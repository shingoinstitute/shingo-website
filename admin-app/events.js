var express = require('express'),
  path = require("path"),
  fs = require("fs"),
  Promise = require('bluebird'),
  jsonfile = require('jsonfile'),
  SF = Promise.promisifyAll(require('../models/sf')),
  router = express.Router()

router.get('/', function(req, res) {
  var events = new Array();
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
  if(!req.session.access_token) { res.end() }
  var event = req.body
  jsonfile.writeFile(__dirname + '/../models/' + event.filename, event, function(err) {
    res.send(err)
  })
})

module.exports = router
