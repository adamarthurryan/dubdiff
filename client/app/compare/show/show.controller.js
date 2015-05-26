'use strict';

var MARKDOWN = "markdown";
var PLAINTEXT = "plaintext";

angular.module('markdownFormatWdiffApp')
  .controller('CompareShowCtrl', function ($scope, $routeParams, $http, $location) {
    $scope.wdiff = '';
    $scope.before = '';
    $scope.after = '';
    $scope.isShowWdiff = true;
    $scope.isMarkdownFormat = true;


    var paramFormat = $location.hash();
    if (paramFormat == "plain" || paramFormat == "plaintext")
      $scope.isMarkdownFormat = false;

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

    $scope.toggleMarkdownFormat = function() {
      if ($scope.isMarkdownFormat) {
        $scope.isMarkdownFormat = false;
        $location.hash('plaintext');
        $location.replace();
      }
      else {
        $scope.isMarkdownFormat = true;
        $location.hash('markdown');
        $location.replace();
      }
    }

  })
