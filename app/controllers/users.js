let express = require('express')
let router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource\r\n')
})

module.exports = router