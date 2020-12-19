const {Router} = require('express')
const {
    requestSimpleHandlerDecorator,
    requestHandlerDecorator
} = require('../utils')
const {
    buyTickets,
    getSeats,
    getTickets,
    returnTickets
} = require('./queries/tickets_queries')
const {resError} = require('../utils/index')
const ticketsRouter = Router()

ticketsRouter.get('/seats/:hallId', (req, res) => {
    const query = getSeats(req.params.hallId)
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get seats',
        query,
        []
    )
})

ticketsRouter.get('/:sessionId', (req, res) => {
    const query = getTickets(req.params.sessionId)
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get tickets',
        query,
        []
    )
})

ticketsRouter.post('/buy', (req, res) => {
    const data = req.body
    const query = buyTickets(data.sessionId, data.seatsColl)
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not buy tickets',
        query,
        []
    )
})

ticketsRouter.post('/return', (req, res) => {
    const data = req.body
    const query = returnTickets(data.sessionId, data.seatsColl)
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not return tickets',
        query,
        []
    )
})

module.exports = ticketsRouter