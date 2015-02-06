'use strict';

angular.module('markdownFormatWdiffApp')
  .controller('WdiffCtrl', function ($scope, $http) {
    $scope.docA = ""; 
    $scope.docB = "";
    $scope.wdiff = "";
    $scope.wdiffMarkdown = "";
    $scope.displayAsMarkdown = true;

    $scope.compare = function() {
      $http.post('/api/wdiff', //+($scope.displayAsMarkdown ? '/markdown': ''), 
        { a: $scope.docA, b: $scope.docB }, 
        {headers:{"Content-Type":"application/json"}})
      .success(function (data) {
        if ($scope.displayAsMarkdown) {
          var markdown = data.wdiff;
          markdown = markdown.replace(/\[-/g, '<del>');
          markdown = markdown.replace(/-\]/g, '</del>');
          markdown = markdown.replace(/{\+/g, '<ins>');
          markdown = markdown.replace(/\+}/g, '</ins>');

          $scope.wdiffMarkdown = markdown; //data.markdown;
          $scope.wdiff = '';
        }
        else {

          $scope.wdiff = data.wdiff;
          $scope.wdiffMarkdown = '';
        }
      });
    };

/* courtesy some rando (doesn't work):
    function expandTextarea(id) {
      var element = document.getElementById(id);
      
      element.addEventListener('keyup', function() {
          this.style.overflow = 'hidden';
          this.style.height = 0;
          this.style.height = this.scrollHeight + 'px';
      }, false);
    }

    expandTextarea('docA');
    expandTextarea('docB');
  */

  })
