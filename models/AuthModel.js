module.exports = {
    getEmail: function(db, callback) {
        db.query('SELECT email FROM users WHERE email = ?', callback)
    },
}