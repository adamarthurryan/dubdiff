'use strict';

angular.module('markdownFormatWdiffApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/document/index/index.html',
        controller: 'DocumentIndexCtrl'
      })
      .when('/user/:userid', {
        templateUrl: 'app/document/index/index.html',
        controller: 'DocumentIndexCtrl'
      })
      .when('/:id', {
        templateUrl: 'app/document/show/show.html',
        controller: 'DocumentShowCtrl'
      })
      .when('/:id/revision/new', {
        templateUrl: 'app/document/revision-new/revision-new.html',
        controller: 'DocumentRevisionNewCtrl'
      })
      .when('/:id/revision/:revisionid', {
        templateUrl: 'app/document/revision/revision.html',
        controller: 'DocumentRevisionCtrl'
      })
      .when('/wdiff/:revisionida/:revisionidb', {
        templateUrl: 'app/document/wdiff/wdiff.html',
        controller: 'DocumentWdiffCtrl'
      });

  })
  .factory('App', function ($window, Auth) {
    var root = {};
    
    root.json = function (object) { 
      return JSON.stringify(object, null, "  "); 
    };    

    //returns true if this revision is the current revision in its document
    root.isCurrent = function (revision) {
      if (!revision)
        return false;

      return revision._id == revision.document.currentRevision;
    };

   //returns true if this revision is the first revision in its document
   // Note: documents have an initial empty sentinel revision - that is the zeroth revision
    root.isFirst = function (revision) {
      if (!revision)
        return false;

      if (revision.document.revisions.length <= 1)
        return true;

      return revision._id == revision.document.revisions[1];
    };

    //returns true if the current user is logged in and is the owner of this document / revision
    root.isOwner = function (document) {
      var currentUser = Auth.getCurrentUser();
      if (!currentUser || !document || !document.owner)
        return false; 

      return document.owner._id == currentUser._id;
    }

    //looks up this revision in the document revisions list
    //and returns the previous revision
    //if this is the oldest revision, then just return itself
    root.previousRevision = function (document, revision) {
      //find the index of the revision in documents
      var index = _.findIndex(document.revisions, '_id');
      var prevIndex = index-1;
      if (prevIndex < 0)
        prevIndex = 0;

      return document.revisions[prevIndex];
    }
    //looks up this revision in the document revisions list
    //and returns the previous revision
    //if this is the oldest revision, then just return itself
    root.nextRevision = function (document, revision) {
      //find the index of the revision in documents
      var index = _.findIndex(document.revisions, '_id');
      var prevIndex = index+1;
      if (prevIndex >= document.revisions.size())
        prevIndex = document.revisions.size()-1;

      return document.revisions[prevIndex];
    }


    return root;
  });