exports.arrayToCounts = function (arr) {
   let lastElement;
   let counts = [];

   arr.forEach((value, index) => {
      if (index % 2) {
         counts.push({ name: lastElement, count: value });
      } else {
         lastElement = value;
      }
   });
   return counts;
};

exports.arrayToMap = function (arr) {
   let lastElement;
   let counts = {};

   arr.forEach((value, index) => {
      if (index % 2) {
         counts[lastElement] = value;
      } else {
         lastElement = value;
      }
   });
   return counts;

};

// You get back a function after giving the factory an endpoint.
exports.writer = function (request, solrAddEndpoint) {
   return function (data) {
      var url = solrAddEndpoint.replace("${now}", Date.now());
      var options = {
         method: 'post',
         body: data,
         json: true,
         url: url
      };

      return new Promise(function (resolve, reject) {
         request.post(options, function (error, response, data) {
            console.log("data", data);
            resolve(response);
         });
      });
   }
}