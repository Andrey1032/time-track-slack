const Router = require('express')
const router = new Router()
const reworkingMonthController = require('../controllers/reworkingMonthController')

router.post(process.env.REWORKINGS_MONTH_POST, reworkingMonthController.createReworkingMonth)
router.put(process.env.REWORKINGS_MONTH_PUT, reworkingMonthController.updateReworkingMonth)

module.exports = router