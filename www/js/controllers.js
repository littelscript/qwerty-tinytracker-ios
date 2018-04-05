angular.module('carcare')

       .controller('carcareController', ['$ionicScrollDelegate', '$state', '$timeout', '$ionicPlatform', '$scope', 'login', 'utils',
        'watchdog', 'trackerService', 'addDevice','draw','report','$cordovaDevice',
        function ($ionicScrollDelegate, $state, $timeout, $ionicPlatform, $scope, login, utils, 
                  watchdog, trackerService, addDevice,draw,report,$cordovaDevice){
          var User_id;
          var Env_name;
          $scope.userData=[];
            //login.getLogin();
            //viewGo('watchTrack','watchdog')

           // $scope.menuItems = ['Watchdog', 'Tracker', 'Hub', 'Distance Report', 'Stoppages', 'Notifications', 'Contact Us'];

           // $scope.demoSettings ={"Devices": {"123456789": {"Name": "Sentra","OverSpeed":"80","OverspeedNoti":"true","HubNoti":"true"},"1234567889": {"Name": "Sentra","OverSpeed":"80","OverspeedNoti":"true","HubNoti":"true"}}};


            $scope.validuser = false;
            $scope.search={};

            /*if ($scope.validuser == false) {
                $scope.appView = 'login';
            }
            else {*/
                $scope.appView = 'watchTrack';
                $scope.viewSelection = 'Watchdog';
                $scope.state = 'watchdog';
                $scope.includeMenu = true;

            /*}*/
           var drawCircleArray=null;   
            
            $scope.removedrawCircle = function () {
                if(mapDiv){
                    var clickEvent = plugin.google.maps.event.MAP_CLICK;
                    //mapDiv.on(clickEvent,getCircle);
                    mapDiv.off(clickEvent,getCircle);
                    $scope.draw.Hub_name="";
                    $scope.draw.lat = "";
                    $scope.draw.lng = "";
                    if(drawCircleArray){
                        drawCircleArray.remove();
                        drawCircleArray = null;
                    }
                }
            }   
            
  
            $scope.viewGo = function (view, state) {
                $scope.appView = view;
                $scope.state = state;  // state //  change this as clicker on  marker or view set to tracker
                $scope.removedrawCircle();
                watchdog.makerVisible(false);
                watchdog.hubSetVisible(false);
                if (view == 'watchTrack' && $scope.state == 'watchdog') {
                    $scope.viewSelection = 'Watchdog';
                    $scope.includeMenu = true;
                    watchdog.makerVisible(true);
                    watchdog.getLatLngBounds();
                    watchdog.mapClick(true);
                    watchdog.makerVisible(true); 
                    trackerService.clearTrackerData();
                    watchdog.hubSetVisible(true);
                }
                else if (view == 'watchTrack' && $scope.state == 'tracker') {
                    $scope.viewSelection = 'Tracker';
                    $scope.includeMenu = true;
                    watchdog.mapClick(true);
                    watchdog.makerVisible(false);
                    trackerService.clearTrackerData();
                }

                 else if (view == 'watchTrack' && $scope.state == 'drawing') { //updated func chandan
                    $scope.viewSelection = 'Draw';
                    $scope.includeMenu = true;
                    watchdog.mapClick(true);
                    watchdog.makerVisible(false);
                     $scope.getdrawCircle();
                    trackerService.clearTrackerData();
                    $scope.draw.lat = "";
                    $scope.draw.lng = "";
                    $scope.draw.Radius = 250;
                    $scope.hubArray=[];
                    $scope.draw.Hub_name = "";
                    $scope.searchAddress();
                }
            }

            $scope.menuEnable = false;

            $scope.menuToggle = function () {
                if ($scope.menuEnable == false) {
                    $scope.menuEnable = true;
                    watchdog.mapClick(false);
                }
                else {
                    $scope.menuEnable = false;
                    watchdog.mapClick(true);
                }

            };

            $scope.satelliteView =! $scope.satelliteView;
            $scope.changeMapView=function(){
                 $scope.satelliteView = !$scope.satelliteView;
                 if(mapDiv){
                    if($scope.satelliteView){
                            mapDiv.setMapTypeId(plugin.google.maps.MapTypeId.SATELLITE);
                    }else{
                        mapDiv.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);

                    }
                 }
            }
            

        $scope.placeseFocused = false;
        $scope.showplaces = function(val){
            //$scope.placeseFocused = val;
            watchdog.mapClick(val);
        }
          
        $scope.tPanel = false;

         $scope.toggleTrackerPanel = function (v) {
                $scope.tPanel = v;
            }


            $scope.dPanel = false;

            $scope.hublistPanel = function () {
                if(!$scope.dPanel){
                    $scope.getHub();
                    watchdog.mapClick(false);
                }else{
                    watchdog.mapClick(true);
                }
                $scope.dPanel = !$scope.dPanel;
                
            }

      //Edit --> For Reference only

        $scope.playButton = {};
        $scope.playButton.state = 'play';

       

            /*-------------------------------*/

            $scope.openSearch = false;
            $scope.watchdogInfo = false;
            $scope.showNotifications = false;
            $scope.contactpage = false;
            $scope.settingsPanel = false;
            $scope.stoppagesPanel = false;
             $scope.reportsPanel = false;
             $scope.reportsDataPanel = false;
             $scope.profilesetupshow = false;//12-07-17 Updates
            $scope.relayPage = false;   //03-08-2017

             $scope.relayData={};

             $scope.openRelay = function(v){
                $scope.relayPage = v;                
                if (v) {
                   $scope.mapClickStatus(v);
                   if($scope.vehicleArray.length>0){
                       
                       $scope.relayData=$scope.vehicleArray[0];
                       $scope.getRelayData($scope.relayData.Device_id);
                   }
                      
                }else{
                    $scope.mapClickStatus(v);
                }

                if ($scope.menuEnable) {
                    $scope.menuEnable = !$scope.menuEnable;
                }
             }
            $scope.relayDetails={};
            $scope.relaySubmitBtn=false;
            $scope.relayCheckboxStatus=false;
            $scope.getRelayData = function(data){

                       var deffer = addDevice.getMasterDevice({"Device_id":data});
                       deffer.then(function(data){
                           if(data.masterDeviceData.length>0){
                               var dataAlldata = data.masterDeviceData[0];
                                if(dataAlldata.Client_mobile_no){
                                  $scope.relayDetails.Client_mobile_no = parseInt(dataAlldata.Client_mobile_no);
                                  $scope.relaySubmitBtn=true;
                                }else{
                                    $scope.relayDetails.Client_mobile_no="";
                                    $scope.relaySubmitBtn=false;
                                }
                                if(dataAlldata.Active_status==1){
                                   $scope.relayCheckboxStatus=true;
                                }
                                $scope.relayDetails.Sim_mobile_no    = dataAlldata.Sim_mobile_no;
                            }

                       },function(){});
            }   
            $scope.setRelayNumber=function(){
                    var data = {"Client_mobile_no":$scope.relayDetails.Client_mobile_no,"Device_id":$scope.relayData.Device_id,"User_id":User_id};
                    var deffer = addDevice.addMasterDeviceNumber(data);
                    deffer.then(function(data){
                          utils.showAlert(data.msg);
                    },function(){
                          utils.showAlert("Please try again!");
                    });
            }

             $scope.searchpanel = function (val) {
                $scope.openSearch = val;
                
                $scope.mapClickStatus(val);

            }

            $scope.mapClickStatus = function(status){
                if (status) {
                    watchdog.mapClick(false);
                } else {
                    watchdog.mapClick(true);
                }
            }

            $scope.vehicleInformation = function (val) {
                $scope.watchdogInfo = val;
                $scope.mapClickStatus(val);
            }
            $scope.openNotify = function (val) {
                $scope.showNotifications = val;
                if (val) {
                   $scope.mapClickStatus(val);
                   $scope.getNotification();
                }else{
                    $scope.mapClickStatus(val);
                }
                if ($scope.menuEnable) {
                    $scope.menuEnable = !$scope.menuEnable;
                }
                if(push){
                        push.setApplicationIconBadgeNumber(function() {
                    console.log('success');
                    }, function() {
                    console.log('error');
                    }, 0);
                }
            }
           $scope.openProfile = function (val) {   //12-07-17 Updates
                $scope.profilesetupshow = val;
                if(val) {
                   $scope.mapClickStatus(val);
                   $scope.getProfile();
                }else{
                    $scope.mapClickStatus(v);
                }
                
                if ($scope.menuEnable) {
                    $scope.menuEnable = !$scope.menuEnable;
                }
            }

            $scope.openStoppages = function (val) {
                $scope.stoppagesPanel = val;
                if (val) {
                   $scope.mapClickStatus(val);
                }

            }
            $scope.openSettings = function (val) {
                $scope.settingsPanel = val;
                if (val) {
                   $scope.mapClickStatus(val);
                   $scope.getDeviceAll();
                }else{
                    $scope.mapClickStatus(val);
                }
                
                if ($scope.menuEnable) {
                    $scope.menuEnable = !$scope.menuEnable;
                }
            }
             $scope.openReports = function (val) { //updated func chandan
                $scope.reportsPanel = val;
               $scope.mapClickStatus(val);
            }
            $scope.openReportData = function (val) { //updated func chandan
                $scope.reportsDataPanel = val;
               $scope.mapClickStatus(val);
            }
            $scope.openAddDevice = function (val) {
                $scope.settingsPanel = !val;
                $scope.addDevicePanel = val;
                //$scope.menuEnable = !$scope.menuEnable;
                if (val) {
                    $scope.mapClickStatus(val);
                }
            }
            $scope.openContact = function (val) {


                $scope.contactpage = val;
                if (val) {
                   $scope.mapClickStatus(val);
                }else{
                    $scope.mapClickStatus(v);
                }
            }
            $scope.openReports = function (val) {
                $scope.reportsPanel = val;
                
                if (val) {
                   $scope.mapClickStatus(val);
                }else{
                    $scope.mapClickStatus(v);
                }
                if ($scope.menuEnable) {
                    $scope.menuEnable = !$scope.menuEnable;
                }
            }
            $scope.openReportData = function (val) {
                
                $scope.reportsDataPanel = val;
                if (val) {
                   $scope.mapClickStatus(val);
                   $scope.getReport();
                   $scope.reportsPanel = false;
                }else{
                   $scope.reportsPanel = true;
                }
            }

            /* login code start here */
            $scope.dataLogin = {};
            $scope.loginStatus = false;

            if (utils.getLocalStorage("userDetails")) {
                $scope.viewGo('watchTrack', 'watchdog');
                var data = utils.getLocalStorage("userDetails");
                //data.row[0].Mobile_no = parseInt(data.row[0].Mobile_no);
                $scope.userData=data;
                //var deviceData = utils.getLocalStorage("deviceData");
                //ser_id = data.row[0].Tab_id;
                Env_name = data.Env_name;
                User_id = data.User_id;
                $scope.loginStatus = true;
            } else {
                $state.go('login.log');
            }
            /*$scope.getLogin = function () {

                console.dir($scope.dataLogin);
                var deffer = login.getLogin($scope.dataLogin);
                deffer.then(function (data) {
                    if (data.status) {
                        $scope.viewGo('watchTrack', 'watchdog');
                        $scope.loginStatus = false;
                        utils.setLocalStorage("userDetails", data);
                    } else {
                        $scope.loginStatus = true;
                    }
                }, function () {

                });

            }*/

            /* login code end here */
            /*search */
            var tarckerSelectedVehicle={};
            $scope.dateSelect={};
            $scope.dateSelect.startDate="";
            $scope.dateSelect.endDate="";
            $scope.search = function (data) {
                data.Env_name= $scope.userData.Env_name;
                $scope.searchpanel(false);
                $scope.dateSelect.startDate="";
                $scope.dateSelect.endDate="";
                if ($scope.viewSelection == "Tracker") {
                    tarckerSelectedVehicle=data;
                    $scope.getTrackerData(0);
                } else {
                    var MarkerLatLong = new plugin.google.maps.LatLng(data.Latitude, data.Longitude);
                    var latLngBounds = new plugin.google.maps.LatLngBounds(MarkerLatLong);
                    mapDiv.animateCamera({
                        'target': latLngBounds,
                        'zoom': 12,

                    });
                }


            }
            /*search */
            /* watchDog code start here */
            $scope.vehicleArray = [];
            var timeoutPromise = null;
            $scope.callWatchDog = function () {
                var watchdogDeffer = watchdog.getWatchDog({ "User_id": User_id ,"Env_name": Env_name });
                watchdogDeffer.then(function (data) {
                    $scope.setInterval();
                    //console.dir(data);
                    watchdog.setOnMap();
                    $scope.vehicleArray = watchdog.getDeviceList();
                    watchdog.hubDraw();
                }, function () { $scope.setInterval(); });
            }
            $scope.setInterval = function () {

                var timeoutPromise = $timeout(function () {
                    console.info("called");
                    //watchdog.setOnMap();
                    $scope.callWatchDog();


                }, 1000 * 15);

            }
            $scope.getWatchDogFirst = function () {
                utils.loaderShow();
                if ($scope.loginStatus) {
                   
                    $scope.callWatchDog();
                    
                }
            }
            $scope.checkMapDivLoad = function(){
               var div = document.getElementById("map_canvas");
                if(div){
                    
                    var deffer = watchdog.loadMap();
                    deffer.then(function(){
                        $scope.getWatchDogFirst();
                     });
                }else{
                        
                    $timeout(function(){
                        $scope.checkMapDivLoad();
                    },500);

                }
                 /* Loading map here */
                
                /* Loading map here */

            }
            $ionicPlatform.ready(function () {
                utils.loaderShow();
                $scope.checkMapDivLoad();
                
            });

            /* watchDog code end here */
            /* Tracker start here*/
            var polylineArray = null;
            $scope.tracker = {};
            $scope.tracker.startDateTime;
            $scope.tracker.endDateTime;
            $scope.tracker.viewData = trackerService.viewTrackerData;


            var cameraanimate = [];
            $scope.getTrackerSubmit = function(){
                if($scope.dateSelect.startDate!="" && $scope.dateSelect.endDate!=""){
                    $scope.getTrackerData(1);
                }else{
                    utils.showAlert("please select date!");
                }
            }
            
            
            $scope.getTrackerData = function (status) {
                var data = tarckerSelectedVehicle;
                trackerService.clearTrackerData();
                if(status==0){
                  var trackerDeffer = trackerService.getTracker({ "Env_name":data.Env_name, "Device_id":data.Truck_id,"date":0 });
                }else{
                    var a = new Date($scope.dateSelect.startDate);
                   var startDate = a.getFullYear() + "-" + changeTwoDigit((a.getMonth() + 1)) + "-" + changeTwoDigit(a.getDate());
                var a = new Date($scope.dateSelect.endDate);
                endDate = a.getFullYear() + "-" + changeTwoDigit((a.getMonth() + 1)) + "-" + changeTwoDigit(a.getDate());
               
                   var trackerDeffer = trackerService.getTracker({ "Env_name":data.Env_name,"Device_id":data.Truck_id,"date":1,
                                         "startDate":startDate,"endDate":endDate});
                }
                trackerDeffer.then(function (reponse) {
                    var trackerDataLength = reponse.length;
                    if(trackerDataLength>0){
                        trackerService.viewTrackerData.status=false;
                    }else{
                          watchdog.mapClick(false);
                        var defferAlert = utils.showAlert("No record found!");
                        defferAlert.then(function(){
                            watchdog.mapClick(true);
                       });
                        return false;
                    }
                    var data = trackerService.rangeSlider(0, trackerDataLength);
                    $scope.tracker.viewData.startDateTime = data[0];
                    $scope.tracker.viewData.endDateTime = data[1];
                    trackerService.startMarker();
                    trackerService.endMarker();
                    var defferTracker = trackerService.getLocationName(new plugin.google.maps.LatLng(reponse[trackerDataLength - 1].Latitude, reponse[trackerDataLength - 1].Longitude));
                    defferTracker.then(function (address) {

                        $scope.tracker.viewData.currentLocation = address;

                    });

                    //$scope.tracker.sliderData.max = data.length;

                }, function () {

                });


            }
        
            $scope.setSider = function () {
                var data = trackerService.rangeSlider(0, $scope.tracker.sliderData);
                $scope.tracker.startDateTime = data[0];
                $scope.tracker.endDateTime = data[1];
            }
            $scope.$watch('tracker.sliderData', function (newValue, oldValue) {
                //var data = trackerService.rangeSlider(0,newValue);
                //$scope.tracker.startDateTime=data[0];
                //$scope.tracker.endDateTime=data[1];



            });
            //var playStatus = false;
            $scope.play = function () {
                trackerService.index = 0;
                if (!trackerService.playStatus) {
                    trackerService.playStatus = true;
                    trackerService.clearPolylineArray();
                    trackerService.play();
                    
                } else {
                    trackerService.playStatus = false;
                    trackerService.pause();
                }
            }
            $scope.stop = function () {

                trackerService.stop();
            }
            /* Tracker end here*/
            /* setting */
            $scope.getDeviceAll = function () {

                defferedDevice = addDevice.getDevice({ "User_id": User_id });
                defferedDevice.then(function (reponse) {
                    $scope.dataDeviceList = reponse.deviceList;
                    $ionicScrollDelegate.resize();
                }, function () {
                    utils.showAlert("please try again.");
                });
            }
            $scope.updateDevice = function (data) {
                data.User_id = User_id;
                defferedDevice = addDevice.updateDevice(data);
                defferedDevice.then(function (reponse) {
                    if (reponse.status) {
                        utils.showAlert("Updated successfully.");
                    } else {
                        utils.showAlert("please try again.");
                    }
                }, function () {
                    utils.showAlert("please try again.");
                });
            }
            $scope.deleteDevice = function (data) {
                data.User_id = User_id;
                var differ = utils.showConfirm();
                differ.then(function () {
                    defferedDevice = addDevice.deleteDevice(data);
                    defferedDevice.then(function (reponse) {
                        $ionicScrollDelegate.resize();
                        if (reponse.status) {
                            utils.showAlert("Deleted successfully.");
                            $scope.dataDeviceList.splice($scope.dataDeviceList.indexOf(data), 1);
                        } else {
                            utils.showAlert("please try again.");
                        }
                    }, function () {
                        utils.showAlert("please try again.");
                    });
                }, function () { });

            }
            /*setting */
            /* addDevice*/
            $scope.addDeviceData = {};

            $scope.addDevice = function () {
                $scope.addDeviceData.User_id = User_id;
                var defferedDevice = addDevice.addDevice($scope.addDeviceData);
                defferedDevice.then(function (reponse) {
                    utils.showAlert(reponse.msg);
                    if (reponse.status) {
                        document.getElementById("deviceFrom").reset();
                    } else {
                        utils.showAlert("please try again.");
                    }
                }, function () {
                    utils.showAlert("please try again.");
                });
            }
            /*addDevice end */
            /* Draw start here*/
            $scope.draw = {}
            $scope.draw.lat = "";
            $scope.draw.lng = "";
            $scope.draw.Radius = 250;
            $scope.hubArray=[];
            $scope.draw.Hub_name = "";
            
            var getCircle =function (latLng) {
                $scope.draw.Radius = 250;
                    if(drawCircleArray){
                        drawCircleArray.remove();
                        drawCircleArray=null;
                    }
                    $scope.draw.lat = latLng.lat;
                    $scope.draw.lng = latLng.lng;
                    $scope.drawCircle(latLng.lat, latLng.lng);



            }
            $scope.getdrawCircle = function () {
                
                var clickEvent = plugin.google.maps.event.MAP_CLICK;
                mapDiv.on(clickEvent,getCircle);
                //mapDiv.off(clickEvent,getCircle);
            }
            
            $scope.drawCircle = function (lat, lng) {

                const GOOGLE = { "lat": lat, "lng": lng };
                mapDiv.addCircle({
                    'center': GOOGLE,
                    'radius': 250,
                    'strokeColor': '#AA00FF',
                    'strokeWidth': 5,
                    'fillColor': '#880000'
                }, function (circle) {
                    drawCircleArray = circle;

                    mapDiv.animateCamera({
                    'target': circle.getBounds(),
                    //'tilt': 60,
                    'zoom': 18
                    //'bearing': 140
                    });
                    

                });
            }
            
 
            $scope.setRadius = function () {
                if(drawCircleArray){
                    drawCircleArray.setRadius($scope.draw.Radius);
                    mapDiv.animateCamera({
                        'target': drawCircleArray.getBounds(),
                        //'tilt': 60,
                        'zoom': 18
                        //'bearing': 140
                    });
                }
            }
            $scope.saveHub = function () {
                watchdog.mapClick(false);                 
                if($scope.draw.lat =="" && $scope.draw.lng==""){
                   var deffer = utils.showAlert("Please draw hub!");
                       deffer.then(function(){
                            watchdog.mapClick(true);
                       });
                   return false; 
                }
                $scope.draw.User_id = User_id;
                $scope.draw.Env_name = Env_name;
                var deffred = draw.addHub($scope.draw);
                deffred.then(function(data){
                    
                        var deffer = utils.showAlert(data.msg);
                        deffer.then(function(){
                            watchdog.mapClick(true);
                       });
                        if(data.status){

                            $scope.draw.lat = "";
                            $scope.draw.lng = "";
                            if(drawCircleArray){
                                drawCircleArray.remove();
                                drawCircleArray=null;
                                $scope.draw.Hub_name="";
                            }
                        }
                        utils.showAlert(data.msg);
                    

                },function(){
                      utils.showAlert("Please try again.");
                });
            }

            $scope.getHub = function () {

                $scope.draw.User_id = User_id;
                $scope.draw.Env_name = Env_name;
                
                console.dir($scope.draw);
                var deffred = draw.getHub({"User_id":User_id});
                deffred.then(function(data){
                     
                     $scope.hubArray=data.hubList;

                },function(){});
            }
            $scope.deleteHub=function(data){
                //data.User_id = User_id;
                var differ = utils.showConfirm();
                differ.then(function () {
                    defferedDevice = draw.deleteHub(data);
                    defferedDevice.then(function (reponse) {
                        $ionicScrollDelegate.resize();
                        if (reponse.status) {
                            utils.showAlert("Deleted successfully.");
                            $scope.hubArray.splice($scope.hubArray.indexOf(data), 1);
                        } else {
                            utils.showAlert("Please try again.");
                        }
                    }, function () {
                        utils.showAlert("Please try again.");
                    });
                }, function () { });
            }
            /* Draw end here*/
            /**/
            $scope.reportData={};
            $scope.distanceArray=[]
            $scope.datesArray=[]
            $scope.TimeArray=[]
            var a = new Date();
            var b=  a.getTime()-604800000;
            //$scope.reportData.startDate1.min= new Date(b);
            //$scope.reportData.endDate1.max= new Date();
            function changeTwoDigit(value){
               if(value<10){
                   value="0"+value;
               }
                return value;
            }
            $scope.getReport=function(){
                $scope.distanceArray=[];
                          $scope.datesArray=[];
                        $scope.TimeArray=[];
                $scope.reportData.Env_name=$scope.userData.Env_name;
            
                var a = new Date($scope.reportData.startDate1);
                $scope.reportData.startDate = a.getFullYear() + "-" + changeTwoDigit((a.getMonth() + 1)) + "-" + changeTwoDigit(a.getDate());
                var a = new Date($scope.reportData.endDate1);
                $scope.reportData.endDate = a.getFullYear() + "-" + changeTwoDigit((a.getMonth() + 1)) + "-" + changeTwoDigit(a.getDate());
               
                var deffer =  report.getReport($scope.reportData);
                    deffer.then(function(data){
                        
                      if($scope.reportData.type=='Distance'){
                      $scope.datesArray    = data.DistanceReport.Dates;
                      $scope.distanceArray = data.DistanceReport.Distance;
                      }else{
                      $scope.datesArray = data.StoppagesReport.Dates;
                      //data.StoppagesReport.dates;
                      $scope.TimeArray = data.StoppagesReport.Time;
                      //data.CummulativeDistance;
                      //data.CummulativeTime;
                      }
                         
                    },function(){});

            }
           var  getLocationPlace=function(address){
                                var request = {
                    'address': address
                    };
                    plugin.google.maps.Geocoder.geocode(request, function(results) {
                    if (results.length) {
                        var result = results[0];
                        var position = result.position;
                        mapDiv.animateCamera({
                            'target': position,
                            'zoom': 14
                        }, function() {
                            
                        });
                    } else {
                        //alert("Not found");
                    }
                    });
                }
            
            $scope.searchAddress= function(){
                 var autocomplete = new google.maps.places.Autocomplete(document.getElementById("DrawSearchText1"));
                 google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        getLocationPlace(document.getElementById("DrawSearchText1").value);
                        return false;
                    });
                 
            }    
            /*  */

            /** */
            $scope.notificationArray=[];
            $scope.getNotification = function () {

                //$scope.draw.User_id = User_id;
                //console.dir($scope.draw);
                var deffred = addDevice.getNotification({"User_id":User_id});
                deffred.then(function(data){
                      
                     $scope.notificationArray=data.Notification;
                     $ionicScrollDelegate.resize();

                },function(){});

                }
            /* */
            /* */
            $scope.getProfile = function(){


            }

            $scope.updateProfile = function(){
                
                var deffer= addDevice.updateProfile($scope.userData);
                deffer.then(function(data){
                        if(data.status){
                              utils.showAlert("Profile updated successfully.");
                              
                               var data = utils.getLocalStorage("userDetails");
                                data.row[0]=$scope.userData;
                                utils.setLocalStorage('userDetails', data);


                        }else{
                           utils.showAlert("Please try again."); 
                        }
                },function(){
                           utils.showAlert("Please try again.");
                });

            }
            /* */
             

        }]);