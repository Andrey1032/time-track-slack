const {Message_Type} = require('../database/models')

class MessageTypeController {
    async createMessageType(req, res){
        const {name_message_type} = req.body
        try {
            const messageType = await Message_Type.create({name_message_type})
            return res.json(messageType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка записи типа сообщения");
        }
    }

    async updateMessageType(req, res){
        const {id_message_type} = req.params
        const {name_message_type} = req.body
        try {
            const messageType = await Message_Type.update({name_message_type}, {where: {id_message_type}})
            return res.json(messageType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка обновления типа сообщения");
        }
    }
    
    async deleteMessageType(req, res){
        const {id_message_type} = req.params
        try {
            const messageType = await Message_Type.destroy({where: {id_message_type}})
            return res.json(messageType)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Ошибка удаления типа сообщения");
        }
    }
}

module.exports = new MessageTypeController()