var app = angular.module('EventAdminApp', ['ngRoute']);
app.config(function ($routeProvider) {
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
});
