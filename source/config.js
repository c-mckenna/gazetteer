
const prefix = "Australian_Gazetteer:";
const itemTag = prefix + "Gazetteer_of_Australia";

var properties = {};
properties[prefix + "Authority_ID"] = "authority";
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

let awsSecrets = {   
   region: "ap-southeast-2",
   secretName: "fsdf/placenames/postgresql",
}

module.exports = {
   properties,
   prefix,
   itemTag,
   awsSecrets
};