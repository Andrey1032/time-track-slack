const Router = require('express')
const router = new Router()
const accountDataController = require('../controllers/accountDataController')
const authMiddleware = require('../middleware/authMiddleware')

router.post(process.env.ACCOUNT_DATA_REGISTRATION, accountDataController.registrationUser)
router.post(process.env.ACCOUNT_DATA_LOGIN, accountDataController.loginUser)
router.get(process.env.ACCOUNT_DATA_AUTH, authMiddleware, accountDataController.check)

module.exports = router