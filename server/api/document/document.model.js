'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DocumentSchema = new Schema({
  title: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  
  //is it necessary to have the revisions list? 
  //yes - it maintains the order
  revisions : [{ type: Schema.Types.ObjectId, ref: 'Revision' }],

  //do we need this? - current revision is just revisions[n-1] 
  currentRevision : {type: Schema.Types.ObjectId, ref: 'Revision'}
});

module.exports = mongoose.model('Document', DocumentSchema);
