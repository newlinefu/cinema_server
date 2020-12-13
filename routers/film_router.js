const {Router} = require('express')
const {
    requestSimpleHandlerDecorator,
    requestHandlerDecorator
} = require('../utils')
const {resError} = require('../utils/index')
const {
    getAllFilmsRatings,
    getFilms,
    getGenres
} = require('./queries/film_queries')

const filmRouter = Router()

filmRouter.get('/ratings', (req, res) => {
    const query = getAllFilmsRatings()
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get ratings data',
        query,
        []
    )
})

filmRouter.post('/', (req, res) => {
    const data = req.body
    const query = getFilms(
        data.duration,
        data.title,
        data.rating,
        data.dateSearchIndex
    )
    const errCB = (err) => resError('Can not get films', res, err)
    requestHandlerDecorator (
        errCB,
        () => {
            req.connection.query(
                query,
                (err, result) => {
                    if(err)
                        return errCB(err)
                    else {
                        const promiseCollection = []
                        for(let i = 0; i < result.length; i++) {
                            const prom = new Promise((resolve, rej) => {
                                req.connection.query (
                                    getGenres(result[i].FILM_ID),
                                    (err, genreRes) => {
                                        if(err) {
                                            return rej(err)
                                        }
                                        else {
                                            result[i].FILM_GENRES = genreRes
                                            resolve()
                                        }
                                    }
                                )
                            })
                            promiseCollection.push(prom)
                        }
                        Promise.all(promiseCollection)
                            .then(() => res.end(JSON.stringify(result)))
                            .catch(err => errCB(err))
                    }
                }
            )
        }
    )
})


module.exports = filmRouter