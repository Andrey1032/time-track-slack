const Router = require('express')
const router = new Router()
const departmentController = require('../controllers/departmentController')

router.post('/', departmentController.createDepartment)
router.get('/', departmentController.getAllDepartment)
router.get('/:id_department', departmentController.getAllDepartment)
router.put('/:id_department', departmentController.updateDepartment)
router.delete('/:id_department', departmentController.deleteDepartment)

module.exports = router