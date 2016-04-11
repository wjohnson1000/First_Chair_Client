app.controller('landing', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
  $scope.login = function(){
    $window.location = "https://firstchair.herokuapp.com/callback"
  }
}]);
app.controller('dashboard', ['$scope', '$http', 'dashboardService', '$stateParams', 'logoutService', function($scope, $http, dashboardService, $stateParams, logoutService){
  token = window.location.search.substr(window.location.search.indexOf('=') + 1);
  if(token.length > 0){
    localStorage.setItem('token', token);
  }
  $scope.isSnow = false;
  $scope.noDest = true;
  $scope.hasSetHome = true;
  $scope.snowfallAlarm = dashboardService.getSnowfallAlarm();
  dashboardService.myDashboard(localStorage.getItem('token')).then(function(response){
    $scope.dashData = response.data.destinations;
    dashboardService.snowfallAlarm = response.data.snowfall_alarm;
    dashboardService.saveDashData($scope.dashData);
    response.data.set_home ? null : $scope.hasSetHome = false;
    if($scope.dashData.length > 0){
      $scope.noDest = false;
    } else {
      $scope.dashData.forEach(function(elem){
        if(elem.forecast.in > 0){
          $scope.isSnow = true;
        }
      })
    }
  })
  $scope.updateHome = function(){
    $scope.hasSetHome = true;
    var data = {
      address: $scope.address,
      city: $scope.city,
      state: $scope.state
    }
    $http({
      method: 'POST',
      url: 'http://firstchair.herokuapp.com/sethome',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': '*'
      },
      data: data
    }).then(function success(response){
        console.log(response)
    }).then(function error(err){
        if(err){
          console.error(err);
        }
    })
    
  };
  $scope.cancelHome = function(){
    $scope.hasSetHome = true;
  };
  $scope.logout = function(){
    return logoutService.logout();
  }
}]);
app.controller('route', ['$scope', '$http', '$stateParams', 'dashboardService', '$sce', 'logoutService', function($scope, $http, $stateParams, dashboardService, $sce, logoutService){
  $scope.dashData = dashboardService.getDashData();
  $scope.snowfallAlarm = dashboardService.getSnowfallAlarm();
  $scope.thisRoute = dashboardService.getRoute($stateParams.id);
  $scope.showmap = false;
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  $scope.directionstring = $scope.thisRoute.directionstring;
  $scope.delay = dashboardService.getDelay($scope.dashData[0].forecast.in);
  $scope.dateDelay = new Date($scope.delay * 60 * 1000);
  var width = 700,
      height = 500,
      padding = 100;
  var snow_vis = d3.select(".graph").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("padding", padding);
  var nodes = $scope.dashData[0].graph_data;
  var max = nodes[nodes.length - 1];
  var min = nodes[0];
  var links = [];
  function makeLinks(array){
    for(i=0; i<array.length-1; i++){
      links.push({source: array[i], target: array[i + 1]});
    }
  }
  makeLinks(nodes);
  console.log(links);
  var x_domain = d3.extent(nodes, function(d) { return d.snowfall; }),
      y_domain = d3.extent(nodes, function(d) { return d.nextdaydrive - min.nextdaydrive; });
  snow_vis.selectAll("circle .nodes")
    .data(nodes)
    .enter()
    .append("svg:circle")
    .attr("class", "nodes")
    .attr("cy", height - 3/2 * padding)
    .transition()
    .duration(500)
    .delay(1000)
    .attr("cx", function(d) {return padding + (d.snowfall / max.snowfall) * (width - 2 * padding); })
    .attr("cy", function(d) {return padding/2 + (d.nextdaydrive - max.nextdaydrive)/(min.nextdaydrive - max.nextdaydrive) * (height - 3/2*padding); })
    .attr("r", "5px")
    .attr("fill", "steelblue");

  snow_vis.selectAll(".line")
    .data(links)
    .enter()
    .append("line")
    .attr('class', 'link')
    .attr("y1", height - 3/2 * padding)
    .attr("y2", height - 3/2 * padding)
    .transition()
    .duration(500)
    .delay(1000)
    .attr("x1", function(d) { return padding + (d.source.snowfall / max.snowfall) * (width - 2 * padding) })
    .attr("y1", function(d) { return padding/2 + (d.source.nextdaydrive - max.nextdaydrive)/(min.nextdaydrive - max.nextdaydrive) * (height - 3/2*padding); })
    .attr("x2", function(d) { return padding + (d.target.snowfall / max.snowfall) * (width - 2 * padding) })
    .attr("y2", function(d) { return padding/2 + (d.target.nextdaydrive - max.nextdaydrive)/(min.nextdaydrive - max.nextdaydrive) * (height - 3/2*padding); })
    .style("stroke", "rgb(6,120,155)");
  var yScale = d3.scale.linear()
          .domain(y_domain).nice()
          .range([height - padding, padding/2]);
  var xScale = d3.scale.linear()
          .domain(x_domain)
          .range([padding, width - padding]);
  var yAxis = d3.svg.axis()
          .orient("left")
          .scale(yScale);
  var xAxis = d3.svg.axis()
          .orient("bottom")
          .scale(xScale)
       snow_vis.append("g")
            .attr("class", "axis")
            .attr("transform", "translate("+padding+",0)")
            .call(yAxis);
       snow_vis.append("g")
            .attr("class", "xaxis axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);
       snow_vis.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
            .text("Today's Drive Time Delay (min)");

       snow_vis.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
            .text("Yesterday's Snowfall (in)");
  $scope.logout = function(){
    return logoutService.logout();
  }
}]);

app.controller('addroute', ['$scope', '$http', 'dashboardService', 'logoutService', function($scope, $http, dashboardService, logoutService){
  $scope.dashData = dashboardService.getDashData();
  $scope.searchResults = []
  token = localStorage.getItem('token')
  $scope.placesearch = function(){
    $http({
      method: 'POST',
      url: 'http://firstchair.herokuapp.com/findroute',
      headers: {
        'Authorization': token,
        'Content-Type': 'text/plain',
        'Accept': '*'
      },
      data: $scope.newplace.replace(" ", "+")
    }).then(function success(response){
        console.log(response)
        $scope.searchResults = response.data.results
    }).then(function error(err){
        console.error(err);
    })
  }

  $scope.addRoute = function(route){
    $http({
      method: 'POST',
      url: 'http://firstchair.herokuapp.com/addroute',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { desty: route }
    }).then(function success(response){
      window.location.href = '/#/dashboard';
    }, function error(err){
        console.error(err);
    });
  }
  $scope.logout = function(){
    return logoutService.logout();
  }
}]);
app.controller('settings', ['$scope', '$http', 'dashboardService', 'logoutService', function($scope, $http, dashboardService, logoutService){
  $scope.alarm = dashboardService.getSnowfallAlarm();
  $scope.confirm = false;
  console.log($scope.alarm);
  $scope.setAlarm = function(value){
    dashboardService.setSnowfallAlarm(value);
    $scope.confirm = true;
  }
  $scope.dashData = dashboardService.getDashData();
  console.log('hello from settings');
  $scope.logout = function(){
    return logoutService.logout();
  }
}]);
