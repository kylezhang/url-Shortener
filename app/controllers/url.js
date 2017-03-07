/**
 * 实现思路：将传入的长链接存入数据库中，ID自增，
 * 1）短链接目前确定为11个字符,存入数据库
 * 具体短链接11个字符生成规则为:N + M,
 * N:保存长URL时，对应记录的自增ID的16进制数，如，存储一条记录时ID为10，那么N=(10).toString(16)=>'a', (3456).toString(16)=>'d80'
 * M:(11 - N)位‘a-zA-z0-9’的随机字符
 * 2）访问短连接时，直接拿着url中11位短链接，在数据库中查找到此11位短链接对应的长连接。
 */

const express     = require('express')
const router      = express.Router()
const url         = require('url')
const async       = require('async')
const _           = require('lodash')
const db          = require('../services/db')
const constStr    = require('../../config/const')

const re = new RegExp(constStr.regexp)

// 制作短链接
router.post('/url2short', (req, res, next) => {
  const long_url  = req.body.long_url
  
  if(!re.test(long_url)) 
  return res.status(500).json({status_code: 500, status_txt: 'fail'})

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
          short_url += constStr.key.charAt(Math.floor(Math.random() * constStr.key.length))
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