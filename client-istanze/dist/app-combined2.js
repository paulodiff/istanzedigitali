"use strict";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myApp', [//'ionic',
                         'ui.bootstrap',   
                         'ui.router',
                         'ui.select',
                         // 'dialogs.main',
                         // 'formly',
                         // 'formlyBootstrap',
                         //'satellizer',
                         //'ngResource',
                         //'ngSanitize',
                         'ngAnimate',
                         'ngMessages',
                         //'naif.base64',
                         //'ngCordova',
                         'angularSpinner',
                         //'restangular',
                         //'ngAnimate',
                         //'ngMockE2E',
                         'ngStorage',
                         'ngFileUpload',
                         // 'ngTable',
                         // 'ui.grid',
                         // 'ui.grid.edit',
                         // 'ui.grid.selection',
                         // 'ui.grid.rowEdit', 
                         // 'ui.grid.cellNav',
                         // 'ui.grid.exporter',
                         //'SheetJSExportService',
                         // 'ui.validate',
                         // 'chart.js',
                         'vcRecaptcha',
                         //'uiGmapgoogle-maps',
                         'myApp.filters',
                         'myApp.services',
                         'myApp.directives',
                         'myApp.controllers',
                         'myApp.config',
                         'myApp.templates'])
                         //'myApp.mockBackend',
                         //'myApp.mockService'])

// PATCH Possibly unhandled rejection with Angular 1.5.9
//.config(['$qProvider', function ($qProvider) {
//     $qProvider.errorOnUnhandledRejections(false);
//}])


// enable disable LOG
.config(function($logProvider){
    $logProvider.debugEnabled(true);
})

/*
// config uiGmapgoogle-maps
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCbkb0dHm-FqvVSf44vd8hr4l6rDHRxGzE',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
*/

// ui.router configuration
.config(  ['$stateProvider', '$urlRouterProvider', 
  function($stateProvider,    $urlRouterProvider) {
    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
    // Here we are just setting up some convenience urls.
    //.when('/c?id', '/contacts/:id')
    //.when('/user/:id', '/contacts/:id')
    // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
    $urlRouterProvider.otherwise('eseguiIstanza');
    
/*
    $stateProvider.state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/mainDashboard.html"
    });
    */
    
    /*

    $stateProvider.state('homeIstanze', {
        url: '/homeIstanze',
        controller: 'homeCtrl',
        templateUrl: 'templates/homeIstanzeITALIA.html',
        accessLogged: false,
        accessLevel: 'free1' 
    });
    */

/*
    $stateProvider.state('elencoIstanze', {
        url: '/elencoIstanze',
        controller: 'homeCtrl',
        templateUrl: 'templates/elencoIstanzeITALIA.html',
        accessLogged: false,
        accessLevel: 'free1' 
    });
*/
    $stateProvider.state('eseguiIstanza', {
      url: '/eseguiIstanza/{id}',
      controller: 'eseguiIstanzaCtrl',
      templateUrl: 'templates/eseguiIstanzaITALIA.html',
      accessLogged: false,
      accessLevel: 'free1' 
    });

    /*
    $stateProvider.state('visualizzaEsitoIstanza', {
      url: '/visualizzaEsitoIstanza/{id}',
      controller: 'eseguiIstanzaCtrl',
      templateUrl: 'templates/visualizzaEsitoIstanzaITALIA.html',
      accessLogged: false,
      accessLevel: 'free1' 
    });


    $stateProvider.state('protocollo', {
        url: '/protocollo',
        templateUrl: 'templates/protocolloForm.html',
        controller: 'ProtocolloCtrl',
        accessLogged: true,
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('elencoAtti', {
        url: '/elencoAtti',
        controller: 'UiGridCtrl',
        templateUrl: 'templates/elencoAtti.html',
        accessLogged: false,
        accessLevel: 'free1' 
    });


    $stateProvider.state('postaDashboard', {
        url: '/postaDashboardPhone',
        templateUrl: 'templates/postaDashboard.html',
        controller: 'postaDashboardCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    //https://scotch.io/tutorials/angularjs-multi-step-form-using-ui-router
    $stateProvider.state('multistep', {
      url: '/multistepHome',
      templateUrl: 'templates/multistep.html',
      controller: 'multistepCtrl',
      controllerAs: 'vm',
      resolve: {
        //loginRequired: loginRequired
      }
    });

    $stateProvider.state('multistep.profile', {
      url: '/multistepProfile',
      templateUrl: 'templates/multistep-profile.html'
    });
    
    $stateProvider.state('multistep.info', {
      url: '/multistepInfo',
      templateUrl: 'templates/multistep-info.html'
    });
    
    $stateProvider.state('multistep.final', {
      url: '/multistepFinal',
      templateUrl: 'templates/multistep-final.html'
    });
*/

    /*
    
        $stateProvider.state('menu.home',{
            url: '/home',
            templateUrl: "templates/loginDashboard.html",
            controller:'LoginController',
            accessLogged: false,
            accessLevel: 'free1' 
    });

    
    
    
    
    /* Login/Logout/Auth/Profile */
  /*  
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/loginFormITALIA.html',
        // controller: 'SLoginCtrl',
        controller: 'LoginController',
        accessLogged: false
    });


    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'templates/signupFormITALIA.html',
        controller: 'SSignupCtrl',
    });

    $stateProvider.state('logout', {
        url: '/logout',
        templateUrl: 'templates/loginFormITALIA.html',
        controller: 'LoginController'
    });
      
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'templates/profileFormITALIA.html',
        controller: 'profileMgrCtrl',
        accessLogged: true
    });

    $stateProvider.state('landingSAML', {
        url: '/landingSAML/{tokenId}/{RelayState}',
        templateUrl: 'templates/landingSAML.html',
        controller: 'landingSAMLCtrl',
        accessLogged: false
    });

    $stateProvider.state('queue', {
      url: '/queue',
      templateUrl: 'templates/queueForm.html',
      controller: 'queueMgrCtrl',
      accessLogged: false
  });


  $stateProvider.state('sid24p', {
    url: '/sid24p',
    templateUrl: 'templates/sid24pForm.html',
    controller: 'sid24pCtrl',
    accessLogged: false
  });

  $stateProvider.state('anagraficaDemanio', {
    url: '/anagraficaDemanio',
    templateUrl: 'templates/anagraficaDemanioForm.html',
    controller: 'anagraficaDemanioCtrl',
    accessLogged: false
  });

  $stateProvider.state('consultazione', {
    url: '/consultazione',
    templateUrl: 'templates/consultazioneFormITALIA.html',
    controller: 'profileMgrCtrl',
    accessLogged: false
  });


  $stateProvider.state('error', {
    url: '/error',
    templateUrl: 'templates/errorFormITALIA.html',
    params:      { 'response': null, 'info': null },
    controller: 'errorMgrCtrl',
    accessLogged: false
  });
*/

/*    $stateProvider.state('form', {
        url: '/form',
        templateUrl: 'templates/formly.html',
        controller: 'SFormlyCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });


    $stateProvider.state('jiride', {
        url: '/jiride',
        templateUrl: 'templates/jformly.html',
        controller: 'SFormlyJirideCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });


    $stateProvider.state('jlist', {
        url: '/jlist',
        templateUrl: 'templates/jlist.html',
        controller: 'SFormlyJirideListCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('formAsync', {
        url: '/formAsync',
        templateUrl: 'templates/formlyAsync.html',
        controller: 'SFormlyAsyncCtrl',
        controllerAs: 'vm',
        resolve: {
          loginRequired: loginRequired
        }
    });

    $stateProvider.state('uigrid', {
        url: '/uigrid',
        templateUrl: 'templates/uiGrid.html',
        controller: 'UiGridCtrl',
        controllerAs: 'vm',
        resolve: {
          loginRequired: loginRequired
        }
    });

// mobile signal

    $stateProvider.state('graphPhone', {
        url: '/graphPhone',
        templateUrl: 'templates/graphPhone.html',
        controller: 'GraphPhoneCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('elezioni', {
        url: '/elezioni',
        templateUrl: 'templates/elezioni.html',
        controller: 'ElezioniCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });


    $stateProvider.state('batch', {
        url: '/batch',
        templateUrl: 'templates/batch.html',
        controller: 'BatchCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('sigPosition', {
        url: '/sigPosition',
        templateUrl: 'templates/sigPosition.html',
        controller: 'sigPositionController',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('sigType', {
        url: '/sigType',
        templateUrl: 'templates/sigType.html',
        controller: 'sigTypeController',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('sigSend', {
        url: '/sigSend',
        templateUrl: 'templates/sigSend.html',
        controller: 'sigSendController',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

    $stateProvider.state('sseChat', {
        url: '/sseChat',
        templateUrl: 'templates/sseChat.html',
        controller: 'sseChatController',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });


    $stateProvider.state('push', {
        url: '/push',
        templateUrl: 'templates/push.html',
        controller: 'pushController',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });

*/
/*    function skipIfLoggedIn($q, AuthService) {
      var deferred = $q.defer();
      if (AuthService.isAuthenticated()) {
        console.log('skipIfLoggedIn ... REJECT!');
        deferred.reject();
      } else {
        console.log('skipIfLoggedIn ...RESOLVE!');
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, AuthService) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        console.log('loginRequired ...RESOLVE!');
        deferred.resolve();
      } else {
        console.log('loginRequired ...TO LOGIN!');
        $location.path('/login');
      }
      return deferred.promise;
    }
*/
    // material design
    // $.material.init();

}])


/*// satellizer

.config(function($authProvider) {

    // Optional: For client-side use (Implicit Grant), set responseType to 'token'
    $authProvider.facebook({
      clientId: 'Facebook App ID',
      responseType: 'token'
    });

    $authProvider.github({
      clientId: '57c6b2d67e6e3cb24640',
      scope: ['user:email']
    });

    $authProvider.linkedin({
      clientId: '77dsl1x9v4htxt'
    });

    //77dsl1x9v4htxt linkedin

    $authProvider.google({
      //clientId: 'Google Client ID'
      clientId: '572820000251-dqu77iuc6t37c5jm2r3p8fug6j0mbjh7.apps.googleusercontent.com'
    });

    // No additional setup required for Twitter

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'Foursquare Client ID',
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
    });

    $authProvider.baseUrl   = '';
    $authProvider.loginUrl  = 'auth/login';
    $authProvider.signupUrl = 'auth/signup';
    $authProvider.unlinkUrl = 'auth/unlink/';

})
*/

/*
//formly configuration GLOBALE
.config(function(formlyConfigProvider) {



    formlyConfigProvider.extras.removeChromeAutoComplete = true;


    // set templates here
    formlyConfigProvider.setType({
      name: 'custom',
      templateUrl: 'templates/formly-custom-template.html'
    });

    formlyConfigProvider.setType({
      name: 'ui-select-single',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select-single-template.html'
    });

    formlyConfigProvider.setType({
      name: 'ui-select-single-select2',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select2-single-template.html'
    });

    formlyConfigProvider.setType({
      name: 'ui-select-single-search',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select-single-async-template.html'
    });

    formlyConfigProvider.setType({
      name: 'ui-select-multiple',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select-multiple-template.html'
    });


    var attributes = [
        'date-disabled',
        'custom-class',
        'show-weeks',
        'starting-day',
        'init-date',
        'min-mode',
        'max-mode',
        'format-day',
        'format-month',
        'format-year',
        'format-day-header',
        'format-day-title',
        'format-month-title',
        'year-range',
        'shortcut-propagation',
        'datepicker-popup',
        'show-button-bar',
        'current-text',
        'clear-text',
        'close-text',
        'close-on-date-selection',
        'datepicker-append-to-body'
      ];

      var bindings = [
        'datepicker-mode',
        'min-date',
        'max-date'
      ];

      function camelize(string) {
        string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function(match, chr) {
          return chr ? chr.toLowerCase() : '';
        });
      };



      var ngModelAttrs = {};

      angular.forEach(attributes, function(attr) {
        ngModelAttrs[camelize(attr)] = {attribute: attr};
      });

      angular.forEach(bindings, function(binding) {
        ngModelAttrs[camelize(binding)] = {bound: binding};
      });



    formlyConfigProvider.setType({
      name: 'datepicker',
      templateUrl:  'templates/formly-datepicker-bootstrap-template.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'dd/MM/yyyy',
            initDate: new Date()
          }
        }
      },
      controller: ['$scope', function ($scope) {
        $scope.datepicker = {};
        $scope.datepicker.opened = false;
        $scope.datepicker.open = function ($event) {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });

    // formly Wrapper

    formlyConfigProvider.setWrapper({    
        name: 'panel',
        templateUrl: 'templates/formly-wrapper-panel-template.html'
    });


    formlyConfigProvider.setWrapper([
      {
        templateUrl: 'templates/formly-input-with-error-template.html',
        types: 'inputWithError'
      },
      {
        template: [
          '<div class="checkbox formly-template-wrapper-for-checkboxes form-group">',
          '<label for="{{::id}}">',
          '<formly-transclude></formly-transclude>',
          '</label>',
          '</div>'
        ].join(' '),
        types: 'checkbox'
      }
    ]);


})*/


.run(function() {
  
  /*
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
  */    

    // hide loading screen...
    console.log('run: hide loading screen...');
    //loading_screen.finish();
});
"use strict";

 angular.module('myApp.config', [])

.constant('ENV', 
		{	
			appVersion: '1.1',
			name:'DEV',
			// apiEndpoint:'https://istanze-dichiarazioni.comune.rimini.it/federa',

			apiEndpoint:'https://istanze-dichiarazioni.comune.rimini.it/istanze',
			apiLogin:'passportauth/login',
			apiLogout:'passportauth/logout',
			apiLoginCheck:'passportauth/check',
			apiProfile: 'profilemgr/me',
			apiUpload:'segnalazioni/upload',
			apiIstanzeUpload:'protocollo/upload',
			apiIstanzeRecuperaImpostazioni:'protocollo/getInfoIstanza',
			apiLoginNTLM:'loginmgr/NTLMlogin',
			apiLoginDEMO:'loginmgr/DEMOlogin',
			apiLoginLDAP:'loginmgr/LDAPlogin',
			apiLogoutLDAP:'loginmgr/LDAPlogout',
			apiPosta:'postamgr/posta',
			apiPostaCDC:'postamgr/cdc',
			apiDemanio:'demaniomgr',
			apiQueue:'queuemgr',
			routeAfterLogon:'consultazione',
			mapsdemo: false,
			debugFormDefaultData: true, // carica dati di default nella schermata 
			loginUserName:'',
			loginUserPassword:'',

			AUTH_EVENTS:{
				loginSuccess:'auth-login-success',
				loginFailed:'auth-login-failed',
				logoutSuccess:'auth-logout-success',
				sessionTimeout:'auth-session-timeout',
				notAuthenticated:'auth-not-authenticated',
				notAuthorized:'auth-not-authorized',
				serverError:'server-error',
				oldAppVersion:'old-app-version'
			},

			USER_ROLES:{
				all:'*',
				admin:'admin',
				editor:'editor',
				guest:'guest'
			}
		});
'use strict';

/* Controllers */

angular.module('myApp.services', []);
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

// angular.module('myApp.services', [])
angular.module('myApp.services')
   
  .service('VersionService', [function() {
      return '1.0.2';
  }])


.factory('AuthService',           ['ENV', '$http', 'Session', '$rootScope', '$log', '$localStorage',
                         function ( ENV,   $http,   Session,   $rootScope,   $log,   $localStorage) {
  return {

    login: function (credentials) {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogin; 
      var checkApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginCheck; 

      $log.info( 'AuthService');
      $log.info(fullApiEndpoint);
      $log.info(checkApiEndpoint);
      $log.info(credentials);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "GET",
                    params: {username: credentials.username, password: credentials.password }
                  })
        .then(function (res) {
            $log.info('AuthService login then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService login ERROR');
            $log.info(response);
            throw new Error('AuthService login ERROR');
       });
    },
      
    storeToken: function(token) {
      if(token){
          $log.info('AuthService store token');
          $log.info(token);
          
          $log.info( 'AuthService store set JWT to storage');
          $localStorage.JWT = token;
          $log.info( 'AuthService store set http common header');
          $http.defaults.headers.common.Authorization = 'Bearer ' + token;
      }
    },

    // imposta e ritorna il 
    getRelayStateToken: function(){
          $log.info('AuthService: getRelayStateToken');
          $log.info('AuthService store RelayStateToken to storage');
          $localStorage.RelayStateToken = Math.random() * 100000000000000000;
          return $localStorage.RelayStateToken;
    },

    checkRelayStateToken: function(RelayStateToken){
      $log.info('AuthService: checkRelayStateToken');
      if(RelayStateToken){
        if($localStorage.RelayStateToken){
          if($localStorage.RelayStateToken == RelayStateToken){
            return true;
          }else{
            $log.info('AuthService: checkRelayStateToken <>');
            return false;
          }
        }else{
          $log.info('AuthService: checkRelayStateToken NOT EXIST');
          return false;
        }
      }else{
        $log.info('AuthService: checkRelayStateToken null parameter');
        return false;
      }
    },


    logout: function (credentials) {
        $log.info('AuthService logout');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogoutLDAP; 
        $log.info(fullApiEndpoint);
        /*
        $log.info('AuthService logout: delete JWT');
        delete $localStorage.JWT;
        $log.info('AuthService logout: remove http header');
        $http.defaults.headers.common.Authorization = '';
        */
       
      return $http
        .get(fullApiEndpoint, credentials)
        .then(function (res) {
            $log.info(res);
            delete $localStorage.JWT;
            delete $localStorage.userData;
            $http.defaults.headers.common.Authorization = '';
        }).catch(function(response) {
            $log.info('AuthService logout ERROR');
            $log.info(response);
            delete $localStorage.JWT;
            delete $localStorage.userData;
            $http.defaults.headers.common.Authorization = '';
            throw new Error('thrown in then');
       });
    },  


   loginLDAP: function (credentials) {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginLDAP; 
      
      $log.info( 'AuthServiceNTLM loginLDAP');
      $log.info(fullApiEndpoint);
        
      return $http.post( 
                    fullApiEndpoint, 
                    credentials
                  )
        .then(function (res) {
            $log.info('AuthService login then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;

            $log.info( 'AuthService set userData to storage');
            $localStorage.userData = res.data.userData;

            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },

   loginNTLM: function () {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginNTLM; 
      
      $log.info( 'AuthServiceNTLM loginNTLM');
      $log.info(fullApiEndpoint);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "POST"
                  })
        .then(function (res) {
            $log.info('AuthService login then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },

   loginDEMO: function () {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginDEMO; 
      
      $log.info( 'AuthServiceNTLM loginDEMO');
      $log.info(fullApiEndpoint);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "POST"
                  })
        .then(function (res) {
            $log.info('AuthService login DEMO then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $localStorage.userData = res.data;
            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService DEMO login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },      

    isAuthenticated: function () {
        // $log.info('AuthService isAuthenticated .. check JWT', !!$localStorage.JWT);

        return !!$localStorage.JWT;
        //return true;

        /*
        // check
        var checkApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginCheck; 
        if(!!$localStorage.JWT){
            return $http
              .get(checkApiEndpoint)
              .then(function (res) {
                  $log.info(res);
                  $log.info('isAuthenticated failed! remove token!');
                  return false;
              }).catch(function(response) {
                  $log.info('isAuthenticated failed! remove token!');
                  $log.info(response);
                  delete $localStorage.JWT;
                  $http.defaults.headers.common.Authorization = '';
                  return false;
            });
        } else {
          return false;
        }
        */

    },
    
    isAdmin: function () {
        // TODO
        $log.info('AuthService isAdmin');

        
        $log.info( 'AuthService set userData to storage');
        if($localStorage.userData){
          return $localStorage.userData.isAdmin;
        }

        
    },
    

    isAuthorized: function (authorizedRoles) {
        // $log.info('AuthService isAuthorized');
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
}])

.service('Session',  ['$log', function ($log) {
  this.create = function (data) {
    $log.info('Session create ...');
    $log.info(data);
    this.session_data = {};
    this.session_data = data;
  };
  this.destroy = function () {
    $log.info('Session destroy');
    this.session_data = {};
  };
  return this;
}]);
'use strict';

/* alert Services Display Errors..on device*/


angular.module('myApp.services')

.factory('AlertService',           ['ENV', '$http', '$rootScope', '$log', 'dialogs',
                         function (  ENV,   $http,   $rootScope,   $log,   dialogs) {
  return {

        displayError: function (obj) {
            $log.info('AlertService:displayError');
            $log.info(obj);

            var status = (obj.status ? obj.status : '');
            var statusText = (obj.statusText ? obj.statusText : '');
            var title = ((obj.data && obj.data.title) ? obj.data.title : '');
            var message = ((obj.data && obj.data.msg) ? obj.data.msg : '');
            var success =  ((obj.data && obj.data.success) ? obj.data.success : '');
            if (message == '') { message = obj.message };
            if (!title) { title = obj.title };
            $log.info('AlertService:dati:',title, message);
            var options = {}
            // options.windowClass = 'Dialog js-fr-dialogmodal Dialog-content Dialog-content--centered u-background-red u-layout-prose u-margin-all-xl u-padding-all-xl js-fr-dialogmodal-modal';
            options.backdrop = true;
            options.size = 'lg';
            var dlg = dialogs.error(title + '<small>(' + status + ')</small>', message, options);
        },

        displayNotify: function(title, text){
            var dlg = dialogs.notify(title, text);
        },

        displayConfirm: function(title, text){
            return dialogs.confirm(title, text).result;
        },

        createDialog: function(url, ctrlr, data, opts, ctrlAs){
            return dialogs.create(url, ctrlr, data, opts, ctrlAs).result;
        }

        
    }
}
]
);
angular.module('myApp.services')
  .factory('UtilsService', function($http) {

    function addZero(x,n) {
      while (x.toString().length < n) {
        x = "0" + x;
      }
    return x;
    }


    return {
      getTimestampPlusRandom: function() {

          console.log('utilsService: getTimestampPlusRandom');

          // Create a date object with the current time
          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          // console.log('UtilsService');
          // console.log(time);

          var suffix = Math.floor(Math.random()*90000) + 10000;

          //time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
          
          //time[0] = time[0] || 12;

          // If seconds and minutes are less than 10, add a zero
            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          

          // console.log(time.join(""));  

          // Return the formatted string
          return [year, month, day].join('') + "@" + time.join("") + "@" + ms + "@" + suffix;
          //return date.join("") + "@" + time.join("") + "@" + suffix;
        },

      updateProfile: function(profileData) {
        console.log('utilsService: updateProfile');
        return $http.put('/api/s/me', profileData);
      },

      getRandomId: function(){
        console.log('utilsService: getRandomId');
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for( var i=0; i < 5; i++ )  text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
      }
    };
  });
'use strict';

/* Controllers */

angular.module('myApp.controllers', []);
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



.controller("AppCtrl", 
                    ['$scope', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log', '$location','$localStorage', '$http',
            function($scope,    $rootScope,   AuthService,   Session,   $state, ENV,   $log,   $location,  $localStorage,   $http) {

                
        $log.info("AppCtrl ... start");
        $log.info(ENV);
        $scope.currentUser = null;
        $scope.userRoles = ENV.USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
        $scope.isCollapsed = false;
    
        // set header AppVersione
        $log.info("AppCtrl ... set header AppVersion");
        $http.defaults.headers.common.AppVersion = ENV.appVersion;


        $scope.go = function ( path ) {
            $log.info("AppCtrl ... go");
            $state.go(path);
        };


        $scope.browserName = bowser.name;
        $scope.browserVersion = bowser.version;
                       
          
        // CONFIGURAZIONI -----------------------------------------------------------------        

        //console.log($location.host());
        //console.log($location.absUrl());

        var host = $location.host();
        //console.log(host); 

        if( host  == 'localhost') {
            $rootScope.base_url = 'http://localhost:8009';
        } else {
            //$rootScope.base_url = 'https://istanze-dichiarazioni.comune.rimini.it/federa';
            $rootScope.base_url = ENV.apiEndpoint;
        }

        // autenticazione
        // Controlla se un reload ricarica il JWT su http header
        $log.info('AppCtrl check JWT exist!');
        if ($localStorage.JWT){
            $log.info('AppCtrl reload JWT http header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.JWT;
        } 

        

        //$rootScope.base_url = ENV.apiEndpoint;
        //$log.info('Restangular set base Url '+ ENV.apiEndpoint);
        $log.info('rootScope Url '+ $rootScope.base_url);



        //$rootScope.base_url = ENV.apiEndpoint;
        //$log.info('Restangular set base Url:'+ ENV.apiEndpoint);
        // Restangular.setBaseUrl($rootScope.base_url);


        /*Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {

            if(response.status === 0) {
                    $ionicLoading.hide();
                    $log.info('setErrorInterceptor 0');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            if(response.status === 403) {
                    $ionicLoading.hide();
                    $log.info('setErrorInterceptor 403');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.sessionTimeout);
                    return false; // error handled
            }

            if(response.status === 500) {
                    $ionicLoading.hide();
                    $log.info('setErrorInterceptor 500');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 502) {
                    $ionicLoading.hide();
                    $log.info('setErrorInterceptor 502');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 504) {
                    $ionicLoading.hide();
                    $log.info('setErrorInterceptor 504');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            if(response.status === 404) {
                    $ionicLoading.hide();
                    $log.info('setErrorInterceptor 404');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            //return false; // error handled
            return true; // error not handled
        });*/
        

        /*
        if (ENV.name === 'development') {        
            $log.info("AppCtrl ... development ... ");
            Session.create(1, 'PROVINCIA', ENV.token,  true);
            $scope.currentUser = ENV.userName;
            $scope.isAuthorized = ENV.isAuthorized;
            Restangular.setDefaultRequestParams({ apiKey: Session.token });
        }
        */
  
                
        //$log.info('WEB SERVICE WEB URL  : ' + $rootScope.base_url);
                
        
        //AUTH_EVENTS.loginFailed
    
        $rootScope.$on(ENV.AUTH_EVENTS.loginSuccess , function (event, next) {
            $log.info('AppCtrl: AUTH_EVENTS.loginSuccess ... ');
            $log.info(event);
            $log.info(next);

            $scope.currentUser = Session.nome_breve_utenti;
            //Restangular.setDefaultHeaders({'rr-access-token': Session.token});

            //storePassword
            // $log.info('set storage login to:',Session.token);
            // $localStorage.Session = Session;
            
            $log.info(AuthService.isAuthorized());

            //$state.go('menu.list');
            $state.go(ENV.routeAfterLogon);
        });
                
                
        $rootScope.$on(ENV.AUTH_EVENTS.logoutSuccess , function (event, next) {
            $log.info('AppCtrl: AUTH_EVENTS.logoutSuccess ... ');
            $log.info(event);
            $log.info(next);
            $log.info('AppCtrl: destroy session & token ... ');
            $scope.currentUser = '';
            Session.token = '123';
            //Restangular.setDefaultHeaders({token: ''});

            //$log.info('Destroy local session....');
            //delete $localStorage.Session;

            $state.go('login');
        });        
                
   
        $rootScope.$on(ENV.AUTH_EVENTS.loginFailed, function (event, next) {
            $log.info('AppCtrl: AUTH_EVENTS.loginFailed ... ');
            $log.info(event);
            $log.info(next);

            AlertService.displayError({title:'Errore di autenticazione',message:'Immettere nome utente e password'});
/*
    
            var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'templates/modalTemplate.html',
              controller: 'ModalController',
              size: 'sm',
              resolve: {
                items: function () {
                  return $scope.items;
                }
              }
            });

            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
  
*/

/*
                var alertPopup = $ionicPopup.alert({
                    title: 'Login errato',
                    template: 'Immettere nome utente e password corrette'
                });
               alertPopup.then(function(res) {
                    $log.info('AppCtrl : Login errato OK');
                    $state.go('menu.home');
               });
*/
      

        }); 

         $rootScope.$on(ENV.AUTH_EVENTS.notAuthenticated, function (event, next) {
            $log.info('AppCtrl : AUTH_EVENTS.notAuthenticated ... ');
            $log.info(event);
            $log.info(next);
            //$scope.currentUser = Session.nome_breve_utenti;
            
            // AlertService.displayError({title:'Utente non autenticato',message:'Provvedere ad autenticarsi mediante uno dei metodi previsti.'});
            $state.go('error', {response: {title:'Utente non autenticato',message:'Provvedere ad autenticarsi mediante uno dei metodi previsti.'} } );

        }); 
    

        $rootScope.$on(ENV.AUTH_EVENTS.sessionTimeout, function (event, next) {
            $log.info('AppCtrl: AUTH_EVENTS.sessionTimeout ... ');
            $log.info(event);
            $log.info(next);
            $scope.currentUser = Session.nome_breve_utenti;
            $state.go('error', {response: {title:'AppCtrl: AUTH_EVENTS.sessionTimeout ... ',message:'Provvedere ad autenticarsi mediante uno dei metodi previsti.'} } );
            
        }); 
        

        $rootScope.$on(ENV.AUTH_EVENTS.oldAppVersion, function (event, next) {
            $log.info('AppCtrl : AUTH_EVENTS.oldAppVersion ... ');
            $log.info(event);
            $log.info(next);
            
            $state.go('error', {response: {title:'AppCtrl : AUTH_EVENTS.oldAppVersion ...  ... ',message:'Provvedere ad autenticarsi mediante uno dei metodi previsti.'} } );
        }); 

        $rootScope.$on('$stateChangeStart', function (event, next) {

            $log.info('AppCtrl on $stateChangeStart: ' + next.accessLogged);
            // $log.info(next);
            // $log.info(event);
                        
            if(next.accessLogged){
                $log.info('AppCtrl on $stateChangeStart: check if isAuthenticated : ' + AuthService.isAuthenticated());
                if(!AuthService.isAuthenticated()){

                    event.preventDefault();    
                    $log.info('AppCtrl on $stateChangeStart: notAuthenticated broadcast event');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);

                }
            } else {
                $log.info('AppCtrl on $stateChangeStart: PATH free');
            }
            
            /*
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                        // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
            */
        });
}])

// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
.controller('LoginController', 
                    [ '$scope', 'usSpinnerService', '$localStorage', '$rootScope', 'ENV', 'AuthService', 'UtilsService', '$state', '$log',
            function ( $scope,   usSpinnerService,   $localStorage,   $rootScope,   ENV,   AuthService,   UtilService,    $state,   $log) {
                
    $log.info('LoginController...');
    $log.info('LoginController...currentUser:' + $scope.currentUser );
    
    /*
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    document.getElementsByTagName('ion-nav-bar')[1].style.display = 'none';

    var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        };
  
    */

    $scope.user = {};
    $scope.user.email = '';
    $scope.user.password = '';
    $scope.loading = false;
    $scope.errorMessage = false;


    /*
    $scope.user ={
        email: 'a@a.com',
        password: '12345678'
    };

    $scope.credentials = {
        username: 'mario',
        password: ''
     };
    
     */
  
  

  $log.info('LoginController...fullApiEndpoint');
  var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogin + '/' + AuthService.getRelayStateToken();

  $log.info(fullApiEndpoint);

  $scope.fullApiEndpoint = fullApiEndpoint;
  
    
  // title ion-view
  // console.log('LoginController...set title' );
  // $scope.navTitle = '**Gestione Volontari**';
  //$scope.navTitle = '<img style="height:100px; width:auto;" src="img/logo2.jpg" />';
             
    $scope.goto_help = function($id) {
        $log.info('HelpController : Route to login');
        $state.go('menu.help');
    };     
                
    $scope.fullscreenOn = function(){
        $log.info('AboutController : fullscreenOn');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.request();
    };

    $scope.fullscreenOff = function(){
        $log.info('AboutController : fullscreenOff');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.exit();
    };            
                        
       
    $scope.clearPasswordCache = function(){
        $log.info('login:clearPasswordCache');
        $localStorage.password = '';
        $scope.credentials.password = '';
    };


  $scope.login = function () {

      $log.info('LoginController : login');
      $scope.loading = true;

      // usSpinnerService.spin('spinner-1');
      //$ionicLoading.show({template: 'Attendere...' });
      
      $log.info(credentials);

      var credentials = {
          username: $scope.user.email,
          password: $scope.user.password
      };

    AuthService.loginLDAP(credentials).then(function (res) {
        $log.info('LoginController : OK');
        $log.info(res);
        $scope.loading = false;
        
        //$ionicLoading.hide();
        $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);

    }, function (error) {
      $log.info('LoginController : login : ERROR'); 
      $log.info('error:', error); 
      //$ionicLoading.hide();
      $scope.loading = false;
      $scope.errorMessage = error;
      if(error.status == 0){
        $scope.errorMessage = '0';
      } else {
        $scope.errorMessage = 'Login Fallito! Riprova!';
      }

        /*

      if(error.status == 0){
        $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
      } else {
        $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
      }
      */

    });
  };


  $scope.logout = function (credentials) {
      $log.info('LoginController : logout ');
      $log.info(credentials);
      
    AuthService.logout(credentials).then(function () {
        $log.info('LoginController : logout broadcast... ');
        $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
       
    }, function (err) {
        $log.info('LoginController : logout err');
        $log.info(err);
        $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
    });
  };



    
  $scope.isAuthenticated = function(){
      $log.info('LoginController : isAuthenticated : ' + AuthService.isAuthenticated());
      return  AuthService.isAuthenticated();  
  }


 $scope.loginLDAP = function() {
      $log.info('LoginController : LoginLDAP');
      usSpinnerService.spin('spinner-1');

      var credentials = {
          username: $scope.user.email,
          password: $scope.user.password
      };

      $log.info(credentials);
 
      AuthService.loginLDAP(credentials)
        .then(function() {
          usSpinnerService.stop('spinner-1');
          $log.info('LoginController : NTLMLogin success');
          $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);
        })
        .catch(function(error) {
          usSpinnerService.stop('spinner-1');
          $log.info('LoginController : NTLMLogin ERROR');
          $log.info(error);
          if (error.data) {
            $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
          } else
            $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
        });
    };



 $scope.NTLMLogin = function(credentials) {
      $log.info('LoginController : NTLMLogin');
 
      AuthService.loginNTLM()
        .then(function() {
          $log.info('LoginController : NTLMLogin success');
          $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);
        })
        .catch(function(error) {
          $log.info('LoginController : NTLMLogin ERROR');
          $log.info(error);
          if (error.data) {
            $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
          } else
            $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
        });
    };

 $scope.DEMOLogin = function() {
      $log.info('LoginController : DEMOLogin');
 
      AuthService.loginDEMO()
        .then(function() {
          $log.info('LoginController : DEMOLogin success');
          $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);
        })
        .catch(function(error) {
          $log.info('LoginController : DEMOLogin ERROR');
          $log.info(error);
          if (error.data) {
            $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
          } else
            $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
        });
    };
 


}])

// AboutController ------------------------------------------------------------------------------------
.controller('AboutController', 
            [ '$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$http', '$log',
            function ($scope, $rootScope, ENV, AuthService, Session, $location, $http, $log ) {
    $log.info('AboutController...');
    $log.info(Session);
    $scope.navTitle = Session.nome_breve_utenti;
    $scope.base_url = $rootScope.base_url;
                
    $scope.$location = {};
    //$ionicLoading.show({   template: 'Loading...'   });         
    angular.forEach("protocol host port path search hash".split(" "), function(method){
        $scope.$location[method] = function(){
        var result = $location[method].call($location);
        return angular.isObject(result) ? angular.toJson(result) : result;
        };
    });
    //$ionicLoading.hide();
               
                
    $scope.fullscreenOn = function(){
        $log.info('AboutController : fullscreenOn');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.request();
    };

    $scope.fullscreenOff = function(){
        $log.info('AboutController : fullscreenOff');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.exit();
    };
                
    $scope.test_connection = function(){
        $log.info('AboutController : test_connection');
        $ionicLoading.show({   template: 'Loading...'   }); 
      
        $http({method: 'GET', url: $rootScope.base_url + '/mv/testconnection'}).
        success(function(data, status, headers, config) {
                $log.info($rootScope.base_url + '/mv/testconnection');
                $log.info(data);
                $log.info(status);
                $log.info(headers);
                $log.info(config);
            
                var alertPopup = $ionicPopup.alert({
                title: 'OK!',
                template: 'Test di connessione ok'
                });
                    alertPopup.then(function(res) {
                    $log.info('Quit popup');
                });
        }).
        error(function(data, status, headers, config) {
                $log.info($rootScope.base_url + '/mv/testconnection');
                $log.info(data);
                $log.info(status);
                $log.info(headers);
                $log.info(config);
                var alertPopup = $ionicPopup.alert({
                title: 'Errori!',
                template: 'Test di connessione FALLITO'
                });
                    alertPopup.then(function(res) {
                    $log.info('Quit popup');
                });
        });
        
        
        $ionicLoading.hide();
        
    };
                
                
    
}])

// HelpController ------------------------------------------------------------------------------------
.controller('HelpController', 
                   [ '$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup','$ionicSlideBoxDelegate','$state','$log',
            function ($scope,   $rootScope,   ENV,   AuthService,  Session,  $location,  $ionicLoading,  $http,   $ionicPopup,  $ionicSlideBoxDelegate,  $state,$log ) {
    $log.info('HelpController...');
    
    //Restangular.setBaseUrl($rootScope.base_url); 

    $scope.UrlApi = $rootScope.base_url
        // action new relazione
    $scope.goto_login = function($id) {
        $log.info('HelpController : Route to login');
        $state.go('menu.login');
    };            
    
    $scope.change_Api1 = function() {
        $scope.UrlApi = "http://localhost:9988/segnalazioni/upload";
        $rootScope.base_url = $scope.UrlApi;
        //Restangular.setBaseUrl($rootScope.base_url); 
    }

    $scope.change_Api2 = function() {
        $scope.UrlApi = "https://pmlab.comune.rimini.it/api/";
        $rootScope.base_url = $scope.UrlApi;
        //Restangular.setBaseUrl($rootScope.base_url); 
    }


}])

// SNavbarCtrl ------------------------------------------------------------------------------------
.controller('SNavbarCtrl',

           ['$scope', 'dialogs', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log',
    function($scope,   dialogs,   $rootScope,   AuthService,   Session,   $state,  ENV ,  $log ) {

    $scope.isCollapsed = false;

    $scope.isAuthenticated = function() {
      // return $auth.isAuthenticated();
      return AuthService.isAuthenticated();
    };

    $scope.isAdmin = function() {
      // return $auth.isAuthenticated();
      return AuthService.isAdmin();
    };

    $scope.switchCollapsed = function (){
        console.log($scope.isCollapsed);
        $scope.isCollapsed = !$scope.isCollapsed;
        console.log($scope.isCollapsed);
    }


    $scope.getUserId = function() {

      if ($auth.isAuthenticated()) {
        return $auth.getPayload().sub.userId;
      } else {
        return '';
      }
      
    };


  }])


// SNavbarCtrl ------------------------------------------------------------------------------------
.controller('landingSAMLCtrl',

           ['$scope', '$stateParams', 'dialogs', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log',
    function($scope,   $stateParams,   dialogs,   $rootScope,   AuthService,   Session,   $state,  ENV ,  $log ) {


    $log.info('landingSAMLCtrl...');
    
    // Verifica RelayState
    if($stateParams.RelayState) {
        // Match RelayState 
        if(AuthService.checkRelayStateToken($stateParams.RelayState)){
            if($stateParams.tokenId) {
                //$scope.tokenId = $stateParams.tokenId;
                //$log.info($scope.tokenId);        
                AuthService.storeToken($stateParams.tokenId);
                $log.info('landingSAMLCtrl: go to profile. ..');
                $state.go('profile');
            } else{
                $log.info('landingSAMLCtrl: No TokenId');
            }
        }else{
          $log.info('landingSAMLCtrl: RelayState NO MATCH!');  
        }
    } else{
        $log.info('landingSAMLCtrl: No RelayState');
    }


    
    $scope.isAuthenticated = function() {
      // return $auth.isAuthenticated();
      return AuthService.isAuthenticated();
    };





    $scope.getUserId = function() {

      if ($auth.isAuthenticated()) {
        return $auth.getPayload().sub.userId;
      } else {
        return '';
      }
      
    };

  }])


// HelpController ------------------------------------------------------------------------------------
.controller('ModalController', 
            [  '$uibModalInstance','$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$http', '$state','$log',
       function ( $uibModalInstance, $scope,  $rootScope, ENV, AuthService, Session, $location,  $http, $state,$log ) {
    $log.info('HelpController...');
    
    //Restangular.setBaseUrl($rootScope.base_url); 

    //$scope.items = items;
    //$scope.selected = { item: $scope.items[0] };

    $scope.ok = function () {
        //$uibModalInstance.close($scope.selected.item);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('eseguiIstanzaCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$stateParams', 'Upload', '$log', '$timeout','ENV','UtilsService', 'vcRecaptchaService',
     function($rootScope,  $scope,   $http,   $state,  $stateParams,    Upload ,  $log,   $timeout,  ENV,  UtilsService,   vcRecaptchaService  ) {
    
  $log.info('eseguiIstanzaCtrl', $stateParams.id);    
  
  $scope.iC = {};
  $scope.iC.idIstanza = 0;
  $scope.iC.statoIstanza = 0;
  $scope.iC.btnInviaDati = 'CLICCA PER INVIARE I DATI';
  $scope.iC.btnDisabled = false;
  $scope.iC.errorMsg = '';
  $scope.iC.errorTitle = '';
  $scope.iC.successTitle = '';
  $scope.iC.successMsg = {};

  $scope.info = {};
  $scope.info.file1 = {};
  $scope.info.file2 = {};
  $scope.info.file3 = {};
  
  $scope.modelForm = {};
  
  $scope.model = {};
  $scope.user = {};
  $scope.token = '';

  // $scope.showLoader = function() { $scope.iC.statoIstanza = 199; }

  $scope.inviaDati = function() {
    $log.info('eseguiIstanzaCtrl: updateProfile');
    var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiIstanzeUpload + '/' + $stateParams.id;
    $log.info('eseguiIstanzaCtrl: updateProfile : ' + fullApiEndpoint );
    // $scope.modelForm.RecaptchaResponse = 'RecaptchaResponseMARIO';
    $log.info($scope.modelForm.RecaptchaResponse);

    $scope.iC.statoIstanza = 199;
    $scope.iC.btnInviaDati = 'INVIO IN CORSO...ATTENDERE';
    $scope.iC.btnDisabled = true;
    Upload.upload({
        url: fullApiEndpoint,
        method: 'POST',
        //files: vm.options.data.fileList
        headers: {  'ISTANZE-API-KEY': $scope.iC.token, 
                    'RECAPTCHA-TOKEN': $scope.modelForm.RecaptchaResponse}, // only for html5
        data: { fields: $scope.modelForm } 
    }).then(function (response) {
        $log.info('Success ');
        $log.info(response);
        $scope.iC.statoIstanza = response.status;
        $scope.iC.successMsg= response.data.msg;
        $scope.iC.successTitle= response.data.title;
        $scope.iC.successTxtMsg= response.data.txtMsg;
        //usSpinnerService.stop('spinner-1');
    }, function (response) {
        $log.info('Error status: ' + response.status);
        $log.info(response.status);
        $scope.iC.statoIstanza = response.status;
        $scope.iC.errorMsg= response.data.msg;
        $scope.iC.errorTitle= response.data.title;
        $scope.iC.successTxtMsg= response.data.txtMsg;
       
    }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $log.info(progressPercentage);
    });
};
   



$scope.caricaImpostazioni = function(){
        $log.info('eseguiIstanzaCtrl: caricaImpostazioni');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiIstanzeRecuperaImpostazioni + '/' + $stateParams.id;
        $log.info('eseguiIstanzaCtrl: caricaImpostazioni : ' + fullApiEndpoint );
        $http.get(fullApiEndpoint)
            .then(function(response) {
                $log.info(response);
   

                $scope.iC.btnInviaDati = 'CLICCA PER INVIARE I DATI';
                $scope.iC.btnDisabled = false;
            

                $scope.iC.numeroAllegati = response.data.numeroAllegati;
                $scope.iC.maxFileSize = response.data.maxFileSize;

                $scope.iC.descrizionePrincipale = response.data.descrizionePrincipale;
                $scope.iC.titles = response.data.titles;
                $scope.iC.file1 = response.data.file1;
                $scope.iC.file2 = response.data.file2;
                $scope.iC.file3 = response.data.file3;
                $scope.iC.file4 = response.data.file4;
                $scope.iC.file5 = response.data.file5;

                $scope.iC.contattiFooter = response.data.contattiFooter;
                $scope.iC.token = response.data.token;
                $scope.iC.idIstanza = response.data.isIstanza;


                if(response.data.defaultUserData){
                    $scope.modelForm.nomeRichiedente = response.data.defaultUserData.nomeRichiedente;
                    $scope.modelForm.cognomeRichiedente = response.data.defaultUserData.cognomeRichiedente;
                    $scope.modelForm.codiceFiscaleRichiedente = response.data.defaultUserData.codiceFiscaleRichiedente;
                    $scope.modelForm.dataNascitaRichiedente = response.data.defaultUserData.dataNascitaRichiedente;
                    $scope.modelForm.indirizzoRichiedente = response.data.defaultUserData.indirizzoRichiedente;
                    $scope.modelForm.cittaRichiedente = response.data.defaultUserData.cittaRichiedente;
                    $scope.modelForm.capRichiedente = response.data.defaultUserData.capRichiedente;
                    $scope.modelForm.emailRichiedente = response.data.defaultUserData.emailRichiedente;
                    $scope.modelForm.recapitoTelefonicoRichiedente = response.data.defaultUserData.recapitoTelefonicoRichiedente;
                    $scope.modelForm.noteRichiedente = response.data.defaultUserData.noteRichiedente;
                }

        }).catch(function(response) {
            $log.info('eseguiIstanzaCtrl: caricaImpostazioni:ERRORE');
            $log.info(response);
            $log.info(response.status);
            $scope.iC.statoIstanza = response.status;
            $scope.iC.errorMsg= response.data.msg;
            $scope.iC.errorTitle= response.data.title;
        });      
};

$scope.caricaImpostazioni();


}]);


'use strict';

/* Filters */

angular.module('myApp.filters', [])



.filter('interpolate', ['version', function(version) {
    return function(text) {
        console.log('FILTER:interpolate:'+input);
      return String(text).replace(/\%VERSION\%/mg, version);
    }
}])
.filter("asDate", function () {
    return function (input) {
        console.log('FILTER:asDate:'+input);
        return new Date(input);
    }
})
.filter("utc8change", function () {
    return function (input) {
        //console.log('utc8changee:'+input);
        input = String(input).replace('Â°','°');
        input = String(input).replace('Ã¨','è');
        input = String(input).replace('Ã','à');
        return input;
    }
})
.filter('datetmUTC', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
    console.log('FILTER:datetmUTC:'+input);
    var _date = $filter('date')(new Date(input),'MMM dd yyyy - HH:mm:ss');
    console.log('FILTER:datetmUTC:'+_date);
    var _now = new Date(_date);
    console.log('FILTER:datetmUTC:'+_now);
    console.log('FILTER:datetmUTC:'+_now.getTime());
    return _now.getTime();
 };
});
'use strict';

/* Controllers */

angular.module('myApp.directives', []);
'use strict';

/* Directives */


angular.module('myApp.directives')

/*
.directive('progressbar', [function() {
    return {
        restrict: 'E',
        scope: {
            'progress': '=pbv'
        },
        controller: function($scope, $element, $attrs) {
            $element.progressbar({ value: $scope.progress  });

            $scope.$watch(function() {
                $element.progressbar({value: $scope.progress})
            })
        }
    }
}])
*/
.directive('myDirective', function(){
    return {

      restrict: 'E',
      template: [
          '<b>From directive scope:</b> {{ directivevariable }}<br/>',
          '<b>From directive controller:</b> {{ vm.controllerVariable }} - {{ vm.controllerCounter }} <br/>',
          '<b>Adapted by directive controller:</b> {{ vm.controllerAdapted }}  <br/>',
          '<b>Test Parent Scope:</b> {{ vm.model.nomeRichiedente }}  <br/>',
          '<button class="Button Button--info u-text-r-xs" ng-click="vm.addItem()">INTERNAL</button></div>'
        ].join(''),
      scope: {
      },
      bindToController: {
        directivevariable: '=',
        directivefunction: '&'
      },
      controller: function(){
        var vm = this;
        vm.controllerCounter = 0;
        vm.controllerVariable = 'Hi, I am from the controller';
        vm.controllerAdapted = vm.directivevariable + '(ctrl adapted)';

        console.log('directive init parameters');
        console.log(vm.directivevariable);
        console.log(vm.directivefunction());

        vm.addItem = function () {
            vm.controllerCounter = vm.controllerCounter + 1;
            console.log('INTERNAL add Item click', vm.controllerCounter);
            vm.directivefunction();
            scope.$apply(function(){
                vm.model.scope.text = '2';
           });
        };


      },
      controllerAs: 'vm'
    }
  })


// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_progressbar_3
 .directive('crProgressBar', function() {
    return {
        restrict: 'EA', //attribute or element
        scope: {
            p1: '=',
            t1: '=',
            f1: '&'
           //bindAttr: '='
          },
          template: '<div class="u-background-20 u-padding-all-s u-text-r-xxl">' + 
                    '<progress value="{{p1}}" max="1000"></progress></br>' +
                    '<small>{{t1}}</small></br>' +
                    // '<button class="Button Button--info u-text-r-xs" ng-click="addItem()">ADD(int)</button>' + 
                    // '<button class="Button Button--info u-text-r-xs" ng-click="resetItem()">RESET(int)</button>' + 
                    '</div>',
          /*
          template: '<div class="u-text-r-xxl u-padding-all-s u-background-60"><input ng-model="progressBarValue">' +
          '<progress max="100" value="80"></progress></div>',
          */
          replace: true,
          //require: 'ngModel',
          link: function($scope, element, attrs, ctrl) {

            element.on('click', function () {
                // console.log('click');
                // element.html('You clicked me!');
            });
            element.on('mouseenter', function () {
                // console.log('mouseenter');
                // $scope.f1();
                // console.log($scope.progressBarValue);
                // $scope.progressBarFunction();
            });
            element.on('mouseleave', function () {
                // console.log('mouseleave');
                // $scope.progressBarFunction();
            });

            // var elem = angular.element(document.querySelector('#klik'))
            // angular.element(elem).triggerHandler('click');
            
            //var textField = $('input', elem).attr('ng-model', 'myDirectiveVar');
            // $compile(textField)($scope.$parent);

          },
          controller: function($scope) {
            
            console.log('INIT directive');
            console.log($scope.progressBarValue);
            console.log($scope.p1);

            $scope.addItem = function () {
                console.log('INTERNAL add Item click');
                console.log($scope.progressBarValue);
                console.log($scope.progressBarValue2);
                console.log($scope.progressBarFunction);
                console.log($scope.p1);
                console.log($scope.p2);
   
                $scope.p1 = $scope.p1 + 1;

                $scope.f1();
                // $scope.$apply(function(){
                //     $scope.progressBarFunction();
                // });
            };

            $scope.resetItem = function () {
                console.log('Reset INTERNAL');
   
                $scope.p1 = 0;
                console.log($scope.p1);

                $scope.f1();
                // $scope.$apply(function(){
                //     $scope.progressBarFunction();
                // });
            };


          }
    };
  })

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      console.log('appVersion');
      elm.text(version);
    };
  }])

.directive('formlyExampleDirective', function() {
    return {
      templateUrl: 'templates/formly-directive-template.html'
    };
 })


.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
})


.directive('browserVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
            var agentStr = navigator.userAgent;
            this.IsIE = false;
            this.IsOn = undefined;  //defined only if IE
            this.Version = undefined;
            console.log('browserVersion');

        if (agentStr.indexOf("MSIE 7.0") > -1) {
          this.IsIE = true;
          this.IsOn = true;
          if (agentStr.indexOf("Trident/6.0") > -1) {
            this.Version = 'IE10';
          } else if (agentStr.indexOf("Trident/5.0") > -1) {
            this.Version = 'IE9';
          } else if (agentStr.indexOf("Trident/4.0") > -1) {
            this.Version = 'IE8';
          } else {
            this.IsOn = false; // compatability mimics 7, thus not on
            this.Version = 'IE7';
          }
        } //IE 7
  };
  }])

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.directive('fancySelect', [ '$ionicModal',function($ionicModal) 
            {
            return {
                /* Only use as <fancy-select> tag */
                restrict : 'E',

                /* Our template */
                templateUrl: 'templates/fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items'        : '=', /* Items list is mandatory */
                    'text'         : '=', /* Displayed text is mandatory */
                    'value'        : '=', /* Selected value binding is mandatory */
                    'callback'     : '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText    = attrs.headerText || '';
                    scope.labelText     = attrs.labelText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText   = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText      = attrs.noteText || '';
                    scope.noteImg       = attrs.noteImg || '';
                    scope.noteImgClass  = attrs.noteImgClass || '';
                    
                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here : 
                     * 
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector. 
                     * 
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view. 
                     * 
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     * 
                     * Also, seems that animations do not work 
                     * anymore.
                     * 
                     */
                    $ionicModal.fromTemplateUrl(
                        'templates/fancy-select-items.html',
                          {'scope': scope}
                    ).then(function(modal) {
                        scope.modal = modal;
                    });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id+',';
                                    scope.text = scope.text + '\r' + item.text+', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0,scope.value.length - 1);
                            scope.text = scope.text.substr(0,scope.text.length - 2);
                            
                            console.log('#DIRECTIVE#Fancy#value:'+  scope.value);
                            console.log('#DIRECTIVE#Fancy#text:'+  scope.text);
                            
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();
                        
                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }

                    /* Show list */
                    scope.showItems = function (event) {
                        event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();
                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function() {
                      scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;

                        // Hide items
                        scope.hideItems();
                        
                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }
                }
            };
        }
    ]
);
// Direttive per custom validation
'use strict';

angular.module('myApp.directives')
.directive('blacklist', function (){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
          var blacklist = attr.blacklist.split(',');
          ngModel.$parsers.unshift(function (value) {
             ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
             return value;
          });
      }
   };
})

/* verifica che un valore sia di soli numeri */


/*
.directive('onlyNumber', function (){ 
    return {
       require: 'ngModel',
       restrict: 'A',
       
       
 link: function(scope, element, attr, ctrl) {
 
     // please note you can name your function & argument anything you like
     function customValidator(ngModelValue) {
         
         // check if contains uppercase
         // if it does contain uppercase, set our custom `uppercaseValidator` to valid/true
         // otherwise set it to non-valid/false
  
         // check if contains number
         // if it does contain number, set our custom `numberValidator`  to valid/true
         // otherwise set it to non-valid/false
         if (/^[0-9]*$/.test(ngModelValue)) {
             ctrl.$setValidity('numberValidator', true);
         } else {
             ctrl.$setValidity('numberValidator', false);
         }
 
         // check if the length of our input is exactly 6 characters
         // if it is 6, set our custom `sixCharactersValidator` to valid/true
         // othwise set it to non-valid/false
 
 
         // we need to return our ngModelValue, to be displayed to the user(value of the input)
         return ngModelValue;
     }
 
     // we need to add our customValidator function to an array of other(build-in or custom) functions
     // I have not notice any performance issues, but it would be worth investigating how much
     // effect does this have on the performance of the app
     ctrl.$parsers.push(customValidator);
     
 }
    };
 })
*/

// /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

.directive('onlyNumber', function (){ 
    return {
       require: 'ngModel',
       link: function(scope, elem, attr, ngModel) {
           //var blacklist = attr.blacklist.split(',');
            ngModel.$validators.onlyNumber = function(modelValue,viewValue){
                var myValue = modelValue || viewValue;
                // console.log(myValue);

                if (/^[0-9]*$/.test(myValue)) {
                   ngModel.$setValidity('numberValidator', true);
                   return true;
                } else {
                    ngModel.$setValidity('numberValidator', false);
                    return false;
                }
           }
        }
    };
 })



.directive('emailValida', function (){ 
    return {
       require: 'ngModel',
       link: function(scope, elem, attr, ngModel) {
           //var blacklist = attr.blacklist.split(',');
            ngModel.$validators.emailValida = function(modelValue,viewValue){
                var myValue = modelValue || viewValue;
                // console.log(myValue);

                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(myValue)) {

                
                   ngModel.$setValidity('emailValidator', true);
                   return true;
                
                } else {
                    ngModel.$setValidity('emailValidator', false);
                    return false;
                }
      
                
           }
        }
    };
 })



 .directive('datanascitaValida', function (){ 
    return {
       require: 'ngModel',
       link: function(scope, elem, attr, ngModel) {
           //var blacklist = attr.blacklist.split(',');
            ngModel.$validators.datanascitaValida = function(modelValue,viewValue){
                var myValue = modelValue || viewValue;
                // console.log(myValue);

                if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(myValue)) {

                    var anno = parseInt(myValue.substr(6),10);
                    var mese = parseInt(myValue.substr(3, 2),10);
                    var giorno = parseInt(myValue.substr(0, 2),10);

                    // console.log(anno, mese, giorno, myValue);
                    var newData = new Date(anno, mese-1, giorno);
                    // console.log(newData.getFullYear(), newData.getMonth()+1, newData.getDate());
                    // console.log(newData.getFullYear() == anno);
                    // console.log((newData.getMonth()+1) == mese);
                    // console.log((newData.getDate() == giorno));


                    if ( (newData.getFullYear() == anno) && ((newData.getMonth()+1) == mese) && (newData.getDate() == giorno) ) {
                        ngModel.$setValidity('dateValidator', true);    
                        return true;
                    } else {
                        ngModel.$setValidity('dateValidator', false);
                        return false;
                    }

                } else {
                    ngModel.$setValidity('dateValidator', false);
                    return false;
                }
      
           }
        }
    };
 })

/* 
.directive('codiceFiscale', function (){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
          var blacklist = attr.blacklist.split(',');
          ngModel.$parsers.unshift(function (value) {
             ngModel.$setValidity('codiceFiscale', blacklist.indexOf(value) === -1);
             return value;
          });
      }
   };
})

*/

/*
// direttiva che controlla il contenuto di un altro campo
.directive('compareTo', function (){ 
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            console.log('compareTo', modelValue);     
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})
*/