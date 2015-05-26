'use strict';

angular.module('markdownFormatWdiffApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/compare/create/create.html',
        controller: 'CompareCreateCtrl'
      })
      .when('/:id', {
        templateUrl: 'app/compare/show/show.html',
        controller: 'CompareShowCtrl'
      })
      .when('/:id/:format', {
        templateUrl: 'app/compare/show/show.html',
        controller: 'CompareShowCtrl'
      });
  });
