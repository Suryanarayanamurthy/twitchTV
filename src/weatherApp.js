
    var app = angular.module('wApp', []);
    //using the service(factory directive) "weather service", to use the yahoo api for weather.
    app.controller('weatherController', ['$scope', 'weatherService','$q', function ($scope, weatherService,$q) {
    $scope.message = "";
        // using a promise variable to get the location coordenates asyncronesly.
        var promise = asyncGetLocation();
        //call the initial fetch when the page loads.
        fetchWeather();

// button to call the fetch weather again, uncomment below code and the button in html, this is mainly used during development for
// explesitily calling the fetch button.// there is no point clicking the button in the actual app bcos the app will do a fetch when the user
// opens the app.
//    $scope.getLocalWeather = function(){
//        //currentLocationService.getCurrentLocation();
//        fetchWeather();
//    }
 
        // get the users location asyncronasly if resolved then use the weather service to get the json object for weather info and putin the
// variable $scope.place.  
    function fetchWeather() {
    var promise = asyncGetLocation();        
    promise.then(function(position) {
    
   var latlon = position.lat + "," + position.long;
        //get the image url on google maps.
    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
    +latlon+"&zoom=14&size=400x300&sensor=false";
        console.log("after promise return"+position.lat+" "+position.long);
    weatherService.getWeather(position.lat,position.long).then(function(data){
    $scope.place = data;
    
    }, function(reason) {
  $scope.message='Failed: ' + reason;
});
    }); 
    }

// perform asynchronous get cordenates from browser, resolve or reject the promise when appropriate.
function asyncGetLocation() {
  return $q(function(resolve, reject) {
    setTimeout(function() {
        var coord = { lat:""  ,
                      long:"" };
      if (navigator.geolocation) {
          
          navigator.geolocation.getCurrentPosition(function(position){
              coord.lat =position.coords.latitude;
              coord.long =position.coords.longitude;
              console.log("b4 if"+coord);
               if(coord.lat != 0 && coord.long != 0){
                resolve(coord);
                console.log(coord);
          }
          else reject("Geolocation is not supported by this browser.");
           });
         } else {
        reject("Geolocation is not supported by this browser.");
      }
    }, 1000);
  });
}
}]);


//select * from weather.forecast where woeid in (SELECT woeid FROM geo.placefinder WHERE text="52.4849956,13.4379836" and gflags="R") and u = 'c'
// once we have the lat and long of the user, get the jason object by calling yql query:
//"select * from weather.forecast where woeid in (SELECT woeid FROM geo.placefinder WHERE text="52.4849956,13.4379836" and gflags="R") and u = 'c'",
//(offcoarse the lat and long is substituded with the newly obtained, lat and long dynamically).
    app.factory('weatherService', ['$http', '$q', function ($http, $q){
    function getWeather (lat,long) {
    var deferred = $q.defer();
    $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.placefinder%20WHERE%20text%3D%22"+lat+"%2C"+long+"%22%20and%20gflags%3D%22R%22)%20and%20u%20%3D%20'c'&format=json&callback=").success(function(data){
    deferred.resolve(data.query.results.channel);
    }).error(function(err){
    console.log('Error retrieving markets');
    deferred.reject(err);
    });
    return deferred.promise;
    }
    return {
    getWeather: getWeather
    };
    }]);