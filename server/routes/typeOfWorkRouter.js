const Router = require('express')
const router = new Router()
const typeOfWorkController = require('../controllers/typeOfWorkController')

router.post(process.env.TYPE_OF_WORK_POST, typeOfWorkController.createTypeOfWork)
router.put(process.env.TYPE_OF_WORK_PUT, typeOfWorkController.updateTypeOfWork)
router.delete(process.env.TYPE_OF_WORK_DELETE, typeOfWorkController.deleteTypeOfWork)

module.exports = router