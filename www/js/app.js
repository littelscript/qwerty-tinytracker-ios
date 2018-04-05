// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var mapDiv = null;
angular.module('carcare', ['ionic','ngCordova'])
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
   

// setup an abstract state for the tabs directive
  .state('register', {
    url: '/register',
    abstract: true,
    templateUrl: 'templates/Register/register-tabs.html'
  })
  .state('register.reg', {
    url: '/reg',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/Register/register.html',
        controller: 'RegisterCtrl'
      }
    }
  })
  .state('login', {
    url: '/login',
    abstract: true,
    templateUrl: 'templates/Login/Login-tabs.html'
  })
  .state('login.log', {
    url: '/log',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/Login/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/App/tab.html'
  })
  .state('app.app', {
    url: '/app',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/App/tab-main.html',
        controller: 'carcareController'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/login/log');

})
.run(function($ionicPlatform,$timeout,utils,$cordovaDevice) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    utils.Device_type = $cordovaDevice.getPlatform();
    utils.Serial_no = $cordovaDevice.getUUID();
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    push = PushNotification.init({
	android: {
		senderID: "927889918717",
    forceShow:true
	},
    browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    },
	ios: {
    senderID: "927889918717",
    forceShow:true,
		alert: "true",
		badge: "true",
		sound: "true"
	},
	windows: {}
});

push.on('registration', function(data) {
	// data.registrationId
  utils.Gcm_id=data.registrationId;
  //alert(data.registrationId);
  console.dir(data);
});

push.on('notification', function(data) {

  //console.dir(data);
  //alert(data);
	// data.message,
	// data.title,
	// data.count,
	// data.sound,
	// data.image,
	// data.additionalData
});

push.on('error', function(e) {
	// e.message
});

  });
  var exitApp=false;
  $ionicPlatform.registerBackButtonAction(function (event) {
      event.preventDefault();
      if(exitApp){
        //navigator.app.backHistory();
        navigator.app.exitApp();
      }
      exitApp=true;   
      $timeout(function(){

            exitApp=false;
         },1000); 
        
      
    }, 100);

})
/*
This directive is used to disable the "drag to open" functionality of the Side-Menu
when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag() {
                $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag() {
                $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        } ]
    };
} ])

/*
This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function () {
    return {
        restrict: 'A',
        replace: false,
        transclude: false,
        link: function (scope, element, attrs) {
            var href = attrs['hrefInappbrowser'];

            attrs.$observe('hrefInappbrowser', function (val) {
                href = val;
            });

            element.bind('click', function (event) {

                window.open(href, '_system', 'location=yes');

                event.preventDefault();
                event.stopPropagation();

            });
        }
    };
})

.filter('HoursFormat', function() {
    return function (seconds) {
            if(seconds==0){

              return "----";
            } 
            var sec_num = parseInt(seconds, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            var time    = hours+':'+minutes+':'+seconds;
            return time;
            };
})

.filter('roundOff', function() {
    return function (value) {
                 return value.toFixed(2);
            };
});
