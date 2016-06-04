exports.chart = function(req, res){ // route
	var data = [40,60,60,45,47,75,70,72];
	var xAxisLabel = 'Categories';
	var yAxisLabel = 'Count';
	var width = 250;
	var height = 100;
	var uri = 'https://chart.googleapis.com/chart?cht=lc&chd=t:' + data.join(",") + '&chs=' + width + 'x' + height + '&chl=' + xAxisLabel + '|' + yAxisLabel;

  console.log(uri);
  
  res.end(uri);
};