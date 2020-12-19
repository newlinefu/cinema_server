const {escape} = require('mysql2')

function getSeats(hallId) {
    return `
            select  SH.SEAT_HALL_ID,
                    SH.SEAT_NUMBER,
                    SH.HALL_ID,
                    PC.CATEGORY_ID,
                    PC.PRICE_CATEGORY_COEF
              from  SEAT_HALL SH
                        left join   PRICE_CATEGORY PC
                                        on PC.CATEGORY_ID = SH.PRICE_CATEGORY_ID
             where  SH.HALL_ID = ${escape(+hallId)}
            ;
    `
}

function getTickets(sessionId) {
    return `
        select  T.*
          from  TICKET T
         where  T.SESSION_ID = ${escape(+sessionId)}
        ;
    `
}

function buyTickets(sessionId, seatHallIdCollection) {
    let query = `
        insert into TICKET(
            SESSION_ID,
            SEAT_HALL_ID
        ) values        
    `

    for(let i = 0; i < seatHallIdCollection.length; i++) {
        query += `(${escape(+sessionId)}, ${escape(+seatHallIdCollection[i])})`
        query += i === seatHallIdCollection.length - 1 ? '' : ','

    }

    return query
}

function returnTickets(sessionId, seatHallIdCollection) {
    return `
        delete 
          from  TICKET
         where  SEAT_HALL_ID in ( ${escape(seatHallIdCollection)} )
       ;
    `
}

module.exports = {
    returnTickets,
    buyTickets,
    getTickets,
    getSeats
}