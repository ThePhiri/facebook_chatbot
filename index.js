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
//spin up the server
app.listen(app.get('port'), function(){
    console.log("running: port", app.get('port'))
})