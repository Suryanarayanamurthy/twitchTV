
    var app = angular.module('twitchApp', []);
    
app.controller('twitchController',[ '$scope','twitchTVservice', function($scope,twitchTVservice){
    
}]);

app.factory('twitchTVservice',function($q){
    return{
        twitchTVservice:twitchTVservice;
    };
});