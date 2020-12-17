const {Router} = require('express')
const {
    requestSimpleHandlerDecorator,
    requestHandlerDecorator
} = require('../utils')
const {resError} = require('../utils/index')
const {
    getAllFilmsRatings,
    getFilms,
    getGenres,
    getAllGenres,
    updateFilm,
    deleteFilm,
    putFilm,
    insertFilmGenreByTitle,
    deleteAllGenresOnFilm,
    insertFilmGenre
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

filmRouter.get('/genres', (req, res) => {
    const query = getAllGenres()
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not get genres data',
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
        data.genres,
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

filmRouter.post('/update_film', (req, res) => {
    const data = req.body
    const errCB = (err) => resError('Can not put films', res, err)
    const queryUpdate = updateFilm (
        data.id,
        data.title,
        data.description,
        data.duration,
        data.ageRating
    )
    const queryClearGenres = deleteAllGenresOnFilm(data.id)

    requestHandlerDecorator(
        errCB,
        async () => {
            await req.connection.execute(queryUpdate)
            await req.connection.execute(queryClearGenres)
            for await (let g of data.genres) {
                req.connection.execute(insertFilmGenre(data.id, g))
            }
            res.end()
        }
    )
})

filmRouter.post('/put_film', (req, res) => {
    const data = req.body
    const errCB = (err) => resError('Can not put films', res, err)
    const queryPut = putFilm (
        data.title,
        data.description,
        data.duration,
        data.ageRating
    )

    requestHandlerDecorator(
        errCB,
        async () => {
            await req.connection.execute(queryPut)
            for await (let g of data.genres) {
                req.connection.execute(insertFilmGenreByTitle(data.title, g))
            }
            res.end()
        }
    )
})


filmRouter.get('/:id', (req, res) => {
    const query = deleteFilm(+req.params.id)
    requestSimpleHandlerDecorator(
        req,
        res,
        'Can not delete film with id ' + req.query.id,
        query,
        []
    )
})






module.exports = filmRouter