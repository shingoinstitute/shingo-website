(function(){
  'use strict;'

  angular.module('app', ['ngRoute', 'angularTrix'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeController',
        templateUrl: '../admin-app/views/home.html'
      })
    	.when('/events/:id',{
      	controller: 'EventController',
      	templateUrl: '../admin-app/views/event.html'
    	})
      .otherwise({
        redirectTo: '/'
      });
  }).filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    });
})();
