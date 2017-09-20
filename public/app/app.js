
//console.log('Testing user application ');
angular.module('userApp',['appRoutes',
                          'userControllers', 'mainController',
                          'userServices', 'authServices',
                          'ngAnimate'])

.config(function($httpProvider){
   $httpProvider.interceptors.push('AuthInterceptors');
});                          


