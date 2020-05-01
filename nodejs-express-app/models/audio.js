const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const audioSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Audio', audioSchema);