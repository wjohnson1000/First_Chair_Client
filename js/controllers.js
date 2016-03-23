app.controller('landing', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
  console.log('hello from controllers');
  $scope.login = function(){
    console.log('pressed a button');
    $window.location = "https://firstchair.herokuapp.com/callback"
  }
}]);
app.controller('dashboard', ['$scope', '$http', 'dashboardService', '$stateParams', function($scope, $http, dashboardService, $stateParams){
  $scope.isSnow = false;
  dashboardService.myDashboard().then(function(response){
    $scope.dashData = response.data.destinations;
    console.log($scope.dashData);
    dashboardService.saveDashData($scope.dashData);
    $scope.dashData.forEach(function(elem){
      if(elem.forecast.in > 0){
        $scope.isSnow = true;
      }
    })
  })
  token = window.location.search.substr(window.location.search.indexOf('=') + 1);
  if(token.length > 0){
    localStorage.setItem('token', token);
  }
}]);
app.controller('route', ['$scope', '$http', '$stateParams', 'dashboardService', function($scope, $http, $stateParams, dashboardService){
  $scope.dashData = dashboardService.getDashData();
  $scope.thisRoute = dashboardService.getRoute($stateParams.id);
  $scope.showmap = false;
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
    .attr("cx", function(d) {return padding + (d.snowfall / max.snowfall) * (width - 2 * padding); })
    .attr("cy", function(d) {return padding/2 + (d.nextdaydrive - max.nextdaydrive)/(min.nextdaydrive - max.nextdaydrive) * (height - 3/2*padding); })
    .attr("r", "5px")
    .attr("fill", "steelblue");

  snow_vis.selectAll(".line")
    .data(links)
    .enter()
    .append("line")
    .attr('class', 'link')
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
}]);

app.controller('addroute', ['$scope', '$http', 'dashboardService', function($scope, $http, dashboardService){
  $scope.dashData = dashboardService.getDashData();
  console.log('hello from addroute');
}]);
app.controller('settings', ['$scope', '$http', 'dashboardService', function($scope, $http, dashboardService){
  $scope.dashData = dashboardService.getDashData();
  console.log('hello from settings');
}]);
