"use strict"
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
        "template_type":"generic",
        "elements":[{
          "title": "Oh hey there!",
          "subtitle": "I'm your friendly Cloogy Assistant. Let me know what you want to do.", //Let me know what you want to do.
          "image_url": "https://scontent.flis2-1.fna.fbcdn.net/v/t1.0-9/481522_453352864725549_1635832609_n.jpg?oh=4d5b255a2a253e369d8d95f178221841&oe=57CE4C15",
          "buttons":[

            {
              "type":"postback",
              "title":"Energy Consumption 🔋",
              "payload":"MAIN_GRAPH"
            },
            {
              "type":"postback",
              "title":"Trivia 📝",
              "payload":"MAIN_TRIVIA"
            },
            {
              "type":"postback",
              "title":"People in room 👨‍👩‍👧",
              "payload":"MAIN_WHOIS"
            }
          ]
        }]
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
function getWhoisSelection(data) {
  var count = 0;

  data.List.forEach(function(element, index, array) {
    count++;
  });

  return {
    // date
    "text": 'There are ' + count + ' people in the building.'
  };
}

exports.messageReceived = function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;

    if (event.postback) {
      var id = event.postback.payload;
      if (id == 'MAIN_STATUS') {
        cloogy.consumptions(function (data) {
          sendTextMessage(sender, getConsumptionSelection(data));
        });
      } else if (id == 'MAIN_GRAPH') {
        cloogy.consumptions(function (data) {
          sendTextMessage(sender, getConsumptionSelection(data));
        });

        chart.chartMonth(function(uriA, sumA) {
          chart.chartWeek(function(uriB, sumB) {
            sendTextMessage(sender, {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [{
                    "title": "Monthly Consumption",
                    "subtitle": "You consumed " + sumA/1000 +" kWh last month.",
                    "image_url": uriA
                  },
                  {
                    "title": "Weekly Consumption",
                    "subtitle": "You consumed " + sumB/1000 + " kWh last week.",
                    "image_url": uriB
                  }
                ]
                }
              }
            });
          });
        });
    } else if (id == 'MAIN_WHOIS')
    {
        cloogy.findDevices(function (data) {
          sendTextMessage(sender, getWhoisSelection(data));
        });
      } else if (id == 'MAIN_TRIVIA') {
        trivia.startTrivia(sender);
      } else if(id.indexOf('TRIVIA_') >= 0) {
        trivia.handleTrivia(event, sender);
      }
    }
    else if (event.message && event.message.text) {
      var text = event.message.text;
      sendTextMessage(sender, mainSelection);
    }

  }
  res.sendStatus(200);
};
