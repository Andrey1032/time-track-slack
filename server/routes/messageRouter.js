const Router = require('express')
const router = new Router()
const messageController = require('../controllers/messageController')

router.post('/', messageController.createMessage)
router.put('/update', messageController.updateMessage)
router.delete('/delete', messageController.deleteMessage)

module.exports = router