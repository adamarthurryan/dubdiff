'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentWdiffCtrl', function ($scope, $routeParams, $http, Auth) {
    $scope.wdiff = "";
    $scope.same = false;
    $scope.revisionA = {};
    $scope.revisionB = {};

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn; 
/*
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

      return $scope.revision._id == $scope.revision.document.currentRevision._id;
    }
*/
    var path = '/api/documents/wdiff/'+$routeParams.revisionida+'/'+$routeParams.revisionidb;
    $http.get(path).success(function(result) {
      $scope.result = result;
      $scope.wdiff = result.wdiff;
      $scope.revisionA = result.a;
      $scope.revisionB = result.b;
    });

    $scope.json = function (object) { return JSON.stringify(object, null, "  "); };

  })
