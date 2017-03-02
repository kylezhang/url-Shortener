const express = require('express')
const router  = express.Router()
const db      = require('../services/db')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express1' })
})

//转发短链接
router.get(/^\/([\w=]+)$/, (req, res, next) => {
  console.log('=====:', req.params[0])
  const shortUrl = req.params[0]
  db.getDataByShortUrl(shortUrl, (err, data) => {
    if(!err){
      const url = data[0].long_url
      res.redirect(url)
    }else{
      res.send({msg : 'Not found!'})
    }
  })
})

module.exports = router