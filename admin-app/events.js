var express = require('express'),
    path = require("path"),
    fs        = require("fs"),
    Promise = require('bluebird'),
    jsonfile = require('jsonfile'),
    SF = Promise.promisifyAll(require('../models/sf')),
    router = express.Router()

router.route('/')
    .get(function(req, res) {
        var events = new Array();
        fs.readdirSync(__dirname + '/../models')
            .filter(function(file) {
                return (file.indexOf(".json") !== 0) && (file != 'sf.js');
            })
            .forEach(function(file) {
                var event = jsonfile.readFileSync(path.join(__dirname, '/../models/' + file));
                events.push(event);
            });
            res.json(events)
    }).post(function(req,res){
      var event = JSON.parse(req.body.event)
      jsonfile.writeFile(__dirname + '/../models/' + event.name + '.json', event, function(err){
        res.send(err)
      })
    })

module.exports = router
