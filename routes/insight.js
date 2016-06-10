var router = require('express').Router()

router.get('/', function(req, res, next){
  console.log("Sending file");
  res.sendFile('/assets/insight/index.html', {root: 'public'})
})

module.exports = router;
