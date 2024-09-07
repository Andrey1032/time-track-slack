const Router = require('express')
const router = new Router()
const underworkingController = require('../controllers/underworkingController')

router.post(process.env.UNDERWORKING_POST, underworkingController.createUnderworking)
// router.put('/:id_underworking', underworkingController.updateUnderworking)
// router.delete('/:id_underworking', underworkingController.deleteUnderworking)

module.exports = router