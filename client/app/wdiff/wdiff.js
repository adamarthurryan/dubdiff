'use strict';

angular.module('markdownFormatWdiffApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/wdiff/wdiff.html',
        controller: 'WdiffCtrl'
      });
  });