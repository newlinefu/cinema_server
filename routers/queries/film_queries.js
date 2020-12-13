const {escape} = require('mysql2')

function getAllFilmsRatings() {
    return `
        select  AR.*
          from  AGE_RATING AR
        ;
    `
}

function getGenres(filmId) {
    const validatedFilmId = escape(filmId)
    return `
        select  FG.GENRE_ID,
                G.GENRE_INFO
          from  FILM_GENRE FG
                left join   GENRE G
                                on G.GENRE_ID = FG.GENRE_ID
        where   FG.FILM_ID = ${validatedFilmId}
        ;
    `
}
function getFilms(duration, title, rating, dateSearchIndex) {
    // 0 - Сегодня
    // 1 - Завтра
    // 2 - Все фильмы
    const searchedDate = dateSearchIndex === 0 ? ' current_date() ' : ' current_date() + interval 1 day '
    const dateCondition = dateSearchIndex === 2
                            ? ''
                            : ` and date(SESSION_TIME) = ${searchedDate} `
    const ratingCondition = rating && rating.length ? ` and AR.AGE_RATING_INFO in  (${escape(rating)})  ` : ''
    const titleCondition = title ? ` and F.FILM_TITLE like ${escape(title + '%')} ` : ''
    return `
        select  F.FILM_ID, 
                F.FILM_TITLE,
                F.FILM_DESCRIPTION,
                F.FILM_MINUTE_DURATION,
                AR.AGE_RATING_INFO
          from  SESSIONS S
                left join   FILM F
                                on F.FILM_ID = S.SESSION_FILM
                left join   AGE_RATING AR
                                on AR.AGE_RATING_ID = F.FILM_AGE_RATING
         where  F.FILM_MINUTE_DURATION >= ${escape(duration[0])} 
                and F.FILM_MINUTE_DURATION <= ${escape(duration[duration.length - 1])}
                ${titleCondition}
                ${ratingCondition}
                ${dateCondition}
        group by    F.FILM_ID, 
                    F.FILM_TITLE,
                    F.FILM_DESCRIPTION,
                    F.FILM_MINUTE_DURATION,
                    AR.AGE_RATING_INFO
        ;
    `
}

module.exports = {
    getAllFilmsRatings,
    getFilms,
    getGenres
}