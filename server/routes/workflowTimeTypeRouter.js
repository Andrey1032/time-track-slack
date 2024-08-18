const Router = require('express')
const router = new Router()
const workflowTimeTypeController = require('../controllers/workflowTimeTypeController')

router.post('/', workflowTimeTypeController.createWorkflowTimeType)
router.put('/:id_workflow_time_type', workflowTimeTypeController.updateWorkflowTimeType)
router.delete('/:id_workflow_time_type', workflowTimeTypeController.deleteWorkflowTimeType)

module.exports = router