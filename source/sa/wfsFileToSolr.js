'use strict'
// stream usage
// takes the same options as the parser

const fs = require('fs');
const request = require('request');
const saxStream = require("sax").createStream(true, {});

const config = require("./config");
const prefix = config.prefix;
const itemTag = config.itemTag;
const properties = config.properties;
const featureFactory = config.solrFeatureFactory;

const RECORDS_PER_WRITE = 50;

const fileLocation = "../../data/SA_GazFeatureCatalogue.gml";
const solrAddEndpoint = "http://localhost:8983/solr/placenames/update?_=${now}&boost=1.0&commitWithin=1000&overwrite=true&wt=json";

let item = featureFactory();
let count = 1;
let expected;
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
   expected = undefined;
   if (node.name === itemTag) {
      //console.log("Reading #" + count++);
   } else {
      expected = properties[node.name];
   }
});

saxStream.on("text", function (value) {
   if (!value.trim()) return;

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
var t = 0;
saxStream.on("closetag", function (name) {
   if (name === itemTag) {
      if (buffer.length >= RECORDS_PER_WRITE) {
         addToSolr(buffer);
         buffer = [];
      }
t++
if(t > 100)
throw new Error("gg")

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

readStream = fs.createReadStream(fileLocation)
   .pipe(saxStream);

let block = 0;
function addToSolr(data) {
   console.log("sending block #" + (++block));
console.log(JSON.stringify(data));
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

