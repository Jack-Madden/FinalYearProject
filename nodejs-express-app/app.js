const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');
const MONGOURI = "mongodb+srv://Jack:fortyninetyfive@cluster0-u6teg.mongodb.net/test?retryWrites=true&w=majority";
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const Account = require('./models/account');
const mongoStore = new MongoDBStore({
  uri: MONGOURI,
  collection: 'sessions'
});

const csrf = csurf();

const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'audiofiles');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const checkFileType = (_req, file, cb) => {
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const indexRouter = require('./routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: audioStorage, fileFilter: checkFileType }).single('audio'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/audiofiles', express.static(path.join(__dirname, 'audiofiles')));
app.use(session({
  secret: '4655434b20594f55',
  resave: false,
  saveUninitialized: false,
  store: mongoStore
}));
app.use(csrf);
app.use(flash());

app.use((req, res, next) => {
  res.locals.registered = req.session.loggedIn;
  res.locals.token = req.csrfToken();
  next();
});

app.use((req, _res, next) => {
  if(!req.session.account) {
    return next();
  }
  Account.findById(req.session.account._id)
  .then(account => {
    if(!account) {
      return next();
    }
    req.account = account;
    next();
  })
  .catch(err => {
    next(new Error(err));
  });
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(errorController.get404);

app.get('/500', errorController.get500);

// error handler
app.use(function(_err, req, res, _next) {
  res.status(500).render('500', {
    pageTitle: 'Error 500',
    path: '/500',
    registered: req.session.loggedIn
  });
});

mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  app.listen(8000);
})
.catch(err => {
  console.log(err);
});

module.exports = app;
