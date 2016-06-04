const request = require('request');
const config = require('../config');

const cloogy = require('../utils/cloogy');

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
            console.log('Prefix: '+prefix);
            if(id.indexOf(prefix) >= 0){
                console.log('Activating: '+prefix);
                var answer = id.replace(prefix,'');
                console.log('Answered: "'+answer+'"')
                if(answer == correct[i]) {
                    sendTextMessage(sender, {text:'Correct!'});
                    GLOBAL.score++;
                } else {
                    sendTextMessage(sender, {text:'Not correct :('});
                }
                console.log(i+' vs '+(questions.length-1))
                if(i < questions.length-1) {
                    sendTextMessage(sender, questions[i+1]);
                } else {
                    sendTextMessage(sender, {text:'Done! Your score is '+GLOBAL.score});
                    var minScore = questions.length*2/3;
                    if(GLOBAL.score >= questions.length*2/3) {
                        sendTextMessage(sender, {text:'Congrats, enjoy the light!'});
                        cloogy.actuate(1, function() {});
                    } else {
                        sendTextMessage(sender, {text:'Sorry, not this time! You should get at least '+minScore+' questions right ;)'});

                        cloogy.actuate(0, function() {});
                    }
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
