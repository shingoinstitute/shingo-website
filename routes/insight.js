var router = require('express').Router()

router.get('/', function(req, res, next){
  console.log("Sending file");
  res.sendFile(path.join(__dirname, 'assets/insight/index.html'))
})

module.exports = router;
