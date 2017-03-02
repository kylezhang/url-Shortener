/**
 * routers
 */
'use strict'
const index = require('../app/controllers/index')
const users = require('../app/controllers/users')
const url   = require('../app/controllers/url')


module.exports = function(app) {
    app.use('/', index)
    app.use('/users', users)
    app.use('/api/v1', url)
}