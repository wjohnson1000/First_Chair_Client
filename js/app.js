var app = angular.module('firstchair', ['ui.router'])
  .config(function($locationProvider, $stateProvider, $urlRouterProvider, $sceDelegateProvider){
//    $urlRouterProvider.when('/dashboard', '/dashboard?token');
    $locationProvider.html5Mode(true);
    $stateProvider.state('landing', {
      templateUrl: 'views/landing.html',
      controller: 'landing',
      url: '/'
    }).state('dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboard',
      url: '/dashboard'
    }).state('dashboardauth', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboard',
      url: '/dashboard?token'
    }).state('route', {
      templateUrl: 'views/route.html',
      controller: 'route',
      url: '/route'
    }).state('addroute', {
      templateUrl: 'views/addroute.html',
      controller: 'addroute',
      url: '/addroute'
    }).state('settings', {
      templateUrl: 'views/settings.html',
      controller: 'settings',
      url: '/settings'
    })
    $urlRouterProvider.otherwise('/');
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     '*://www.youtube.com/**'
   ]);
});
