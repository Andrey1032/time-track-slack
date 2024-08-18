const Router = require('express')
const router = new Router()
const messageTypeController = require('../controllers/messageTypeController')

router.post('/', messageTypeController.createMessageType)
router.put('/:id_message_type', messageTypeController.updateMessageType)
router.delete('/:id_message_type', messageTypeController.deleteMessageType)


module.exports = router