const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post(process.env.USER_POST, userController.createUser)
router.get(process.env.USER_GET, userController.getOneUser)
router.put(process.env.USER_PUT, userController.updateUser)
router.delete(process.env.USER_DELETE, userController.deleteUser)

module.exports = router