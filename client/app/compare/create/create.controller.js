'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('CompareCreateCtrl', function ($scope, $http, $location) {
    $scope.docA = "";
    $scope.docB = "";
    $scope.wdiff = "";
    $scope.wdiffMarkdown = "";
    $scope.displayAsMarkdown = true;

    $scope.compare = function() {
      $http.post('/api/compare',
        { a: $scope.docA, b: $scope.docB },
        {headers:{"Content-Type":"application/json"}})
      .success(function (comparison) {
        $location.path('/'+comparison._id)
      });
    };



  })
