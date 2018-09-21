var express = require('express'),
    Promise = require('bluebird'),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    SF = Promise.promisifyAll(require('../models/sf')),
    request = Promise.promisifyAll(require('request')),
    _ = require('lodash'),
    router = express.Router(),
    Logger = require('../Logger'),
    logger = new Logger().logger

var routes_recipients = require('./index-recipients.js');

var formatImage = (url, height, width) => {
  var new_url;
  if (!url){
      return "https://res.cloudinary.com/shingo/image/upload/c_fill,g_face,h_" + height + ",w_" + width + "/v1414874243/silhouette_vzugec.png"
  }
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
router.get('/', (req, res, next) => {
     res.render('index', {
        title: 'Shingo Institute - Leading a New Era of Enterprise Excellence'
    });
});


/* Education Menu */
/* GET model  */
router.get('/model', (req, res, next) => {
    res.render('education/model', {
        title: 'The Shingo Model - Shingo Institute'
    });
});

/* GET workshops */
router.get('/workshops', (req, res, next) => {
  var allWorkshops = new Array();

  request.getAsync('https://api.shingo.org/salesforce/workshops')
  .then(results => {
    var records = JSON.parse(results.body);
    workshops = records.workshops;
    // Verify full url
    workshops.forEach(workshop =>{
        if (!workshop || !workshop.Registration_Website__c) {
            throw new Error(`Invalid Workshop\n${JSON.stringify(workshop)}`);
        }
        if(workshop.Registration_Website__c.indexOf("http")) workshop.Registration_Website__c = "https://" + workshop.Registration_Website__c;
    })
    workshops = _.sortBy(workshops, ['End_Date__c']);
    for (var i in workshops) {

        switch(workshops[i].Workshop_Type__c) {
            case "Discover":
                workshops[i].workshopTypeFull = "Discover Excellence";
                break;
            case "Enable":
                workshops[i].workshopTypeFull = "Cultural Enablers";
                break;
            case "Improve":
                workshops[i].workshopTypeFull = "Continuous Improvement";
                break;
            case "Align":
                workshops[i].workshopTypeFull = "Enterprise Alignment";
                break;
            case "Build":
                workshops[i].workshopTypeFull = "Build Excellence";
                break;
        }
        if (workshops[i].Additional_Information__c && workshops[i].Additional_Information__c !== '') {
            workshops[i].hasAdditionalInfo = true
        } else {
            workshops[i].hasAdditionalInfo = false
        }
        allWorkshops.push(workshops[i]);
    }


    workshopLocations = new Array();
    for (var i in workshops) {
        var found = false
        for (var j in workshopLocations) {
            if (workshopLocations[j].indexOf(workshops[i].Event_Country__c) > -1) {
                found = true;
            }
        }
        if (!found) {
            workshopLocations.push(workshops[i].Event_Country__c)
        }
    }
    workshopLocations = workshopLocations.sort()

    workshopMonths = new Array();
    for (var i in workshops) {
        var found = false
        var month = moment(workshops[i].Start_Date__c).format('MMM YYYY')
        for (var j in workshopMonths) {
            if (workshopMonths[j].indexOf(month) > -1) {
                found = true;
            }
        }
        if (!found) {
            workshopMonths.push(month)
        }
    }

    res.render('education/workshops', {
        title: 'Workshops - Shingo Institute',
        workshops: allWorkshops,
        locations: workshopLocations,
        months: workshopMonths
    });
  })

  .catch(err => {
      logger.log("error", "EDUCATION ROUTE\n%j", err);
      res.render('education/education', {
          title: 'Education - Shingo Institute',
          workshops: query_res
      });
  })
});

/* GET education */
router.get('/education', (req, res, next) => {
    res.render('education/education', {
        title: 'Workshops - Shingo Institute'
    });
});


/* EDUCATION/INFO PAGES */

/* GET discover */
router.get('/education/discover', (req, res, next) => {
    var showWorkshops = new Array()

    request.getAsync('https://api.shingo.org/salesforce/workshops')
    .then(results => {
        var records = JSON.parse(results.body);
        workshops = records.workshops;
        // Verify full url
        workshops.forEach(workshop =>{
            if(workshop.Registration_Website__c.indexOf("http")) workshop.Registration_Website__c = "https://" + workshop.Registration_Website__c;
        })
        workshops = _.sortBy(workshops, ['End_Date__c']);
        for (var i in workshops) {
            if(workshops[i].Workshop_Type__c == "Discover") showWorkshops.push(workshops[i])
        }

        res.render('education/discover', {
            title: 'Discover - Shingo Institute',
            workshops: showWorkshops,
            workshopType: 'Discover Excellence',
            color: '5b3214'
        });
    })

    .catch(err => {
        logger.log("error", "Discover ROUTE\n%j", err);
        res.render('education/education', {
            title: 'Education - Shingo Institute',
            workshops: showWorkshops

        });
    })
});

/* GET enable */
router.get('/education/enable', (req, res, next) => {
    var showWorkshops = new Array()

    request.getAsync('https://api.shingo.org/salesforce/workshops')
    .then(results => {
        var records = JSON.parse(results.body);
        workshops = records.workshops;
        // Verify full url
        workshops.forEach(workshop =>{
            if(workshop.Registration_Website__c.indexOf("http")) workshop.Registration_Website__c = "https://" + workshop.Registration_Website__c;
        })
        workshops = _.sortBy(workshops, ['End_Date__c']);
        for (var i in workshops) {
            if(workshops[i].Workshop_Type__c == "Enable") showWorkshops.push(workshops[i])
        }

        res.render('education/enable', {
            title: 'Enable - Shingo Institute',
            workshops: showWorkshops,
            workshopType: 'Cultural Enablers',
            color: '003768'
        });
    })

    .catch(err => {
        logger.log("error", "Enable ROUTE\n%j", err);
        res.render('education/education', {
            title: 'Education - Shingo Institute',
            workshops: showWorkshops
        });
    })
});

/* GET improve */
router.get('/education/improve', (req, res, next) => {
    var showWorkshops = new Array()

    request.getAsync('https://api.shingo.org/salesforce/workshops')
    .then(results => {
        var records = JSON.parse(results.body);
        workshops = records.workshops;
        // Verify full url
        workshops.forEach(workshop =>{
            if(workshop.Registration_Website__c.indexOf("http")) workshop.Registration_Website__c = "https://" + workshop.Registration_Website__c;
        })
        workshops = _.sortBy(workshops, ['End_Date__c']);
        for (var i in workshops) {
            if(workshops[i].Workshop_Type__c == "Improve") showWorkshops.push(workshops[i])
        }

        res.render('education/improve', {
            title: 'Improve - Shingo Institute',
            workshops: showWorkshops,
            workshopType: 'Continuous Improvement',
            color: '640820'
        });
    })

    .catch(err => {
        logger.log("error", "Improve ROUTE\n%j", err);
        res.render('education/education', {
            title: 'Education - Shingo Institute',
            workshops: showWorkshops
        });
    })
});

/* GET align */
router.get('/education/align', (req, res, next) => {
    var showWorkshops = new Array()

    request.getAsync('https://api.shingo.org/salesforce/workshops')
    .then(results => {
        var records = JSON.parse(results.body);
        workshops = records.workshops;
        // Verify full url
        workshops.forEach(workshop =>{
            if(workshop.Registration_Website__c.indexOf("http")) workshop.Registration_Website__c = "https://" + workshop.Registration_Website__c;
        })
        workshops = _.sortBy(workshops, ['End_Date__c']);
        for (var i in workshops) {
            if(workshops[i].Workshop_Type__c == "Align") showWorkshops.push(workshops[i])
        }

        res.render('education/align', {
            title: 'Align - Shingo Institute',
            workshops: showWorkshops,
            workshopType: 'Enterprise Alignment',
            color: '627c33'
        });
    })

    .catch(err => {
        logger.log("error", "Align ROUTE\n%j", err);
        res.render('education/education', {
            title: 'Education - Shingo Institute',
            workshops: showWorkshops
        });
    })
});

/* GET build */
router.get('/education/build', (req, res, next) => {
    var showWorkshops = new Array()

    request.getAsync('https://api.shingo.org/salesforce/workshops')
    .then(results => {
        var records = JSON.parse(results.body);
        workshops = records.workshops;
        // Verify full url
        workshops.forEach(workshop =>{
            if(workshop.Registration_Website__c.indexOf("http")) workshop.Registration_Website__c = "https://" + workshop.Registration_Website__c;
        })
        workshops = _.sortBy(workshops, ['End_Date__c']);
        for (var i in workshops) {
            if(workshops[i].Workshop_Type__c == "Build") showWorkshops.push(workshops[i])
        }

        res.render('education/build', {
            title: 'Build - Shingo Institute',
            workshops: showWorkshops,
            workshopType: 'Build Excellence',
            color: '405124'
        });
    })

    .catch(err => {
        logger.log("error", "Build ROUTE\n%j", err);
        res.render('education/education', {
            title: 'Education - Shingo Institute',
            workshops: showWorkshops
        });
    })
});

/**
 * Standardized Link Redirects
 *
 * Format: shortnameYEAR
 *
 * Existing redirects that do not meet the format are legacy: DO NOT CHANGE
 *
 * Shingo Annual Conferences (International, etc) use only the YEAR
 */
const Redirects =
    { '2018': 'https://events.shingo.org/#!/events/a1B1200000N7aHXEAZ'
    , '2017': 'https://events.shingo.org/#!/events/a1B1200000NSAaXEAX'
    , 'ireland2018': 'https://events.shingo.org/#!/events/a1B1200000IC6CYEA1'
    , 'ireland2017': 'https://events.shingo.org/#!/events/a1B1200000Rin6uEAB'
    , 'mountainwest2017': 'https://events.shingo.org/#!/events/a1B1200000Sbgf1EAB'
    , 'japan2017': 'https://events.shingo.org/#!/events/a1B1200000SseieEAB'
    , 'europe2017': 'https://events.shingo.org/#!/events/a1B1200000Ril1QEAR'
    , 'oe2017': 'https://events.shingo.org/#!/events/a1B1200000RihJsEAJ'
    , 'latinamerica2017': 'https://events.shingo.org/#!/events/a1B1200000RilBGEAZ'
    , 'manufacturing2017': 'https://events.shingo.org/#!/events/a1B1200000SU9NBEA1'
    , 'midwest2018': 'https://events.shingo.org/#!/events/a1B1H00000SupAFUAZ'
    , 'mountainwest2018': 'https://events.shingo.org/#!/events/a1B1H00000Sw5QfUAJ'
    , 'japan2018': 'https://events.shingo.org/#!/events/a1B1H00000Sw5QVUAZ'
    , '2018': 'https://events.shingo.org/#!/events/a1B1200000N7aHXEAZ'
    , 'events': 'https://events.shingo.org'
    , 'events/international': 'https://events.shingo.org/#!/events/a1B1200000N7aHXEAZ'
    , 'events/30': 'https://events.shingo.org/#!/events/a1B1200000N7aHXEAZ'
    , 'events/manufacturing': 'https://events.shingo.org/#!/events/a1B1200000SU9NBEA1'
    , 'events/latinamerica': 'https://events.shingo.org/#!/events/a1B1200000RilBGEAZ'
    , 'events/oe': 'https://events.shingo.org/#!/events/a1B1200000RihJsEAJ'
    , 'events/europe': 'https://events.shingo.org/#!/events/a1B1200000Ril1QEAR'
    , 'usastudytour': 'https://events.shingo.org/#!/events/a1B1200000Sbgf1EAB'
    , 'blog': 'https://blog.shingo.org'
    , 'insight_initiate': 'https://usu.co1.qualtrics.com/jfe/form/SV_4GgAN0KZ0qf6pkp'
    , 'japanstudytour': 'https://events.shingo.org/#!/events/a1B1200000SseieEAB'
    , 'irelandstudytour': 'https://events.shingo.org/#!/events/a1B1200000IC6CYEA1'
    , 'midweststudytour': 'https://events.shingo.org/#!/events/a1B1H00000SupAFUAZ'
    , 'rosencentre': 'https://www.phgsecure.com/IBE/bookingRedirect.ashx?propertyCode=ORLRH&group=GRPSHINGO&arrivalDate=04-04-2018&departureDate=04-18-2018'
    , 'latinamerica2018': 'https://www.cvent.com/events/2018-shingo-latin-america-conference/event-summary-3fcc59a22a3f45e985a5f2c1e7ec4e1e.aspx'
    , 'manufacturing2018': 'https://www.cvent.com/events/2018-shingo-manufacturing-summit/event-summary-7a99c175b4734dac9af3ebd91e3726cf.aspx'
    , 'oe2018': 'https://events.shingo.org/#!/events/a1B1H00000GHrlhUAD'
    , 'financial2018': 'http://www.cvent.com/events/2018-shingo-financial-services-summit/event-summary-e89c1e845b0f43769d5a62127bdaa4e1.aspx'
    , '2019': 'https://events.shingo.org/#!/events/a1B1H00000GHhWiUAL'
    , 'financialservices2018': 'http://www.cvent.com/events/2018-shingo-financial-services-summit/event-summary-e89c1e845b0f43769d5a62127bdaa4e1.aspx'
    }

Object.keys(Redirects).forEach(k => {
    const path = Redirects[k]
    router.get(`/${k}`, (req, res) => res.redirect(path))
})

router.get('/events/:name', (req, res, next) => {
    var event = jsonfile.readFileSync(__dirname + '/../models/' + req.params.name + '.json')
    var keynote = new Array()
    var concurrent = new Array()
    var template = 'summit'
    if (req.params.name=='oe') {template = 'partners-summit'}
    res.render('conference/summit', {
            layout: template,
            title: event.name + ' - Shingo Institute',
            keynote: keynote,
            concurrent: concurrent,
            event: event
    });
});

/* GET Japan studytour */   // TODO Templatize Study TOUR
router.get('/japanstudytour', (req, res, next) => {
    res.render('education/japanstudytour', {
        title: 'Study Tour - Shingo Institute'
    });
});

/* GET Ireland studytour */   // TODO Templatize Study TOUR
router.get('/irelandstudytour', (req, res, next) => {
  var event_info;
  var sess_dict;

  request.getAsync('https://api.shingo.org/salesforce/events/a1B1200000Rin6u')
  .then(results => {
    response = JSON.parse(results.body)
    event_info = response.event

    event_info.Shingo_Prices__r.records = _.orderBy(event_info.Shingo_Prices__r.records, ['Price__c'], ['desc'])
    // Get Session Map
    return request.getAsync('https://api.shingo.org/salesforce/events/sessions?event_id=a1B1200000Rin6u')
  })
  .then(results => {
    //Create map from API Call
    var response = JSON.parse(results.body);
    sess_dict = _.keyBy(response.sessions, 'Id')

    // Get list of Days
    return request.getAsync('https://api.shingo.org/salesforce/events/days?event_id=a1B1200000Rin6u')
  })
    .then(results =>{
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
        event_info.days.forEach(day =>{
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

        res.render('education/irelandstudytour', {
        event: event_info,
        })
    })
    .catch(err =>{
    logger.log("error", "IRELAND STUDY TOUR\n%j", err)
    res.render('education/irelandstudytour', {
      event: event_info,
    })
  })
})


/*  Awards Route */   // TODO PUll awards from SF.
/* GET challengefortheprize */
router.get('/challengefortheprize', (req, res, next) => {
    res.render('awards/challengefortheprize', {
        title: 'The Shingo Prize - Shingo Institute'
    });
});

/* GET awards routes */
router.get('/awards', (req, res, next) => {
    request.getAsync('https://api.shingo.org/salesforce/awards/prize')
    .then(results => {
        var response = JSON.parse(results.body);
        var awards = response.records;

        var shingoAwards = []
        var silverAwards = []
        var bronzeAwards = []

        awards.sort(function(a, b) {
            if (a.Date_Awarded__c < b.Date_Awarded__c) {return 1}
            if (a.Date_Awarded__c > b.Date_Awarded__c) {return -1}
            return 0
        })

        awards.forEach(award => {
            award.info = award.City__c + ", " + award.Country__c;
            var date = moment(award.Date_Awarded__c);
            var formattedDate = date.format('YYYY');
            award.date = formattedDate;
            award.link = award.Company_Profile_Link__c;
        })

        awards.forEach(award => {
            if (award.SV_Status__c == "The Shingo Prize") {
                shingoAwards.push(award)
            }
            else if (award.SV_Status__c == "Silver Medallion") {
                silverAwards.push(award)
            }
            else if (award.SV_Status__c == "Bronze Medallion") {
                bronzeAwards.push(award)
            }
        })

        var foundDates = []
        shingoAwards.forEach(award => {
            var dateFound = false;
            foundDates.forEach(date => {
              if (award.date == date) {
                dateFound = true;
                award.date = "";
              }
            })
            if (!dateFound) {foundDates.push(award.date)}
        })

        var foundDates = []
        silverAwards.forEach(award => {
            var dateFound = false;
            foundDates.forEach(date => {
              if (award.date == date) {
                dateFound = true;
                award.date = "";
              }
            })
            if (!dateFound) {foundDates.push(award.date)}
        })

        var foundDates = []
        bronzeAwards.forEach(award => {
            var dateFound = false;
            foundDates.forEach(date => {
              if (award.date == date) {
                dateFound = true;
                award.date = "";
              }
            })
            if (!dateFound) {foundDates.push(award.date)}
        })

        res.render('awards/awards', {
            title: 'Awards - Shingo Institute',
            shingoAwards: shingoAwards,
            silverAwards: silverAwards,
            bronzeAwards: bronzeAwards
        });
    });
});

router.get('/awards/:id', (req, res, next) => {
    request.getAsync('https://api.shingo.org/salesforce/awards/prize/' + req.params.id)
    .then(results => {
        res.render('awards/prize-template', {
            title: 'Award Recipient - Shingo Institute',
            award: JSON.parse(results.body).records[0]
        })
    })
})

/* GET researchaward  */
router.get('/researchaward', (req, res, next) => {
    request.getAsync('https://api.shingo.org/salesforce/awards/research')
    .then(results => {
        var response = JSON.parse(results.body);
        var awards = response.records;

        awards.forEach(award => {
            award.info = award.Public_Author_Name__c;
            award.date = award.Press_Release_Date__c;
            award.link = "/researchaward/" + award.Id;
        })

        res.render('awards/researchaward', {
            title: 'Research Award - Shingo Institute',
            awards: awards
        });
    });
});

// GET Resarch Award template
router.get('/researchaward/:id', (req, res, next) => {
    request.getAsync('https://api.shingo.org/salesforce/awards/research/' + req.params.id)
   .then(results => {
        res.render('awards/research-template', {
            title: 'Research Award - Shingo Institute',
            award: JSON.parse(results.body).records[0]
        })
    })
    .catch(err =>{
        res.render('awards/research-template', {
            title: 'Research Award - Shingo Institute',
            award: null
        })
    })
});

/* GET publication award  */
router.get('/publicationaward', (req, res, next) => {
    request.getAsync('https://api.shingo.org/salesforce/awards/publication')
    .then(results => {
        var response = JSON.parse(results.body)
        var awards = response.records

        awards.forEach(award => {
            award.info = award.Public_Author_Name__c;
            award.date = award.Press_Release_Date__c;
            award.link = "/publicationaward/" + award.Id;
        })

        res.render('awards/publicationaward', {
            title: 'Publication Award - Shingo Institute',
            awards: awards
        })
    })
    .catch(err =>{
        res.rendder('awards/publicationaward', {
            title: 'Publication Award - Shingo Institute',
            awards: null
        })
    })
});

// GET Publication Award template
router.get('/publicationaward/:id', (req, res, next) => {
    request.getAsync('https://api.shingo.org/salesforce/awards/publication/' + req.params.id)
   .then(results => {
        var response = JSON.parse(results.body)
        // How to simplify??
        var awards = response.records[0]
        res.render('awards/publication-template', {
            title: 'Publication Award - Shingo Institute',
            award: awards
        })
    })
    .catch(err =>{
        res.render('awards/publication-template', {
            title: 'Publication Award - Shingo Institute',
            award: null
        })
    })
});

/*  Affiliates Route */
/* GET affiliates */
router.get('/affiliates', (req, res, next) => {
  var affiliates = null;
  var myeducator = null;
  request.getAsync('https://api.shingo.org/salesforce/affiliates')
  .then(results => {
    var response = JSON.parse(results.body);
    affiliates = response.affiliates;

    // Remove MyEducator
    var i = _.findIndex(affiliates, a =>{ return a.Id == '0011200001Gl4QoAAJ'; })
    myeducator = affiliates[i];
    affiliates.splice(i, 1);

    // Remove Shingo Institute
    var l = _.findIndex(affiliates, a =>{ return a.Id == '0011200001Gkm2uAAB'; });
    shingoInstitute = affiliates[l];
    affiliates.splice(l, 1);

    affiliates.sort(function(a, b) {
        var aLower = a['Name'].toLowerCase()
        var bLower = b['Name'].toLowerCase()
        if (aLower < bLower) {return -1}
        if (aLower > bLower) {return 1}
        return 0
    })

    res.render('affiliates/affiliates', {
        title: 'Affiliates - Shingo Institute',
        affiliates: affiliates,
        myeducator: myeducator
    });
  })
  .catch(err => {
      logger.log("error", "AFFILIATES ROUTE\n%j", err)
      res.render('affiliates/affiliates', {
          title: 'Affiliates - Shingo Institute',
          affiliates: affiliates,
          myeducator: myeducator
      });
  })
});

/*  GET an affiliate  */
// TODO Verify https:// at beginning of all affiliate urls
router.get('/affiliates/:id', (req, res, next) => {
  var aff = null;
  var fac = null;
  request.getAsync('https://api.shingo.org/salesforce/affiliates/web/' + req.params.id)
  .then(results => {
    var response = JSON.parse(results.body)
    aff = response.affiliate

    // Get Facilitators
    return request.getAsync('https://api.shingo.org/salesforce/affiliates/facilitators/' + req.params.id)
  })
  .then(results =>{
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
  .then(() =>{
    res.render('affiliates/template', {
        title: aff.Name + ' - Shingo Institute',
        affiliate: aff,
        fac_pair: fac
    });
  })
  .catch(err => {
      logger.log("error", "AFFILIATE ROUTE: %s\n%j", req.params.id, err)
      res.render('affiliates/template', {
          title: aff.Name + ' - Shingo Institute',
          affiliate: aff,
          fac_pair: fac
      });
  })
});

/*  About Menu  */
router.get('/about', (req, res, next) => {
  var staff = null;
  request.getAsync('https://api.shingo.org/salesforce/about/staff')
  .then(results => {
    var response = JSON.parse(results.body);
    staff = response.staff;
    res.render('about/about', {
        title: 'Shingo Mission - Shingo Institute',
        staff: staff
    });
  })
  .catch(err => {
      logger.log("error", "ABOUT ROUTE\n%j", err)
      res.render('about/about', {
          title: 'Shingo Mission - Shingo Institute',
          staff: staff
      });
  })
});

/* GET academy */
router.get('/academy', (req, res, next) => {
  var academy = null;
  request.getAsync('https://api.shingo.org/salesforce/about/academy')
  .then(results => {
    var response = JSON.parse(results.body);
    academy = response.academy;
    res.render('about/academy', {
        title: 'Shingo Academy - Shingo Institute',
        academy: academy
    });
  })
  .catch(err => {
      logger.log("error", "ACADEMY ROUTE\n%j", err)
      res.render('about/academy', {
          title: 'Shingo Academy - Shingo Institute',
          academy: academy
      });
  })
});

/* GET examiner */ // TODO Divide lists
router.get('/examiners', (req, res, next) => {
  var examiners = null;
  request.getAsync('https://api.shingo.org/salesforce/about/examiner/')
  .then(results => {
    var response = JSON.parse(results.body);
    examiners = response.examiners;
    res.render('about/examiners', {
        title: 'Examiners - Shingo Institute',
        examiner: examiners
    });
  })
  .catch(err => {
      logger.log("error", "EXAMINERS ROUTE\n", err)
      res.render('about/examiners', {
          title: 'Examiners - Shingo Institute',
          examiner: examiners
      });
  })
});

/* GET seab */
router.get('/seab', (req, res, next) => {
  var seab = null;
  request.getAsync('https://api.shingo.org/salesforce/about/seab/')
  .then(results => {
    var response = JSON.parse(results.body);
    seab = response.records;
    seab.forEach(member =>{
      member.Photograph__c = formatImage(member.Photograph__c, 300, 300)
      logger.log("debug", "member.Photograph__c (line 412) = %s", member.Photograph__c)
    })

    res.render('about/seab', {
        title: 'Shingo Executive Advisory Board - Shingo Institute',
        members: seab
    })
  })
  .catch(err => {
      logger.log("error", "SEAB ROUTE\n%j", err)
      res.render('about/seab', {
          title: 'Shingo Executive Advisory Board - Shingo Institute',
          members: seab
      })
  })
});

/* GET Career Page */
router.get('/careers', (req, res, next) => {
    res.render('about/careers', {
        title: 'Shingo Careers - Shingo Institute'
    });
});

/* GET Faculty Fellows */
router.get('/faculty-fellows', (req, res, next) => {
    res.render('about/faculty-fellows', {
        title: 'Shingo Faculty Fellows - Shingo Institute'
    });
});

/* Other Routes */
router.get('/linkedin', (req, res, next) => {
  res.render('about/linkedin', {
    title: 'The Shingo Institute'
  })
})

/* GET research - Linked from homepage only */
router.get('/research', (req, res, next) => {
    res.render('about/research', {
        title: 'Insight - Shingo Institute'
    });
});

/* GET privacy policy */
router.get('/privacy-policy', (req, res, next) => {
    res.render('about/privacy-policy', {
        title: 'Privacy Policy - Shingo Institute'
    });
});

/* GET Prize FAQ */
router.get('/prizefaq', (req, res, next) => {
    res.render('about/prizefaq', {
        title: 'Prize Questions - Shingo Institute'
    });
});

/* GET Craftsmanship Landing Page */
router.get('/craftsmanship', (req, res, next) => {
    res.render('about/craftsmanship', {
        title: 'The Craftsmanship Project - Shingo Institute'
    });
});


/* Files */  // TODO Handle static file routing & storage
/* GET .pdf - From challengefortheprize */
router.get('/assets/Assessment_Process_Flow_Chart.pdf', (req, res, next) => {
    res.download('../assets/Assessment_Process_Flow_Chart.pdf');
});

/* GET .pdf - From challengefortheprize*/
router.get('/assets/Application_Guidelines.pdf', (req, res, next) => {
    res.download('../assets/Application_Guidelines.pdf');
});

/* GET .pdf - From researchaward*/
router.get('/assets/Research-Award-Application-Form.pdf', (req, res, next) => {
    res.download('../assets/Research-Award-Application-Form.pdf');
});

router.get('/additional', (req, res, next) => {
    res.render('education/additional', {
        title: 'Additional Workshops - Shingo Institute'
    });
});

module.exports = router;
