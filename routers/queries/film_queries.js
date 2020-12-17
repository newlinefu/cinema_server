const {escape} = require('mysql2')

function getAllFilmsRatings() {
    return `
        select  AR.*
          from  AGE_RATING AR
        ;
    `
}

function getAllGenres() {
    return `
        select  G.*
          from  GENRE G
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

function getFilms(duration, title, rating, genre, dateSearchIndex) {
    // 0 - Сегодня
    // 1 - Завтра
    // 2 - Все фильмы
    const searchedDate = dateSearchIndex === 0 ? ' current_date() ' : ' current_date() + interval 1 day '
    const dateCondition = dateSearchIndex === 2
        ? ''
        : ` and date(SESSION_TIME) = ${searchedDate} `
    const ratingCondition = rating && rating.length ? ` and AR.AGE_RATING_INFO in  (${escape(rating)})  ` : ''
    const genreCondition = genre && genre.length ? ` and G.GENRE_INFO in (${escape(genre)})  ` : ''
    const titleCondition = title ? ` and F.FILM_TITLE like ${escape(title + '%')} ` : ''
    return `
        select  F.FILM_ID, 
                F.FILM_TITLE,
                F.FILM_DESCRIPTION,
                F.FILM_MINUTE_DURATION,
                AR.AGE_RATING_INFO
          from  FILM_GENRE FG
                left join   GENRE G
                                on G.GENRE_ID = FG.GENRE_ID
                left join   FILM F
                                on F.FILM_ID = FG.FILM_ID
                left join   SESSIONS S
                                on S.SESSION_FILM = F.FILM_ID
                left join   AGE_RATING AR
                                on AR.AGE_RATING_ID = F.FILM_AGE_RATING
         where  F.FILM_MINUTE_DURATION >= ${escape(duration[0])}
                and F.FILM_MINUTE_DURATION <= ${escape(duration[duration.length - 1])}
                ${dateCondition}
                ${ratingCondition}
                ${titleCondition}
                ${genreCondition}
        group by    F.FILM_ID, 
                    F.FILM_TITLE,
                    F.FILM_DESCRIPTION,
                    F.FILM_MINUTE_DURATION,
                    AR.AGE_RATING_INFO
        ;
    `
}

function deleteFilm(filmId) {
    return `
        delete from FILM
            where   FILM_ID = ${escape(filmId)}
        ;
    `
}

function putFilm(title, description, duration, ageRating) {
    return `
        insert into FILM (
            FILM_TITLE,
            FILM_DESCRIPTION,
            FILM_MINUTE_DURATION,
            FILM_AGE_RATING
        ) values (
            ${escape(title)},
            ${escape(description)},
            ${escape(+duration)},
            ${escape(ageRating)}
        );
    `
}

function updateFilm(id, title, description, duration, ageRating) {
    return `
        update  FILM
           set  FILM_TITLE = ${escape(title)},
                FILM_DESCRIPTION = ${escape(description)},
                FILM_MINUTE_DURATION = ${escape(+duration)},
                FILM_AGE_RATING = ${escape(ageRating)}
        where FILM_ID = ${escape(+id)}
        ;
    `
}

function insertFilmGenre(filmId, genre) {
    return `
        insert into FILM_GENRE (
                FILM_ID,
                GENRE_ID
            ) values (
                ${escape(+filmId)},
                ${escape(+genre)}
            );
    `
}

function insertFilmGenreByTitle(title, genre) {
    return `
            insert into FILM_GENRE (
                FILM_ID,
                GENRE_ID
            ) values (
                (
                    select  F.FILM_ID
                      from  FILM F
                     where  F.FILM_TITLE = ${escape(title)}
                ),
                ${escape(genre)}
            );
        `
}

function deleteAllGenresOnFilm(filmId) {
    return `
        delete 
          from  FILM_GENRE
         where  FILM_ID = ${escape(+filmId)}
        ;
    `
}

module.exports = {
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
}