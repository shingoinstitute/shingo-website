var express = require('express');
var router = express.Router();

var routes_affiliates = require('./index-affiliates.js');
var routes_recipients = require('./index-recipients.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shingo Institute - Leading a New Era of Enterprise Excellence'});
});


                      /* Education Menu */
/* GET model  */
router.get('/model', function(req, res, next) {
  res.render('./layouts/education/model', { title: 'The Shingo Model - Shingo Institute' });
});

/* GET education */
router.get('/education', function(req, res, next) {
  res.render('./layouts/education/education', { title: 'Education - Shingo Institute' });
});

/* GET Japan studytour */
router.get('/japanstudytour', function(req, res, next) {
  res.render('./layouts/education/japanstudytour', { title: 'Study Tour - Shingo Institute' });
});

/* GET USA studytour */
router.get('/usastudytour', function(req, res, next) {
  res.render('./layouts/education/usastudytour', { title: 'Study Tour - Shingo Institute' });
});

                        /* LEAN Network */
/*GET LEAN Home Page*/
router.get('/teaching-lean', function(req, res, next) {
  res.render('./LEAN/teaching-lean', { title: 'Lean Education Academic Network - Shingo Institute' });
});

/*GET LEAN Resource Page*/
router.get('/teaching-lean/resources', function(req, res, next) {
  res.render('./LEAN/resources', { title: 'Resources - Lean Education Academic Network - Shingo Institute' });
});

/*GET LEAN Events Page*/
router.get('/teaching-lean/events', function(req, res, next) {
  res.render('./LEAN/events', { title: 'Events - Lean Education Academic Network - Shingo Institute' });
});

/*GET LEAN Professors Page*/
router.get('/teaching-lean/professors', function(req, res, next) {
  res.render('./LEAN/professors', { title: 'Professors - Lean Education Academic Network - Shingo Institute' });
});


                       /*  Awards Route */
/* GET challengefortheprize */
router.get('/challengefortheprize', function(req, res, next) {
  res.render('./layouts/awards/challengefortheprize', { title: 'The Shingo Prize - Shingo Institute' });
});

/* GET awards routes */
router.use('/awards', routes_recipients);

/* GET researchaward  */
router.get('/researchaward', function(req, res, next) {
  res.render('./layouts/awards/researchaward', { title: 'Research Publication Award - Shingo Institute' });
});

// TODO: Add Affiliates Route based on url param to render specific awards page content. Fetch Content from SF


                       /*  Affiliates Route */
/* GET affiliates */
router.use('/affiliates', routes_affiliates);


                        /*  About Menu  */
// TODO: Pages contain content that can be populated from salesforce

/* GET about */
router.get('/about', function(req, res, next) {
  res.render('./layouts/about/about', { title: 'Mission & History - Shingo Institute' });
});

/* GET academy */
router.get('/academy', function(req, res, next) {
  res.render('./layouts/about/academy', { title: 'Shingo Academy - Shingo Institute' });
});

/* GET examiner */
router.get('/examiners', function(req, res, next) {
  res.render('./layouts/about/examiners', { title: 'Examiners - Shingo Institute' });
});

/* GET seab */
router.get('/seab', function(req, res, next) {
  res.render('./layouts/about/seab', { title: 'Shingo Executive Advisory Board - Shingo Institute' });
});

/* GET shingoteam */
router.get('/shingoteam', function(req, res, next) {
  res.render('./layouts/about/shingoteam', { title: 'The Shingo Team - Shingo Institute' });
});


                          /*Other Routes*/
/* GET research - Linked from homepage only */
router.get('/research', function(req, res, next) {
  res.render('./layouts/about/research', { title: 'Insight - Shingo Institute' });
});

/* GET privacy policy - Linked from homepage only */
router.get('/privacy-policy', function(req, res, next) {
  res.render('./layouts/about/privacy-policy', { title: 'Privacy Policy - Shingo Institute' });
});

/* GET Prize FAQ */
router.get('/prizefaq', function(req, res, next) {
  res.render('./layouts/about/prizefaq', { title: 'Prize Questions - Shingo Institute' });
});


                          /*Files*/
/* GET .pdf - From challengefortheprize */
router.get('/assets/Assessment_Process_Flow_Chart.pdf', function(req, res, next) {
  res.send('../assets/Assessment_Process_Flow_Chart.pdf');
});

/* GET .pdf - From challengefortheprize*/
router.get('/assets/Application_Guidelines.pdf', function(req, res, next) {
  res.send('../assets/Application_Guidelines.pdf');
});

/* GET .pdf - From researchaward*/
router.get('/assets/Research-Award-Application-Form.pdf', function(req, res, next) {
  res.send('../assets/Research-Award-Application-Form.pdf');
});


module.exports = router;
