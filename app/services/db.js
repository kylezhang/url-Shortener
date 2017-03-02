const mysql   = require('mysql')

const conn    = mysql.createConnection({
  host  : 'localhost',
  user  : 'root',
  password  : '',
  database  : 'short_url'
})

conn.connect((err) => {
  if(err) console.error(err)
})

module.exports = db = {
  getDataByLongUrl : (long_url, callback) => {
    conn.query(`SELECT * FROM ad_short_url_t WHERE long_url = ?`, [long_url], (error, results, fields) => {
        if(error) throw error
        console.log('The solution is: ', results)
        callback(null, results)
    })
  },

  getCount: (callback) => {
    conn.query('select count(*) as count from ad_short_url_t', (error, results, fields) => {
      if(error) throw error
      console.log('The solution is: ', results[0].count)
      callback(null, results[0].count)
    })
  },

  add: (values, callback) => {
    conn.query(`INSERT INTO ad_short_url_t SET ?`, values, (error, results, fields) => {
      if(error) throw error
      console.log('The insert results: ', results)
      callback(null, results)
    })
  },

  getDataByShortUrl : (short_url, callback) => {
    conn.query(`SELECT * FROM ad_short_url_t WHERE short_url = ?`, [short_url], (error, results, fields) => {
        if(error) throw error
        console.log('The solution is: ', results)
        callback(null, results)
    })
  }
}