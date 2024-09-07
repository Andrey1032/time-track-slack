const Router = require('express')
const router = new Router()
const events = require('./slackHandler/events')
const aboutUser = require('./slackHandler/aboutUser')

router.use(process.env.SLACK_EVENTS_ROUTER, events)
router.use(process.env.SLACK_ABOUT_USER_ROUTER, aboutUser.infoAboutUser)

module.exports = router