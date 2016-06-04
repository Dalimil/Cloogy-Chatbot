const request = require('request');
const config = require('../config');


function sendTextMessage(sender, messageData) {
    const payload = {
        recipient: {id: sender},
        message: messageData,
    };

    console.log(payload);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: config.FB.ACCESS_TOKEN},
        method: 'POST',

        json: payload
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

var questions = [];
var correct = [];

function addQuestion(question, options, answer) {
    var letter = ['a','b','c','d','e','f','g'];
    var buttons = [];
    for(var i=0; i<options.length; i++) {
        buttons.push({
            "type":"postback",
            "title":options[i],
            "payload":"TRIVIA_Q"+i+"_"+letter[i]
        })
    }
    questions.push({
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":question,
                "buttons":buttons
            }
        }
    });
    correct.push(answer);

}

addQuestion('How are you?',['Great','Good','Bad'],'c');
addQuestion('What time is it?',['1','2','3'],'c');
addQuestion('Final question',['2','3','4'],'5');

function startTrivia(sender){
    sendTextMessage(sender, {text:'Hi, let\'s do a trivia quiz.'});
    sendTextMessage(sender, questions[0]);
    GLOBAL.score = 0;
}

function handleTrivia(event, sender) {
    console.log(event);
    if (event.postback) {
        id = event.postback.payload
        for(var i=0; i<questions.length; i++) {
            var prefix = 'TRIVIA_Q'+i+'_';
            if(id.indexOf(prefix) >= 0 ){
                var answer = id.replace(prefix,'');
                console.log('Answered: "'+answer+'"')
                if(answer == correct[i]) {
                    sendTextMessage(sender, 'Correct!');
                    GLOBAL.score++;
                } else {
                    sendTextMessage(sender, 'Not correct :(');
                }
                if(i < questions.length-1) {
                    sendTextMessage(sender, questions[i+1]);
                } else {
                    sendTextMessage(sender, {text:'Done! Your score is '+GLOBAL.score});

                }
                break;
            }
        }
    }

}

module.exports = {
    startTrivia: startTrivia,
    handleTrivia: handleTrivia
};
