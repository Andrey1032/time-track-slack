const Router = require('express')
const router = new Router()
const writtenOffTimeController = require('../controllers/writingOffTimeController')

router.post(process.env.WRITTEN_OFF_TIME_POST, writtenOffTimeController.createWrittenOffTime)
router.get(process.env.WRITTEN_OFF_TIME_GET_ALL, writtenOffTimeController.getAllWrittenOffTime)
router.get(process.env.WRITTEN_OFF_TIME_GET_ONE, writtenOffTimeController.getAllWrittenOffTime)
router.put(process.env.WRITTEN_OFF_TIME_PUT, writtenOffTimeController.updateWrittenOffTime)
router.delete(process.env.WRITTEN_OFF_TIME_DELETE, writtenOffTimeController.deleteWrittenOffTime)

module.exports = router