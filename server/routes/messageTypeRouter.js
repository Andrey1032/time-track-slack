const Router = require('express')
const router = new Router()
const messageTypeController = require('../controllers/messageTypeController')

router.post(process.env.MESSAGE_TYPE_POST, messageTypeController.createMessageType)
router.put(process.env.MESSAGE_TYPE_PUT, messageTypeController.updateMessageType)
router.delete(process.env.MESSAGE_TYPE_DELETE, messageTypeController.deleteMessageType)


module.exports = router