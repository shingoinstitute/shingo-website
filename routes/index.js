var express = require('express'),
    Promise = require('bluebird'),
    jsonfile = require('jsonfile'),
    SF = Promise.promisifyAll(require('../models/sf')),
    request = Promise.promisifyAll(require('request')),
    _ = require('lodash'),
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
      console.log("sf.js:  " + err)
      res.render('education/education', {
          title: 'Education - Shingo Institute',
          workshops: query_res
      });
  })
});

router.get('/events/international', function(req, res, next){
  var event_info;
  var sess_dict;

  //  Arrays for speakers
  var keynote = new Array()
  var concurrent = new Array()

  request.getAsync('http://api.shingo.org/salesforce/events/a1B1200000NSAaXEAX')
  .then(function(results) {
    response = JSON.parse(results.body)
    event_info = response.event

    event_info.Shingo_Prices__r.records = _.orderBy(event_info.Shingo_Prices__r.records, ['Price__c'], ['desc'])
    // Get Session Map
    return request.getAsync('http://api.shingo.org/salesforce/events/sessions?event_id=a1B1200000NSAaXEAX')
  })
  .then(function(results) {
    //Create map from API Call
    var response = JSON.parse(results.body);
    sess_dict = _.keyBy(response.sessions, 'Id')

    // Get list of Days
    return request.getAsync('http://api.shingo.org/salesforce/events/days?event_id=a1B1200000NSAaXEAX')
  })
  .then(function(results){
    var response = JSON.parse(results.body);
    event_info.days = response.days;
    event_info.days = _.sortBy(event_info.days, ['Agenda_Date__c'])

    for(var i = 0; i < event_info.days.length; i++) {
      if(event_info.days[i].Shingo_Sessions__r) {
        for(var j = 0; j < event_info.days[i].Shingo_Sessions__r.records.length; j++){
          event_info.days[i].Shingo_Sessions__r.records[j] = sess_dict[event_info.days[i].Shingo_Sessions__r.records[j].Id]
          // Convert time string for correct display
          var startdate = new Date(event_info.days[i].Shingo_Sessions__r.records[j].Start_Date_Time__c);
          var enddate = new Date(event_info.days[i].Shingo_Sessions__r.records[j].End_Date_Time__c);
          event_info.days[i].Shingo_Sessions__r.records[j].Start_Date_Time__c = (new Date(startdate - 2*60*60*1000)).toString();
          event_info.days[i].Shingo_Sessions__r.records[j].End_Date_Time__c = (new Date(enddate - 2*60*60*1000)).toString();
        }
        event_info.days[i].Shingo_Sessions__r.records = _.sortBy(event_info.days[i].Shingo_Sessions__r.records, ['Start_Date_Time__c'])
      }
      else {
        event_info.days[i].Shingo_Sessions__r = {'records': []}
      }
    }
    return request.getAsync('http://api.shingo.org/salesforce/events/speakers?event_id=a1B1200000NSAaX')
  })
  .then(function(results) {
    // Parse API response into JSON
    var response = JSON.parse(results.body);
    // Organize Speakers
    for (var i = 0; i < response.total_size; i++) {
      // Adjust images to proper sizes
      var url = response.speakers[i].Picture_URL__c;
      if (!url){
        url = "http://res.cloudinary.com/shingo/image/upload/c_fill,g_center,h_300,w_300/v1414874243/silhouette_vzugec.png"
      }
      if (url.indexOf("w_") < 0) {
        var first = url.split("d/");
        response.speakers[i].Picture_URL__c = first[0] + "d/c_fill,g_face,h_300,w_300/" + first[1];
      }
      else {
        var first = url.split("d/");
        var second = first[1].split("/v");
        response.speakers[i].Picture_URL__c = first[0] + "d/c_fill,g_face,h_300,w_300/v" + second[1];
      }


      // Helper function to check
      // if a speaker is a keynote
      // speaker via the speakers
      // Session associations. As
      // the API filters for Is_Keynote__c
      // == true for populating the associations,
      // if there are any associations returned
      // they will be keynote associations.
      function isKeynote(speaker){
          if(speaker.Session_Speaker_Associations__r)
            return true;
          
          return false;
      }

      
      // Sort speakers into groups
      if (isKeynote(response.speakers[i])) {
        keynote.push(response.speakers[i]);
      } else {
        concurrent.push(response.speakers[i])
      }
    }
    // Sort Speakers by Last Name
    keynote = _.sortBy(keynote, ['Contact__r.LastName'])
    concurrent = _.sortBy(concurrent, ['Contact__r.LastName'])
    res.render('conference/international', {
      layout: 'international',
      title: '29th International Conference - Shingo Institute',
      event: event_info,
      keynote: keynote,
      concurrent: concurrent
    })
  })
  .catch(function(err){
    console.log("api err: " + err)
    res.render('conference/international', {
      layout: 'international',
      title: '29th International Conference - Shingo Institute',
      event: event_info,
      keynote: keynote,
      concurrent: concurrent
    })
  })
})

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


/*  About Menu  */
router.get('/about', function(req, res, next) {
  var staff = null;
  request.getAsync('http://api.shingo.org/salesforce/about/staff')
  .then(function(results) {
    var response = JSON.parse(results.body);
    staff = response.staff;
    res.render('about/about', {
        title: 'Shingo Mission - Shingo Institute',
        staff: staff
    });
  })
  .catch(function(err) {
      console.log("sf.js: " + err)
      res.render('about/about', {
          title: 'Shingo Mission - Shingo Institute',
          staff: staff
      });
  })
});

/* GET academy */
router.get('/academy', function(req, res, next) {
  var academy = null;
  request.getAsync('http://api.shingo.org/salesforce/about/academy')
  .then(function(results) {
    var response = JSON.parse(results.body);
    academy = response.academy;
    res.render('about/academy', {
        title: 'Shingo Academy - Shingo Institute',
        academy: academy
    });
  })
  .catch(function(err) {
      console.log("sf.js: " + err)
      res.render('about/academy', {
          title: 'Shingo Academy - Shingo Institute',
          academy: academy
      });
  })
});

/* GET examiner */ // TODO Divide lists
router.get('/examiners', function(req, res, next) {
  var examiners = null;
  request.getAsync('http://api.shingo.org/salesforce/about/examiner/')
  .then(function(results) {
    var response = JSON.parse(results.body);
    examiners = response.examiners;
    res.render('about/examiners', {
        title: 'Examiners - Shingo Institute',
        examiner: examiners
    });
  })
  .catch(function(err) {
      console.log("sf.js: " + err)
      res.render('about/examiners', {
          title: 'Examiners - Shingo Institute',
          examiner: examiners
      });
  })
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
