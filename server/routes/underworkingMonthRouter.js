const Router = require('express')
const router = new Router()
const underworkingMonthController = require('../controllers/underworkingMonthController')

router.post(process.env.UNDERWORKING_MONTH_POST, underworkingMonthController.createReworkingMonth)
router.put(process.env.UNDERWORKING_MONTH_PUT, underworkingMonthController.updateReworkingMonth)

module.exports = router