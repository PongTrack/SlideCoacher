var app = angular.module('web', ['ngRoute', 'chart.js']);

/*
angular.module('controllers', [])
    .controller('myCtrl', [function($scope, resolvedVal) { $scope.answer = resolvedVal; }]);
*/

app.config(['$routeProvider', 'ChartJsProvider', function($routeProvider, ChartJsProvider) {
        $routeProvider
          .when('/view/:id', {
            templateUrl: 'view.html',
            controller: 'resolveCtrl',
         });
         $routeProvider
           .when('/', {
             templateUrl: 'all.html'
         });
    }]);

app.controller('MainCtrl', function($scope, $location, $rootScope, $http) {
  $scope.aa = {};
  $rootScope.all = [];
  $scope.data = [];
  $scope.labels = [];
  $http.get('all.json').then(function(success){
    if (success != null && success != undefined){
      if (success.data != null && success.data != undefined){
        var count = parseInt(success.data.All);
        for (var i = 0; i < count; i++){
          $http.get(i+1+'.json').then(function(success){
            $rootScope.all.push(success.data);
			$scope.data.push(success.data.Lost_Total / success.data.Total + 100);
			$scope.labels.push($rootScope.all.indexOf(success.data));			
          })
        }
      }
    }
  })

  $scope.goTo = function(id) {
    $location.path("/view/" + $rootScope.all.indexOf(id));
  }
	$scope.run = function(){
		$http.get('http://localhost:3000/run', { params : $scope.aa });
	}
});

app.controller('resolveCtrl', function($scope, $rootScope, $http, $routeParams, $location) {
  $scope.labels = ["LOST LEFT", "LOST RIGHT", "LOST UP", "LOST DOWN", "GOOD"];
  var actual = $scope.actual = $rootScope.all[$routeParams.id];
  if (actual != undefined){
    $scope.actual.tips = [];
	var bons = actual.Total - actual.Lost_Left - actual.Lost_Right - actual.Lost_Up - actual.Lost_Down;
    $scope.data = [actual.Lost_Left, actual.Lost_Right, actual.Lost_Up, actual.Lost_Down, bons];
    if (actual.Lost_Left / actual.Total * 100 > 15){
      $scope.actual.tips.push("Try to don't focus your view in the left side.");
    }
    if (actual.Lost_Right / actual.Total * 100 > 15){
      $scope.actual.tips.push("Try to don't focus your view in the right side.");
    }
    if (actual.Lost_Up / actual.Total * 100 > 15){
      $scope.actual.tips.push("Try to don't focus your view in the air.");
    }
    if (actual.Lost_Down / actual.Total * 100 > 15){
      $scope.actual.tips.push("Try to don't focus your view in the floor.");
    }
  } else {
    $location.path('/');
  }
  $scope.colors =  [ '#FFA474', '#F47461', '#DB4551', '#B81B34', '#79FF4D', '#949FB1', '#4D5360'];

});
