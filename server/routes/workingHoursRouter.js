const Router = require('express')
const router = new Router()
const workingHoursController = require('../controllers/workingHoursController')

router.post(process.env.WORKING_HOURS_POST, workingHoursController.createWorkingHours)
router.put(process.env.WORKING_HOURS_PUT, workingHoursController.updateWorkingHours)
router.put(process.env.WORKING_HOURS_DELETE, workingHoursController.deleteWorkingHours)

module.exports = router