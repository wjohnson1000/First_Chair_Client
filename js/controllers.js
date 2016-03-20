app.controller('landing', ['$scope', function($scope){
  console.log('hello from controllers');
  $scope.login = function(){
    $http.get("https://firstchair.herokuapp.com")
      .then(function(response){
        console.log(response)
      })
      .catch(function(error){
        console.error('could not log in')
      })
  }
}]);
