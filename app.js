const createError = require('http-errors');
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const db = require('./db.js');
const sha256 = require('sha256');
const session = require('express-session');
const multer = require('multer');
const crypto = require('crypto');
const app = express();
const secret_key = crypto.randomBytes(48);

app.use(session({
    secret: secret_key.toString('hex'),
    resave: false,
    saveUninitialized: true
}));

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const router = require('./routes/router.js')(app);

//for pretty print
app.locals.pretty = true;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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



const server = app.listen(3000, function () {
  console.log('Listening on port 3000');
});
