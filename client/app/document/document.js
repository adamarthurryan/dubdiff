'use strict';

angular.module('markdownFormatWdiffApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/document/index/index.html',
        controller: 'DocumentIndexCtrl'
      })
      .when('/user/:userid', {
        templateUrl: 'app/document/index/index.html',
        controller: 'DocumentIndexCtrl'
      })
      .when('/:id', {
        templateUrl: 'app/document/show/show.html',
        controller: 'DocumentShowCtrl'
      })
      .when('/:id/revision/new', {
        templateUrl: 'app/document/revision-new/revision-new.html',
        controller: 'DocumentRevisionNewCtrl'
      })
      .when('/:id/revision/:revisionid', {
        templateUrl: 'app/document/revision/revision.html',
        controller: 'DocumentRevisionCtrl'
      })
      .when('/wdiff/:revisionida/:revisionidb', {
        templateUrl: 'app/document/wdiff/wdiff.html',
        controller: 'DocumentWdiffCtrl'
      });

  });