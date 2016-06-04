var cloogy = require('../utils/cloogy');

exports.chartMonth = function(cb){ // route
  cloogy.consumptionsAllMonth(createChart(cb, 30));
};
exports.chartWeek = function(cb) {
  cloogy.consumptionsAllWeek(createChart(cb, 6));
}

function createChart(cb, num) {
  return function(raw) {
    var start = raw.map(function(x) { return x.Read * 1000; });
    console.log(start);
    var data = [];
    var sum = 0;
    for(var i=0; i<=num; i++) {
      data[i] = i < start.length ? start[i] : 0;
      sum = sum + data[i];
    }
    console.log(data);


  var xLabels = raw.map(function(x) {
    var date = new Date(x.Date);
    return date.getHours() + ':' + date.getMinutes();
  });
  var yLabels = raw.map(function(x) { return (x.Read * 1000) + ' W'; });
    const imgSize = 200;
    var width = 1.91 * imgSize;
    var height = 1 * imgSize;

  var args = [
    'cht=lc:nda',
    // 'chxt=x,y',
    'chd=t:' + data.join(','),
    'chs=' + width + 'x' + height,
    'chxl=0:|' + xLabels.join('|') + '|1:|' + yLabels.join('|'),
    'chco=00BFB3',
    'chma=30,30,30,30'
  ];

  var uri = 'https://chart.googleapis.com/chart?' + args.join('&');

  console.log(uri);

  // res.end(uri);
   cb(uri, sum);
  };
}
