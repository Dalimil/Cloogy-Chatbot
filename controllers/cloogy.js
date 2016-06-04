var cloogy = require('../utils/cloogy');

exports.listAllUnits = function(req, res){ // route
  cloogy.consumptions(function(data) {
    res.jsonPretty(data);
  });
};
