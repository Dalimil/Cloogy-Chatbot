var cloogy = require('../utils/cloogy');

exports.listAllUnits = function(req, res){ // route
  cloogy.consumptions(function(data) {
    res.jsonPretty(data);
  });
};

exports.consumptionsAll = function(req, res){ // route
  cloogy.consumptionsAll(function(data) {
    res.jsonPretty(data);
  });
};