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

const wfsDataEndpoint = "http://services.ga.gov.au/site_1/services/Australian_Gazetteer/MapServer/WFSServer?service=wfs&version=2.0.0&request=GetFeature&typeNames=Australian_Gazetteer:Gazetteer_of_Australia";
const outputFile = "../data/Gazetteer_of_Australia.json";

const startObj = '{\n' +
   '   "type": "FeatureCollection",\n' +
   '   "features": [\n';
const endObj = '\n   ]\n}';

var stream = fs.createWriteStream(outputFile);

//request(wfsDataEndpoint).pipe(fs.createWriteStream('../data/doodle.png'));

stream.on("open", function (fd) {
   var item = featureFactory();
   var count = 1;
   var expected = null;
   var readStream;
   var commaEventually = ",\n";
   var itemSeperator = "";
   //return;

   stream.write(startObj);

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
         item.properties[expected] = value;
      } else if (typeof expected === "object") {
         if (expected.type === "point") {
            item.geometry.coordinates[expected.index] = +value;
         } else if(expected.type === "array") {
            var arr = item.properties[expected.name] = item.properties[expected.name]? item.properties[expected.name]: [];
            arr.push(value);
         }
      }
   });

   saxStream.on("closetag", function (name) {
      if (name === itemTag) {
         stream.write(
            itemSeperator + JSON.stringify(item, null, 3).split("\n").map(item => "      " + item).join("\n")
         );
         itemSeperator = commaEventually;
         item = featureFactory();
      }
   });

   saxStream.on("end", function (node) {
      stream.write(endObj);
      stream.end();
   });

   readStream = request(wfsDataEndpoint)
      .pipe(saxStream);
});


function featureFactory() {
   return {
      type: "Feature",
      geometry: {
         type: "Point",
         coordinates: []
      },
      properties: {}
   };
}