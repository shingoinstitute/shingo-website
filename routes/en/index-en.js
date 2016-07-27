var express = require('express'),
    Promise = require('bluebird'),
    jsonfile = require('jsonfile'),
    SF = Promise.promisifyAll(require('../../models/sf')),
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
    var ws_query = 'SELECT Id, Name, Organizing_Group__r.Name, Organizing_Group__r.Page_Path__c, Course__c, Event_Start_Date__c, Event_End_Date__c, Host_Organization__c, Host_City__c, Host_Country__c, Event_Website__c FROM Event__c WHERE Visibility__c=\'Public\' AND Event_Type__c=\'Affiliate Event\' AND Verified__c=true AND Course__c!=null AND Event_End_Date__c>=YESTERDAY AND Event_Status__c=\'Active event\' ORDER BY Event_Start_Date__c';

    var query_res = {
        "Discover": new Array(),
        "Enable": new Array(),
        "Improve": new Array(),
        "Align": new Array()
    }

    SF.queryAsync(ws_query)
        .then(function(results) {
            var events = results.records
            for (var i in events) {
                query_res[events[i].Course__c].push(events[i])
            }
            // console.log(JSON.stringify(query_res,null,4));
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: query_res
            });
        }).catch(function(err) {
            console.log("sf.js:Line 40 " + err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: query_res
            });
        })

});

/*  Conference, Summits & Study Tour */
/* GET manufacturing  */
router.get('/events/:name', function(req, res, next) {
    var event = jsonfile.readFileSync(__dirname + '/../../models/' + req.params.name + '.json')
    SF.queryAsync(event.speaker_query).then(function(results) {
        var keynote = new Array()
        var concurrent = new Array()
        for(var i = 0; i < results.records.length; i++){
          if(results.records[i].Speaker_Type__c == 'Keynote Speaker'){
            keynote.push(results.records[i])
          }
          else {
            concurrent.push(results.records[i])
          }
        }
        res.render('conference/summit', {
            layout: 'summit',
            title: event.name + ' - Shingo Institute',
            keynote: keynote,
            concurrent: concurrent,
            event:event
        });
    }).catch(function(err){
      console.log(err);
    })
});

/* GET Japan studytour */
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

/* LEAN Network */
/*GET LEAN Home Page*/
router.get('/teaching-lean', function(req, res, next) {
    res.render('./LEAN/teaching-lean', {
        title: 'Lean Education Academic Network - Shingo Institute'
    });
});

/*GET LEAN Resource Page*/
router.get('/teaching-lean/resources', function(req, res, next) {
    res.render('./LEAN/resources', {
        title: 'Resources - Lean Education Academic Network - Shingo Institute'
    });
});

/*GET LEAN Events Page*/
router.get('/teaching-lean/events', function(req, res, next) {
    res.render('./LEAN/events', {
        title: 'Events - Lean Education Academic Network - Shingo Institute'
    });
});

/*GET LEAN Professors Page*/
router.get('/teaching-lean/professors', function(req, res, next) {
    res.render('./LEAN/professors', {
        title: 'Professors - Lean Education Academic Network - Shingo Institute'
    });
});


/*  Awards Route */
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
        title: 'Research Publication Award - Shingo Institute'
    });
});

// TODO: Add Affiliates Route based on url param to render specific awards page content. Fetch Content from SF


/*  Affiliates Route */
/* GET affiliates */
router.use('/affiliates', routes_affiliates);


/*  About Menu  */
// TODO: Pages contain content that can be populated from salesforce

router.get('/about',  function(req, res, next){
  var staff_query = 'SELECT Name, Title, Email, Phone, Photograph__c  FROM Contact WHERE AccountId=\'0011200001Gkm2uAAB\' ORDER BY LastName'

  SF.queryAsync(staff_query)
    .then(function(results){
      // console.log(JSON.stringify(results.records,null,4));
      res.render('about/about', {
        title: 'Mission & History - Shingo Institute',
        staff: results.records
      })
    }).catch(function(err){
      console.log('index-en.js:Line 200' + err)
      res.render('about/about', {
        title:'Mission & History - Shingo Institute',
        staff: restults.records
      })
    });
});

/* GET academy */
router.get('/academy', function(req, res, next) {
    res.render('about/academy', {
        title: 'Shingo Academy - Shingo Institute'
    });
});

/* GET examiner */
router.get('/examiners', function(req, res, next) {
    res.render('about/examiners', {
        title: 'Examiners - Shingo Institute'
    });
});

/* GET seab */
router.get('/seab', function(req, res, next) {
    res.render('about/seab', {
        title: 'Shingo Executive Advisory Board - Shingo Institute'
    });
});

/* GET shingoteam */
router.get('/shingoteam', function(req, res, next) {
    res.render('about/shingoteam', {
        title: 'The Shingo Team - Shingo Institute'
    });
});


/*Other Routes*/
/* GET research - Linked from homepage only */
router.get('/research', function(req, res, next) {
    res.render('about/research', {
        title: 'Insight - Shingo Institute'
    });
});

/* GET privacy policy - Linked from homepage only */
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


/*Files*/
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
