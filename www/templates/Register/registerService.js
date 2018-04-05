angular.module("carcare")
.service("Register",function($http,$ionicLoading,$q,utils){

  this.getLogin=function(data){
     var defer = $q.defer();
    console.dir(data);

      $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
});
// $ionicLoading.hide();
    data.Gcm_id      = utils.Gcm_id;
    data.Device_type = utils.Device_type;
    data.Serial_no   = utils.Serial_no;
    $http({
            method: 'POST',
            url: 'http://fleetcommando.com/Carcare/Register.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            data: data
        }).success(function(reponse){
             $ionicLoading.hide();
             defer.resolve(reponse);
        });

        return defer.promise;

  }


});