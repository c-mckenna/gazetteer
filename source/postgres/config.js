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
properties["SUPPLY_DATE"] = "supplyDate";

var solrFeatureFactory = function() {
   return {
      location: [],
   };
}

var parameters = {
   pageSize: 500
};

module.exports = {
   properties,
   parameters,
   solrFeatureFactory
};