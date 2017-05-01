var path = require('path');
require('dotenv').load({path: path.normalize(path.join(__dirname, '.env'))});

var express = require('express'),
    exphbs = require('express-handlebars'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    sass = require('node-sass'),
    config = require('./config.js'),
    api_route = require('./admin-app/events'),
    Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    session = require('express-session'),
    MySQLStore = require('express-mysql-session')(session),
    moment = require('moment'),
    fs = require('fs'),
    https = require('https'),
    subdomains = require('express-subdomains'),
    insight_routes = require('./routes/insight.js'),
    index = require('./routes/index.js')
    Logger = require('./Logger'),
    logger = new Logger().logger;

// var privateKey = fs.readFileSync('/etc/ssl/private/server.key', 'utf8'),
//     certificate = fs.readFileSync('/etc/ssl/certs/server.crt', 'utf8'),
//     credentials = {
//         key: privateKey,
//         cert: certificate
//     }

var app = express();

var store = new MySQLStore(config.mysql_connection)
app.use(
    session({
        secret: 'iamawesome',
        store: store,
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: config.cookie_security,
            maxAge: 3600000
        }
    })
)

app.get('/presentations', function(req, res) {
    var files = new Array();
    fs.readdirSync(__dirname + '/public/presentations')
        .filter(function(file) {
            return (file.indexOf(".pdf") !== 0);
        })
        .forEach(function(file) {
            files.push(file);
        });
    res.render('presentations', {
        title: "Download",
        files: files
    })
})

app.get('/latinamerica', function(req, res) {
    var files = new Array();
    fs.readdirSync(__dirname + '/public/presentations/LatinAmerica')
        .filter(function(file) {
            return (file.indexOf(".pdf") !== 0);
        })
        .forEach(function(file) {
            files.push("LatinAmerica/" + file);
        });
    res.render('presentations', {
        title: "Download",
        files: files
    })
})

app.get('/copenhagen', function(req, res) {
    var files = new Array();
    fs.readdirSync(__dirname + '/public/presentations/Copenhagen')
        .filter(function(file) {
            return (file.indexOf(".pdf") !== 0);
        })
        .forEach(function(file) {
            files.push("Copenhagen/" + file);
        });
    res.render('presentations', {
        title: "Download",
        files: files
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
// app.use(logger('dev'));
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
        return res.redirect(config.sf.environment + "/services/oauth2/authorize?response_type=code&client_id=" + config.sf.client_id + "&redirect_uri=" + config.sf.redirect_uri)
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
        url: config.sf.environment + '/services/oauth2/token',
        form: post_data
    }

    request.postAsync(options).then(function(body) {
        if (body.statusCode != 200) {
            throw new Error("status_code:" + body.status_code)
        }
        response = JSON.parse(body.body);

        req.session.access_token = response.access_token
        return res.redirect('/admin')
    }).catch(function(err) {
        logger.log("error", "AUTH_CALLBACK ROUTE\n%j", err);
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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error: No stacktrace leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function() {
    logger.log("info", "Node is on port %s", app.get('port'));
});

// var httpsServer = https.createServer(credentials, app)

// httpsServer.listen(8443);

module.exports = app;
