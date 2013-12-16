/*jslint node: true */
'use strict';

var app  = angular.module('app', [
 'ngRoute',
 'app.filters',
 'app.services',
 'app.directives',
 'app.controllers']
 );
 

app.config(['$locationProvider','$routeProvider',   function($locationProvider,$routeProvider) {
	 
	$locationProvider.html5Mode(true);
	//$locationProvider.hashPrefix('!');
    $routeProvider.when('/', {templateUrl: 'home.html', controller: 'homeCtrl'});
    $routeProvider.when('/about', {templateUrl: 'about.html', controller: 'aboutCtrl'});
	 $routeProvider.when('/home', {templateUrl: 'home.html', controller: 'aboutCtrl'});
    $routeProvider.when('/camera', {templateUrl: 'camera.html', controller: 'cameraCtrl'});
    $routeProvider.when('/barcode', {templateUrl: 'barcode.html', controller: 'barcodeCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
	   
}]);
    
    
app.run(['$rootScope',function($rootScope){

$rootScope.alertmsg = "";

}]);


angular.element(document).ready(function() {	    
	angular.bootstrap(document, [ "app" ]); 
});

