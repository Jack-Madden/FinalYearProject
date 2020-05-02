const express = require('express');
const router = express.Router();
const Audio = require('../models/audio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {pageTitle: 'E-Music Box'});
});

router.get('/intro_page', function (req, res, next) {
  res.render('intro_page', {pageTitle: 'E-Music Box'});
});

router.get('/upload', function (req, res, next) {
  res.render('upload', {pageTitle: 'Upload'});
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

router.get('/playback_page/:audioId', function (req, res, next) {
  const audId = req.params.audioId;
  Audio.findById(audId)
    .then(audio => {
      res.render('playback_page', {
        audio: audio,
        pageTitle: audio.title
      });
    });
});

router.get('/view_all', function (req, res, next) {
  Audio.find()
    .then(audios => {
      res.render('view_all', {
        auds: audios,
        pageTitle: 'All Audio Files'
      });
    });
});

module.exports = router;
