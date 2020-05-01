const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'E-Music Box'});
});

router.get('/intro_page', function (req, res, next) {
  res.render('intro_page', {title: 'E-Music Box'});
});

router.get('/upload', function (req, res, next) {
  res.render('upload', {title: 'Upload'});
});

router.post('/upload',
  [
    body('title')
    .isString()
    .trim(),
  ],
  uploadController.postAddDrums
);

router.get('/playback_page', function (req, res, next) {
  res.render('playback_page', {title: 'Playback'});
});

module.exports = router;
