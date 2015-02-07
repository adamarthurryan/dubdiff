'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('DocumentIndexCtrl', function ($scope, $routeParams, $http, Auth, $location) {
    $scope.documents = [];
    $scope.newDocumentTitle;

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
        //and document view page
        $location.path('/'+newDocument._id);
      });

    };

    $scope.json = function (object) { return JSON.stringify(object, null, "  "); };
 })
