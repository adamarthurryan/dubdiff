'use strict';

angular.module('markdownFormatWdiffApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/test/wdiff', {
        templateUrl: 'app/wdiff/wdiff.html',
        controller: 'WdiffCtrl'
      });
  });