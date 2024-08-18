const Router = require('express')
const router = new Router()
const userRoleController = require('../controllers/userRoleController')

router.post('/', userRoleController.createUserRole)
router.put('/:id_user_role', userRoleController.updateUserRole)
router.delete('/:id_user_role', userRoleController.deleteUserRole)

module.exports = router