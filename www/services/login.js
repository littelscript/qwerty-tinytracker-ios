(function () {

    var app = angular.module('carcare');

    app.service("login", ['utils', '$q','$http', function (utils,$q,$http) {


        this.getLogin = function (data) {
            var defer = $q.defer();
            data.Gcm_id=utils.Gcm_id;
            data.Device_type =utils.Device_type;
            data.Serial_no   =utils.Serial_no;
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'/Login.php',
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