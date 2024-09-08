const Router = require('express')
const router = new Router()
const departmentController = require('../controllers/departmentController')

router.post(process.env.DEPARTMENT_POST, departmentController.createDepartment)
router.get(process.env.DEPARTMENT_GET, departmentController.getAllDepartment)
router.put(process.env.DEPARTMENT_PUT, departmentController.updateDepartment)
router.delete(process.env.DEPARTMENT_DELETE, departmentController.deleteDepartment)

module.exports = router