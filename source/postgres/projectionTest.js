const proj4 = require("proj4");

const epsg3031 = proj4.defs('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');


console.log("[-180, -80]", proj4("EPSG:4326", "EPSG:3031", [-180, -80]))
console.log("[-90, -80]", proj4("EPSG:4326", "EPSG:3031", [-90, -80]))
console.log("[90, -80]", proj4("EPSG:4326", "EPSG:3031", [90, -80]))
console.log("[180, -80]", proj4("EPSG:4326", "EPSG:3031", [180, -80]))
console.log("[0, -90]", proj4("EPSG:4326", "EPSG:3031", [0, -90]))
console.log("[0, -80]", proj4("EPSG:4326", "EPSG:3031", [0, -80]))
console.log("[0, -70]", proj4("EPSG:4326", "EPSG:3031", [0, -70]))
console.log("[0, -60]", proj4("EPSG:4326", "EPSG:3031", [0, -60]))
console.log("[0, -50]\n", proj4("EPSG:4326", "EPSG:3031", [0, -50]))
console.log("[45, -90]", proj4("EPSG:4326", "EPSG:3031", [45, -90]))
console.log("[45, -80]", proj4("EPSG:4326", "EPSG:3031", [45, -80]))
console.log("[45, -70]", proj4("EPSG:4326", "EPSG:3031", [45, -70]))
console.log("[45, -60]", proj4("EPSG:4326", "EPSG:3031", [45, -60]))
console.log("[45, -50]\n", proj4("EPSG:4326", "EPSG:3031", [45, -50]))