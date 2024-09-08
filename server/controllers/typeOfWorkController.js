const {Type_of_work} = require('../database/models')

class TypeOfWorkController {
    async createTypeOfWork(req, res){
        const {name_type_of_work} = req.body
        try {
            const typeOfWork = await Type_of_work.create({name_type_of_work})
            return res.json(typeOfWork)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка записи типа по работе");
        }
    }

    async updateTypeOfWork(req, res){
        const {id_type_of_work} = req.params
        const {name_type_of_work} = req.body
        try {
            const typeOfWork = await Type_of_work.update({name_type_of_work}, {where: {id_type_of_work}})
            return res.json(typeOfWork)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка обновления типа по работе");
        }
    }
    
    async deleteTypeOfWork(req, res){
        const {id_type_of_work} = req.params
        try {
            const typeOfWork = await Type_of_work.destroy({where: {id_type_of_work}})
            return res.json(typeOfWork)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка удаления типа по работе");
        }
    }
}

module.exports = new TypeOfWorkController()