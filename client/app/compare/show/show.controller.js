'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('CompareShowCtrl', function ($scope, $routeParams, $http) {
    $scope.wdiff = {};
    $scope.before = {};
    $scope.after = {};
    $scope.isShowWdiff = true;


    // if routeParams specifies a user, restrict the query to that user
    var path = '/api/compare/wdiff/' + $routeParams.id;
    $http.get(path).success(function(comparison) {
      $scope.wdiff = comparison.wdiff;
      $scope.before = comparison.a;
      $scope.after = comparison.b;
    });

    $scope.showBefore = function() {
      $scope.isShowBefore = true;
      $scope.isShowAfter = false;
      $scope.isShowWdiff = false;
    }
    $scope.showAfter = function() {
      $scope.isShowBefore = false;
      $scope.isShowAfter = true;
      $scope.isShowWdiff = false;
    }
    $scope.showWdiff = function() {
      $scope.isShowBefore = false;
      $scope.isShowAfter = false;
      $scope.isShowWdiff = true;
    }

  })
