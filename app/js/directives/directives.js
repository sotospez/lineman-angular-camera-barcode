'use strict';

/* Directives */


var directives = angular.module('app.directives', []);



directives.directive('menuNavbar', [ function() {
    
                 
    return {
      restrict: 'AE',
      templateUrl: 'menuNavbar.html'
    };
    
  }]);