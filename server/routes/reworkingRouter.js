const Router = require('express')
const router = new Router()
const reworkingController = require('../controllers/reworkingController')

router.post('/', reworkingController.createUnderworking)
// router.put('/:id_reworking', reworkingController.updateUnderworking)
// router.delete('/:id_reworking', reworkingController.deleteUnderworking)

module.exports = router