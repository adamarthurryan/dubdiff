'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentRevisionCtrl', function ($scope, $routeParams, $http, Auth) {
    $scope.revision = {};

    $scope.title = '';
    $scope.subtitle = '';

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn; 

    //returns true if the current user is logged in and is the owner of this document / revision
    $scope.isOwner = function () {
      var currentUser = Auth.getCurrentUser();
      if (!currentUser || !$scope.revision || !$scope.revision.owner)
        return false; 

      return $scope.revision.owner._id == currentUser._id;
    }

    //returns true if this revision is the current revision in its document
    $scope.isCurrent = function () {
      if (!$scope.revision)
        return false;

      return $scope.revision._id == $scope.revision.document.currentRevision;
    }

    var path = '/api/documents/'+$routeParams.id+'/revisions/' + $routeParams.revisionid;
    $http.get(path).success(function(revision) {
      $scope.revision = revision;
      $scope.title = revision.document.title;
      $scope.subtitle = $scope.isCurrent() ? " (current)":(" ("+$scope.revision.created+")");
    });

    $scope.json = function (object) { return JSON.stringify(object, null, "  "); };

  })
