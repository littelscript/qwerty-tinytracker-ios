(function () {

    var app = angular.module('carcare');

    app.service("report", ['utils', '$q','$http', function (utils,$q,$http) {


        this.getReport = function (data) {
            var defer = $q.defer();
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'/Report/getReport.php',
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