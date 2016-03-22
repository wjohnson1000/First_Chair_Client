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
  token = window.location.search.substr(window.location.search.indexOf('=') + 1);
  if(token.length > 0){
    localStorage.setItem('token', token);
    console.log('hello from dashboard');
  }
}]);
app.controller('route', ['$scope', '$http', '$location', '$window', 'routeService', function($scope, $http, $location, $window, routeService){
  console.log('hello from route');
  $scope.traveltimes = [6160, 6170, 6180, 6190];
  $scope.snowfall = [0, 4, 8, 12];
//  $scope.routeData = routeService.getRouteData();
  var width = 700,
      height = 400,
      padding = 100;
  var snow_vis = d3.select(".graph").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("padding", padding);
  var nodes = [{x: 30, y: 50},
              {x: 50, y: 80},
              {x: 200, y: 120}]
  var links = [
    {source: nodes[0], target: nodes[1]},
    {source: nodes[2], target: nodes[1]}
  ]
  var x_domain = d3.extent(nodes, function(d) { return d.x; }),
      y_domain = d3.extent(nodes, function(d) { return d.y; });
  snow_vis.selectAll("circle .nodes")
    .data(nodes)
    .enter()
    .append("svg:circle")
    .attr("class", "nodes")
    .attr("cx", function(d) {return d.x; })
    .attr("cy", function(d) {return d.y; })
    .attr("r", "10px")
    .attr("fill", "steelblue")

  snow_vis.selectAll(".line")
    .data(links)
    .enter()
    .append("line")
    .attr('class', 'link')
    .attr("x1", function(d) { return d.source.x })
    .attr("y1", function(d) { return d.source.y })
    .attr("x2", function(d) { return d.target.x })
    .attr("y2", function(d) { return d.target.y })
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
            .text("Delay");

       snow_vis.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (width/2) +","+(height-(padding/3))+")")
            .text("Snowfall");
}]);

app.controller('addroute', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
  console.log('hello from addroute');
}]);
app.controller('settings', ['$scope', 'routeService', '$http', '$location', '$window', function($scope, $http, $location, $window){
  console.log('hello from settings');
}]);
