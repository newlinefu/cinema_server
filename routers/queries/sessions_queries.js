const {escape} = require('mysql2')

function getAllHalls() {
    return `
        select  H.*
          from  HALL H
        ;
    `
}

function getAllFilms() {
    return `
        select  F.*
          from  FILM F
        ;
    `
}

function getSessions(date, price, film = null) {
    return `
        select  S.SESSION_ID as SESS_ID,
                S.SESSION_HALL as SESS_HALL,
                S.SESSION_PRICE * H.HALL_PRICE_COEF as SESS_PRICE,
                S.SESSION_PRICE as SESS_PRIMARY_PRICE,
                S.SESSION_TIME as SESS_TIME,
                F.FILM_ID as SESS_FILM_ID,
                F.FILM_TITLE as SESS_FILM_TITLE,
                AR.AGE_RATING_INFO as SESS_FILM_AR_INFO
          from  SESSIONS S
                left join   HALL H
                                on H.HALL_ID = S.SESSION_HALL
                left join   FILM F 
                                on F.FILM_ID = S.SESSION_FILM
                left join   AGE_RATING AR
                                on AR.AGE_RATING_ID = F.FILM_AGE_RATING
         where  ${escape(price[0])} <= SESSION_PRICE * H.HALL_PRICE_COEF 
                and SESSION_PRICE * H.HALL_PRICE_COEF <= ${escape(price[price.length - 1])}
                ${!!date ? `and date(SESSION_TIME) = date(${escape(new Date(date))})` : ''}
                ${film ? `and F.FILM_ID = ${escape(film)}` : ''}
                
        order by    S.SESSION_TIME
        ;
    `
}

function putSession(hallId, filmId, price, time) {
    return `
        insert into SESSIONS (
            SESSION_HALL,
            SESSION_FILM,
            SESSION_PRICE,
            SESSION_TIME
        ) values (
            ${escape(+hallId)},
            ${escape(+filmId)},
            ${escape(+price)},
            ${escape(time)}
        );
    `
}

function updateSession(sessId, hallId, filmId, price, time) {
    return `
        update  SESSIONS
           set  SESSION_HALL = ${escape(+hallId)},
                SESSION_FILM = ${escape(+filmId)},
                SESSION_PRICE = ${escape(+price)},
                SESSION_TIME = ${escape(time)}
        where SESSION_ID = ${escape(+sessId)}
        ;
    `
}

function deleteSession(sessId) {
    return `
        delete 
          from  SESSIONS
         where  SESSION_ID = ${escape(+sessId)}
        ;
    `
}
module.exports = {
    getSessions,
    getAllFilms,
    getAllHalls,
    deleteSession,
    updateSession,
    putSession
}