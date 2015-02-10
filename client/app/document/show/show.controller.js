'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentShowCtrl', function ($scope, $routeParams, $http, Auth, App) {
    $scope.App = App;
    $scope.document = {};
    $scope.title = '';

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn; 

    $scope.isOwner = function () {
      var currentUser = Auth.getCurrentUser();
      if (!currentUser || !$scope.document || !$scope.document.owner)
        return false; 

      return $scope.document.owner._id == currentUser._id;
    }

    // if routeParams specifies a user, restrict the query to that user
    var path = '/api/documents/' + $routeParams.id;
    $http.get(path).success(function(document) {
      $scope.document = document;
      $scope.title = document.title;
    });

    //looks up this revision in the document revisions list
    //and returns the previous revision
    //if this is the oldest revision, then just return itself
    $scope.previousRevision = function (revision) {
      //find the index of the revision in documents
      var index = _.findIndex($scope.document.revisions, '_id');
      var prevIndex = index-1;
      if (prevIndex < 0)
        prevIndex = 0;

      return $scope.document.revisions[prevIndex];
    }

  })
