var request = require("request");

class Extent {
   constructor(node) {
      if (node && node.EX_Extent && node.EX_Extent.geographicElement && node.EX_Extent.geographicElement.EX_GeographicBoundingBox) {
         this.node = node.EX_Extent.geographicElement.EX_GeographicBoundingBox;
      }
   }

   get west() {
      if (this.node && this.node.westBoundLongitude && this.node.westBoundLongitude.Decimal && this.node.westBoundLongitude.Decimal.__text) {
         return +this.node.westBoundLongitude.Decimal.__text;
      }
      return "";
   }

   get east() {
      if (this.node && this.node.eastBoundLongitude && this.node.eastBoundLongitude.Decimal && this.node.eastBoundLongitude.Decimal.__text) {
         return +this.node.eastBoundLongitude.Decimal.__text;
      }
      return "";
   }

   get north() {
      if (this.node && this.node.northBoundLatitude && this.node.northBoundLatitude.Decimal && this.node.northBoundLatitude.Decimal.__text) {
         return +this.node.northBoundLatitude.Decimal.__text;
      }
      return "";
   }

   get south() {
      if (this.node && this.node.southBoundLatitude && this.node.southBoundLatitude.Decimal && this.node.southBoundLatitude.Decimal.__text) {
         return +this.node.southBoundLatitude.Decimal.__text;
      }
      return "";
   }

   toWkt() {
      if (this.south !== "") {
         // ENVELOPE(147.317470505607, 147.338568716996, -31.9414868296578,-31.9595849666431)
         return "ENVELOPE(" + this.west + ", " + this.east + ", " + this.north + ", " + this.south + ")";
      }
      return "";
   }
}

class BaseStrategy {
   constructor(base) {
      if (base) {
         this.base = base;
      } else {
         this.base = "http://localhost/xml2js/";
      }
      this.NO_METADATA = "No metadata found for this dataset.";
   }

   constructLink(item) {
      return null;
   }

   hasMetadata(item) {
      return false;
   }

   requestMetadata(item) {
      return BaseStrategy.resolvedPromise({
         title: this.NO_METADATA
      });
   }

   static extractData(wrapper) {
      var metadata = wrapper.MD_Metadata;
      var data = {};

      var node = metadata &&
         metadata.identificationInfo &&
         metadata.identificationInfo.MD_DataIdentification;
      var abstractNode = node;

      var bbox = new Extent(node.extent);
      if(bbox.toWkt()) {
         data.bbox = bbox.toWkt();
      }

      node = node &&
         node.citation &&
         node.citation.CI_Citation;
      node = node &&
         node.title &&
         node.title.CharacterString;

      if (node) {
         data.title = node.__text;

         let abstract = abstractNode &&
            abstractNode.abstract &&
            abstractNode.abstract.CharacterString &&
            abstractNode.abstract.CharacterString.__text;
         data.abstract = data.abstractText = abstract;
      } else {
         data.title = super.NO_METADATA;
      }
      return data;
   }
}

class UnknownStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class ActStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class GaStrategy extends BaseStrategy {
   constructor(base) {
      super(base); // https://ecat.ga.gov.au/geonetwork/srv/eng/xml.metadata.get?uuid=22be4b55-2465-4320-e053-10a3070a5236
      this.GA_LINK_METADATA_TEMPLATE = 'https://ecat.ga.gov.au/geonetwork/srv/eng/search#!${uuid}';
      this.GA_METADATA_TEMPLATE = 'https://ecat.ga.gov.au/geonetwork/srv/eng/xml.metadata.get?uuid=${uuid}';
      this.UUID_REG_EX = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
   }

   constructLink(item) {
      var uuid = item.metadata_id;
      return uuid ? this.GA_LINK_METADATA_TEMPLATE.replace("${uuid}", uuid) : null;
   }

   hasMetadata(item) {
      return !!this.constructLink(item);
   }

   requestMetadata(item) {
      var uuid = item.metadata_id;
      var url = uuid ? (this.base + this.GA_METADATA_TEMPLATE.replace("${uuid}", uuid)) : null;
      if (url) {
         return new Promise((resolve, reject) => {
            request.get({
               method: "GET",
               json: true,
               url
            }, (err, res, body) => {
               if (err) {
                  resolve({
                     title: this.NO_METADATA
                  });
               }

               resolve(BaseStrategy.extractData(body));
            });
         });
      } else {
         return BaseStrategy.resolvedPromise({
            title: this.NO_METADATA
         });
      }
   }
}

class NswStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
      this.NSW_METADATA_TEMPLATE = "https://s3-ap-southeast-2.amazonaws.com/nsw.elvis/z5${zone}/Metadata/";
   }

   constructLink(item) {
      var filename = item.file_name;
      var re = /\_5\d\_/;
      var index = filename.search(re);
      var zone = 6;
      var url = this.NSW_METADATA_TEMPLATE;
      if (index !== -1) {
         zone = filename.substr(index + 2, 1);
      }
      return url.replace("${zone}", zone) + filename.replace(".zip", "_Metadata.html");
   }

   hasMetadata(item) {
      return true;
   }

   requestMetadata(item) {
      var filename = item.file_name;
      var re = /\_5\d\_/;
      var index = filename.search(re);
      var zone = 6;
      var url = this.NSW_METADATA_TEMPLATE;
      if (index !== -1) {
         zone = filename.substr(index + 2, 1);
      }
      url = this.base + url.replace("${zone}", zone) + filename.replace(".zip", "_Metadata.xml");

      return new Promise((resolve, reject) => {
         request.get({
            method: "GET",
            json: true,
            url
         }, (err, res, body) => {
            if (err) {
               resolve({
                  title: this.NO_METADATA
               });
            }

            resolve(BaseStrategy.extractData(body));
         });
      });
   }
}

class NtStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class QldStrategy extends BaseStrategy {
   constructor(base) {
      super(base);

      this.XML_METADATA_TEMPLATE = "http://qldspatial.information.qld.gov.au/catalogue/rest/document?id={metadata_id}&f=xml";
      this.QLD_METADATA_TEMPLATE = "http://qldspatial.information.qld.gov.au/catalogue/rest/document?id={EB442CAB-D714-40D8-82C2-A01CA4661324}&f=xml";
      this.QLD_HTML_TEMPLATE = "http://qldspatial.information.qld.gov.au/catalogue/custom/detail.page?fid={EB442CAB-D714-40D8-82C2-A01CA4661324}";
      this.FRASER_COAST_METADATA_TEMPLATE = "http://qldspatial.information.qld.gov.au/catalogue/rest/document?id={E8CEF5BA-A1B7-4DE5-A703-8161FD9BD3CF}&f=xml";
      this.FRASER_COAST_HTML_TEMPLATE = "http://qldspatial.information.qld.gov.au/catalogue/custom/detail.page?fid={E8CEF5BA-A1B7-4DE5-A703-8161FD9BD3CF}";
      this.FRASER_COAST_BOUNDS = [152.331, -26.003, 153.370, -24.692]; //  Extracted from metadata XML
   }

   constructLink(item) {
      if (item.metadata_url) {
         return item.metadata_url;
      }

      let bbox = item.bbox.split(",").map((val) => parseFloat(val.trim()));
      if (bbox[0] >= this.FRASER_COAST_BOUNDS[0] &&
         bbox[1] >= this.FRASER_COAST_BOUNDS[1] &&
         bbox[2] <= this.FRASER_COAST_BOUNDS[2] &&
         bbox[0] >= this.FRASER_COAST_BOUNDS[3]
      ) {
         return this.FRASER_COAST_HTML_TEMPLATE;
      } else {
         return this.QLD_HTML_TEMPLATE;
      }
   }

   hasMetadata(item) {
      return true;
   }

   requestMetadata(item) {
      let url;

      if (item.metadata_id) {
         url = this.XML_METADATA_TEMPLATE.replace("metadata_id", item.metadata_id);
      } else {
         url = this.QLD_METADATA_TEMPLATE;
         let bbox = item.bbox.split(",").map((val) => parseFloat(val.trim()));

         if (bbox[0] >= this.FRASER_COAST_BOUNDS[0] &&
            bbox[1] >= this.FRASER_COAST_BOUNDS[1] &&
            bbox[2] <= this.FRASER_COAST_BOUNDS[2] &&
            bbox[0] >= this.FRASER_COAST_BOUNDS[3]
         ) {
            url = this.FRASER_COAST_METADATA_TEMPLATE;
         }
      }
      url = this.base + url;

      return new Promise((resolve, reject) => {
         request.get({
            method: "GET",
            json: true,
            url
         }, (err, res, body) => {
            if (err) {
               resolve({
                  title: this.NO_METADATA
               });
            } else {
               resolve(BaseStrategy.extractData(body));
            }
         });
      });
   }
}

class SaStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class TasStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class VicStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class WaStrategy extends BaseStrategy {
   constructor(base) {
      super(base);
   }
}

class Strategies {
   constructor(base) {
      var unknown = this.unknown = new UnknownStrategy(base);

      this.strategies = {
         "NSW Government": new NswStrategy(base),
         "VIC Government": unknown, // new VicStrategy(),
         "SA Government": unknown, // new SaStrategy(),
         "WA Government": unknown, // new WaStrategy(),
         "QLD Government": new QldStrategy(base),
         "ACT Government": unknown, // new ActStrategy(),
         "NT Government": unknown, // new NtStrategy(),
         "TAS Government": unknown, // new TasStrategy(),
         "Geoscience Australia": new GaStrategy(base)
      };
   }

   strategy(name) {
      var strategy = this.strategies[name];
      return strategy ? strategy : this.unknown;
   }
}

exports.Strategies = Strategies;