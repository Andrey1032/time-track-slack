const Router = require('express')
const router = new Router()
const events = require('./slackHandler/events')
const aboutUser = require('./slackHandler/aboutUser')

router.use('/slack', events)
router.use('/slackaboutuser', aboutUser.infoAboutUser)

module.exports = router