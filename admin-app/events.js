const express = require('express')
const path = require('path')
const fs = require('fs')
const jsonfile = require('jsonfile')
const router = express.Router()

router.get('/', function (req, res) {
    const events =
        fs.readdirSync(__dirname + '/../models')
            .filter(file => file.indexOf('.json') !== 0 && file != 'sf.js')
            .map(file => {
                const event = jsonfile.readFileSync(
                    path.join(__dirname, '/../models/' + file),
                )
                event.filename = file
                return event
            })
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
