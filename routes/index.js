const express = require('express')
const jsonfile = require('jsonfile')
const moment = require('moment')
const request = require('request-promise-native')
const _ = require('lodash')
const router = express.Router()

const routes_recipients = require('./index-recipients.js')

const formatImage = (url, height, width) => {
    if (!url) {
        return (
            `https://res.cloudinary.com/shingo/image/upload/c_fill,g_face,h_${height},w_${width}/v1414874243/silhouette_vzugec.png`
        )
    }
    const first = url.split('upload/')
    const second = first[1].split('/v')
    return url.indexOf('w_') < 0
        ? `${first[0]}upload/c_fill,g_face,h_${height},w_${width}/${first[1]}`
        : `${first[0]}upload/c_fill,g_face,h_${height},w_${width}/v${second[1]}`
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

/* GET journey */
router.get('/journey', (req, res, next) => {
    res.render('education/journey', {
        title: 'Your Shingo Journey - Shingo Institute'
    });
});


/**
 * Ensures that a workshop's Registration_Website__c is a valid url
 *
 * Mutates the items in the given array
 * @param workshops {Array<{ Registration_Website__c: string }>} an array of workshops
 */
const ensureValidWorkshopUrl = workshops => {
    workshops.forEach(workshop => {
        if (!workshop.Registration_Website__c) return
        if (!workshop.Registration_Website__c.includes('http://')
         && !workshop.Registration_Website__c.includes('https://')) {
            workshop.Registration_Website__c =
                'http://' + workshop.Registration_Website__c
        }
    })
}

/* GET workshops */
router.get('/workshops', (req, res, next) => {
    request
        .get('https://api.shingo.org/salesforce/workshops')
        .then(results => {
            let records = JSON.parse(results)
            /** @type object[]  */
            let workshops = records.workshops
            const workshopLocationsSet = new Set()
            const workshopMonthsSet = new Set()
            workshops = workshops.filter(w => !!(w && w.Registration_Website__c))
            // Ensure url is valid
            ensureValidWorkshopUrl(workshops)
            workshops = _.sortBy(workshops, ['End_Date__c'])

            const allWorkshops = workshops.map(ws => {
                switch (ws.Workshop_Type__c) {
                    case 'Discover':
                        ws.workshopTypeFull = 'Discover Excellence'
                        break
                    case 'Enable':
                        ws.workshopTypeFull = 'Cultural Enablers'
                        break
                    case 'Improve':
                        ws.workshopTypeFull = 'Continuous Improvement'
                        break
                    case 'Align':
                        ws.workshopTypeFull = 'Enterprise Alignment'
                        break
                    case 'Build':
                        ws.workshopTypeFull = 'Build Excellence'
                        break
                }

                ws.hasAdditionalInfo =
                    ws.Additional_Information__c &&
                    ws.Additional_Information__c !== ''
                return ws
            })

            for (const ws of workshops) {
                workshopLocationsSet.add(ws.Event_Country__c)
            }
            const workshopLocations = Array.from(workshopLocationsSet).sort()

            for (const ws of workshops) {
                let month = moment(ws.Start_Date__c).format('MMM YYYY')
                workshopMonthsSet.add(month)
            }
            const workshopMonths = Array.from(workshopMonthsSet)

            res.render('education/workshops', {
                title: 'Workshops - Shingo Institute',
                workshops: allWorkshops,
                locations: workshopLocations,
                months: workshopMonths,
            })
        })
        .catch(err => {
            console.error('WORKSHOPS ROUTE\n', err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: [],
            })
        })
})

/* GET education */
router.get('/education', (req, res, next) => {
    res.render('education/education', {
        title: 'Workshops - Shingo Institute'
    });
});

/* EDUCATION/INFO PAGES */

/** 
 * @param type {string} The workshop Type ('Discover' | 'Enable' | 'Improve' | 'Align' | 'Build')
 * @returns {Promise<any[]>}
 */
const getWorkshopType = type => {
    return request
        .get('https://api.shingo.org/salesforce/workshops')
        .then(results => {
            const records = JSON.parse(results)
            let workshops = records.workshops

            // Ensure url is valid
            ensureValidWorkshopUrl(workshops)
            workshops = _.sortBy(workshops, ['End_Date__c'])
            return workshops.filter(ws => ws.Workshop_Type__c === type)
        })
}

/* GET discover */
router.get('/education/discover', (req, res, next) => {
    getWorkshopType('Discover')
        .then(showWorkshops => {
            res.render('education/discover', {
                title: 'Discover - Shingo Institute',
                workshops: showWorkshops,
                workshopType: 'Discover Excellence',
                color: '5b3214',
            })
        })
        .catch(err => {
            console.error('DISCOVER ROUTE\n', err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: [],
            })
        })
})

/* GET enable */
router.get('/education/enable', (req, res, next) => {
    getWorkshopType('Enable')
        .then(showWorkshops => {
            res.render('education/enable', {
                title: 'Enable - Shingo Institute',
                workshops: showWorkshops,
                workshopType: 'Cultural Enablers',
                color: '003768',
            })
        })
        .catch(err => {
            console.error('ENABLE ROUTE\n', err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: [],
            })
        })
})

/* GET improve */
router.get('/education/improve', (req, res, next) => {
    getWorkshopType('Improve')
        .then(showWorkshops => {
            res.render('education/improve', {
                title: 'Improve - Shingo Institute',
                workshops: showWorkshops,
                workshopType: 'Continuous Improvement',
                color: '640820',
            })
        })
        .catch(err => {
            console.error('Improve ROUTE\n', err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: [],
            })
        })
})

/* GET align */
router.get('/education/align', (req, res, next) => {
    getWorkshopType('Align')
        .then(showWorkshops => {
            res.render('education/align', {
                title: 'Align - Shingo Institute',
                workshops: showWorkshops,
                workshopType: 'Enterprise Alignment',
                color: '627c33',
            })
        })
        .catch(err => {
            console.error('Align ROUTE\n', err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: [],
            })
        })
})

/* GET build */
router.get('/education/build', (req, res, next) => {
    getWorkshopType('Build')
        .then(showWorkshops => {
            res.render('education/build', {
                title: 'Build - Shingo Institute',
                workshops: showWorkshops,
                workshopType: 'Build Excellence',
                color: '405124',
            })
        })
        .catch(err => {
            console.error('Build ROUTE\n', err)
            res.render('education/education', {
                title: 'Education - Shingo Institute',
                workshops: [],
            })
        })
})

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
    , 'events/31': 'http://www.cvent.com/events/31st-annual-shingo-conference/event-summary-cc99906ddb2f4a5abdc73a67a0142f24.aspx'
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

/*  Awards Route */   // TODO PUll awards from SF.
/* GET challengefortheprize */
router.get('/challengefortheprize', (req, res, next) => {
    res.render('awards/challengefortheprize', {
        title: 'The Shingo Prize - Shingo Institute'
    });
});

/**
 * Strips the duplicate dates of items in the given array
 * @param {Array<{date: string}>} awardList an array of awar
 */
function stripDates(awardList) {
    /** @type {Set<string>} */
    const foundDates = new Set()
    awardList.forEach(award => {
        if (foundDates.has(award.date)) {
            award.date = "";
        } else {
            foundDates.add(award.date)
        }
    })
    return awardList
}

/* GET awards routes */
router.get('/awards', (req, res, next) => {
  request
    .get('https://api.shingo.org/salesforce/awards/prize')
    .then(results => {
        const response = JSON.parse(results)
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
            if (award.State__c != null) {
                console.log("Found State " + award.Name)
                award.info = award.City__c + ", " + award.State__c + ", " + award.Country__c;
            }
            else award.info = award.City__c + ", " + award.Country__c;
            var date = moment(award.Date_Awarded__c);
            var formattedDate = date.format('YYYY');
            award.date = formattedDate;
            award.link = award.Company_Profile_Link__c;

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

        shingoAwards = stripDates(shingoAwards)
        silverAwards = stripDates(silverAwards)
        bronzeAwards = stripDates(bronzeAwards)

        res.render('awards/awards', {
            title: 'Awards - Shingo Institute',
            shingoAwards: shingoAwards,
            silverAwards: silverAwards,
            bronzeAwards: bronzeAwards
        });
    })
    .catch(err => {
        console.error('/awards', err)
        return next(err)
    })
});

router.get('/awards/:id', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/awards/prize/' + req.params.id)
    .then(results => {
        res.render('awards/prize-template', {
            title: 'Award Recipient - Shingo Institute',
            award: JSON.parse(results).records[0]
        })
    }).catch(err => {
        console.error(`awards/${req.params.id}`, err)
        return next(err)
    })
})

/* GET researchaward  */
router.get('/researchaward', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/awards/research')
    .then(results => {
        var response = JSON.parse(results)
        var awards = response.records;

        awards.forEach(award => {
            award.info = award.Public_Author_Name__c;
            var date = moment(award.Press_Release_Date__c);
            var formattedDate = date.format('MMM YYYY');
            award.date = formattedDate;
            award.link = award.Press_Release_Link__c;
            award.Press_Release_Link__c = null;
        })

        res.render('awards/researchaward', {
            title: 'Research Award - Shingo Institute',
            awards: awards
        });
    }).catch(err => {
        console.error('awards/researchaward', err)
        res.render('awards/researchaward', {
            title: 'Research Award - Shingo Institute',
            awards: []
        });
    });
});

// GET Resarch Award template
router.get('/researchaward/:id', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/awards/research/' + req.params.id)
   .then(results => {
        res.render('awards/research-template', {
            title: 'Research Award - Shingo Institute',
            award: JSON.parse(results).records[0]
        })
    })
    .catch(err => {
        console.error('/researchaward/:id', err)
        res.render('awards/research-template', {
            title: 'Research Award - Shingo Institute',
            award: null
        })
    })
});

/* GET awards routes */
router.use('/publication', routes_recipients);

/* GET publication award  */
router.get('/publicationaward', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/awards/publication')
    .then(results => {
        const response = JSON.parse(results)
        const awards = response.records
        res.render('awards/publicationaward', {
            title: 'Publication Award - Shingo Institute',
            awards: awards
        })
    })
    .catch(err => {
        console.error('/publicationaward', err)
        res.render('awards/publicationaward', {
            title: 'Publication Award - Shingo Institute',
            awards: null
        })
    })
});

// GET Publication Award template
router.get('/publicationaward/:id', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/awards/publication/' + req.params.id)
   .then(results => {
        const response = JSON.parse(results)
        // How to simplify??
        const award = response.records[0]
        res.render('awards/publication-template', {
            title: 'Publication Award - Shingo Institute',
            award: award
        })
    })
    .catch(err =>{
        console.error('/publicationaward/:id', err)
        res.render('awards/publication-template', {
            title: 'Publication Award - Shingo Institute',
            award: null
        })
    })
});

/* GET alumni  */
router.get('/alumni', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/awards/alumni')
    .then(results => {
        var response = JSON.parse(results)
        var awards = response.records;

        awards.forEach(award => {
            award.info = award.Account.Name;
            award.date = award.Name;
            award.Name = award.Title;
            award.Press_Release_Link__c = null;
        })

        res.render('awards/alumni', {
            title: 'Shingo Alumni - Shingo Institute',
            awards: awards
        });
    }).catch(err => {
        console.error('awards/researchaward', err)
        res.render('awards/researchaward', {
            title: 'Research Award - Shingo Institute',
            awards: []
        });
    });
});

/*  Affiliates Route */
/* GET affiliates */
router.get('/affiliates', (req, res, next) => {
  request.get('https://api.shingo.org/salesforce/affiliates')
  .then(results => {
    const response = JSON.parse(results);
    let affiliates = response.affiliates;

    // Remove MyEducator
    let i = _.findIndex(affiliates, a =>{ return a.Id == '0011200001Gl4QoAAJ'; })
    let myeducator = affiliates[i];
    affiliates.splice(i, 1);

    // Remove Shingo Institute
    let l = _.findIndex(affiliates, a =>{ return a.Id == '0011200001Gkm2uAAB'; });
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
      console.error("AFFILIATES ROUTE\n", err)
      res.render('affiliates/affiliates', {
          title: 'Affiliates - Shingo Institute',
          affiliates: null,
          myeducator: null,
      });
  })
});

/*  GET an affiliate  */
// TODO Verify https:// at beginning of all affiliate urls
router.get('/affiliates/:id', (req, res, next) => {
  request.get('https://api.shingo.org/salesforce/affiliates/web/' + req.params.id)
  .then(results => {
    const response = JSON.parse(results)
    // Get Facilitators
    return request
        .get('https://api.shingo.org/salesforce/affiliates/facilitators/' + req.params.id)
        .then(results => [response.affiliate, results])
  })
  .then(([aff, results]) => {
    const response = JSON.parse(results)
    let fac = response.records
    // Split into pair for css display requirements
    var pairs = []
    for(var i = 0; i < fac.length; i += 2){
      fac[i].Photograph__c = formatImage(fac[i].Photograph__c, 350, 300)
      if(fac[i+1]){ fac[i+1].Photograph__c = formatImage(fac[i+1].Photograph__c, 350, 300) }
      var p = {}
      p.a = fac[i];
      if(fac[i+1]) {  p.b = fac[i + 1]; }
      pairs.push(p)
    }
    fac = pairs;
    return [aff, fac]
  })
  .then(([aff, fac]) =>{
        res.render('affiliates/template', {
            title: aff.Name + ' - Shingo Institute',
            affiliate: aff,
            fac_pair: fac
        });
  })
  .catch(err => {
      console.error(`AFFILIATE ROUTE: ${req.params.id}\n`, err)
      res.render('affiliates/template', {
          title: ' - Shingo Institute',
          affiliate: null,
          fac_pair: null
      });
  })
});

/*  About Menu  */
router.get('/about', (req, res, next) => {
  request.get('https://api.shingo.org/salesforce/about/staff')
  .then(results => {
    const response = JSON.parse(results);
    const staff = response.staff;
    res.render('about/about', {
        title: 'Shingo Mission - Shingo Institute',
        staff: staff
    });
  })
  .catch(err => {
      console.error("ABOUT ROUTE\n", err)
      res.render('about/about', {
          title: 'Shingo Mission - Shingo Institute',
          staff: null
      });
  })
});

/* GET academy */
router.get('/academy', (req, res, next) => {
  request.get('https://api.shingo.org/salesforce/about/academy')
  .then(results => {
    const response = JSON.parse(results);
    const academy = response.academy;
    res.render('about/academy', {
        title: 'Shingo Academy - Shingo Institute',
        academy: academy
    });
  })
  .catch(err => {
      console.error( "ACADEMY ROUTE\n", err)
      res.render('about/academy', {
          title: 'Shingo Academy - Shingo Institute',
          academy: null
      });
  })
});

/* GET examiner */ // TODO Divide lists
router.get('/examiners', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/about/examiner/site')
    .then(results => {
      const response = JSON.parse(results);
      const examiners = response.examiners;
      res.render('about/siteExaminers', {
          title: 'Site Examiners - Shingo Institute',
          examiner: examiners
      });
    })
    .catch(err => {
        console.error( "EXAMINERS ROUTE\n", err)
        res.render('about/siteExaminers', {
            title: 'Site Examiners - Shingo Institute',
            examiner: null
        });
    })
  });

router.get('/siteexaminers', (req, res, next) => {
  request.get('https://api.shingo.org/salesforce/about/examiner/site')
  .then(results => {
    const response = JSON.parse(results);
    const examiners = response.examiners;
    res.render('about/siteExaminers', {
        title: 'Site Examiners - Shingo Institute',
        examiner: examiners
    });
  })
  .catch(err => {
      console.error( "EXAMINERS ROUTE\n", err)
      res.render('about/siteExaminers', {
          title: 'Examiners - Shingo Institute',
          examiner: null
      });
  })
});

router.get('/researchpublicationexaminers', (req, res, next) => {
    request.get('https://api.shingo.org/salesforce/about/examiner/respub')
    .then(results => {
      const response = JSON.parse(results);
      const examiners = response.examiners;
      res.render('about/rpExaminers', {
          title: 'Research & Publication Examiners - Shingo Institute',
          examiner: examiners
      });
    })
    .catch(err => {
        console.error( "EXAMINERS ROUTE\n", err)
        res.render('about/rpExaminers', {
            title: 'Research & Publication Examiners - Shingo Institute',
            examiner: null
        });
    })
  });

/* GET seab */
router.get('/seab', (req, res, next) => {
  request.get('https://api.shingo.org/salesforce/about/seab/')
  .then(results => {
    const response = JSON.parse(results);
    const seab = response.records;
    seab.forEach(member =>{
      member.Photograph__c = formatImage(member.Photograph__c, 300, 300)
    //   console.log("debug", "member.Photograph__c (line 412) = %s", member.Photograph__c)
    })

    res.render('about/seab', {
        title: 'Shingo Executive Advisory Board - Shingo Institute',
        members: seab
    })
  })
  .catch(err => {
      console.error( "SEAB ROUTE\n", err)
      res.render('about/seab', {
          title: 'Shingo Executive Advisory Board - Shingo Institute',
          members: []
      })
  })
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




/* GET Event Landing Pages */
router.get('/conference', (req, res, next) => {
    res.render('landingPages/conference2020', {
        title: 'Shingo Conference | Orlando, Florida'
    });
});

/* GET / Mountain West Study Tours Landing Pages */
router.get('/studytours/mountainWest', (req, res, next) => {
    res.render('landingPages/MountainWest2019', {
        title: 'Shingo Study Tours | Mountain West 2019'
    });
});

/* GET / Ireland Study Tour Landing Pages */
router.get('/studytours/Ireland', (req, res, next) => {
    res.render('landingPages/irelandStudyTour', {
        title: 'Shingo Study Tours | Ireland 2019'
    });
});

/* GET / Japan Study Tour Landing Pages */
router.get('/studytours/Japan', (req, res, next) => {
    res.render('landingPages/Japan', {
        title: 'Shingo Study Tours | Japan 2019'
    });
});

/* GET / Manufacturing Summit Landing Page */
router.get('/mfg2019', (req, res, next) => {
    res.render('landingPages/manufacturingSummit2019', {
        title: 'Summits | Manufacturing 2019'
    });
});

/* GET / Financial Services Summit Landing Page */
router.get('/summits/financial', (req, res, next) => {
    res.render('landingPages/financialServices', {
        title: 'Summits | Financial Services 2019'
    });
});

/* GET / O.E. Conference Landing Page */
router.get('/Conferences/OE', (req, res, next) => {
    res.render('landingPages/OE_Conference', {
        title: 'Conferences | O.E. Conference 2019'
    });
});

/* GET / European Conference Landing Page */
router.get('/Conferences/Europe', (req, res, next) => {
    res.render('landingPages/europeanConference', {
        title: 'Conferences | Europe 2019'
    });
});

/* GET / Goodyear Showcases Landing Page */
router.get('/showcases/denso', (req, res, next) => {
    res.render('landingPages/goodyearShowcase', {
        title: 'Showcases | Goodyear and Denso 2019'
    });
});

/* GET / About Page Shingo Insight */
router.get('/insight/about', (req, res, next) => {
    res.render('insight/about_insight', {
        title: 'Shingo Insight | About'
    });
});

/* GET / Details Page Shingo Insight */
router.get('/insight/details', (req, res, next) => {
    res.render('insight/insight_details', {
        title: 'Shingo Insight | Details'
    });
});

/* GET / Pricing Page Shingo Insight */
router.get('/insight/pricing-and-FAQ', (req, res, next) => {
    res.render('insight/insight_pricing_and_FAQ', {
        title: 'Shingo Insight | Pricing & FAQ'
    });
});

/* GET / Signup Page Shingo Insight */
router.get('/insight/signup', (req, res, next) => {
    res.render('insight/insight_signup', {
        title: 'Shingo Insight | Signup'
    });
});

/* GET / Privacy Policy Page Shingo Insight */
router.get('/insight/privacy', (req, res, next) => {
    res.render('insight/insight_privacy_policy', {
        title: 'Shingo Insight | Privacy Policy'
    });
});

/* GET / Terms of Use Page Shingo Insight */
router.get('/insight/terms', (req, res, next) => {
    res.render('insight/insight_terms_of_use', {
        title: 'Shingo Insight | Terms of Use'
    });
});

/* GET /Assessment Page */
router.get('/assessment', (req, res, next) => {
    res.render('index', {
        title: 'Shingo Institute - Leading a New Era of Enterprise Excellence'
    });
});

/* GET /Assessment Page */
router.get('/assessments', (req, res, next) => {
    res.render('index', {
        title: 'Shingo Institute - Leading a New Era of Enterprise Excellence'
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
