const express = require('express')
const ngrok = require('ngrok')
const axios = require('axios');
const cors = require('cors')
const routes = require('./routes')

const portEvent = 80


const app = new express()


// app.get('/', (req, res) => {
//   res.status(200).json({message: "working"})
// })
// app.use('/slack/events', slackEvents.requestListener());

app.use(cors())
app.use('/app', routes)

app.listen(portEvent, (err) => {
  if(err) return console.log(err.message)
  console.log(`App is running on port ${portEvent}`)

  ngrok.connect({authtoken: '2iPsJGnsWq9L3r5JsAALXp7DN1J_6C4dkvfaFC2Wd5MCWBKTp'})
      .then(url => console.log(url))
      .catch(err => console.log(err.message))
})