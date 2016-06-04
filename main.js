const express = require('express');
const bodyParser = require('body-parser'); // additional body parsing
const morgan = require('morgan'); // General request logger
const session = require('express-session'); // session cookies
const path = require('path'); // path.join
const pp = function(s){ return path.join(__dirname, s); };
const app = express();
const server = require('http').createServer(app); // or https
const config = require('./config');

// Pug template engine - previously Jade - http://jade-lang.com/
app.set('views', pp('views')); // where templates are located
app.set('view engine', 'pug'); // Express loads the module internally

// Add top-level (could be made route-specific) parsers that will populate request.body
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

app.use(morgan('dev')); // Set up logger
const debug = require('./utils/debug'); // + my own logger
app.use(debug.requestInfo); // Middleware function - Order/Place of call important!
// app.use('/articles', requestInfo); // Works but messes up request URLs - /articles/id -> /id

// Set up secure cookie session
app.use(session({
  secret: config.APP_SECRET,
  saveUninitialized: false,
  resave: false, // keep the most recent session modification
}));

/** Route handlers */
const statusController = require('./controllers/chart');
const botController = require('./controllers/bot');
const cloogyController = require('./controllers/cloogy');
const chartController = require('./controllers/chart');

// Expose urls like /static/images/logo.png
app.use('/static', express.static(pp('public'))); // first arg could be omitted

app.get('/', function(req, res) { // Intro website ?
  // Render .pug template with any JSON locals/variables:
  res.render('index',
    { title: 'Demo', data: { name: "Shop", items: [3, 5, 8] } }
  );
});

app.get('/chart', chartController.chart);

//app.get('/list', statusController.listAll);

app.get('/units', cloogyController.listAllUnits);

app.get('/consumptionsAll', cloogyController.consumptionsAll);

app.route('/webhook')
  .get(botController.verify)
  .post(botController.messageReceived);

/* Specify both GET and POST endpoint */
app.route('/debug')
  .get(function(req, res) {
    var info = req.requestInfo;
    res.jsonPretty(info); // custom method
  })
  .post(function(req, res) {
    // Or with status: res.status(500).json({ error: 'message' });
    res.json(req.requestInfo);
  });


server.listen(config.PORT, function() {
  var host = server.address().address;
  var port = server.address().port;
  // console.log(app.get('env'));
  console.log("Server dir: " + pp('/'));
  console.log((new Date()).toLocaleTimeString() + " - Server running at http://localhost:" + port);
});
