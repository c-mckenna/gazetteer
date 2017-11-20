

/**
 * {
         "source" : "QLD Government",
         "downloadables" : {
            "DEMs" : {
               "1 Metre" : [
                  {
                     "index_poly_name" : "4447052",
                     "file_name" : "Jimna_2012_Twn_SW_444000_7052000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/Jimna_2012_Twn_SW_444000_7052000_1K_DEM_1m.zip",
                     "file_size" : "4040939",
                     "file_last_modified" : "20171020",
                     "bbox" : "152.437298196198,-26.6518614571334,152.447389529185,-26.6428722541848"
                  },
 */
class Traverser {
   constructor(data) {
      this.load(data);
   }

   load(data) {
      this._data = data;
      this._parse();
   }

   _parse() {
      this._sources = [];

      this._sources = (this._data ? this._data : { available_data: [] }).available_data.filter(available => available.downloadables).map(available => {
         return new Source(available);
      })
   }

   getFlattened() {
      return this._sources.map(source => {
         return source.getFlattened();
      }).reduce((sum, item) => sum.concat(item), []);
   }
}

class Source {
   constructor(data) {
      this.source = data.source;
      this.downloadables = Object.keys(data.downloadables).map(name => {
         let obj = data.downloadables[name];
         return new Type(name, obj, this);
      });
   }

   getFlattened() {
      return this.downloadables.map(downloadable => {
         return downloadable.getFlattened();
      }).reduce((sum, item) => sum.concat(item), []);;
   }
}

class Type {
   constructor(name, subTypes, parent) {
      this.parent = parent;
      this.name = name;
      this.subTypes = Object.keys(subTypes).map(name => {
         let obj = subTypes[name];
         return new SubType(name, obj, this);
      });
   }

   getFlattened() {
      return this.subTypes.map(subType => {
         return subType.getFlattened();
      }).reduce((sum, item) => sum.concat(item), []);
   }
}

class SubType {
   constructor(name, items, parent) {
      this.parent = parent;
      this.name = name;
      this.items = items.map(item => {
         let obj = new Item(this);
         Object.assign(obj, item);
         return obj;
      });
   }

   getFlattened() {
      return this.items.map(item => {
         return item.getFlattened();
      });
   }
}

class Item {
   constructor(parent) {
      this.parent = parent;
   }

   /*
      bbox
      source
      type
      subType
      composite_id
      index_poly_name
      file_name
      file_url
      file_size
      file_last_modified
      metadata_id
      metadata_url
   */
   getFlattened() {
      let response = {
         bbox: strToWkt(this.bbox),
         source: this.parent.parent.parent.source,
         type: this.parent.parent.name,
         subType: this.parent.name,
         file_name: this.file_name,
         file_url: this.file_url,
         metadata_id: this.metadata_id,
         metadata_url: this.metadata_url
      };
      if (this.file_last_modified) {
         response.file_last_modified = new Date(this.file_last_modified.substr(0, 4) + "-" +
            this.file_last_modified.substr(4, 2) + "-" +
            this.file_last_modified.substr(6, 2));
      }
      if (this.file_size) {
         response.file_size = +this.file_size;
      }
      if (this.index_poly_name) {
         response.index_poly_name = this.index_poly_name;
      }
      response.composite_id = response.source + "-" + response.subType + "-" + response.file_name;
      return response;
   }
}

function strToWkt(str) {
   // ENVELOPE(-10, 20, 15, 10) which is minX, maxX, maxY, minY
   //  FME format "114.086504559315,-22.0044267119211,114.15291550312,-21.897406013802"
   let parts = str.split(",");
   return "ENVELOPE(" + parts[0] + ", " + parts[2] + ", " + parts[3] + "," + parts[1] + ")";
}

exports.Traverser = Traverser;