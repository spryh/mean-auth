function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile')
    } else { return next()}
}

module.exports.loggedOut = loggedOut

function requiresLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
        var err = new Error('User not authorized to view page.')
        err.status = 403
        return next(err)
    } else { 
        return next()}
}

module.exports.requiresLogin = requiresLogin
