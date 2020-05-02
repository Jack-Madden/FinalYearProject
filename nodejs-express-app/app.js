const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const mongoUri = "mongodb+srv://Jack:fortyninetyfive@cluster0-u6teg.mongodb.net/test?retryWrites=true&w=majority";

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'audiofiles');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const checkFileType = (req, file, cb) => {
  if(
    file.mimetype === 'audio/wav' ||
    file.mimetype === 'audio/mpeg' ||
    file.mimetype === 'audio/ogg'
  ) {
    cb(null, true);
  } 
  else {
    cb(null, false);
  }
};

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: audioStorage, fileFilter: checkFileType }).single('audio'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/audiofiles', express.static(path.join(__dirname, 'audiofiles')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});

module.exports = app;
