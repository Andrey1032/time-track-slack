const Router = require('express')
const router = new Router()
const workingHoursController = require('../controllers/workingHoursController')

router.post('/', workingHoursController.createWorkingHours)
router.put('/:year/:month/:day', workingHoursController.updateWorkingHours)
router.put('/delete/:year/:month/:day/', workingHoursController.deleteWorkingHours)

module.exports = router