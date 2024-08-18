const express = require('express')
const { Sequelize } = require('./database/db')
const sequelize = require('./database/db')
const cors = require('cors')
const model = require('./database/models')
const router = require('./routes/index')

const cron = require('./planeTask/index')


const PORT = process.env.PORT || 5000
const slackSigningSecret = '7f3a527ea87aff28f314b15e13db3dbf';

const app = express()  

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use('/', (req, res) => {
    res.json({message: 'work1', originalUrl: req.originalUrl, query: req.query, params: req.params, body: req.body})
})

const start = async () => {
    try {
        await sequelize.authenticate()
        //await sequelize.sync({ force: true }) //  удаляет существующую таблицу и создает новую
        //await sequelize.sync({ alter: true }) // приводит таблицу в соответствие с моделью
        //await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

    } catch (e) {
        console.log(e)
    }
}


start()