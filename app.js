var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var configurationData = require('./services/configuration');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/common/js/q', express.static(path.join(__dirname, 'node_modules', 'q', 'q.js')));
app.use('/common/js/o', express.static(path.join(__dirname, 'node_modules', 'o.js', 'o.js')));
app.use('/common/js/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')));
app.use('/common/js/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.min.js')));
app.use('/common/js/knockout', express.static(path.join(__dirname, 'node_modules', 'knockout', 'build', 'output', 'knockout-latest.js')));
app.use('/common/js/moment', express.static(path.join(__dirname, 'node_modules', 'moment', 'min', 'moment.min.js')));
app.use('/common/js/datepicker', express.static(path.join(__dirname, 'node_modules', 'eonasdan-bootstrap-datetimepicker', 'build', 'js', 'bootstrap-datetimepicker.min.js')));
app.use('/common/js/guid', express.static(path.join(__dirname, 'node_modules', 'guid', 'guid.js')));
app.use('/common/js/uri', express.static(path.join(__dirname, 'node_modules', 'urijs', 'src', 'URI.min.js')));

app.use('/common/css/bootstrap/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/common/css/bootstrap/fonts', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'fonts')));
app.use('/common/css/datepicker', express.static(path.join(__dirname, 'node_modules', 'eonasdan-bootstrap-datetimepicker', 'build', 'css')));

var pages = require('./routes/pages');
app.use('/', pages);

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
	res.locals.error = configurationData.Environment === 'dev' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
