const {Workflow_Time_Type} = require('../database/models')

class WorkflowTimeTypeController {
    async createWorkflowTimeType(req, res){
        const {name_workflow_time_type} = req.body
        try {
            const workflowTimeType = await Workflow_Time_Type.create({name_workflow_time_type})
            return res.json(workflowTimeType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка записи типа времени рабочего процесса");
        }
    }

    async updateWorkflowTimeType(req, res){
        const {id_workflow_time_type} = req.params
        const {name_workflow_time_type} = req.body
        try {
            const workflowTimeType = await Workflow_Time_Type.update({name_workflow_time_type}, {where: {id_workflow_time_type}})
            return res.json(workflowTimeType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка обновления типа времени рабочего процесса");
        }
    }
    
    async deleteWorkflowTimeType(req, res){
        const {id_workflow_time_type} = req.params
        try {
            const workflowTimeType = await Workflow_Time_Type.destroy({where: {id_workflow_time_type}})
            return res.json(workflowTimeType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка удаления типа времени рабочего процесса");
        }
    }
}

module.exports = new WorkflowTimeTypeController()