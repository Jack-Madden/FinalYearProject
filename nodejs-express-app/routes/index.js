const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audio');
const loginController = require('../controllers/login');
const { check, body } = require('express-validator');
const loggedIn = require('../middleware/logged_in');
const Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {pageTitle: 'E-Music Box'});
});

router.get('/intro', function (req, res, next) {
  res.render('intro', {pageTitle: 'About'});
});

router.get('/upload', loggedIn, audioController.getUpload);

router.post('/upload', loggedIn, audioController.postUpload);

router.get('/delete/:audioId', loggedIn, audioController.getDelete);

router.post('/delete', loggedIn, audioController.postDelete);

router.get('/playback/:audioId', audioController.getPlayback);

router.get('/view_all', audioController.getAll);

router.get('/login', loginController.getLogin);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Email address is invalid.')
      .normalizeEmail(),
    body('password', 'Invalid password.')
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim()
  ],
  loginController.postLogin
);

router.get('/signup', loginController.getSignup);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Invalid email.')
      .custom(async (value, { req }) => {
        const accountDoc = await Account.findOne({ email: value });
          if (accountDoc) {
              return Promise.reject('That email already exists.');
          }
      })
      .normalizeEmail(),
    body(
      'password',
      'Password must have 8+ characters and use only numbers and letters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match.');
        }
        return true;
      })
  ],
  loginController.postSignup
);

router.post('/logout', loginController.postLogout);

module.exports = router;