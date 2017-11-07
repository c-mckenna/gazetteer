const {Traverser} = require("./traverser");
const request = require('request');

const testUrl = "https://elvis20161a-ga.fmecloud.com/fmedatastreaming/fsdf_elvis_prod/ReturnDownloadables.fmw?ymin=-27&ymax=-26.98&xmin=152.98&xmax=153";

var data = {
   "available_data" : [
      {
         "source" : "NSW Government"
      },
      {
         "source" : "ACT Government"
      },
      {
         "source" : "QLD Government",
         "downloadables" : {
            "DEMs" : {
               "1 Metre" : [
                  {
                     "index_poly_name" : "4987014",
                     "file_name" : "SunshineCoast_2014_LGA_SW_498000_7014000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_498000_7014000_1K_DEM_1m.zip",
                     "file_size" : "4042446",
                     "file_last_modified" : "20171020",
                     "bbox" : "152.979842497176,-26.996068928861,152.989922052994,-26.9870414041124"
                  },
                  {
                     "index_poly_name" : "4987015",
                     "file_name" : "SunshineCoast_2014_LGA_SW_498000_7015000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_498000_7015000_1K_DEM_1m.zip",
                     "file_size" : "4042446",
                     "file_last_modified" : "20171020",
                     "bbox" : "152.979844106366,-26.9870403231376,152.989922857212,-26.9780127863995"
                  },
                  {
                     "index_poly_name" : "4997014",
                     "file_name" : "SunshineCoast_2014_LGA_SW_499000_7014000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_499000_7014000_1K_DEM_1m.zip",
                     "file_size" : "4042446",
                     "file_last_modified" : "20171020",
                     "bbox" : "152.989921248399,-26.9960700102553,153,-26.9870417644374"
                  },
                  {
                     "index_poly_name" : "4997015",
                     "file_name" : "SunshineCoast_2014_LGA_SW_499000_7015000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_499000_7015000_1K_DEM_1m.zip",
                     "file_size" : "4042446",
                     "file_last_modified" : "20171020",
                     "bbox" : "152.989922052994,-26.9870414041124,153,-26.9780131465847"
                  },
                  {
                     "index_poly_name" : "5007014",
                     "file_name" : "SunshineCoast_2014_LGA_SW_500000_7014000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_500000_7014000_1K_DEM_1m.zip",
                     "file_size" : "4042446",
                     "file_last_modified" : "20171020",
                     "bbox" : "153,-26.9960703707201,153.010077947006,-26.9870414041124"
                  },
                  {
                     "index_poly_name" : "5007015",
                     "file_name" : "SunshineCoast_2014_LGA_SW_500000_7015000_1K_DEM_1m.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_500000_7015000_1K_DEM_1m.zip",
                     "file_size" : "4042446",
                     "file_last_modified" : "20171020",
                     "bbox" : "153,-26.9870417644374,153.010077142788,-26.9780127863995"
                  }
               ]
            },
            "Point Clouds" : {
               "AHD" : [
                  {
                     "index_poly_name" : "4987014",
                     "file_name" : "SunshineCoast_2014_LGA_SW_498000_7014000_1K_Las.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_498000_7014000_1K_Las.zip",
                     "file_size" : "10211421",
                     "file_last_modified" : "20171010",
                     "bbox" : "152.979842497176,-26.996068928861,152.989922052994,-26.9870414041124"
                  },
                  {
                     "index_poly_name" : "4987015",
                     "file_name" : "SunshineCoast_2014_LGA_SW_498000_7015000_1K_Las.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_498000_7015000_1K_Las.zip",
                     "file_size" : "54079958",
                     "file_last_modified" : "20171010",
                     "bbox" : "152.979844106366,-26.9870403231376,152.989922857212,-26.9780127863995"
                  },
                  {
                     "index_poly_name" : "4997014",
                     "file_name" : "SunshineCoast_2014_LGA_SW_499000_7014000_1K_Las.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_499000_7014000_1K_Las.zip",
                     "file_size" : "21958876",
                     "file_last_modified" : "20171010",
                     "bbox" : "152.989921248399,-26.9960700102553,153,-26.9870417644374"
                  },
                  {
                     "index_poly_name" : "4997015",
                     "file_name" : "SunshineCoast_2014_LGA_SW_499000_7015000_1K_Las.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_499000_7015000_1K_Las.zip",
                     "file_size" : "56201653",
                     "file_last_modified" : "20171010",
                     "bbox" : "152.989922052994,-26.9870414041124,153,-26.9780131465847"
                  },
                  {
                     "index_poly_name" : "5007014",
                     "file_name" : "SunshineCoast_2014_LGA_SW_500000_7014000_1K_Las.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_500000_7014000_1K_Las.zip",
                     "file_size" : "19127039",
                     "file_last_modified" : "20171010",
                     "bbox" : "153,-26.9960703707201,153.010077947006,-26.9870414041124"
                  },
                  {
                     "index_poly_name" : "5007015",
                     "file_name" : "SunshineCoast_2014_LGA_SW_500000_7015000_1K_Las.zip",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/qld.elvis/z56/SunshineCoast_2014_LGA_SW_500000_7015000_1K_Las.zip",
                     "file_size" : "38250168",
                     "file_last_modified" : "20171010",
                     "bbox" : "153,-26.9870417644374,153.010077142788,-26.9780127863995"
                  }
               ]
            }
         }
      },
      {
         "source" : "TAS Government"
      },
      {
         "source" : "SA Government"
      },
      {
         "source" : "NT Government"
      },
      {
         "source" : "WA Government"
      },
      {
         "source" : "Geoscience Australia",
         "downloadables" : {
            "DEMs" : {
               "5 Metre" : [
                  {
                     "index_poly_name" : "109",
                     "file_name" : "moretonbay2009.tif",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/elvis.ga.gov.au/elevation/5m-dem/qld/moretonbay2009.tif",
                     "file_size" : "815630311",
                     "file_last_modified" : "20160211",
                     "bbox" : "152.706017718241,-27.4511366178134,153.147489402757,-26.7247684195144",
                     "metadata_id" : "22be4b55-2465-4320-e053-10a3070a5236"
                  },
                  {
                     "index_poly_name" : "125",
                     "file_name" : "sunshinecoast2009.tif",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/elvis.ga.gov.au/elevation/5m-dem/qld/sunshinecoast2009.tif",
                     "file_size" : "1216497415",
                     "file_last_modified" : "20160211",
                     "bbox" : "152.603743322471,-27.0521846600801,153.094057296036,-26.1154037533578",
                     "metadata_id" : "22be4b55-2465-4320-e053-10a3070a5236"
                  }
               ],
               "1 Second" : [
                  {
                     "file_name" : "SRTM-derived 1 Second Digital Elevation Model Version 1.0",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/elvis.ga.gov.au/elevation/1sec-srtm/aac46307-fce8-449d-e044-00144fdd4fa6.zip",
                     "bbox" : "113,-44,154,-10",
                     "metadata_id" : "aac46307-fce8-449d-e044-00144fdd4fa6"
                  },
                  {
                     "file_name" : "SRTM-derived Hydrological 1 Second Digital Elevation Model Version 1.0",
                     "file_url" : "https://s3-ap-southeast-2.amazonaws.com/elvis.ga.gov.au/elevation/1sec-srtm/a05f7893-0050-7506-e044-00144fdd4fa6.zip",
                     "bbox" : "113,-44,154,-10",
                     "metadata_id" : "a05f7893-0050-7506-e044-00144fdd4fa6"
                  }
               ]
            }
         }
      }
   ]
};

let traverser = new Traverser(data);

console.log(traverser.getFlattened())

//console.log(JSON.stringify(traverser));
/*
request.get({url: testUrl, json:true}, function (error, response, data) {
   let traverser = new Traverser(data);
   console.log(data);
});
*/