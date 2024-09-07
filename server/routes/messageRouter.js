const Router = require('express')
const router = new Router()
const messageController = require('../controllers/messageController')

router.post(process.env.MESSAGE_POST, messageController.createMessage)
router.put(process.env.MESSAGE_UPDATE, messageController.updateMessage)
router.delete(process.env.MESSADE_DELETE, messageController.deleteMessage)

module.exports = router