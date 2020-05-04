const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {pageTitle: 'E-Music Box'});
});

router.get('/intro', function (req, res, next) {
  res.render('intro', {pageTitle: 'E-Music Box'});
});

router.get('/upload', audioController.getUpload);

router.post('/upload', audioController.postUpload);

router.get('/delete/:audioId', audioController.getDelete);

router.post('/delete', audioController.postDelete);

router.get('/playback/:audioId', audioController.getPlayback);

router.get('/view_all', audioController.getAll);

module.exports = router;
