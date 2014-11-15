var gingApp = gingApp || angular.module('gingApp');

gingApp.directive('resultsPagination', function(){
    return {
      templateUrl: 'views/_pagination.html'
    };
});
