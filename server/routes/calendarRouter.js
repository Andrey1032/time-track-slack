const Router = require('express')
const router = new Router()
const calendarController = require('../controllers/calendarController')

router.post(process.env.CALENDAR_POST, calendarController.createCalendar)
router.get(process.env.CALENDAR_PUT, calendarController.getAllCalendar)

module.exports = router