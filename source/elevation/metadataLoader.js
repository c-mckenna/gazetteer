var request = require("request");
var solrHelper = require("./lib/solrhelper");
var strat = require("./lib/strategies");
var config = require("./metadataconfig").config;
var loader = new strat.Strategies(config.baseUrl);

// This is a factory method that takes the HTTP request and a template for updating
var solrWriter = solrHelper.writer(request, "http://localhost:8983/solr/metadata/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json");

// Used to page through metadata_id
var count = 0;

// Phase one. Get the facets for metadata ID, that way we get all the unique ID's
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


// Phase 2. Cycle through each of the metadata records and fetch other attributed like url, source etc
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

// Phase 3: Get the full metadata from the source metadata repository.
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
      writeRecord.bbox = metadata.bbox;
      writeRecord.composite_id = writeRecord.source + "_" + writeRecord.metadata_id;
      // Normally we send pages but at this stage there are so few we write one at a time. We will lilkely change this over time as
      // the profile of the data changes.
      solrWriter([writeRecord]);
   });
}