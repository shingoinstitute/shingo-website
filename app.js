require('dotenv').load();

var express      = require('express')
  , exphbs       = require('express-handlebars')
  , path         = require('path')
  , favicon      = require('serve-favicon')
  , logger       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , sass         = require('node-sass')
  , config       = require('./config.js')

var languageTree = require('./routes/tree.js');

var app = express();

// Complie SASS
// sass.render({
//     file: config.scsspath,
//     outputStyle: 'compressed',
//   }, function(error, result){
//     if(error){
//       console.log(JSON.stringify(error))
//     } else {
//       console.log("SASS compiled successfully")
//       var file = require('fs')
//       file.writeFile(config.cssout, result.css.toString(),function(error){
//         if(error) console.log(JSON.stringify(error))
//       })
//     }
// })

app.set('port', config.port)

// Setup View Engine
app.set('views', path.join(__dirname,  'views'));
app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

//TODO Fix favicon
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', languageTree);

/*   Error Handling  */
//Catch 404 and forward
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Dev Error: Prints stacktrace
if(app.get('env') === 'development'){
  app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production Error: No stacktrace leaked to user
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function(){
  console.log('Node is on port', app.get('port'));
})

module.exports = app;
