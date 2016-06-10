var express = require('express')
  , router = express.Router();

  var routes_en = require('./en/index-en.js');
  // var routes_es = require('./es/index-es.js');
  // var routes_ch = require('./ch/index-ch.js');


  /* GET Language website index. */
  router.use('/', routes_en);
  // router.use('/spanish', routes_es);
  // router.use('/chinese', routes_ch);

module.exports = router;
