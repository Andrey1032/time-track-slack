const Router = require('express')
const router = new Router()
const dataTypeController = require('../controllers/dataTypeController')

router.post(process.env.DATA_TYPE_POST, dataTypeController.createDataType)
router.put(process.env.DATA_TYPE_PUT, dataTypeController.updateDataType)
router.delete(process.env.DATA_TYPE_DELETE, dataTypeController.deleteDataType)

module.exports = router