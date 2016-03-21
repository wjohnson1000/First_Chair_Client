var app = angular.module('firstchair', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider){
    $urlRouterProvider.otherwise('/');
//    $urlRouterProvider.when('/dashboard', );
    $stateProvider.state('landing', {
      templateUrl: 'views/landing.html',
      controller: 'landing',
      url: '/'
    }).state('dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboard',
      url: '/dashboard&token'
    }).state('route', {
      templateUrl: 'views/route.html',
      controller: 'route',
      url: '/route/:id'
    }).state('addroute', {
      templateUrl: 'views/addroute.html',
      controller: 'addroute',
      url: '/addroute'
    }).state('settings', {
      templateUrl: 'views/settings.html',
      controller: 'settings',
      url: '/settings'
    })
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     '*://www.youtube.com/**'
   ]);
});
