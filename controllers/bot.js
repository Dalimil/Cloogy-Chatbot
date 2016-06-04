const request = require('request');
const config = require('../config');
const cloogy = require('../utils/cloogy');
const trivia = require('./trivia');

const chart = require('./chart');

exports.verify = function(req, res) {
  if (req.query['hub.verify_token'] === config.FB.APP_VERIFY) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
};

function sendTextMessage(sender, messageData) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: config.FB.ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

const mainSelection = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        // "text":"Oh hey there, I'm your friendly Cloogy Assistant. Let me know what you want to do and we can get started.",
        "text": "Let me know what you want to do.",
        "buttons":[
          {
            "type":"postback",
            "title":"Show my energy consumption",
            "payload":"MAIN_STATUS"
          },
          {
            "type":"postback",
            "title":"Graph",
            "payload":"MAIN_GRAPH"
          },
          {
            "type":"postback",
            "title":"Trivia",
            "payload":"MAIN_TRIVIA"
          }
        ]
      }
    }
};

function getConsumptionSelection(data) {
  let text = 'You consumed ' + Math.round(data.Read * 1000, 3)/1000 + ' kWh of energy last month. This equals a carbon dioxide emission of ';
      text = text + Math.round(data.ReadCarbon*100, 2)/100 + ' kg CO2.\n\n';
      text = text + Math.round(data.Trees*1000)/1000 + ' 🌳s are needed to process the emitted CO2.\n\n';
      text = text + 'A 🚗 can travel ' + Math.round(data.Cars*100)/100 + ' km with the same emitted CO2.';

  return {
    // date
    "text": text //'You consumed ' + data.Read + ' kWh last month.  ' + data.ReadCarbon +  '' + data.Trees + '🌳or ' + data.Cars + ' 🚗.'
  };

  // return {
  //     "attachment": {
  //       "type": "template",
  //       "payload": {
  //         "template_type": "generic",
  //         "elements": [{
  //           "title": "Trees - " + data.Trees,
  //           "image_url": "https://www.arborday.org/enterprise/images/hero-enterprise.jpg"
  //          },{
  //           "title": "Carbon - " + data.ReadCarbon,
  //           "image_url": "http://spectrum.ieee.org/image/MjMyNjY1Mw"
  //         },{
  //           "title": "Cars - " + data.Cars,
  //           "image_url": "https://chart.googleapis.com/chart?cht=p3&chd=t:60,40&chs=250x100&chl=Hello|World"
  //         }]
  //       }
  //     }
  // };
}

exports.messageReceived = function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;

    if (event.postback) {
      id = event.postback.payload;
      if (id == 'MAIN_STATUS') {
        cloogy.consumptions(function (data) {
          sendTextMessage(sender, getConsumptionSelection(data));
        });
      } else if (id == 'MAIN_GRAPH') {
        chart.chart(function(uri) {
          sendTextMessage(sender, {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Monthly Consumption",
                  "subtitle": "You consumed xx monthly.",
                  "image_url": uri
                 }]
              }
            }
          })
        });
      } else if (id == 'MAIN_TRIVIA') {
        trivia.startTrivia(sender);
      } else if(id.indexOf('TRIVIA_') >= 0) {
        trivia.handleTrivia(event, sender);
      }
    }
    else if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, mainSelection);
    }

  }
  res.sendStatus(200);
};
