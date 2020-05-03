const Audio = require('../models/audio');

exports.getUpload = (req, res, next) => {
  res.render('upload', {pageTitle: 'Upload'});
};

exports.postUpload = (req, res, next) => {
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
};

exports.postDelete = (req, res, next) => {
  const audId = req.body.audioId;
  Audio.deleteOne({ _id: audId })
  .then(() => {
      res.redirect('/view_all');
  });
};

exports.getPlayback = (req, res, next) => {
  const audId = req.params.audioId;
  Audio.findById(audId)
    .then(audio => {
      res.render('playback', {
        audio: audio,
        pageTitle: audio.title
      });
    });
};

exports.getAll = (req, res, next) => {
  Audio.find()
    .then(audios => {
      res.render('view_all', {
        auds: audios,
        pageTitle: 'All Audio Files'
      });
    });
};