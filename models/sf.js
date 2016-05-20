var jsforce     = require('jsforce')
    , config    = require('../config.js')

var conn = new jsforce.Connection();

exports.query = function(query, callback){
  conn.login(config.sf.username, config.sf.password, function(err, res) {
    if (err) { return callback(err, null) }
    conn.query(query, function(err, res) {
      if (err) { return callback(err, null) }
      return callback(null, res);
    });
  });
}
