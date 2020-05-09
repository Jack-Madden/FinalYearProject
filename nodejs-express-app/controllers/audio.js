const Audio = require('../models/audio');
const { validationResult } = require('express-validator');

exports.getUpload = (req, res, next) => {
  res.render('upload', {
    pageTitle: 'Upload',
    hasErr: false,
    errMessage: null,
    validationErrors: []
  });
};

exports.postUpload = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const audioFile = req.file;

  if(!audioFile) {
    return res.status(422).render('/upload', {
      pageTitle: 'Upload',
      hasErr: true,
      audio: {
        title: title,
        author: author
      },
      errMessage: 'File must be .mp3, .wav or .ogg',
      validationErrors: []
    });
  }

  const errs = validationResult(req);

  if(!errs.isEmpty()) {
    console.log(errs.array());
    return res.status(422).render('upload', {
      pageTitle: 'Upload',
      hasErr: true,
      audio: {
        title: title,
        author: author,
        url: url
      },
      errMessage: errs.array()[0].msg,
      validationErrors: errs.array()
    });
  }

  const url = audioFile.path;

  const audio = new Audio({
    title: title,
    author: author,
    url: url,
    accountId: req.account
  });
  audio.save()
  .then(result => {
    res.redirect('/upload');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getDelete = (req, res, next) => {
  const audId = req.params.audioId;
  Audio.findById(audId)
  .then(audio => {
    if(audio.accountId.toString() !== req.account._id.toString()) {
      return res.redirect('/view_all');
    }
    res.render('delete', {
      audio: audio,
      pageTitle: audio.title,
      hasErr: false,
      errMessage: null,
      validationErrors: []
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postDelete = (req, res, next) => {
  const audId = req.body.audioId;
  Audio.deleteOne({ _id: audId, accountId: req.account._id })
  .then(() => {
    res.redirect('/view_all');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getAll = (req, res, next) => {
  Audio.find()
  .then(audios => {
    res.render('view_all', {
      auds: audios,
      pageTitle: 'All Audio Files'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};