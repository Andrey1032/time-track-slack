const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/', userController.createUser)
router.get('/', userController.getOneUser)
router.put('/:id_user', userController.updateUser)
router.delete('/:id_user', userController.deleteUser)

module.exports = router