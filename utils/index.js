//Функция валидации ошибки при обработке запросов
function resError(errMessage, res, err) {
    console.log(err)
    console.log(errMessage)
    return res.end(JSON.stringify({errMessage}))
}

function requestSimpleHandlerDecorator(req, res, errMessage, query, queryArgs) {
    try {
        req.connection.query(
            query,
            queryArgs,
            (err, result) => {
                if(err) {
                    return resError(errMessage, res, err)
                } else {
                    return res.end(JSON.stringify(result))
                }
            }
        )
    } catch (err) {
        return resError(errMessage, res, err)
    }
}

function requestHandlerDecorator(errorCB, actionCB) {
    try {
        actionCB()
    } catch (err) {
        return errorCB(err)
    }
}

module.exports = {
    requestSimpleHandlerDecorator,
    requestHandlerDecorator,
    resError
}