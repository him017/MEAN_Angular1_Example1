//console.log('Main Ctrl');
angular.module('mainController',['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window){
  //  console.log('Testing Main Ctrl');
  var app    = this;
  app.loadme = false;
  $rootScope.$on('$routeChangeStart', function(){    
    if(Auth.isLoggedIn()){
       console.log('Success: User is logged in ') ;
       app.isLoggedIn = true;
       Auth.getUser().then(function(data){
         console.log(data.data.username);
         app.username = data.data.username;
         app.email    = data.data.email;
         app.loadme   = true;
      })
    }else{
      console.log('Failure: User is NOT logged in ') ;
      app.username   = '';
      app.isLoggedIn = false;
      app.loadme     = true;
    }
    if($location.hash() == '_=_') $location.hash(null);   
  });

  this.facebook = function(){
    console.log('Testing facebook function');
    console.log($window.location.host);
    console.log($window.location.protocol);
    $window.location = $window.location.protocol + '//' + 
                       $window.location.host + '/auth/facebook'
                            

  }
  
  this.doLogin = function(loginData){
       //console.log('Testing doLogin Function');
       //console.log(this.loginData);
       app.loading  = true;
       app.errorMsg = false;
        Auth.login(app.loginData).then(function(data){
          //console.log('success:'+data.data.success);
          //console.log('message:'+data.data.message);
          app.loading  = false;
          if(data.data.success){
            app.successMsg = data.data.message;
            //Redirect to about page after 2 sec wait
            $timeout(function(){
              $location.path('/about');
              app.loginData  = '';
              app.successMsg = false;
            }, 2000);
          }else{
            app.errorMsg  = data.data.message;
          }
       });
   };

  this.logout = function(){
     Auth.logout();
     $location.path('/logout');
     $timeout(function(){
      $location.path('/');
     }, 2000);
  } 
});