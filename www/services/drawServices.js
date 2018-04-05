(function () {

    var app = angular.module('carcare');

    app.service("draw", ['utils', '$q','$http', function (utils,$q,$http) {


        this.addHub = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'/addHub.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {
               utils.loaderHide();
                defer.reject();
            });
            return defer.promise;
        }
        this.getHub = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'/getHub.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {
               utils.loaderHide();
                defer.reject();
            });
            return defer.promise;
        }

        /*this.updateDevice = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: 'http://fleetcommando.com/Carcare/updateDevice.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }*/

        this.deleteHub = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'/deletehub.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                utils.loaderHide();
                defer.resolve(reponse);
            }).error(function () {
                utils.loaderHide();
                defer.reject();
            });
            return defer.promise;
        }


    }]);

})();