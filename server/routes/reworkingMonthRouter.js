const Router = require('express')
const router = new Router()
const reworkingMonthController = require('../controllers/reworkingMonthController')

router.post('/', reworkingMonthController.createReworkingMonth)
router.put('/:id_reworking_month', reworkingMonthController.updateReworkingMonth)

module.exports = router