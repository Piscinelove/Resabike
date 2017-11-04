var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
//only for test
var login = require('./routes/login');
var driver = require('./routes/driver');
var zoneadmin = require('./routes/zoneadmin');
var regionadmin = require('./routes/regionadmin');
var administration = require('./routes/administration');
var autocomplete = require('./routes/autocomplete');
//

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret:'badger badger badger mushroom',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
//test
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

var isAuthenticated = function(req, res, next) {

    if(req.session.authenticated !== true)
        res.redirect('/login');
    else
        next();
};

var isAuthorized = function (req, res, next) {
    var url = req.path;
    var idRole = req.session.idRole;

    if(url == "/admin/zone")
    {
        if(idRole == 1)
            next();
        else
            res.status(500).send("Unauthorized access");
    }
    else if(url == "/admin/lines")
    {
        if(idRole == 1 || idRole == 2)
            next();
        else
            res.status(500).send("Unauthorized access");
    }
    else if(url == "/admin/users")
    {
        if(idRole == 1)
            next();
        else
            res.status(500).send("Unauthorized access");
    }
    else if(url == "/admin/bookings")
    {
        if(idRole == 1 || idRole == 2)
            next();
        else
            res.status(500).send("Unauthorized access");
    }
    else
        next();
}

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/driver', driver);
app.use('/zoneadmin', zoneadmin);
app.use('/regionadmin', regionadmin);
app.use('/administration', isAuthenticated, isAuthorized, administration);
app.use('/autocomplete', autocomplete);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
