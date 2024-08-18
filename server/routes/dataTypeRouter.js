const Router = require('express')
const router = new Router()
const dataTypeController = require('../controllers/dataTypeController')

router.post('/', dataTypeController.createDataType)
router.put('/:id_data_type', dataTypeController.updateDataType)
router.delete('/:id_data_type', dataTypeController.deleteDataType)

module.exports = router