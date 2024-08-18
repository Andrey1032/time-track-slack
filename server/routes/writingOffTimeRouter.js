const Router = require('express')
const router = new Router()
const writtenOffTimeController = require('../controllers/writingOffTimeController')

router.post('/', writtenOffTimeController.createWrittenOffTime)
router.get('/', writtenOffTimeController.getAllWrittenOffTime)
router.get('/:id_writing_off_time', writtenOffTimeController.getAllWrittenOffTime)
router.put('/:id_writing_off_time', writtenOffTimeController.updateWrittenOffTime)
router.delete('/:id_writing_off_time', writtenOffTimeController.deleteWrittenOffTime)

module.exports = router