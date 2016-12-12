'use strict'
// stream usage
// takes the same options as the parser
const request = require('request');
const saxStream = require("sax").createStream(true, {});

const RECORDS_PER_WRITE = 500;

const wfsDataEndpoint = "http://services.ga.gov.au/site_1/services/Australian_Gazetteer/MapServer/WFSServer?service=wfs&version=2.0.0&request=GetFeature&typeNames=Australian_Gazetteer:Gazetteer_of_Australia";
const solrAddEndpoint = "http://localhost:8983/solr/placenames/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json";

const prefix = "Australian_Gazetteer:";
const itemTag = prefix + "Gazetteer_of_Australia";
const properties = {};

properties[prefix + "Name"] = "name";
properties[prefix + "Variant_Name"] = "variant";
properties[prefix + "OBJECTID"] = "id";
properties[prefix + "Classification"] = "classification";
properties[prefix + "Feature_code"] = "featureCode";
properties[prefix + "Record_ID"] = "recordId";
properties[prefix + "Latitude"] = {
   target: "location",
   type: "point",
   index: 1
};
properties[prefix + "Longitude"] = {
   target: "location",
   type: "point",
   index: 0
};

let item = featureFactory();
let count = 1;
let expected = null;
let readStream;
let buffer = [];


saxStream.on("error", function (e) {
   // unhandled errors will throw, since this is a proper node
   // event emitter.
   console.error("error!", e);
   // clear the error
   this._parser.error = null;
   this._parser.resume();
});

saxStream.on("opentag", function (node) {
   expected = null;
   if (node.name === itemTag) {
      //console.log("Reading #" + count++);
   } else {
      expected = properties[node.name];
   }
});

saxStream.on("text", function (value) {
   if (typeof expected === "string") {
      item[expected] = value;
   } else if (typeof expected === "object") {
      if (expected.type === "point") {
         item[expected.target][expected.index] = +value;
      } else if (expected.type === "array") {
         var arr = item[expected.name] = item[expected.name] ? item[expected.name] : [];
         arr.push(value);
      }
   }
});

saxStream.on("closetag", function (name) {
   if (name === itemTag) {
      if (buffer.length >= RECORDS_PER_WRITE) {
         addToSolr(buffer);
         buffer = [];
      }
      item.ll = item.location = item.location.join(' ');
      buffer.push(item)
      item = featureFactory();
   }
});

saxStream.on("end", function (node) {
   if (buffer.length) {
      addToSolr(buffer);
   }
});

readStream = request(wfsDataEndpoint)
   .pipe(saxStream);

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


function featureFactory() {
   return {
      location: [],
   };
}