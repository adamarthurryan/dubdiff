'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RevisionSchema = new Schema({
  state: String,
  //This property is denormalized for efficient querying
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now},
  description: String,
  content: String,

  document : {type: Schema.Types.ObjectId, ref: 'Document'}
});

module.exports = mongoose.model('Revision', RevisionSchema);