const proj4 = require("proj4");

const epsg3031 = proj4.defs('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');


console.log("[0, -85]", proj4("EPSG:4326", "EPSG:3031", [+"0", +"-85"])) // Just testinh casting string to number
console.log("[90, -85]", proj4("EPSG:4326", "EPSG:3031", [90, -85]))