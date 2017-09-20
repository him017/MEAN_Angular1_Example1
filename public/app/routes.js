
console.log('Testing routes configuration');
var app = angular.module('appRoutes',['ngRoute'])

// Configure Routes; 'authenticated = true' means the user must be logged in to access the route
.config(function($routeProvider, $locationProvider){

// AngularJS Route Handler
  $routeProvider
  // Route: Home 
  .when('/',{
    templateUrl:'app/views/pages/home.html'
  })
  // Route: About 
  .when('/about',{
    templateUrl:'app/views/pages/about.html'
  })
  // Route: Register
  .when('/register',{
    templateUrl   :'app/views/pages/users/register.html',
    controller    : 'regCtrl',
    controllerAs  : 'register',
    authenticated : false
  })
  // Route: Login
  .when('/login',{
    templateUrl   :'app/views/pages/users/login.html',
    controller    : 'mainCtrl',
    controllerAs  : 'main',
    authenticated : false
  })
  // Route: Logout
  .when('/logout',{
    templateUrl   :'app/views/pages/users/logout.html',
    authenticated : true
  })
  // Route: User profile
  .when('/profile',{
    templateUrl   :'app/views/pages/users/profile.html',
    authenticated : true
  })
  // Route: Facebook callback result
  .when('/facebook/:token',{
    templateUrl  :'app/views/pages/social/social.html',
    controller   : 'facebookCtrl',
    controllerAs  : 'facebook'
  })
  // Route: facebook error
  .when('/facebookerror',{
    templateUrl  :'app/views/pages/users/login.html',
    controller   : 'facebookCtrl',
    controllerAs : 'facebook'
  })

  // If user tries to access any other route, redirect to home page
  .otherwise({redirectTo:"/"});

// Required to remove AngularJS hash from URL (no base is required in index file)
  $locationProvider.html5Mode({
   enabled: true,
   requireBase: false
  });

});

// Run a check on each route to see if user is logged in or not 
//(depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
  $rootScope.$on('$routeChangeStart', function(event, next, current){    
     console.log('routeChangeStart:');
     console.log($location);
     //console.log(next.$$route);
     //console.log('authenticated:' + next.$$route.authenticated);
     if(next.$$route.authenticated){
       console.log('Needs to be authenticated');
       if(!Auth.isLoggedIn()){
         event.preventDefault();
         $location.path('/');
       }       
     }else if(!next.$$route.authenticated){
       console.log('Should not be authenticated');
        if(Auth.isLoggedIn()){
         event.preventDefault();
         $location.path('/profile');
       } 
     }else{
       console.log('Authentication Does not matter');
     }
  });

}]);
