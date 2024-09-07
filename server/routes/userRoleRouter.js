const Router = require('express')
const router = new Router()
const userRoleController = require('../controllers/userRoleController')

router.post(process.env.USER_ROLE_POST, userRoleController.createUserRole)
router.put(process.env.USER_ROLE_PUT, userRoleController.updateUserRole)
router.delete(process.env.USER_ROLE_DELETE, userRoleController.deleteUserRole)

module.exports = router