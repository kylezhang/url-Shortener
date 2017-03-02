const express = require('express')
const router  = express.Router()
const url     = require('url')
const async   = require('async')
const _       = require('lodash')
const db      = require('../services/db')

const key     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// 制作短链接
router.post('/url2short', (req, res, next) => {
  const long_url  = req.body.long_url

  async.waterfall([
    (callback) => {
      db.getDataByLongUrl(long_url, (err, data) => {
        callback(err, data)
      })
    },
    (results, callback) => {
      results.length > 0 ?
      callback(
        null,
        results
      ) :
      db.getCount((err, data) => {
        callback(err, data)
      })
    },
    (currentMaxId, callback) => {
      if(_.isObject(currentMaxId)){
        callback(null,currentMaxId)
      }else{
        const id = currentMaxId + 1
        let short_url = id.toString(16)

        const l = short_url.length

        for(let i = l; i < 11; i++){
          short_url += key.charAt(Math.floor(Math.random() * key.length))
        }

        const values = {id: id, long_url: long_url, short_url : short_url}
        db.add(values, (err, data) => {
          callback(null, short_url)
        })
      }
    }
  ], (err, result) => {
    if(err) throw err

    let shortUrl = result
    if(_.isObject(result)){
      shortUrl = result[0].short_url
    }
    res.status(200).json({status_code: 200, status_txt: 'Ok', short_url : `http://192.168.6.178:3000/${shortUrl}`})
  })
})
module.exports = router