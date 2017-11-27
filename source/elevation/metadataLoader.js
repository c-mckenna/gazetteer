var request = require("request");
var solrHelper = require("./lib/solrhelper");
var strat = require("./lib/strategies");
var config = require("./metadataconfig").config;

var loader = new strat.Strategies(config.baseUrl);

var solrWriter = solrHelper.writer("http://localhost:8983/solr/metadata/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json");

// Used to page through metadata_id
var count = 0;


request({
   json: true,
   method: "GET",
   url: config.facetQuery
}, (err, response, body) => {
   if(err) {
      console.error("Couldn't load metadata facets");
   } else {
      loadRecords(solrHelper.arrayToCounts(body.facet_counts.facet_fields.metadata_id));
   }
});


function loadRecords(facets) {
   var containers = facets.map(facet => facet.name);

   request({
      json: true,
      method: "GET",
      url: config.getRecordTemplate.replace("{metadata_id}",  containers[count])
   }, (err, response, body) => {
      if(err) {
         console.error("Couldn't load metadata facets");
      } else {
         let doc = body.response.docs[0];
         loadRecord(doc);

         count++;
         if(count < facets.length) {
            loadRecords(facets);
         }
      }
   });
}

function loadRecord(record) {
   let writeRecord = {
      metadata_id: record.metadata_id,
      metadata_url: record.metadata_url,
      source: record.source
   };

   let strategy = loader.strategy(record.source);

   strategy.requestMetadata(record).then(metadata => {
      console.log(metadata)
      writeRecord.abstract = metadata.abstract;
      writeRecord.title = metadata.title;
      //solrWriter([writeRecord]);
   });
}

/*

qld.requestMetadata({
   metadata_id: "3594F263-F8B4-4F21-923D-0E78B7D02C80"
}).then(response => {
   console.log(JSON.stringify(response, null, 3));
});
*/