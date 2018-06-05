const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const expressHandlebars = require('express-handlebars');

// -------------------------------------------------------------------------
// EXPRESS SETUP
// -------------------------------------------------------------------------

// Create an express instance
const app = express();

// View engine setup
var handlebars = expressHandlebars.create({
  defaultLayout: 'main',
  partials: {
    'buying-info': '{{buying-info}}'
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('view cache', true);

// Protect from well-known vulnerabilities
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve compressed (.gz) files
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------------------
// ROUTING
// -------------------------------------------------------------------------

const routes = require('./routes');
app.use('/', routes);

// -------------------------------------------------------------------------
// ERROR HANDLING
// -------------------------------------------------------------------------

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(logger('dev'));
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
