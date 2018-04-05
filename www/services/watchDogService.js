(function () {

    var app = angular.module('carcare');

    app.service("watchdog", ['$timeout', '$http', '$q', 'utils', function ($timeout, $http, $q, utils) {
        var gcmStatus=false;
        var watchDogData = [];
        var pointmarkers = [];
        var appLoadStatus = true;
        var watchDogDataLength = 0;
        var markerArray = [];
        var fairCount = 0;
        var geofenceCount = 0;
        var stopCount = 0;
        var speedingCount = 0;
        var hubData=[];
        var drawCircleArray=[];
        
        this.loadMap = function(){
            var defer = $q.defer();
           
            if (window.plugin) {
                    // org.apache.cordova.statusbar required
                    var div = document.getElementById("map_canvas");
                    if (div) {
                        // Initialize the map view
                        var LatLong = new plugin.google.maps.LatLng(23.349677, 78.468821);
                        var map = plugin.google.maps.Map.getMap(div, {
                            'camera': {
                                'latLng': LatLong,
                                'zoom': 4
                            }
                        });

                        mapDiv = map;
                        mapDiv.on(plugin.google.maps.event.MAP_READY,function(){

                               utils.loaderHide();
                               defer.resolve();
                 
                        });
                    }
                }
             return defer.promise;     
        }
        this.getWatchDogDetails = function () {
            var data = {};
            data.watchDogData = watchDogData;
            data.fairCount = fairCount;
            data.geofenceCount = geofenceCount;
            data.stopCount = stopCount;
            data.speedingCount = speedingCount;
            return data;
        }
        this.getDeviceList = function () {

            return watchDogData;
        }
        this.mapClick = function (status) {
            if (mapDiv) {
                mapDiv.setClickable(status);
            }
        }
        this.getWatchDog = function (data) {
            var defer = $q.defer();
            if (watchDogDataLength == 0) {
                utils.loaderShow();
            }
            if(!gcmStatus){
                if(utils.Gcm_id){
                  data.Gcm_id=utils.Gcm_id;
                }
            }
            $http({
                method: 'POST',
                url: utils.baseUrl+'/watchDog/getWatchDog.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: data
            }).success(function (reponse) {
                if (watchDogDataLength == 0) {
                    utils.loaderHide();
                }
                defer.resolve(reponse);
                watchDogData = reponse.watchDogData;
                if(!gcmStatus){
                   if(reponse.errorGcm==1){
                      gcmStatus=true;   
                   }
                }
                
                hubData = reponse.hubData;
                

            }).error(function () {

                defer.reject();
            });
            return defer.promise;
        }
        this.hubDraw= function(){
            this.removeHub();  
            for(var i=0; i<hubData.length;i++){

                  this.drawCircle(hubData[i].Latitude,hubData[i].Longitude,hubData[i].Radius,hubData[i].Hub_name);
            }
        }
        this.hubSetVisible=function(Boolean){

            for(var i=0; i<drawCircleArray.length;i++){

                 drawCircleArray[i].setVisible(Boolean);
            }
        }
        this.removeHub=function(){

            for(var i=0; i<drawCircleArray.length;i++){

                 drawCircleArray[i].remove();
            }
        }
        this.drawCircle = function (lat, lng,radius,Hub_name) {

                var GOOGLE = { "lat": lat, "lng": lng };
                mapDiv.addCircle({
                    'center': GOOGLE,
                    'radius': radius,
                    'strokeColor': '#AA00FF',
                    'strokeWidth': 2,
                    'fillColor': '#880000',
                    'Hub_name':Hub_name
                }, function (circle) {
                    drawCircleArray.push(circle);

                        /*circle.on(plugin.google.maps.event.OVERLAY_CLICK, function(overlay) {
                            
                            console.dir(circle.getCenter());
                            drawMarkerForCircle(circle.getCenter(),circle.get("Hub_name"));
                            
                            
                    });*/

                });
        }
        var hubMarker=[];
        var removeMarkerHub=function(){

           for(var i=0; i<hubMarker.length;i++){

                 hubMarker[i].remove();
            }
            hubMarker=[];    
        }
        function drawMarkerForCircle(latLong,Hub_name){
            removeMarkerHub();    
            mapDiv.addMarker({
            position: latLong,
            'title': Hub_name,
             visible:false
            }, function(marker) {
               marker.showInfoWindow();
               hubMarker.push(marker);
            });

        }
        this.getLatLngBounds = function () {
            if (pointmarkers.length > 0) {
                var latLngBounds = new plugin.google.maps.LatLngBounds(pointmarkers);
                mapDiv.animateCamera({
                    'target': latLngBounds,
                    'zoom': 7,

                });
            }
            this.hubSetVisible(true);

        }
        this.setOnMap = function () {

            fairCount = 0;
            geofenceCount = 0;
            stopCount = 0;
            speedingCount = 0;
            pointmarkers = [];
            if (watchDogDataLength == 0 || markerArray.length == 0 || watchDogDataLength != watchDogData.length) {
                appLoadStatus = true;
                if (markerArray.length > 0) {
                    for (var i = 0; i < markerArray.length; i++) {
                        markerArray[i].remove();
                    }
                    markerArray = [];
                }
            }
            watchDogDataLength = watchDogData.length;
            for (var i = 0; i < watchDogDataLength; i++) {


                if (appLoadStatus) {

                    this.setOnMapLoad(watchDogData[i]);

                } else {
                    // this.setOnMapLoad(watchDogData[i]);
                    this.setOnMapAfterLoad(watchDogData[i], i);
                }


            }
            if(appLoadStatus){
                 this.getLatLngBounds();
            }
            appLoadStatus = false;
           

        }

        this.setOnMapLoad = function (data) {

            data.Latitude;
            data.Longitude;
            data.Speed;
            data.Geofence;
            data.Direction;
            console.dir(data);
            //mapDiv
            var MarkerLatLong = new plugin.google.maps.LatLng(data.Latitude, data.Longitude);
            pointmarkers.push(MarkerLatLong);
            var catagory = this.getCatagory(data.Speed, data.Geofence);
            var content = this.getInfoWindow(data);
            //var hours = service.getDifference(data.Date_Time);
            var hours = 0;
            var dir = (data.Direction).toLowerCase();
            if (dir == "") {

                dir = "s";
            }
            mapDiv.addMarker({
                'position': MarkerLatLong,
                'title': content,
                'markerType': catagory,
                'visible': false,
                'dir': dir,
                'hours': hours

            }, function (marker) {
                var catagory = marker.get("markerType");
                var dir = marker.get("dir");
                //var hours = marker.get("hours");
                var width = 48;
                var height = 48;
                if (hours >= 1) {
                    width = 44
                    height = 58;

                }
                //marker.showInfoWindow();
                var icon = './markers/' + catagory + '/' + catagory + '_' + dir + '.png';
                //var icon = service.getTimeMarker(hours, icon);
                marker.setIcon({
                    'url': icon
                    , 'size': {
                        width: width,
                        height: height
                    }
                });
                marker.addEventListener("click", function () {
                    // marker.get("myMsg");
                    marker.showInfoWindow()
                });
                marker.setVisible(true);
                markerArray.push(marker);


            });



        }

        this.makerVisible = function (status) {

            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].setVisible(status);
            }
        }


        this.setOnMapAfterLoad = function (data, i) {

            var catagory = this.getCatagory(data.Speed, data.Geofence);
            var MarkerLatLong = new plugin.google.maps.LatLng(data.Latitude, data.Longitude);
            pointmarkers.push(MarkerLatLong);
            var content = this.getInfoWindow(data);
            markerArray[i].setPosition(MarkerLatLong);
            markerArray[i].setTitle(content);
            var dir = (data.Direction).toLowerCase();
            if (dir == "") {

                dir = "s";
            }
            if (markerArray[i].get("markerType") != catagory || markerArray[i].get("dir") != dir) {
                markerArray[i].set("markerType", catagory);
                markerArray[i].set("dir", dir);

                var icon = './markers/' + catagory + '/' + catagory + '_' + dir + '.png';
                markerArray[i].setIcon({
                    'url': icon
                    , 'size': {
                        width: 48,
                        height: 48
                    }
                });

            }

        }

        this.getDifference = function (dateTime) {

            var currDate = new Date();
            var dateTimeFormate = new Date(dateTime);

            var curDateSeconds = currDate.getTime();
            var dataDateSeconds = dateTimeFormate.getTime();
            var t_duration = curDateSeconds - dataDateSeconds;
            t_duration = t_duration / (1000 * 60 * 60);
            t_duration = t_duration.toFixed(1);

            return t_duration;

        }

        this.getInfoWindow = function (data) {
            var content = [];

            content.push("Last data : " + data.Date+" "+data.Time);
            content.push("Vehicle No : " + data.Truck_No);
            content.push("Stop since : " + data.S_date + " " + data.S_time);
            content.push("Speed : " + data.Speed);

            if (data.Ign_1) {
                var mode = "ON";
                if (data.Ign_1 == 0) {
                    mode = "OFF";
                }
                content.push("Ignition : " + mode);
            }

            if (data.Ac_status) {
                var mode = "ON";
                if (data.Ac_status == 0) {
                    mode = "OFF";
                }
                content.push("AC : " + mode);
            }
            /*if (data.Mobile_no != "") {
                content.push("Mobile No.: " + data.Mobile_no);
            }*/
            content = content.join("\n");
            return content;
        }

        this.getCatagory = function (speed, geofence) {
            var Speedlimit = 60;

            if (speed <= Speedlimit && geofence == "Right" && speed >= 4) {
           // if (speed <= Speedlimit && speed >= 4) {

                fairCount++;
                return "fair";
            }
            if (geofence != "Right") {

                geofenceCount++;
                return "geo";
            }
            if (speed < 4) {

                stopCount++;
                return "idle";
            }
            if (speed > Speedlimit) {

                speedingCount++;
                return "speed";
            }

        }

        


    }]);

})();
