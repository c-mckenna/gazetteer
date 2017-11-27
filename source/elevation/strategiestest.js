var strat = require("./lib/strategies");

var loader = new strat.Strategies(); //"http://elevation.fsdf.org.au/xml2js/");

var qld = loader.strategy("QLD Government");

qld.requestMetadata({
   metadata_id: "3594F263-F8B4-4F21-923D-0E78B7D02C80"
}).then(response => {
   console.log(JSON.stringify(response, null, 3));
});
