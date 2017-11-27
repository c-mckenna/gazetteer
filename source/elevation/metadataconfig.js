var config = {
   baseUrl: "http://placenames.fsdf.org.au/xml2js/",
   facetQuery: "http://placenames.fsdf.org.au/elevation/select?facet.field=metadata_id&facet=on&q=*:*&rows=0&wt=json",
   getRecordTemplate: "http://placenames.fsdf.org.au/elevation/select?q=metadata_id:{metadata_id}&rows=1&wt=json",
};

exports.config = config;