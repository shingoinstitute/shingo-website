var express = require('express');
var router = express.Router();

/*  Affiliates Route */

// TODO: Add Affiliates Route based on url param to render specific affiliate page content. Fetch Content from SF?
// TODO: Dynamic CSS with Node & Sass

/* GET affiliates */
router.get('/', function(req, res, next) {
res.render('affiliates/affiliates', { title: 'Affiliates - Shingo Institute' });
});

/* GET arches*/
router.get('/arches', function(req, res, next) {
res.render('affiliates/arches', { title: 'Arches Leadership, LLC - A Shingo Institute Affiliate' });
});

/* GET efeso */
router.get('/efeso', function(req, res, next) {
res.render('affiliates/efeso', { title: 'EFESO Consulting - A Shingo Institute Affiliate' });
});

/* GET gbmp */
router.get('/gbmp', function(req, res, next) {
res.render('affiliates/gbmp', { title: 'GBMP - A Shingo Institute Affiliate' });
});

/* GET iex */
router.get('/iex', function(req, res, next) {
res.render('affiliates/iex', { title: 'IEX - A Shingo Institute Affiliate' });
});

/* GET lensys */
router.get('/lensys', function(req, res, next) {
res.render('affiliates/lensys', { title: 'Lensys - A Shingo Institute Affiliate' });
});

/* GET Mobius */
router.get('/mobius', function(req, res, next) {
res.render('affiliates/mobius', { title: 'Möbius Business Redesign - A Shingo Institute Affiliate' });
})

/* GET myEducator */
router.get('/myeducator', function(req, res, next) {
res.render('affiliates/myeducator', { title: 'MyEducator - A Shingo Institute Online Provider' });
})

/* GET opex-academy */
router.get('/opex-academy', function(req, res, next) {
res.render('affiliates/opex-academy', { title: 'Opex Academy - A Shingo Institute Affiliate' });
})

/* GET sapartners */
router.get('/sapartners', function(req, res, next) {
res.render('affiliates/sapartners', { title: 'S A Partners - A Shingo Institute Affiliate' });
});

/* GET spg */
router.get('/spg', function(req, res, next) {
res.render('affiliates/spg', { title: 'SPG - A Shingo Institute Affiliate' });
});

/* GET sisu */
router.get('/sisu', function(req, res, next) {
res.render('affiliates/sisu', { title: 'SISU Consulting - A Shingo Institute Affiliate' });
});

/* GET TMI */
router.get('/tmi', function(req, res, next) {
res.render('affiliates/tmi', { title: 'The Manufacturing Institute - A Shingo Institute Affiliate' });
});

/* GET KPC */
router.get('/kpc', function(req, res, next) {
res.render('affiliates/kpc', { title: 'Key Performance Consulting - A Shingo Institute Affiliate' });
});

/* GET ul */
router.get('/ul', function(req, res, next) {
res.render('affiliates/ul', { title: 'UL - A Shingo Institute Affiliate' });
});

/* GET young */
router.get('/young', function(req, res, next) {
res.render('affiliates/young', { title: 'Young Consulting Group - A Shingo Institute Affiliate' });
});


module.exports = router;
