const {Router} = require('express')
const {
    requestSimpleHandlerDecorator,
    requestHandlerDecorator
} = require('../utils')
const {
    getAllFilms,
    getAllHalls,
    getSessions,
    deleteSession,
    putSession,
    updateSession
} = require('./queries/sessions_queries')
const {resError} = require('../utils/index')
const sessionsRouter = Router()

sessionsRouter.post('/get_all', (req, res) => {
    const data = req.body
    const query = getSessions (
        data.date,
        data.price,
        data.film
    )

    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get sessions',
        query,
        []
    )
})

sessionsRouter.get('/all_films', (req, res) => {
    const query = getAllFilms()
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get films',
        query,
        []
    )
})

sessionsRouter.get('/all_halls', (req, res) => {
    const query = getAllHalls()
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get halls',
        query,
        []
    )
})

sessionsRouter.get('/delete_sess/:id', (req, res) => {
    const query = deleteSession(req.params.id)
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not delete session ' + req.params.id,
        query,
        []
    )
})

sessionsRouter.post('/update_sess', (req, res) => {
    const data = req.body
    const query = updateSession(
        data.sessId,
        data.hallId,
        data.filmId,
        data.price,
        data.time.replace('T', ' ').replace('Z', '')
    )
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not update session ' + data.sessId,
        query,
        []
    )
})

sessionsRouter.post('/put_sess', (req, res) => {
    const data = req.body
    console.log(data.time)
    console.log(new Date(data.time))
    const query = putSession(
        data.hallId,
        data.filmId,
        data.price,
        data.time.replace('T', ' ').replace('Z', '')
    )
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not put session',
        query,
        []
    )
})


module.exports = sessionsRouter