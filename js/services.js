app.factory('dashboardService', ['$http', function($http){
  var dashData = [];
  var getDashData = function(){
    return dashData;
  }
  var saveDashData = function(dashArray){
    dashData = dashArray;
  }
  var getRoute = function(index){
    return dashData[index];
  }
  var getDelay = function(forecast){
    var delay = 0;
    var snows = dashData[0].graph_data;
    for(i=0; i<snows.length; i++){
      if (forecast == snows[i].snowfall){
        delay = snows[i].nextdaydrive - snows[0].nextdaydrive;
        return delay;
      }
      if (forecast > snows[i].snowfall && forecast <= snows[i+1].snowfall){
        delay = (snows[i + 1].nextdaydrive - snows[i].nextdaydrive) / (snows[i + 1].snowfall - snows[i].snowfall) * forecast + snows[i].nextdaydrive - snows[0].nextdaydrive;
        return delay;
      }
      if (forecast > snows[snows.length - 1].snowfall){
        delay = (snows[snows.length - 1].nextdaydrive - snows[snows.length - 2].nextdaydrive) / (snows[length - 1].snowfall - snows[snows.length - 2].snowfall) * forecast + snows[snows.length - 2].nextdaydrive - snows[0].nextdaydrive;
        return delay;
      }
    }
  }
  return {
    myDashboard: function(){
      return $http.get('http://firstchair.herokuapp.com/dashboard')
    },
    getDashData: getDashData,
    saveDashData: saveDashData,
    getRoute: getRoute,
    getDelay: getDelay
  }
}]);
app.factory('forecastService', ['$http', function($http){
  return {
    getForecast: function(){
      return $http.get('http://firstchair.herokuapp.com/forecast')
    }
  }
}]);
