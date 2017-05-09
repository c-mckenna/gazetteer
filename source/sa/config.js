
const prefix = "fme:";
const itemTag = prefix + "Gazetteer";

var properties = {};
// properties[prefix + "Authority_ID"] = "authority"; // Mapped in code to fixed SA
properties[prefix + "NAME"] = "name";
properties[prefix + "CURNAME"] = "variant";
properties[prefix + "GLOBALID"] = "id";
properties[prefix + "FEATURE_CLASS"] = "classification";
properties[prefix + "F_CODE"] = "featureCode";
properties[prefix + "RECNO"] = "recordId";
properties[prefix + "GDA94_LAT"] = {
   target: "location",
   type: "point",
   index: 1
};
properties[prefix + "GDA94_LONG"] = {
   target: "location",
   type: "point",
   index: 0
};

var geojsonFeatureFactory = function() {
   return {
      type: "Feature",
      geometry: {
         type: "Point",
         coordinates: []
      },
      properties: {
         authority: "SA"
      }
   };
}

var solrFeatureFactory = function() {
   return {
      authority: "SA",
      location: [],
   };
}

module.exports = {
   properties,
   prefix,
   itemTag,
   geojsonFeatureFactory,
   solrFeatureFactory
};