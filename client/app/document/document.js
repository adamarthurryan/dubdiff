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
    root.isCurrent = function (document, revision) {
      if (!revision)
        return false;

      var cr = document.currentRevision;
      var compareId = (cr.hasOwnProperty('_id') ? cr._id : cr);
      return revision._id == compareId;
    };

   //returns true if this revision is the first revision in its document
   // Note: documents have an initial empty sentinel revision - that is the zeroth revision
    root.isFirst = function (document, revision) {
      if (!revision)
        return false;

      if (document.revisions.length <= 1)
        return true;

      var fr = document.revisions[1];
      var compareId = (fr.hasOwnProperty('_id') ? fr._id : fr);
      return revision._id == compareId;
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
      //sometimes the document will have revision ids as a separate field and sometimes it wont
      var revisionIds = document.revisions;
      if (revisionIds[0].hasOwnProperty('_id'))
        revisionIds = _.pluck(revisionIds, '_id');

      //find the index of the revision in documents
      var index = _.findIndex(revisionIds);
      var prevIndex = index-1;
      if (prevIndex < 0)
        prevIndex = 0;

      return {_id: revisionIds[prevIndex]};
    }
    //looks up this revision in the document revisions list
    //and returns the previous revision
    //if this is the oldest revision, then just return itself
    root.nextRevision = function (document, revision) {
      //sometimes the document will have revision ids as a separate field and sometimes it wont
      var revisionIds = document.revisions;
      if (revisionIds[0].hasOwnProperty('_id'))
        revisionIds = _.pluck(revisionIds, '_id');

      //find the index of the revision in documents
      var index = _.findIndex(revisionIds);
      var nextIndex = index+1;
      if (nextIndex >= document.revisions.size())
        nextIndex = document.revisions.size()-1;

      return {_id: revisionIds[nextIndex]};
    }


    return root;
  });