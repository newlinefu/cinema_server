function getStatistics() {
    return `
            select (
                        select  count(*)
                        from  film
               ) as "Общее колличество фильмов",
               (
                        select  count(*)
                        from  TICKET
               ) as "Колличество проданных билетов",
               (
                    select sum(S.SESSION_PRICE * PC.PRICE_CATEGORY_COEF * H.HALL_PRICE_COEF)
                      from  TICKET T
                            left join SESSIONS S
                                        on S.SESSION_ID = T.SESSION_ID
                            left join SEAT_HALL SH
                                        on SH.SEAT_HALL_ID = T.SEAT_HALL_ID
                            left join HALL H
                                        on H.HALL_ID = SH.HALL_ID
                            left join PRICE_CATEGORY PC
                        on PC.CATEGORY_ID = SH.PRICE_CATEGORY_ID
               ) as "Общая сумма выручки",
               (
                    select  sum(H.HALL_SEATS_QUANTITY)
                      from  HALL H
               ) as "Максимальная единовременная вместимость кинотеатра"
          from dual
        ;
    
    `
}

module.exports = {
    getStatistics
}