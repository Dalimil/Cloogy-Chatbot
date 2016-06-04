var cloogy = require('../utils/cloogy');

exports.listAllUnits = function(req, res) { // route
  cloogy.consumptions(function(data) {
    res.jsonPretty(data);
  });
};

exports.consumptionsAllMonth = function(req, res) { // route
  cloogy.consumptionsAllMonth(function(data) {
    res.jsonPretty(data);
  });
};

exports.findUnits = function(req, res){ // route
  cloogy.findUnits(function(data) {
    res.jsonPretty(data);
  });
};

exports.findDevices = function(req, res){ // route
  cloogy.findDevices(function(data) {
    res.jsonPretty(data);
  });
};
