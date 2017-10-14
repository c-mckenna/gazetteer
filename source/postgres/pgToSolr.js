const config = require('./config');
const featureFactory = config.solrFeatureFactory;
const request = require('request');
const solrAddEndpoint = "http://localhost:8983/solr/placenames/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json";

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

});


function writeBlock(client, pageSize, offset) {

   return client.query('select * from "PLACENAMES" order by "ID" limit ' + pageSize + ' offset ' + offset + ';')
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
            item.ll = item.location = item.location.join(' ');
            buffer.push(record);
         });
         addToSolr(buffer);
         return rowsLength;
      });
}


let block = 0;
function addToSolr(data) {
   console.log("sending block #" + (++block), JSON.stringify(data));
   process.exit();
   return;

   var url = solrAddEndpoint.replace("${now}", Date.now());
   var options = {
      method: 'post',
      body: data,
      json: true,
      url: url
   }
   request.post(options);
}