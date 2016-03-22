app.factory('dashboardService', ['$http', function($http){
  var dashData = [];
  var getDashData = function(){
    return dashData;
  }
  var saveDashData = function(dashArray){
    dashData = dashArray;
  }
  return {
    myDashboard: function(){
      return $http.get('http://firstchair.herokuapp.com/dashboard')
    },
    getDashData: getDashData,
    saveDashData: saveDashData
  }
}]);
app.factory('forecastService', ['$http', function($http){
  return {
    getForecast: function(){
      return $http.get('http://firstchair.herokuapp.com/forecast')
    }
  }
}]);
