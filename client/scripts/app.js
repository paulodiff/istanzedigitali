"use strict";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myApp', [//'ionic',
                         'ui.bootstrap',   
                         'ui.router',
                         'ui.select',
                         'dialogs.main',
                         // 'formly',
                         // 'formlyBootstrap',
                         //'satellizer',
                         'ngResource',
                         'ngSanitize',
                         'ngMessages',
                         //'naif.base64',
                         //'ngCordova',
                         'angularSpinner',
                         //'restangular',
                         'ngAnimate',
                         //'ngMockE2E',
                         'ngStorage',
                         'ngFileUpload',
                         // 'ngTable',
                         // 'ui.grid',
                         // 'ui.grid.selection',
                         'ui.validate',
                         // 'chart.js',
                         'vcRecaptcha',
                         //'uiGmapgoogle-maps',
                         'myApp.filters',
                         'myApp.services',
                         'myApp.directives',
                         'myApp.controllers',
                         'myApp.config'])
                         //'myApp.mockBackend',
                         //'myApp.mockService'])

// PATCH Possibly unhandled rejection with Angular 1.5.9
.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


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
    $urlRouterProvider.otherwise('homeIstanze');
    
/*
    $stateProvider.state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/mainDashboard.html"
    });
    */
    
    

    $stateProvider.state('homeIstanze', {
        url: '/homeIstanze',
        controller: 'homeCtrl',
        templateUrl: 'templates/Shome.html',
        accessLogged: false,
        accessLevel: 'free1' 
    });

    $stateProvider.state('protocollo', {
        url: '/protocollo',
        templateUrl: 'templates/protocollo.html',
        controller: 'ProtocolloCtrl',
        controllerAs: 'vm',
        resolve: {
          //loginRequired: loginRequired
        }
    });



    /*
    
        $stateProvider.state('menu.home',{
            url: '/home',
            templateUrl: "templates/loginDashboard.html",
            controller:'LoginController',
            accessLogged: false,
            accessLevel: 'free1' 
    });

    
    
    
    
    /* Login/Logout/Auth/Profile */
    
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/Slogin.html',
        // controller: 'SLoginCtrl',
        controller: 'LoginController',
        accessLogged: false
    });

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'templates/Ssignup.html',
        controller: 'SSignupCtrl',
    });

    $stateProvider.state('logout', {
        url: '/logout',
        templateUrl: 'templates/Slogin.html',
        controller: 'LoginController'
    });
      
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'templates/Sprofile.html',
        controller: 'profileMgrCtrl',
        accessLogged: true
    });

    $stateProvider.state('landingSAML', {
        url: '/landingSAML/{tokenId}/{RelayState}',
        templateUrl: 'templates/landingSAML.html',
        controller: 'landingSAMLCtrl',
        accessLogged: false
    });


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
    $.material.init();

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
    console.log('hide loading screen...');
    //loading_screen.finish();
});