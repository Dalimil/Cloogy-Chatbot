var cloogy = require('../utils/cloogy');

exports.chart = function(cb){ // route
  cloogy.consumptionsAll(function(raw) {
    var data = raw.map(function(x) { return x.Read * 1000; });
  var xLabels = raw.map(function(x) {
    var date = new Date(x.Date);
    return date.getMonth() + '/' + date.getDay();
  });
  var yLabels = raw.map(function(x) { return (x.Read * 1000) + ' W'; });
  var width = 250;
  var height = 100;

  var args = [
    'cht=lc',
    'chxt=x,y',
    'chd=t:' + data.join(','),
    'chs=' + width + 'x' + height,
    'chxl=0:|' + xLabels.join('|') + '|1:|' + yLabels.join('|')
  ];

  var uri = 'https://chart.googleapis.com/chart?' + args.join('&');

  console.log(uri);

  // res.end(uri);
   cb(uri);
  });
};
