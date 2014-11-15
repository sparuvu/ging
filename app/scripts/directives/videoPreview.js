var gingApp = gingApp || angular.module('gingApp');

gingApp.directive('myIframe', function(){
  return {
    restrict: 'EA',
    scope: {
      src:'&src',
    },
    template: '<iframe id="preview" height="300" width="500"></iframe>'
  };
});
