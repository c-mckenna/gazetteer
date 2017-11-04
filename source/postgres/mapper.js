const proj4 = require("proj4");

const epsg3031 = proj4.defs('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

// console.log(proj4("EPSG:4326", "EPSG:3031", [10, -89]))

var properties = {};

properties["ID"] = "recordId";
properties["NAME"] = "name";
//properties["CURNAME"] = "variant";
properties["FEATURE"] = "feature";
properties["CATEGORY"] = "category";
properties["GROUP"] = "group";
properties["LATITUDE"] = {
   target: "location",
   type: "point",
   index: 1
};
properties["LONGITUDE"] = {
   target: "location",
   type: "point",
   index: 0
};
properties["AUTHORITY"] = "authority";
properties["AUTH_ID"] = "authorityId";
properties["SUPPLY_DATE"] = "supplyDate";

var solrFeatureFactory = function() {
   return {
      location: [],
   };
}

function decorateGrid(record) {
   let lngLatStrs = record.location.split(" ");
   let lng = +lngLatStrs[0];
   // We only care about southern points
   if (lng < -50) {
      let epsg3031 = proj4("EPSG:4326", "EPSG:3031", [+lngLatStrs[1], lng]);
      record.xPolar = epsg3031[0];
      record.yPolar = epsg3031[1];
   }
}


var parameters = {
   pageSize: 500
};

module.exports = {
   decorateGrid,
   properties,
   parameters,
   solrFeatureFactory
};