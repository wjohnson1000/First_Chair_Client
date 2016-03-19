var app = angular.module('firstchair', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider){
    $urlRouterProvider.otherwise('/landing');
    $stateProvider.state('landing', {
      templateUrl: 'views/landing.html',
      controller: 'landing',
      url: '/landing'
    }).state('dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboard',
      url: '/dashboard'
    })
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     '*://www.youtube.com/**'
   ]);
});
