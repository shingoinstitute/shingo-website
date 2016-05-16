var express = require('express');
var router = express.Router();

/******* Recipients Route *********/
// All .pdf files are served statically and can be found at /public/assets/press

/* GET awards  */
router.get('/', function(req, res, next) {
  res.render('./layouts/awards/awards', { title: 'Recipients - Shingo Institute' });
});

                      /********** Shingo Prize Recipients *********/
/* Rexam Prize Profile */
router.get('/prize-rexam-bev', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-rexam-bev', { title: 'Recipients - Shingo Institute' });
});

/* Abbot Prize Profile */
router.get('/prize-abbott', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-abbott', { title: 'Recipients - Shingo Institute' });
});

/* ECA Prize Profile */
router.get('/prize-eca', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-eca', { title: 'Recipients - Shingo Institute' });
});

/* NewsPrinters Prize Profile */
router.get('/prize-newsprinters', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-newsprinters', { title: 'Recipients - Shingo Institute' });
});

/* Barnes Prize Profile */
router.get('/prize-barnes-ogden', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-barnes-ogden', { title: 'Recipients - Shingo Institute' });
});

/* Depuy Prize Profile */
router.get('/prize-depuysynthes-ireland', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-depuysynthes-ireland', { title: 'Recipients - Shingo Institute' });
});

/* Abbott Vascular Prize Profile */
router.get('/prize-abbottvascular-ireland', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-abbottvascular', { title: 'Recipients - Shingo Institute' });
});

/* Ethicon Prize Profile */
router.get('/prize-ethicon', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-ethicon', { title: 'Recipients - Shingo Institute' });
});

/* Aguas Claras Prize Profile */
router.get('/prize-rexam', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-rexam', { title: 'Recipients - Shingo Institute' });
});

/* Goodyear Brasil Prize Profile */
router.get('/prize-goodyear-brasil', function(req, res, next) {
  res.render('./layouts/awards/prize-shingo/prize-goodyear-brasil', { title: 'Recipients - Shingo Institute' });
});


                      /******* Silver Recipients *********/
/* GET commonwealth */
router.get('/silver_commonwealth', function(req, res, next) {
  res.render('./layouts/awards/prize-silver/silver-commonwealth', { title: 'Recipients - Shingo Institute' });
});

/* GET rexam */
router.get('/silver_rexam-jacarei', function(req, res, next) {
  res.render('./layouts/awards/prize-silver/silver-rexam-jacarei', { title: 'Recipients - Shingo Institute' });
});

/* GET rexam */
router.get('/silver_pympsa', function(req, res, next) {
  res.render('./layouts/awards/prize-silver/silver-pympsa', { title: 'Recipients - Shingo Institute' });
});


                    /******** Bronze Recipients ********/
/* GET rexam */
router.get('/bronze_lake', function(req, res, next) {
  res.render('./layouts/awards/prize-bronze/bronze-lake', { title: 'Recipients - Shingo Institute' });
});

/* GET lundbeck*/
router.get('/bronze_lundbeck-italy', function(req, res, next) {
  res.render('./layouts/awards/prize-bronze/bronze-lundbeck-italy', { title: 'Recipients - Shingo Institute' });
});

/* GET vistaprint*/
router.get('/bronze_vistaprint-australia', function(req, res, next) {
  res.render('./layouts/awards/prize-bronze/bronze-vistaprint-australia', { title: 'Recipients - Shingo Institute' });
});



                      /******* Research Recipients *********/
/* GET gemba walk */
router.get('/research_michael-bremer', function(req, res, next) {
  res.render('./layouts/awards/prize-research/research-michael-bremer-gemba-walk', { title: 'Recipients - Shingo Institute' });
});

/* GET vistaprint*/
router.get('/research_jeffrey-liker', function(req, res, next) {
  res.render('./layouts/awards/prize-research/research-jeffrey-liker', { title: 'Recipients - Shingo Institute' });
});


/* Historical .pdf */
//Served Statically as .pdf file. Can be found at public/assets/press

module.exports = router;
