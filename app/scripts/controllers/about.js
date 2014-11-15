'use strict';

/**
 * @ngdoc function
 * @name gingApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the gingApp
 */
angular.module('gingApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
