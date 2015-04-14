'use strict';

angular.module('markdownFormatWdiffApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'btford.markdown'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise ({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
