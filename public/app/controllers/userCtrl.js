console.log('Testing User Controller');
/*angular.module('userControllers',[]).config(function(){
    console.log('Testing User Controller');
})*/

angular.module('userControllers',['userServices'])
.controller('regCtrl', function($http, $location, $timeout, User){
   //console.log('Testing Registration Controller');
   var app = this;
   this.regUser = function(regData){
       //console.log('Testing regUser Function');
       //console.log(this.regData);
       app.loading  = true;
       app.errorMsg = false;
       // $http.post('/api/users',this.regData).then(function(data){
        User.create(app.regData).then(function(data){
          console.log('success:'+data.data.success);
          console.log('message:'+data.data.message);
          app.loading  = false;
          if(data.data.success){
            app.successMsg = data.data.message;
            //Redirect to Home page after 2 sec wait
            $timeout(function(){
              $location.path('/');
            }, 2000);
            //Redirect to Home page
            //$location.path('/');
          }else{
            app.errorMsg  = data.data.message;
          }
       });
   };

  this.checkUserName = function(regData){
    console.log('Testing checkUserName Function');
    app.checkingUserName = true;
    app.usernameMsg      = false;
    app.usernameInvalid  = false;
     User.checkUserName(app.regData).then(function(data){
       console.log(data);
       app.checkingUserName = false;
       app.usernameMsg     = data.data.message;   
       app.usernameInvalid = !(data.data.success);
       console.log('usernameInvalid:'+app.usernameInvalid);
     });
  };

  this.checkUserEmail = function(regData){
    console.log('Testing checkUserEmail Function');
    app.checkingUserEmail = true;
    app.useremailMsg      = false;
    app.useremailInvalid  = false;
     User.checkUserEmail(app.regData).then(function(data){
       console.log(data);
       app.checkingUserEmail = false;
       app.useremailMsg      = data.data.message;   
       app.useremailInvalid  = !(data.data.success);
     });
  }
})

// Custom directive to check matching passwords
.directive('match', function() {
    return {
        restrict: 'A', // Restrict to HTML Attribute
        controller:function($scope){
          $scope.confirmed = false;
          $scope.doConfirm = function(values){
            //console.log(values);
            //console.log($scope.confirm);
            // Run as a loop to continue check for each value each time key is pressed
            values.forEach(function(ele){
              // Check if inputs match and set variable in $scope
             // console.log(ele);
             // console.log($scope.confirm);
              if ($scope.confirm == ele) {
                 $scope.confirmed = true; // If inputs match
              } else {
                 $scope.confirmed = false; // If inputs do not match
              }
            });
          };
        },
        link : function(scope, element, attrs){
          // Grab the attribute and observe it    
           attrs.$observe('match', function(){
             scope.matches = JSON.parse(attrs.match);
             console.log('observe match:' + scope.matches);
             scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other
           });
            // Grab confirm ng-model and watch it  
           scope.$watch('confirm', function(){             
             scope.matches = JSON.parse(attrs.match);
             console.log('watch confirm:' + scope.matches);
             scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other
           });
        }
    };  
})    


.controller('facebookCtrl', function($routeParams, Auth, $location, $window){
   console.log('testing facebook controller');
   var app = this;
   if($window.location.pathname() == '/facebookerror'){
       app.errorMsg = 'Facebook email not found in db';
   } else{
     console.log($routeParams.token);
     Auth.facebook($routeParams.token);
     $location.path('/');
   }
});
