'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentRevisionNewCtrl', function ($scope, $routeParams, $http, Auth, $location) {
    $scope.revision = {};


    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn; 

    $scope.isOwner = function () {
      var currentUser = Auth.getCurrentUser();
      if (!currentUser || !$scope.revision || !$scope.revision.owner)
        return false; 

      return $scope.revision.owner._id == currentUser._id;
    };

    var path = '/api/documents/' + $routeParams.id;
    $http.get(path).success(function(revision) {
      $scope.document = document;
      $scope.revision = angular.copy(document.currentRevision);
    });


    $scope.saveRevision = function() {
      //save the revision to the document
      $http.post('/api/documents/'+$routeParams.id+'/revisions', $scope.revision)
      .success(function(newRevision) {
        //and redirect to the revision view page
        $location.path('/'+$routeParams.id+'/revision/'+newRevision._id);
      });
    };

    $scope.json = function (object) { return JSON.stringify(object, null, "  "); };
  })
