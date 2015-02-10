'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentWdiffCtrl', function ($scope, $routeParams, $http, Auth, App) {
    $scope.App = App;
    $scope.wdiff = '';
    $scope.title = '';
    $scope.same = false;
    $scope.revisionA = {};
    $scope.revisionB = {};

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn; 


    var path = '/api/documents/wdiff/'+$routeParams.revisionida+'/'+$routeParams.revisionidb;
    $http.get(path).success(function(result) {
      $scope.result = result;
      $scope.wdiff = result.wdiff;
      $scope.revisionA = result.a;
      $scope.revisionB = result.b;

      $scope.title = result.a.document.title;
      $scope.subtitle = "wdiff: "+result.a.created + " / " + result.b.created;
    });


  })
