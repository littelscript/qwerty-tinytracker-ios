(function () {

    var app = angular.module('carcare');

    app.service("utils", [ '$q','$ionicPopup', '$ionicLoading', function ( $q,$ionicPopup, $ionicLoading) {

        /* Local storage code */
        this.baseUrl="http://fleetcommando.com/fleetcommandoApp";
        this.Gcm_id =null;
        this.Device_type =null;
        this.Serial_no =null;
        var userData=null;
        this.setLocalStorage = function (key, value) {
        
            return localStorage.setItem(key, JSON.stringify(value));
        }
        this.getLocalStorage = function (key) {
            return JSON.parse(localStorage.getItem(key));
        }
        this.destroyLocalStorage = function (key) {
            return localStorage.removeItem(key);
        }

        this.getEnvName=function(){

           return userData.Env_name;
        }
        /* Local storage code end */
        this.loaderShow = function () {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        }

        this.loaderHide = function () {

            $ionicLoading.hide();
        }

        this.showAlert = function (msg) {
            var defer = $q.defer();
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: msg
            });

            alertPopup.then(function (res) {
                // Custom functionality....
                defer.resolve();
            });
            return defer.promise;
        };

        this.showConfirm = function () {
            var defer = $q.defer();
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confrim',
                template: 'Are you sure you want to Delete?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    defer.resolve();
                } else {
                    defer.reject();
                }
            });
            return defer.promise;
        };



    }]);

})();