'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ComparisonSchema = new Schema({
  created: {type: Date, default: Date.now},

  a: String,
  b: String,
});

module.exports = mongoose.model('Comparison', ComparisonSchema);
