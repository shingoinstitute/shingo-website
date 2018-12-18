const path = require('path');
require('dotenv').load({ path: path.normalize(path.join(__dirname, '.env')) });

const express = require('express')
const exphbs = require('express-handlebars')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config.js')
const api_route = require('./admin-app/events')
const request = require('request-promise-native')
const moment = require('moment')
const subdomains = require('express-subdomains')
const insight_routes = require('./routes/insight.js')
const index = require('./routes/index.js')
const _ = require('lodash')
const xmlParser = require('xml2js').parseString

const app = express();

// Get S3 bucket folder info
function getAWSData(params){
    // Destructure params
    let {conf, year} = params;

    // Create RegExs
    const { p1: confPattern, p2: yearPattern } = { p1: /(international|latinamerica|manufacturing|european)/, p2: /2\d{3}/ };

    // Test conf & year; set to default if fail
    if(!conf) conf = 'international';
    if(!yearPattern.test(year)) year = new Date().getFullYear();

    const data =  { title: '', conf, year}
    
    // Return resulting title
    if(conf === 'international') data.title = `${year} International Conference Presentations`;
    else if(conf === 'latinamerica') data.title = `${year} Latin America Conference Presentations`;
    else if(conf === 'european') data.title = `${year} European Conference Presentations`;
    else if(conf === 'manufacturing') data.title = `${year} Manufacturing Summit Presentations`;
    else if(conf === 'oe') data.title = `${year} Operational Excellence Conference Presentations`;
    else if(conf === 'financialservices') data.title = `${year} Financial Services Conference Presentations`;
    else {
        const error = new Error(`Couldn't find presentations for ${JSON.stringify(params)}`);
        error.status = 504;
        throw error;
    }
    
    return data;
}

app.get('/presentations/:conf?/:year?', function(req, res, next) {
    const { title } = getAWSData(req.params);

    const files = []
    request("https://s3-us-west-1.amazonaws.com/shingo-presentations").then(body => {
        xmlParser(body, function(err, bucket){
            if(err) { console.error(`Error in GET: ${req.path}\n`, err); return next(); }
            _.forOwn(bucket.ListBucketResult.Contents, function(val){
                var pres = _.pick(val, 'Key');
                if(pres && pres.Key && pres.Key.length) pres = pres.Key[0];
                // logger.debug("Presentation Path: %s", pres);
                if(pres.includes(title) && pres.includes(".pdf")){
                    var file = "https://s3-us-west-1.amazonaws.com/shingo-presentations/" + pres.replace(new RegExp(" ", 'g'), "+");
                    files.push({ file: file, name: pres.split('/')[1] });
                }
            });

            res.render('presentations', {
                title: "Download",
                files: files,
                conference: title
            });
        });
    })
    .catch(error => {
        console.error(`Error in GET: ${req.path}\n`, error)
        return next(error)
    })
})

app.set('port', config.port)

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'base',
    helpers: {
        prettyMonth: function(date) {
            var d = moment(date)
            var format = 'MMM YYYY'
            return d.format(format)
        },

        prettyDate: function(start, end) {
            var s = moment(start)
            var e = moment(end)
            var format = 'DD MMMM YYYY'
            if (s.year() != e.year()) {
                return s.format(format) + " - " + e.format(format)
            } else if (s.month() != e.month()) {
                return s.format('DD MMMM') + " - " + e.format(format)
            } else if (s.date() != e.date()) {
                return s.format('DD') + " - " + e.format(format)
            } else {
                return e.format(format)
            }
        },

        prettyDateTime: function(start, end) {
          var s = moment(new Date(start))
          var e = moment(new Date(end))
          var format = 'hh:mm a'
          return s.format(format) + " - " + e.format(format)
        }
    }
}));
app.set('view engine', 'handlebars');


app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

subdomains.use('insight')

app.use(subdomains.middleware);

app.use('/insight', insight_routes);
app.use('/api', api_route);

app.use('/', index);

app.get('/admin', function(req, res) {
    if (!req.session.access_token) {
        return res.redirect(`${config.sf.environment}/services/oauth2/authorize?response_type=code&client_id=${config.sf.client_id}&redirect_uri=${config.sf.redirect_uri}`)
    }
    res.sendFile(__dirname + '/public/admin-app/index.html')
})

app.get('/auth_callback', function(req, res) {
    var post_data = {
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: config.sf.client_id,
        client_secret: config.sf.client_secret,
        redirect_uri: config.sf.redirect_uri,
    }

    var options = {
        uri: config.sf.environment + '/services/oauth2/token',
        formData: post_data,
        json: true
    }

    request.post(options).then(response => {
        req.session.access_token = response.access_token
        return res.redirect('/admin')
    }).catch(function(err) {
        console.error("AUTH_CALLBACK ROUTE\n", err);
        return res.redirect('/')
    })
})

/*   Error Handling  */
//Catch 404 and forward
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Dev Error: Prints stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        const status = err.status || err.code === 'ENOENT' ? 404 : undefined || 500;
        res.status(status);
        res.render('error', {
            message: `<h3>${err.message}</h3>`,
            error: err,
            status: status
        });
    });
}

// Production Error: No stacktrace leaked to user
app.use(function(err, req, res, next) {
    const status = err.status || err.code === 'ENOENT' ? 404 : undefined || 500;
    let message;
    switch(status){
    case 404:
        message = '<img style="width:500px" src="/images/404.png"><h3>Ooops! We couldn\'t find the resource you requested! Please check the URL or contact us at <a href="mailto: shingo.info@usu.edu">shingo.info@usu.edu</a>.</h3><br><br>';
        break;
    case 401:
    case 403:
        message = '<div style="font-size: 250%; color: red;">You are not allowed access to this resource!</div><br><br>';
        break;
    case 500:
    default:
        message = '<h3>Ooops! Something unexpected happened. Please contact us at <a href="mailto: shingo.development@usu.edu">shingo.development@usu.edu</a>!</h3><br><br>'
    }
    res.status(status);
    res.render('error', { message });
});

app.listen(app.get('port'), function() {
    console.log("Node is on port ", app.get('port'));
});

module.exports = app;
