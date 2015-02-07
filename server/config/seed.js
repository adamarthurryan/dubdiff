/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Document = require('../api/document/document.model');
var Revision = require('../api/document/revision.model');
var User = require('../api/user/user.model');


var oldUser;
var testUser;
var testDocument;
var testRevisionIds = [];


Document.find({owner:null}).remove();
Revision.find({owner:null}).remove();


User.findOne({email:'test@test.com'}).exec()
  .then(function(user) {
    oldUser = user;

    console.log('removing test revisions');
    Revision.find({owner: user}).remove().exec();
    
    console.log('removing test documents');
    Document.find({owner: user}).remove().exec();

    console.log('removing test user');
    User.find({email:'test@test.com'}).remove().exec(); 
  }, function (err) { console.log('err: '+err)})

  .then(function() {
    console.log('creating test user');
    return User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    });  
  }, function (err) { console.log('err: '+err)})

  .then(function(user) {
    testUser = user;
    console.log('creating test document');
    return Document.create({
      owner: testUser,
      title: "test document",
    });
  }, function (err) { console.log('err: '+err)})

  .then(function(document) {
    testDocument = document;
    console.log('creating test revisions');
    return Revision.create({
      owner: testUser,
      state: "rough draft",
      description: "test revision a",
      content: "blah, blah, blah",
      document: testDocument
    }, {
      owner: testUser,
      state: "final draft",
      description: "test revision b",
      content: "Blah, blah, blah!",
      document: testDocument      
    }, function (err, revisionA, revisionB) {
      console.log('updating document with revisions');
      testRevisionIds = [revisionA, revisionB]; 
      testDocument.currentRevision = revisionB;
      testDocument.revisions.push(revisionA);
      testDocument.revisions.push(revisionB);
      return testDocument.save();
    });
  }, function (err) { console.log('err: '+err)})
  
  .then(function() {
    console.log('finished seeding db');
  }, function (err) { console.log('err: '+err)})
  ;