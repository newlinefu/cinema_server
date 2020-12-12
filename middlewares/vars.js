module.exports = function(connection) {
    return (req, res, next) => {
        req.connection = connection
        next()
    }
}