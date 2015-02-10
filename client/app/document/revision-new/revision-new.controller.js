'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentRevisionNewCtrl', function ($scope, $routeParams, $http, Auth, $location, App) {
    $scope.App = App;
    $scope.title = '';
    $scope.subtitle = '';

    $scope.revision = {};

    $scope.stateOptions = ['first draft', 'final draft', 'first edit', 'final edit'];

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn; 

    var path = '/api/documents/' + $routeParams.id;
    $http.get(path).success(function(document) {
      $scope.document = document;
      $scope.revision = angular.copy(document.currentRevision);
      $scope.title = document.title;
      $scope.subtitle = 'new revision';
    });


    $scope.saveRevision = function() {
      //save the revision to the document
      $http.post('/api/documents/'+$routeParams.id+'/revisions', $scope.revision)
      .success(function(newRevision) {
        //and redirect to the revision view page
        $location.path('/'+$routeParams.id+'/revision/'+newRevision._id);
      });
    };

  })
