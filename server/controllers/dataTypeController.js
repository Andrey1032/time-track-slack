const {Data_Type} = require('../database/models')

class DataTypeController {
    async createDataType(req, res){
        const {name_data_type} = req.body
        try {
            const dataType = await Data_Type.create({name_data_type})
            return res.json(dataType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка заполнения типа даты");
        }

    }

    async updateDataType(req, res){
        const {id_data_type} = req.params
        const {name_data_type} = req.body
        try {
            const dataType = await Data_Type.update({name_data_type}, {where: {id_data_type}})
            return res.json(dataType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка обновления типа даты");
        }
    }
    
    async deleteDataType(req, res){
        const {id_data_type} = req.params
        try {            
            const dataType = await Data_Type.destroy({where: {id_data_type}})
            return res.json(dataType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка удаления типа даты");
        }
    }
}

module.exports = new DataTypeController()