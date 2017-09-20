//console.log('Testing User Service')
/*
angular.module('userServices',[]).config(function(){
    console.log('Testing User Service');
});*/

angular.module('userServices',[])
.factory('User', function($http){
    userFactory = {};
    userFactory.create = function(regData){
        return $http.post('/api/users', regData);
    };
    
    userFactory.checkUserName = function(regData){
        return $http.post('/api/checkusername', regData);
    };

    userFactory.checkUserEmail = function(regData){
        return $http.post('/api/checkemail', regData);
    };


    return userFactory;
});