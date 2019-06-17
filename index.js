'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

//initialise app
const app = express()

//set port
app.set('port', (process.env.PORT || 5000))

//allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//ROUTES
app.get('/', function(req, res){
    res.send("Hi, I am ThePhiri Chatbot")
})

//Facebook
app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token']==="password"){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    if (event.message && event.message.text) {
		    let text = event.message.text
		    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
	    }
    }
    res.sendStatus(200)
})

const token = "EAAfazJU8y28BAABhGU2DH6yrafiTAMpFfOwvv0edCaZByIfxonhiQOWkGA9AJN6neQgfA9JZBlQhH2WXroF2fsjp6OYQCs1eSnXdZCg5tyk0R8bWl2RszimQd5aZBhLtroj2JMnfnDEtm5PJRo4XqqaWslvbRvAOdaTYWQonJwZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}
//spin up the server
app.listen(app.get('port'), function(){
    console.log("running: port", app.get('port'))
})