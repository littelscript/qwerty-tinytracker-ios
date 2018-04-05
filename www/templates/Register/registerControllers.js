angular.module('carcare')

.controller('RegisterCtrl', function($scope,$state,Register,utils,$ionicPopup) {
    $scope.data={}; 
    $scope.doSomething=function(){
      $state.go('login.log');
    }    
   
    $scope.submit=function(){
      $scope.showAlertError = function() {
	
                                var alertPopup = $ionicPopup.alert({
                                  title: 'Alert',
                                  template: 'Please try again.'
                                });

                                alertPopup.then(function(res) {
                                  // Custom functionality....
                                });
                            };
      var deffer=Register.getLogin($scope.data);
        deffer.then(function(data){
               if(data.status){
                  
                utils.setLocalStorage('userDetails',data);
                if(data.row[0].Type==2){
                 
                   $state.go('app.app');
                }
                

               }else{

                   if(data.ResponseCode==2){
                     utils.showAlert("Email or Mobile no. already exists!");
                   }else{
                     utils.showAlert("Please try again!");
                   }
               }
        },function(data){

           $scope.showAlertError();
        });
    }
    
  
})
.controller('LoginCtrl', function($scope,$state,login,utils,$ionicNavBarDelegate) {
    $scope.data={};
     $scope.error=false;
    $ionicNavBarDelegate.showBar(false);
    $scope.doSomething=function(){
      $state.go('register.reg');
    } 
    console.dir(utils.getLocalStorage('userDetails'));
    if(utils.getLocalStorage('userDetails')){
                var data=utils.getLocalStorage('userDetails');
                console.dir(data);
              
                 
                 $state.go('app.app');
        
        }   
$scope.showAlertError = function() {
	
                                var alertPopup = $ionicPopup.alert({
                                  title: 'Alert',
                                  template: 'Please try again.'
                                });

                                alertPopup.then(function(res) {
                                  // Custom functionality....
                                });
                            };
    $scope.login=function(){  
        
       var deffer=login.getLogin($scope.data);
        deffer.then(function(data){
               if(data.status){
                 utils.setLocalStorage('userDetails',data);
                 //if(data.row[0].Type==2){
                     
                     $state.go('app.app');
                //}
                $scope.error=false;

               }else{
                  
                  if(data.ResponseCode==2){
                     utils.showAlert("Please register!");
                   }else{
                     $scope.error=true;
                     //utils.showAlert("Please try again!");
                   }
               }
        },function(){

          $scope.showAlertError();
        });
    }

     
    
    
    
  
});
