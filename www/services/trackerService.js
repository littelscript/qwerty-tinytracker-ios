(function () {

    var app = angular.module('carcare');

    app.service("trackerService", ['$timeout', '$http', '$q', 'utils', function ($timeout, $http, $q, utils) {
        var trackerData = [];
        this.viewTrackerData = {};
        this.playstatus = false;
        var trakerPlayTimeOut = null;
        var CurrentLocation;
        this.clearTrackerData =function(){

            trackerData=[];
            this.viewTrackerData.status=true;
            this.clearPolylineArray();
            this.clearStartEndMarkerArray();
        }
        
        this.getTracker = function (data) {
            
            var defer = $q.defer();
            trackerData = [];
            utils.loaderShow();
            $http({
                method: 'POST',
                url: utils.baseUrl+'/tracker/getTracker.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {

                console.dir(reponse.tracker);
                if (reponse.tracker.length > 0) {
                    trackerData = sorting(angular.copy(reponse.tracker));
                    
                }
                
                utils.loaderHide();
                console.dir(trackerData);
                defer.resolve(trackerData);
            }).error(function () {
                utils.loaderHide();
                defer.reject();
            });
            return defer.promise;
        }

        var sorting = function (arrayData) {

            arrayData.sort(function (x, y) {
                a = (new Date(x.Dt_device)).getTime();
                b = (new Date(y.Dt_device)).getTime();

                return a < b ? -1 : a > b ? 1 : 0;
            });
            return arrayData;
        }
        this.index = 2;
 
        this.rangeSlider = function (start, index) {
            this.index = index;
            this.drawPolyLine();
            return [trackerData[0].Dt_device, trackerData[index - 1].Dt_device]
        }
        var startEndMarkerArray=[];
        this.startMarker=function(){
                 var MarkerLatLong = new plugin.google.maps.LatLng(trackerData[0].Latitude, trackerData[0].Longitude);
                 var content = this.getInfoWindow(trackerData[0],"Start point");
                 mapDiv.addMarker({
                'position': MarkerLatLong,
                 'title': content,
                //'markerType': catagory,
                'visible': true,
                //'dir': dir,
                //'hours': hours

            }, function (marker) {

                startEndMarkerArray.push(marker);
            });

        }
        this.endMarker=function(){
                  var MarkerLatLong = new plugin.google.maps.LatLng(trackerData[trackerData.length-1].Latitude, trackerData[trackerData.length-1].Longitude);
                 
                var content = this.getInfoWindow(trackerData[trackerData.length-1],"End point");
                 mapDiv.addMarker({
                'position': MarkerLatLong,
                'title': content,
               // 'markerType': catagory,
                'visible': true,
                //'dir': dir,
                //'hours': hours

            }, function (marker) {

                startEndMarkerArray.push(marker);
            });

        }

         this.getInfoWindow = function (data,type) {
            var content = [];
            content.push(type);
            
            content = content.join("\n");
            return content;
        }


        var polylineArray = [];
       
        this.drawPolyLine = function () {

            var dataPointTracker = [];
            var cameraanimate = [];
            this.viewTrackerData.totalDistance = 0;
            this.viewTrackerData.maxSpeed = 0;
            var distance = 0;
            this.clearPolylineArray();
            var averageCount = 0;
            var totalSpeed = 0;
            this.viewTrackerData.averageSpeed = 0;
            this.viewTrackerData.stopDuration = 0;
            var totalTime = 0;
            this.viewTrackerData.totalDuration="00:00:00";
            this.viewTrackerData.stopDuration ="00:00:00";
            var trackerDataLength = trackerData.length;
            var totalDuration=0;
            if(trackerDataLength>0){
                this.viewTrackerData.startDateTime = trackerData[0].Dt_device;

                this.viewTrackerData.endDateTime = trackerData[trackerDataLength-1].Dt_device;

               totalDuration= parseInt(new Date(trackerData[trackerDataLength-1].Dt_device).getTime()) -parseInt(new Date(trackerData[0].Dt_device).getTime() );
            }
            this.viewTrackerData.totalDuration = toHHMMSS((totalDuration / (1000)));  


            
            
            
            for (var i = 0; i < trackerData.length; i++) {
                dataPointTracker.push({ "lat": trackerData[i].Latitude, "lng": trackerData[i].Longitude });
                
                cameraanimate.push(new plugin.google.maps.LatLng(trackerData[i].Latitude, trackerData[i].Longitude));
                
               
                if (i > 1 && i < (trackerData.length - 1)) {

                    distance = distance + parseFloat(this.getDistance(trackerData[i].Latitude, trackerData[i].Longitude, trackerData[i + 1].Latitude, trackerData[i + 1].Longitude));
                }
                trackerData[i].Speed=parseInt(trackerData[i].Speed);
                if (trackerData[i].Speed > this.viewTrackerData.maxSpeed ) {
                    if(trackerData[i].Speed>3){
                        this.viewTrackerData.maxSpeed = trackerData[i].Speed;
                    }
                }
                if (trackerData[i].Speed > 3) {
                    averageCount++;
                    totalSpeed = totalSpeed + trackerData[i].Speed;

                }
                if (trackerData[i].Speed <4) {

                    if (i > 0) {
                        totalTime = totalTime + parseInt(new Date(trackerData[i].Dt_device).getTime() )- parseInt(new Date(trackerData[i - 1].Dt_device).getTime());
                    }
                }

            }
            var average = 0;
            if (averageCount > 0 && totalSpeed > 0) {
                average = totalSpeed / averageCount;
            }
            
            
            this.viewTrackerData.averageSpeed = average.toFixed(2);
            this.viewTrackerData.totalDistance = distance.toFixed(2);
            var time = toHHMMSS((totalTime / (1000)));  
            this.viewTrackerData.stopDuration =time;
            //this.viewTrackerData.stopDuration = (totalTime / (1000 * 60 * 60)).toFixed(2);
            this.viewTrackerData.averageSpeed = average.toFixed(2);
            this.viewTrackerData.totalDistance = distance.toFixed(2);

            mapDiv.addPolyline({
                'points': dataPointTracker,
                'color': "green",
                'width': 3
                //'geodesic': true
            }, function (polyline) {
                polylineArray.push(polyline);
                var latLngBounds = new plugin.google.maps.LatLngBounds(cameraanimate);
                mapDiv.animateCamera({
                    'target': latLngBounds,
                    'zoom': 11,

                },function(data){
                         console.dir(data);
                });
            });

        }
        function toHHMMSS(seconds) {
            var sec_num = parseInt(seconds, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            var time    = hours+':'+minutes+':'+seconds;
            return time;
        }
        this.timeForLoop=1000;
        this.getTimeOut = function () {
               
            trakerPlayTimeOut = $timeout((function () {
                this.play();

            }.bind(this)), this.timeForLoop);
        }

        this.play = function () {
            if (trakerPlayTimeOut) {
                $timeout.cancel(trakerPlayTimeOut);
            }
            this.getTimeOut();
            dataPointTracker = [];
            var center;
            var distance = 0;
            this.viewTrackerData.totalDistance = 0;
            this.viewTrackerData.maxSpeed = 0;
            var averageCount = 0;
            var totalSpeed = 0;
            this.viewTrackerData.averageSpeed = 0;
            this.viewTrackerData.stopDuration = 0;
            var totalTime = 0;
            var totalDuration=0;
            var trackerDataLength = trackerData.length;
            if(trackerDataLength>0){
                this.viewTrackerData.startDateTime = trackerData[0].Dt_device;

            }
             
            var center=null;
            for (var i = 0; i < this.index; i++) {
                dataPointTracker.push({ "lat": trackerData[i].Latitude, "lng": trackerData[i].Longitude });
                //cameraanimate.push(new plugin.google.maps.LatLng(data[i].Latitude, data[i].Longitude));
                center = new plugin.google.maps.LatLng(trackerData[i].Latitude, trackerData[i].Longitude);
               center = {
      lat: trackerData[i].Latitude,
      lng: trackerData[i]. Longitude
    };
                
                this.viewTrackerData.Dt_device = trackerData[i].Dt_device;
                if (i > 1 && i < (trackerData.length - 1)) {

                    distance = distance + parseFloat(this.getDistance(trackerData[i].Latitude, trackerData[i].Longitude, trackerData[i + 1].Latitude, trackerData[i + 1].Longitude));
                }
                this.viewTrackerData.endDateTime = trackerData[i].Dt_device;
                trackerData[i].Speed=parseInt(trackerData[i].Speed);
                if (trackerData[i].Speed > this.viewTrackerData.maxSpeed ) {
                    if(trackerData[i].Speed>3){
                    this.viewTrackerData.maxSpeed = trackerData[i].Speed;
                    }
                }
                if (trackerData[i].Speed > 3) {
                    averageCount++;
                    totalSpeed = totalSpeed + trackerData[i].Speed;

                }
                if (trackerData[i].Speed <4) {

                    if (i > 0) {
                        totalTime = totalTime + (new Date(trackerData[i].Dt_device).getTime() - new Date(trackerData[i - 1].Dt_device).getTime());
                    }
                }
                
               totalDuration= parseInt(new Date(trackerData[i].Dt_device).getTime()) -parseInt(new Date(trackerData[0].Dt_device).getTime() );
               this.viewTrackerData.totalDuration = toHHMMSS((totalDuration / (1000)));

            }

            if(center){
                
                mapDiv.setCameraTarget(center);
            }
            var average = 0;
            if (averageCount > 0 && totalSpeed > 0) {
                average = totalSpeed / averageCount;
            }
            
            
            this.viewTrackerData.averageSpeed = average.toFixed(2);
            this.viewTrackerData.totalDistance = distance.toFixed(2);
            var time = toHHMMSS((totalTime / (1000)));  
            this.viewTrackerData.stopDuration =time;
            //this.viewTrackerData.stopDuration = (totalTime / (1000 * 60 * 60)).toFixed(2);
            this.viewTrackerData.averageSpeed = average.toFixed(2);
            this.viewTrackerData.totalDistance = distance.toFixed(2);

            if (this.index != trackerData.length) {
                this.index++;
            }
            this.clearPolylineArray();
            
            mapDiv.addPolyline({
                'points': dataPointTracker,
                'color': "green",
                'width': 3
                //'geodesic': true
            }, function (polyline) {
                polylineArray.push(polyline);

            });


        }
        this.pause = function () {
            this.playstatus = true;
            $timeout.cancel(trakerPlayTimeOut);
        }
        this.stop = function () {
            this.playstatus = false;
            $timeout.cancel(trakerPlayTimeOut);
            this.drawPolyLine();
            this.index = 0;

        }
        this.forward = function () {

             this.timeForLoop=this.timeForLoop-100;
             this.play();
        }
        this.review = function () {

            this.timeForLoop=this.timeForLoop+100;
            this.play();
        }
        this.clearPolylineArray = function () {
            if (polylineArray.length > 0) {
                for (var i = 0; i < polylineArray.length; i++) {
                    polylineArray[i].remove();
                }
            }
            polylineArray = [];
        }
        this.clearStartEndMarkerArray = function () {
            if (startEndMarkerArray.length > 0) {
                for (var i = 0; i < startEndMarkerArray.length; i++) {
                    startEndMarkerArray[i].remove();
                }
            }
            startEndMarkerArray = [];
        }

        this.getDistance = function (lat1, lon1, lat2, lon2) {

            if (lat1 == lat2 & lon2 == lon2) {

                return 0;
            }

            var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
            var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
            var km, kmeters;

            var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, dalt, a, c, dm, dk, mi, km, xx, d, alt, alt1, alt2, v_kmeters, dist1, dist;

            //var dcounter = p_ar.length;
            //alert(dcounter);

            miles = 0;
            kmeters = 0;
            dist = 0;




            // convert coordinates to radians
            lat1 = deg2radg(lat1);
            lon1 = deg2radg(lon1);
            lat2 = deg2radg(lat2);
            lon2 = deg2radg(lon2);

            //18.750249,73.667825

            // find the differences between the coordinates
            dlat = lat2 - lat1;
            dlon = lon2 - lon1;




            // here's the heavy lifting
            a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);


            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians

            //dm = c * Rm; // great circle distance in miles
            dk = c * Rk; // great circle distance in km



            // round the results down to the nearest 1/1000
            //mi = round(dm);
            km = roundg(dk);

            // display the result


            //miles   = miles + mi;
            //kmeters = kmeters + km;        code is commented on 18th sept. distance which we were getting was cumulative. 
            //v_kmeters = kmeters * 1000;    So now finding distance using 2 consecutive points and den considering altitude and finding proper distance. 

            v_kmeters = km * 1000; // 
            dist1 = Math.sqrt(Math.pow(v_kmeters, 2));

            dist = dist1;

            dist = dist / 1000;
            dist = parseFloat(dist);
            if (isNaN(dist)) {

                return 0;
            }
            km = dist.toFixed(2);

            //document.getElementById('r_distance').innerHTML = km;



            //alert(km);
            return km;
        }

        // convert degrees to radians
        function deg2radg(deg) {
            rad = deg * Math.PI / 180; // radians = degrees * pi/180
            return rad;

        }


        // round to the nearest 1/1000
        function roundg(x) {
            return Math.round(x * 1000) / 1000;
        }

        this.getLocationName = function (CurrentLocation) {

            var defer = $q.defer();

            var request = {
                'position': CurrentLocation
            };
            plugin.google.maps.Geocoder.geocode(request, function (results) {
                if (results.length) {
                    var result = results[0];
                    var position = result.position;
                    var address = [
                        result.subThoroughfare || "",
                        result.thoroughfare || "",
                        result.locality || "",
                        result.adminArea || "",
                        result.postalCode || "",
                        result.country || ""].join(", ");
                    defer.resolve(address);
                    
                } else {
                    //alert("Not found");
                    defer.reject();
                }
            });



            return defer.promise;



        }




    }]);

})();