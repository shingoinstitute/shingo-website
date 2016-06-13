var router = require('express').Router()

router.get('/', function(req, res, next){
  res.sendFile('/assets/insight/index.html', {root: 'public'})
})

module.exports = router;
