const Router = require('express')
const router = new Router()
const typeOfWorkController = require('../controllers/typeOfWorkController')

router.post('/', typeOfWorkController.createTypeOfWork)
router.put('/:id_type_of_work', typeOfWorkController.updateTypeOfWork)
router.delete('/:id_type_of_work', typeOfWorkController.deleteTypeOfWork)

module.exports = router