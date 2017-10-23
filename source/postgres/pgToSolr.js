const config = require('./config');
const featureFactory = config.solrFeatureFactory;
const request = require('request');
const solrAddEndpoint = "http://localhost:8983/solr/placenames/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json";
//const solrGetSupplyDate = "http://localhost:8983/solr/placenames/select?q=*:*&rows=1&sort=supplyDate+desc&wt=json";
const solrGetSupplyDate = "http://placenames.geospeedster.com/select?q=*:*&rows=1&sort=supplyDate+desc&wt=json&fl=supplyDate";


const mappings = config.properties;

/*
   In the user running the Gazetteer it needs .bash_profile to set the following environment variables:

   export PLACENAMES_DB_USER
   export PLACENAMES_DB_HOST
   export PLACENAMES_DB_DATABASE
   export PLACENAMES_DB_PASSWORD
   export PLACENAMES_DB_PORT

*/

const { Client } = require('pg');

const client = new Client({
   user: process.env.PLACENAMES_DB_USER,
   host: process.env.PLACENAMES_DB_HOST,
   database: process.env.PLACENAMES_DB_DATABASE,
   password: process.env.PLACENAMES_DB_PASSWORD,
   port: process.env.PLACENAMES_DB_PORT,
});

let pageSize = config.parameters.pageSize;

getWhereClause().then(clause => {
   client.connect((err, client, done) => {
      let offset = 0;
      // Handle connection errors
      if (err) {
         console.log(err);
         return;
      }

      writeBlock(client, pageSize, offset).then(writeFinished);

      function writeFinished(written) {
         if (written) {
            offset += pageSize;
            writeBlock(client, pageSize, offset).then(writeFinished);
         } else {
            console.log("finished");
            process.exit();
         }
      }

      function writeBlock(client, pageSize, offset) {
         return client.query('select * from "PLACENAMES" ' + clause + ' order by "ID" limit ' + pageSize + ' offset ' + offset + ';')
            .then(res => {
               let buffer = [];

               rowsLength = res.rows.length;

               res.rows.forEach(row => {
                  let record = featureFactory();
                  Object.keys(row).forEach(key => {
                     let expected = mappings[key];
                     let value = row[key];

                     if (typeof expected === "string") {
                        record[expected] = value;
                     } else if (typeof expected === "object") {
                        if (expected.type === "point") {
                           record[expected.target][expected.index] = +value;
                        }
                     }
                  });
                  record.ll = record.location = record.location.join(' ');
                  buffer.push(record);
               });
               addToSolr(buffer);
               return rowsLength;
            });
      }
   });
});

let block = 0;
function addToSolr(data) {
   console.log("sending block #" + (++block));

   var url = solrAddEndpoint.replace("${now}", Date.now());
   var options = {
      method: 'post',
      body: data,
      json: true,
      url: url
   }
   request.post(options);
}

function getWhereClause() {
   return getLastSupplyDate().then(date => ' where "SUPPLY_DATE" > \'' + date + "'").catch(() => "");
}

function getLastSupplyDate() {
   console.log("Getting last supply date");
   return new Promise(function (resolve, reject) {
      request.get(solrGetSupplyDate, function (error, response, body) {
         let data = JSON.parse(body);
         if (!data.response || !data.response.docs || !data.response.docs.length) {
            return "2000-01-01 00:00:00";
         }
         let date = new Date(JSON.parse(body).response.docs[0].supplyDate);
         // Minus one second
         date.setSeconds(date.getSeconds() - 1);
         resolve(pgFormatDate(date));
      });
   });
}

function pgFormatDate(date) {
   return date.getFullYear() + "-" +
      zeroPad(date.getMonth() + 1) + "-" +
      zeroPad(date.getDate()) + " " +
      zeroPad(date.getHours()) + ":" +
      zeroPad(date.getMinutes()) + ":" +
      zeroPad(date.getSeconds());
}

function zeroPad(d) {
   return ("0" + d).slice(-2)
}