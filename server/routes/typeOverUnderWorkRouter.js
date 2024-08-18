const Router = require('express')
const router = new Router()
const typeOverUnderWorkController = require('../controllers/typeOverUnderWorkController')

router.post('/', typeOverUnderWorkController.createTypeOverUnderWork)
router.put('/:id_type_over_under_work', typeOverUnderWorkController.updateTypeOverUnderWork)
router.delete('/:id_type_over_under_work', typeOverUnderWorkController.deleteTypeOverUnderWork)

module.exports = router