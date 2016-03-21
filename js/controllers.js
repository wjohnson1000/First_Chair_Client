app.controller('landing', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
  console.log('hello from controllers');
  $scope.login = function(){
    console.log('pressed a button');
    $window.location = "https://firstchair.herokuapp.com/callback"
  }
}]);
app.controller('dashboard', ['$scope', '$http', '$location', '$window', 'forecastService', function($scope, $http, $location, $window, forecastService){
  forecastService.getForecast().then(function(response){
    $scope.forecastData = response.data.isSnow;
    console.log($scope.forecastData);
  })
  console.log('hello from dashboard');
}]);
app.controller('route', ['$scope', '$http', '$location', '$window', 'routeService', function($scope, $http, $location, $window, routeService){
  console.log('hello from route');
  $scope.routeData = routeService.getRouteData();
}]);
app.controller('addroute', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
  console.log('hello from addroute');
}]);
app.controller('settings', ['$scope', 'routeService', '$http', '$location', '$window', function($scope, $http, $location, $window){
  console.log('hello from settings');
}]);
