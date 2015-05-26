'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('CompareCreateCtrl', function ($scope, $http, $location) {
    $scope.docA = "";
    $scope.docB = "";
    $scope.wdiff = "";
    $scope.wdiffMarkdown = "";
    $scope.isMarkdownFormat = true;

    $scope.compare = function() {
      $http.post('/api/compare',
        { a: _.escape($scope.docA), b: _.escape($scope.docB) },
        {headers:{"Content-Type":"application/json"}})
      .success(function (comparison) {
        $location.path('/'+comparison._id);
        $location.hash($scope.isMarkdownFormat?'markdown':'plaintext');
      });
    };

    $scope.toggleMarkdownFormat = function() {
      if ($scope.isMarkdownFormat) {
        $scope.isMarkdownFormat = false;
      }
      else {
        $scope.isMarkdownFormat = true;
      }
    }



  })
