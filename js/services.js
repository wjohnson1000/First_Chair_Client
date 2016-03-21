app.factory('routeService', ['$http', function($http){
  return {
    getRouteData: function(){
    return $http.get('http://firstchair.herokuapp.com/route')
      .then(function(response){
        console.log(response);
      }) 
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
