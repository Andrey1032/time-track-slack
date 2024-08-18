const Router = require('express')
const router = new Router()
const underworkingMonthController = require('../controllers/underworkingMonthController')

router.post('/', underworkingMonthController.createReworkingMonth)
router.put('/:id_underworking_month', underworkingMonthController.updateReworkingMonth)

module.exports = router