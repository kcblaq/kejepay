var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config()
var PORT = process.env.PORT  || 5000
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DB_CON, {useNewUrlParser: true})
.then(console.log("Connected to database"))
.catch((error) =>console.log(error))


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var transRouter = require('./routes/transRoute');
// var transactionRouter = require('./routes/transaction');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/trans', transRouter);

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

app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`))

module.exports = app;
