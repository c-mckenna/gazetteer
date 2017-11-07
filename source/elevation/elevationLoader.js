const {Traverser} = require('./traverser');
const cells = require("./cells").cells;

const request = require('request');
const solrAddEndpoint = "http://localhost:8983/solr/elevation/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json";

let template = "https://elvis20161a-ga.fmecloud.com/fmedatastreaming/fsdf_elvis_prod/ReturnDownloadables.fmw?ymin={ymin}&ymax={ymax}&xmin={xmin}&xmax={xmax}"

console.log("Due to process " + cells.length);

let keys = {};

let index = 0;

getBlock(cells[index++]).then(processBlock);

function processBlock(response) {
   addToSolr(response).then(status => {
      console.log("Written " + response.length + " records, block#" + index + " of " + cells.length);
      if(index < cells.length) {
         getBlock(cells[index++]).then(processBlock);
      } else {
         console.log("Finit")
         process.exit();
      }
   });
}

function getBlock(cell) {
   // cell =  [[-45, 110], [-10, 140]]
   let url = template.replace("{xmin}", cell[0][1])
                     .replace("{ymin}", cell[0][0])
                     .replace("{xmax}", cell[1][1])
                     .replace("{ymax}", cell[1][0]);
   console.log(url)
   return new Promise(function (resolve, reject) {
      request.get({ url, json: true},  function (error, response, data) {
         console.log(data);
         try {
            let traverser = new Traverser(data);
            resolve(traverser.getFlattened().filter(item => {
               var itsNew = !keys[item.composite_id];
               keys[item.composite_id] = true;
               return itsNew;
            }));
         } catch(e) {
            console.log("e", e);
            reject(e);
         }
      });
   });
}

function addToSolr(data) {
   var url = solrAddEndpoint.replace("${now}", Date.now());
   var options = {
      method: 'post',
      body: data,
      json: true,
      url: url
   }
   return new Promise(function (resolve, reject) {
      request.post(options, function (error, response, data) {
         console.log("data", data);
         resolve(response);
      });
   });
}
