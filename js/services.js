app.factory('dashboardService', ['$http', function($http){
  return {
    myDashboard: function(){
      return $http.get('http://firstchair.herokuapp.com/dashboard')
    }
  }
}]);
app.factory('forecastService', ['$http', function($http){
  return {
    getForecast: function(){
      return $http.get('http://firstchair.herokuapp.com/forecast')
    }
  }
}]);
