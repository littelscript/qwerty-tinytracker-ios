(function () {

    var app = angular.module('carcare');

    app.service("addDevice", ['utils', '$q','$http', function (utils,$q,$http) {


        this.addDevice = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/addDevice.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }
        this.getDevice = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/getDevice.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }

        this.updateDevice = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/updateDevice.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }

        this.deleteDevice = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/deleteDevice.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }
        this.getNotification = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/getNotification.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }

        this.updateProfile = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/updateProfile.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }

        this.getMasterDevice = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/getMasterDevice.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }

        this.addMasterDeviceNumber = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'Carcare/addMobileNumber.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }


    }]);

})();