var express = require('express'),
    Promise = require('bluebird'),
    jsonfile = require('jsonfile'),
    SF = Promise.promisifyAll(require('../models/sf')),
    request = Promise.promisifyAll(require('request')),
    router = express.Router()

var routes_affiliates = require('./index-affiliates.js');
var routes_recipients = require('./index-recipients.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Shingo Institute - Leading a New Era of Enterprise Excellence'
    });
});


/* Education Menu */
/* GET model  */
router.get('/model', function(req, res, next) {
    res.render('education/model', {
        title: 'The Shingo Model - Shingo Institute'
    });
});

/* GET education */
router.get('/education', function(req, res, next) {
  var query_res = {
      "Discover": new Array(),
      "Enable": new Array(),
      "Improve": new Array(),
      "Align": new Array(),
      "Build": new Array()
  }

  request.getAsync('http://api.shingo.org/salesforce/workshops')
  .then(function(results) {
    var records = JSON.parse(results.body);
    workshops = records.workshops;
    for (var i in workshops) {
      query_res[workshops[i].Workshop_Type__c].push(workshops[i]);
    }

    res.render('education/education', {
        title: 'Education - Shingo Institute',
        workshops: query_res
    });
  })
  .catch(function(err) {
      console.log("sf.js:Line 40 " + err)
      res.render('education/education', {
          title: 'Education - Shingo Institute',
          workshops: query_res
      });
  })
});

/*  Conference, Summits & Study Tour */
/* GET manufacturing  */  // TODO Convert to web api
router.get('/events/:name', function(req, res, next) {
    var event = jsonfile.readFileSync(__dirname + '/../../models/' + req.params.name + '.json')
    SF.queryAsync(event.speaker_query).then(function(results) {
        var keynote = new Array()
        var concurrent = new Array()
        for (var i = 0; i < results.records.length; i++) {
            if (results.records[i].Speaker_Type__c == 'Keynote Speaker') {
                keynote.push(results.records[i])
            } else {
                concurrent.push(results.records[i])
            }
        }
        res.render('conference/summit', {
            layout: 'summit',
            title: event.name + ' - Shingo Institute',
            keynote: keynote,
            concurrent: concurrent,
            event: event
        });
    }).catch(function(err) {
        console.log(err);
    })
});

/* GET Japan studytour */   // TODO Templatize Study TOUR
router.get('/japanstudytour', function(req, res, next) {
    res.render('education/japanstudytour', {
        title: 'Study Tour - Shingo Institute'
    });
});

/* GET USA studytour */
router.get('/usastudytour', function(req, res, next) {
    res.render('education/usastudytour', {
        title: 'Study Tour - Shingo Institute'
    });
});

/*  Awards Route */   // TODO PUll awards from SF.  // TODO Split prize and publisher
/* GET challengefortheprize */
router.get('/challengefortheprize', function(req, res, next) {
    res.render('awards/challengefortheprize', {
        title: 'The Shingo Prize - Shingo Institute'
    });
});

/* GET awards routes */
router.use('/awards', routes_recipients);

/* GET researchaward  */
router.get('/researchaward', function(req, res, next) {
    res.render('awards/researchaward', {
        title: 'Research Award - Shingo Institute'
    });
});

/* GET researchaward  */
router.get('/publicationaward', function(req, res, next) {
    res.render('awards/publicationaward', {
        title: 'Professional Publication Award - Shingo Institute'
    });
});

// TODO: Add Affiliates Route based on url param to render specific awards page content. Fetch Content from SF


/*  Affiliates Route */
/* GET affiliates */
router.use('/affiliates', routes_affiliates);


/*  About Menu  */  // TODO Pull from api?!

router.get('/about', function(req, res, next) {
    var staff_query = 'SELECT Name, Title, Email, Phone, Photograph__c  FROM Contact WHERE AccountId=\'0011200001Gkm2uAAB\' ORDER BY LastName'

    SF.queryAsync(staff_query)
        .then(function(results) {
            // console.log(JSON.stringify(results.records,null,4));
            res.render('about/about', {
                title: 'Mission & History - Shingo Institute',
                staff: results.records
            })
        }).catch(function(err) {
            console.log('index-en.js:Line 200' + err)
            res.render('about/about', {
                title: 'Mission & History - Shingo Institute',
                staff: restults.records
            })
        });
});

/* GET academy */  // TODO Pull from api
router.get('/academy', function(req, res, next) {
    var academy_query = "SELECT Id, Name, Title, Account.Name FROM Contact WHERE Shingo_Prize_Relationship__c INCLUDES('Shingo Academy') ORDER BY LastName"

    SF.queryAsync(academy_query)
        .then(function(results) {
            // console.log(JSON.stringify(results.records,null,4));
            res.render('about/academy', {
                title: 'Shingo Academy - Shingo Institute',
                academy: results.records
            })
        }).catch(function(err) {
            res.render('about/academy', {
                title: 'Shingo Academy - Shingo Institute',
                academy: restults.records
            })
        });
});

/* GET examiner */
router.get('/examiners', function(req, res, next) {
    res.render('about/examiners', {
        title: 'Examiners - Shingo Institute'
    });
});

/* GET seab */  // TODO Pull from api
router.get('/seab', function(req, res, next) {
    var seab_query = "SELECT Id, Name, Title, Account.Name, Photograph__c, Biography__c FROM Contact WHERE Shingo_Prize_Relationship__c INCLUDES('Board of Governors') ORDER BY LastName"

    SF.queryAsync(seab_query)
        .then(function(results) {
            // console.log(JSON.stringify(results.records,null,4));
            res.render('about/seab', {
                title: 'Shingo Executive Advisory Board - Shingo Institute',
                members: results.records
            })
        }).catch(function(err) {
            console.log('index-en.js:Line 203' + err)
            res.render('about/seab', {
                title: 'Shingo Executive Advisory Board - Shingo Institute',
                members: restults.records
            })
        });
});

/* GET shingoteam */  // TODO Restructure about menu
router.get('/shingoteam', function(req, res, next) {
    res.render('about/shingoteam', {
        title: 'The Shingo Team - Shingo Institute'
    });
});


/*Other Routes*/
router.get('/linkedin', function(req, res, next) {
  res.render('about/linkedin', {
    title: 'The Shingo Institute'
  })
})

/* GET research - Linked from homepage only */
router.get('/research', function(req, res, next) {
    res.render('about/research', {
        title: 'Insight - Shingo Institute'
    });
});

/* GET privacy policy */
router.get('/privacy-policy', function(req, res, next) {
    res.render('about/privacy-policy', {
        title: 'Privacy Policy - Shingo Institute'
    });
});

/* GET Prize FAQ */
router.get('/prizefaq', function(req, res, next) {
    res.render('about/prizefaq', {
        title: 'Prize Questions - Shingo Institute'
    });
});

/* GET Craftsmanship Landing Page */
router.get('/craftsmanship', function(req, res, next) {
    res.render('about/craftsmanship', {
        title: 'The Craftsmanship Project - Shingo Institute'
    });
});


/*Files*/  // TODO Handle static file routing & storage
/* GET .pdf - From challengefortheprize */
router.get('/assets/Assessment_Process_Flow_Chart.pdf', function(req, res, next) {
    res.download('../assets/Assessment_Process_Flow_Chart.pdf');
});

/* GET .pdf - From challengefortheprize*/
router.get('/assets/Application_Guidelines.pdf', function(req, res, next) {
    res.download('../assets/Application_Guidelines.pdf');
});

/* GET .pdf - From researchaward*/
router.get('/assets/Research-Award-Application-Form.pdf', function(req, res, next) {
    res.download('../assets/Research-Award-Application-Form.pdf');
});


module.exports = router;
