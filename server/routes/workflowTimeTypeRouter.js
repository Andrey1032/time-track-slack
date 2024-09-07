const Router = require('express')
const router = new Router()
const workflowTimeTypeController = require('../controllers/workflowTimeTypeController')

router.post(process.env.WORKFLOW_TIME_TYPE_POST, workflowTimeTypeController.createWorkflowTimeType)
router.put(process.env.WORKFLOW_TIME_TYPE_PUT, workflowTimeTypeController.updateWorkflowTimeType)
router.delete(process.env.WORKFLOW_TIME_TYPE_DELETE, workflowTimeTypeController.deleteWorkflowTimeType)

module.exports = router