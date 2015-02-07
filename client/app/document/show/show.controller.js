'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentShowCtrl', function ($scope, $routeParams, $http, Auth) {
    $scope.document = {};

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
    });

    $scope.json = function (object) { return JSON.stringify(object, null, "  "); };

  })
