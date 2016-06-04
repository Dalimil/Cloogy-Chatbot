var cloogy = require('../utils/cloogy');

exports.listAllUnits = function(req, res){ // route
  cloogy.findUnits(function(data) {
    res.jsonPretty({ data: data });
  });
};
