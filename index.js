const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql2')
const config = require('./configs')
const vars = require('./middlewares/vars')
const path = require('path')

const filmRouter = require('./routers/film_router')
const sessionsRouter = require('./routers/sessions_router')
const ticketsRouter = require('./routers/tickets_router')
const statRouter = require('./routers/stat_router')


const connection = mysql.createConnection({
    host: config.SQL_CONNECTION_HOST,
    user: config.SQL_CONNECTION_USER,
    database: config.SQL_CONNECTION_DATABASE,
    password: config.SQL_CONNECTION_PASSWORD
})

//Установка заголовков для общения сервера и клиента с разных портов (сервер - 9000, клиент - 3000)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

//Промежуточные слои для парсинга req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

//Установка объекта подключения к базе в объект req
app.use(vars(connection))

//add routers here
app.use('/films', filmRouter)
app.use('/sessions', sessionsRouter)
app.use('/tickets', ticketsRouter)
app.use('/stat', statRouter)

app.listen(config.PORT, () => {
    connection.connect(err => {
        if(err) console.log(err)
        else {
            console.log('successful')
        }
    })
})