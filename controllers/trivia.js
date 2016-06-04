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
var facts = [];
function addQuestion(question, options, answer, fact) {
    var letter = ['a','b','c','d','e','f','g'];
    var buttons = [];
    for(var i=0; i<options.length; i++) {
        buttons.push({
            "type":"postback",
            "title":options[i],
            "payload":"TRIVIA_Q"+questions.length+"_"+letter[i]
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
    facts.push(fact);
}

addQuestion('What kind of pilot energy process is researched in Portugal and is considered a clean and safe energy process?',['Coal','Marine','Nuclear'],'b','According to research 40% of domestic electrical consumption could be covered by marine energy.');
addQuestion('If you compare traveling 2000 km by car or plane, which produces more CO2? We\'re considering a mid-sized car with four other passengers.',['Car','Plane'],'b','Traveling by plane produces 300% more CO2.');
addQuestion('And what if you\'re traveling alone in the car, which produces more CO2?',['Car','Plane'],'a','Traveling by car alone is actually producing 50% more CO2 than a flight.');

function startTrivia(sender){
    sendTextMessage(sender, {text:'Hi, let\'s do a trivia quiz.'});
    setTimeout(function(){
        sendTextMessage(sender, questions[0]);
    },500);
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
                setTimeout(function(){
                    sendTextMessage(sender, {text:facts[i]});
                },500);
                console.log(i+' vs '+(questions.length-1))
                if(i < questions.length-1) {
                    setTimeout(function(){
                        sendTextMessage(sender, questions[i+1]);
                    },1000);
                } else {
                    sendTextMessage(sender, {text:'Done! Your score is '+GLOBAL.score});
                    var minScore = questions.length*2/3;
                    if(GLOBAL.score >= questions.length*2/3) {
                        setTimeout(function(){
                            sendTextMessage(sender, {text:'Congrats, enjoy the light!'});
                        },500);
                        cloogy.actuate(1, function() {});
                    } else {
                        setTimeout(function(){
                            sendTextMessage(sender, {text:'Sorry, not this time! You should get at least '+minScore+' questions right ;)'});

                        },500);
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
