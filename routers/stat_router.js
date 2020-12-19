const {Router} = require('express')
const {
    requestSimpleHandlerDecorator
} = require('../utils')
const {
    getStatistics
} = require('./queries/statistic_queries')
const statRouter = Router()

statRouter.get('/', (req, res) => {
    const query = getStatistics()
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get statistics',
        query,
        []
    )
})
module.exports = statRouter