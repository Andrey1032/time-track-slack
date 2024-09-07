const Router = require('express')
const router = new Router()
const typeOverUnderWorkController = require('../controllers/typeOverUnderWorkController')

router.post(process.env.TYPE_OVER_UNDER_WORK_POST, typeOverUnderWorkController.createTypeOverUnderWork)
router.put(process.env.TYPE_OVER_UNDER_WORK_PUT, typeOverUnderWorkController.updateTypeOverUnderWork)
router.delete(process.env.TYPE_OVER_UNDER_WORK_DELETE, typeOverUnderWorkController.deleteTypeOverUnderWork)

module.exports = router