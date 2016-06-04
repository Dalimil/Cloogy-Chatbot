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
