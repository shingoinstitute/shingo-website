var express = require('express'),
  path = require("path"),
  fs = require("fs"),
  Promise = require('bluebird'),
  jsonfile = require('jsonfile'),
  SF = Promise.promisifyAll(require('../models/sf')),
  router = express.Router()

router.get('/', function(req, res) {
  var events = new Array();
  console.log("api/get called");
  fs.readdirSync(__dirname + '/../models')
    .filter(function(file) {
      return (file.indexOf(".json") !== 0) && (file != 'sf.js');
    })
    .forEach(function(file) {
      var event = jsonfile.readFileSync(path.join(__dirname, '/../models/' + file));
      event.filename = file
      events.push(event);
    });
  res.json(events)
})

router.post('/', function(req, res) {
  var event = req.body
  console.log("api/post called");
  jsonfile.writeFile(__dirname + '/../models/' + event.filename, event, function(err) {
    res.send(err)
  })
})

module.exports = router
