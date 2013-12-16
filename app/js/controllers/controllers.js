'use strict';

/* Controllers */

var controllers = angular.module('app.controllers', []);



controllers.controller('NavBarCtrl', ['$rootScope','$scope', '$location', function($rootScope,$scope, $location) {
    

    $scope.navList = [
	  { url: '/home', title:"Home",icon:'fa fa-home fa-lg'},
	  { url: '/camera', title: 'Camera',icon :'fa fa-video-camera fa-lg'},
      { url: '/barcode', title: 'Barcode',icon :'fa   fa-barcode fa-lg'},
	  { url: '/about', title: "About",icon :'fa fa-asterisk fa-lg'}
     ];
    

	
	    
    function detectRoute() {
      	
      angular.forEach($scope.navList, function(item) {
        item.active = $location.path().match(new RegExp(item.url)) ? true : false;
      });  
	  
	  angular.forEach($scope.navListDrop, function(item) {
        item.active = $location.path().match(new RegExp(item.url)) ? true : false;
      }); 
	  
    }
    
   $scope.$on('$routeChangeSuccess', detectRoute);
  
  }]);
  