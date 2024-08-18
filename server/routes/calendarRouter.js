const Router = require('express')
const router = new Router()
const calendarController = require('../controllers/calendarController')

router.post('/', calendarController.createCalendar)
router.get('/', calendarController.getAllCalendar)

module.exports = router