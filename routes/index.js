var express = require('express'),
    Promise = require('bluebird'),
    jsonfile = require('jsonfile'),
    SF = Promise.promisifyAll(require('../models/sf')),
    request = Promise.promisifyAll(require('request')),
    _ = require('lodash'),
    router = express.Router()

var routes_recipients = require('./index-recipients.js');

var formatImage = function(url, height, width){
  var new_url;
  if (url.indexOf("w_") < 0) {
    var first = url.split("d/");
    new_url = first[0] + "d/c_fill,g_face,h_" + height + ",w_" + width + "/" + first[1];
  }
  else {
    var first = url.split("d/");
    var second = first[1].split("/v");
    new_url = first[0] + "d/c_fill,g_face,h_" + height + ",w_" + width + "/v" + second[1];
  }
  return new_url;
}


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
    workshops = _.sortBy(workshops, ['End_Date__c']);
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
    event_info.days = _.sortBy(event_info.days, ['Agenda_Date__c']);

    /* TODO Review nested .forEach loop.  Here I had to use a classic loop inside the forEach function because
     I couldn't assign to the object and maintain data persistance with a double forEach for an unknown reason.

    ** Example code for interior purposed loop.
           day.Shingo_Sessions__r.records.forEach(function(record){
             record = sess_dict[record.Id]
           })
    */
    // Append detailed records to each session
    event_info.days.forEach(function(day){
      if(day.Shingo_Sessions__r) {
        for(var j = 0; j < day.Shingo_Sessions__r.records.length; j++){
              day.Shingo_Sessions__r.records[j] = sess_dict[day.Shingo_Sessions__r.records[j].Id]
              // Convert time string for correct display
              var startdate = new Date(day.Shingo_Sessions__r.records[j].Start_Date_Time__c);
              var enddate = new Date(day.Shingo_Sessions__r.records[j].End_Date_Time__c);
              day.Shingo_Sessions__r.records[j].Start_Date_Time__c = (new Date(startdate - 2*60*60*1000)).toString();
              day.Shingo_Sessions__r.records[j].End_Date_Time__c = (new Date(enddate - 2*60*60*1000)).toString();
        }
        day.Shingo_Sessions__r.records = _.sortBy(day.Shingo_Sessions__r.records, ['Start_Date_Time__c'])
      }
      else {
        day.Shingo_Sessions__r = {'records': []}
      }
    })
    // Get Speakers
    return request.getAsync('http://api.shingo.org/salesforce/events/speakers?event_id=a1B1200000NSAaX')
  })
  .then(function(results) {
    // Parse API response into JSON
    var response = JSON.parse(results.body);
    // Organize Speakers
    response.speakers.forEach(function(speaker){
      // Adjust images to proper sizes
      speaker.Picture_URL__c = formatImage(speaker.Picture_URL__c, 300, 300)

      // Helper function to check
      // if a speaker is a keynote
      // speaker via the speakers
      // Session associations. As
      // the API filters for Is_Keynote__c
      // == true for populating the associations,
      // if there are any associations returned
      // they will be keynote associations.
      function isKeynote(speaker){
          return speaker.Session_Speaker_Associations__r;
      }

      // Sort speakers into groups
      if (isKeynote(response.speakers[i])) {
        keynote.push(response.speakers[i]);
      } else {
        concurrent.push(speaker)
      }
    })
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
        // TODO Clean up for loop with a a.forEach(function(item){}) loop
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

/*  Awards Route */   // TODO PUll awards from SF.
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

/*  Affiliates Route */
/* GET affiliates */
router.get('/affiliates', function(req, res, next) {
  var affiliates = null;
  var myeducator = null;
  request.getAsync('http://api.shingo.org/salesforce/affiliates')
  .then(function(results) {
    var response = JSON.parse(results.body);
    affiliates = response.affiliates;
    // Format Logos  // TODO Update function for logos?
    // affiliates.forEach(function(aff){
    //   aff.Logo__c = formatImage(aff.Logo__c, 150, 300)
    // })

    // Remove MyEducator
    var i = _.findIndex(affiliates, function(a){ return a.Id == '0011200001Gl4QoAAJ'; })
    myeducator = affiliates[i];
    affiliates.splice(i, 1);

    res.render('affiliates/affiliates', {
        title: 'Affiliates - Shingo Institute',
        affiliates: affiliates,
        myeducator: myeducator
    });
  })
  .catch(function(err) {
      console.log("sf.js: " + err)
      res.render('affiliates/affiliates', {
          title: 'Affiliates - Shingo Institute',
          affiliates: affiliates,
          myeducator: myeducator
      });
  })
});

/*  GET an affiliate  */
router.get('/affiliates/:id', function(req, res, next) {
  var aff = null;
  var fac = null;
  request.getAsync('http://api.shingo.org/salesforce/affiliates/web/' + req.params.id)
  .then(function(results) {
    var response = JSON.parse(results.body)
    aff = response.affiliate
    // TODO Update for logos? // aff.Logo__c = formatImage(aff.Logo__c, 150, 300)
    // Get Facilitators
    return request.getAsync('http://api.shingo.org/salesforce/affiliates/facilitators/' + req.params.id)
  })
  .then(function(results){
    var response = JSON.parse(results.body)
    fac = response.records
    // Split into pair for css display requirements
    var pairs = new Array();
    for(var i = 0; i < fac.length; i += 2){
      fac[i].Photograph__c = formatImage(fac[i].Photograph__c, 350, 300)
      if(fac[i+1]){ fac[i+1].Photograph__c = formatImage(fac[i+1].Photograph__c, 350, 300) }
      var p = new Object();
      p.a = fac[i];
      if(fac[i+1]) {  p.b = fac[i + 1]; }
      pairs.push(p)
    }
    fac = pairs;
    return
  })
  .then(function(){
    res.render('affiliates/template', {
        title: aff.Name + ' - Shingo Institute',
        affiliate: aff,
        fac_pair: fac
    });
  })
  .catch(function(err) {
      console.log("sf.js: " + err)
      res.render('affiliates/template', {
          title: aff.Name + ' - Shingo Institute',
          affiliate: aff,
          fac_pair: fac
      });
  })
});

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

/* GET seab */
router.get('/seab', function(req, res, next) {
  var seab = null;
  request.getAsync('http://api.shingo.org/salesforce/about/seab/')
  .then(function(results) {
    var response = JSON.parse(results.body);
    seab = response.records;
    seab.forEach(function(member){
      member.Photograph__c = formatImage(member.Photograph__c, 300, 300)
      console.log(member.Photograph__c);
    })
    res.render('about/seab', {
        title: 'Shingo Executive Advisory Board - Shingo Institute',
        members: seab
    })
  })
  .catch(function(err) {
      console.log("sf.js: " + err)
      res.render('about/seab', {
          title: 'Shingo Executive Advisory Board - Shingo Institute',
          members: seab
      })
  })
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
