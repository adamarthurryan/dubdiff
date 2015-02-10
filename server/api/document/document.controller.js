/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /documents              ->  index
 * POST    /documents              ->  create
 * GET     /documents/:id          ->  show
 * PUT     /documents/:id          ->  update
 * DELETE  /documents/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Document = require('./document.model');
var Revision = require('./revision.model');
var wdiff = require('../../components/wdiff');
var mongoose = require('mongoose');


// Get a list of all documents
exports.index = function(req, res) {
  Document
    .find()
    .populate('owner', '_id name')
    .populate('currentRevision', '_id state created')
    .populate('revisions', '_id state created description')
    .exec(function (err, documents) {
      if(err) { return handleError(res, err); }
      return res.json(200, documents);
    });
};

// Get a list of all documents
exports.indexForUser = function(req, res) {
  Document
    .find({owner: req.params.userid})
    .populate('owner', '_id name')
    .populate('revisions', '_id state created description')
    .populate('currentRevision', '_id state created')
    .exec(function (err, documents) {
      if(err) { return handleError(res, err); }
      return res.json(200, documents);
    });
};

// Get a single document
exports.show = function(req, res) {
  Document
    .findById(req.params.id)
    .populate('owner', '_id name')
    .populate('currentRevision', '_id state created description content')
    .populate('revisions', '_id state created description')
    .exec(function (err, document) {
      if(err) { return handleError(res, err); }
      if(!document) { return res.send(404); }
      return res.json(document);
    });
};

// Creates a new document with the current user as owner
exports.create = function(req, res) {
  //we do not allow the api client to change the owner willy-nilly!
  //can this be set in the schema somehow?
  if (req.body.owner) { delete req.body.owner; }

  //nor document id
  if (req.body._id) { delete req.body._id; }

  //the client cant add revisions either
  if (req.body.revisions) { delete req.body.revisions; }
  if (req.body.currentRevision) { delete req.body.currentRevision; }

  //add the current user to the document object
  var document = _.merge(req.body, {owner: req.user._id});


  //and add to the db
  Document.create(document, function(err, document) {
    if(err) { return handleError(res, err); }

    //create an initial, empty revision
    var revision = {document: document, status: 'empty', content:''};
    Revision.create(revision, function(err, revision) {
      if(err) { return handleError(res, err); }

      //then add that revision back to the document
      document.currentRevision = revision;
      document.revisions = [revision];

      //save the document and return
      document.save(function (err, document) {
        if(err) { return handleError(res, err); }
          return res.json(201, document);
      });
    });
  });
};

/*
// Updates an existing document in the DB.
exports.update = function(req, res) {
  //we don't allow the id to be updated 
  //!!! do we even need to worry about this? Prolly not!
  if(req.body._id) { delete req.body._id; }

  //??? should we allow the revisions to be updated here? Prolly not
  if (req.body.revisions) { delete req.body.revisions; }

  Document.findById(req.params.id, function (err, document) {
    if (err) { return handleError(res, err); }
    if(!document) { return res.send(404); }

    // require user authentication
    if (! mongoose.Types.ObjectId(document.owner).equals(req.user._id))
      {return res.send(401);}

    //do it
    var updated = _.merge(document, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, document);
    });
  });
};
*/

// Deletes a document from the DB.
exports.destroy = function(req, res) {
  Document.findById(req.params.id, function (err, document) {
    if(err) { return handleError(res, err); }
    if(!document) { return res.send(404); }

    // require user authentication
    if (! mongoose.Types.ObjectId(document.owner).equals(req.user._id))
      {return res.send(401);}

    //do it
    document.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Get a list of all revisions for a document
exports.indexRevisionsForDocument = function(req, res) {
  Revision
    .find({document: req.params.id})
    .populate('owner', '_id name')
    .populate('document', '_id title currentRevision')
    .exec(function (err, revisions) {
      if(err) { return handleError(res, err); }
      if(!revisions) { return res.send(404); }

      return res.json(200, revisions);
    });
};

// Show a revision by id
exports.showRevision = function(req, res) {
  Revision
    .findById(req.params.revisionid)
    .populate('owner', '_id name')
    .populate('document', '_id title currentRevision')
    .populate('document.revisions', '_id')
    .exec(function (err, revision) {
      if(err) { return handleError(res, err); }
      if(!revision) { return res.send(404); }

      //ensure this revision actually belongs to the specified document
      if (! mongoose.Types.ObjectId(revision.document._id).equals(req.params.id))
        {return res.status(403).send("Mismatch between revision id and document id.");}

 
      // ??? require user authentication
      //if (! mongoose.Types.ObjectId(document.owner).equals(req.user._id))
      //  {return res.send(401);}

      return res.json(revision);     
  });
};

// Create a new revision and add it to a document (with the current user as owner)
// This can only be performed by the user who owns the document
exports.createRevision = function(req, res) {
  //we do not allow the api client to change the owner willy-nilly!
  //can this be set in the schema somehow?
  if (req.body.owner) { delete req.body.owner; }

  //similarly the document
  if (req.body.document) { delete req.body.document; }

  //and the date
  if (req.body.created) { delete req.body.created; }

  //and the id!
  if (req.body._id) { delete req.body._id; }

  console.log(req.body);

  //get the record for the parent document
  Document.findById(req.params.id).exec(function(err, document){
    if (err) { return handleError(res, err); }
    if(!document) { return res.send(404); }

    // require user authentication
    if (! mongoose.Types.ObjectId(document.owner).equals(req.user._id))
      {return res.send(401);}

    console.log('---');
    console.log(document);

    //set the owner and document fields for the revision
    var revision = _.merge(req.body, {owner: req.user, document: document});

    console.log('---');
    console.log(revision);

    //create the record
    Revision.create(revision, function (err, revision) {
      if(err) { return handleError(res, err); }
      if (!revision) {return handleError(res, "Unknown error creating revision");}

      console.log('---');
      console.log(revision);

      //and update the document
      document.revisions.push(revision);
      document.currentRevision = revision;
      document.save(function (err) {
        if (err) { return handleError(res, err); }
          return res.json(200, revision);
      });
     
    });
  });
};

//compares two revisions with wdiff
exports.wdiff = function(req, res) {
  Revision
  .findById(req.params.revisionida)
  .populate('document', 'title')
  .exec(function (err, revisiona) {
    if(err) { return handleError(res, err); }
    if(!revisiona) { return res.send(404); }


    Revision
    .findById(req.params.revisionidb)
    .populate('document', 'title')
    .exec(function (err, revisionb) {
      if(err) { return handleError(res, err); }
      if(!revisionb) { return res.send(404); }

      //??? do we care if both revisions have the same document?
      //??? if they both have the same user?
      //??? if the current user is the owner?

      wdiff(revisiona.content, revisionb.content, true, function(err, result){
        if(err) { return handleError(res, err); }

        result.a = revisiona;
        result.b = revisionb;

        res.json(result);
      });
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}