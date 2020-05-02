const express = require('express');
const router = express.Router();
const Audio = require('../models/audio');

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

router.post('/upload', function (req, res, next) {
  const title = req.body.title;
  const author = req.body.author;
  const audioFile = req.file;

  const url = audioFile.path;

  const audio = new Audio({
    title: title,
    author: author,
    url: url
  });
  audio.save()
  .then(result => {
    res.redirect('/upload');
  });
}
);

router.get('/playback_page', function (req, res, next) {
  res.render('playback_page', {title: 'Playback'});
});

module.exports = router;
