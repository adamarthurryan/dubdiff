'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentIndexCtrl', function ($scope, $routeParams, $http, Auth, $location, App) {
    $scope.App = App;
    $scope.title = 'Documents';

    $scope.documents = [];
    $scope.newDocumentTitle = '';

    $scope.getCurrentUser = Auth.getCurrentUser; 
    $scope.isLoggedIn = Auth.isLoggedIn;  

    // if routeParams specifies a user, restrict the query to that user
    var path = '/api/documents'+ ($routeParams.userid ? '/owner/'+$routeParams.userid : '');
    $http.get(path).success(function(documents) {
      $scope.documents = documents; 
    });


    $scope.createDocument = function () {
      if ($scope.newDocumentTitle == "")
        return

      //save the document
      $http.post('/api/documents', {title: $scope.newDocumentTitle})
      .success(function(newDocument) {
        $scope.documents.push(newDocument);
        //skip redirecting to document view page
        //$location.path('/'+newDocument._id);
      });

    };

 })
