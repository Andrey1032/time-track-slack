const Router = require('express')
const router = new Router()
const accountDataController = require('../controllers/accountDataController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', accountDataController.registrationUser)
router.post('/login', accountDataController.loginUser)
router.get('/auth', authMiddleware, accountDataController.check)

module.exports = router