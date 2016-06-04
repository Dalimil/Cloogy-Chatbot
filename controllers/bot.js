const request = require('request');
const config = require('../config');
const cloogy = require('../utils/cloogy');

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
        "text":"What do you want to see?",
        "buttons":[
          {
            "type":"postback",
            "title":"Energy status",
            "payload":"MAIN_STATUS"
          },
          {
            "type":"postback",
            "title":"Graph",
            "payload":"MAIN_GRAPH"
          }
        ]
      }
    }
};

function getConsumptionSelection(trees) {
	return {
	    "attachment": {
	      "type": "template",
	      "payload": {
	        "template_type": "generic",
	        "elements": [{
	          "title": "First card",
	          "subtitle": "Element #1 of an hscroll - " + trees,
	          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
	          "buttons": [{
	            "type": "web_url",
	            "url": "https://www.messenger.com/",
	            "title": "Web url"
	          }, {
	            "type": "postback",
	            "title": "Postback",
	            "payload": "Payload for first element in a generic bubble",
	          }],
	        },{
	          "title": "Second card",
	          "subtitle": "Element #2 of an hscroll",
	          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
	          "buttons": [{
	            "type": "postback",
	            "title": "Postback",
	            "payload": "Payload for second element in a generic bubble",
	          }],
	        }]
	      }
	    }
	};
}

exports.messageReceived = function (req, res) {
	messaging_events = req.body.entry[0].messaging;
	for (var i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		sender = event.sender.id;

		if (event.postback) {
			id = event.postback.payload;
			if(id == 'MAIN_STATUS') {
				cloogy.consumptions(function(data) {
					// getConsumptionSelection
					sendTextMessage(sender, { text: data });
				});
			} else if(id == 'MAIN_GRAPH') {
				sendTextMessage(sender, { text: 'hi' });
			}
		} 
		else if (event.message && event.message.text) {
			text = event.message.text;
			sendTextMessage(sender, mainSelection);
		}
	}
	res.sendStatus(200);
};

