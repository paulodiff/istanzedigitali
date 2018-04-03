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
                         'formly',
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
        // controller: 'homeCtrl',
        templateUrl: 'templates/homeIstanzeITALIA.html',
        accessLogged: false,
        accessLevel: 'free1' 
    });
    

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

    $stateProvider.state('eseguiIstanzaDinamica', {
      url: '/eseguiIstanzaDinamica/{id}',
      controller: 'eseguiIstanzaDinamicaCtrl',
      templateUrl: 'templates/eseguiIstanzaDinamicaITALIA.html',
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
    
    $stateProvider.state('login', {
      url: '/login/{id}',
      templateUrl: 'templates/loginFormITALIA.html',
      // controller: 'SLoginCtrl',
      controller: 'LoginController',
      accessLogged: false
  });


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


//formly configuration GLOBALE
.config(function(formlyConfigProvider) {

    // formlyConfigProvider.extras.removeChromeAutoComplete = true;

    formlyConfigProvider.setType({
      name: 'input',
      template: `
          <div class="Form-field">
          <label class="u-text-r-m Form-label is-required">{{options.templateOptions.label}}</label>
          <input type="{{options.templateOptions.type || 'text'}}"
	        class="Form-input u-text-r-s u-borderRadius-m"
	        id="{{id}}"
	        formly-dynamic-name="id"
	        formly-custom-validation="options.validators"
	        placeholder="{{options.templateOptions.placeholder}}"
	        aria-describedby="{{id}}_description"
	        ng-required="options.templateOptions.required"
	        ng-disabled="options.templateOptions.disabled"
          ng-model="model[options.key]">
          </div>
          `
    });

    formlyConfigProvider.setType({
      name: 'select',
      template: `
        <div class="Form-field">
          <label class="u-text-r-m Form-label is-required">{{options.templateOptions.label}}</label>
          <select 
            class="Form-input u-text-r-s u-borderRadius-m" 
            ng-model="model[options.key]"
            ng-options="option.value as option.name group by option.group for option in options.templateOptions.options">
          </select>
        </div>
        `
      });



    formlyConfigProvider.setType({
        name: 'ng-file-upload',
        extends: 'input',
        template: '<input type="file"  ngf-select="formState.upload($files)"  name="files" multiple>'
     });


   // ng-model="model[options.key]"
   formlyConfigProvider.setType({
        name: 'upload',
        template: `
          <div class="Form-field">
          <label class="u-text-r-m Form-label is-required">{{options.templateOptions.label}}</label><br>
            <input 
                type="file" 
                ngf-select="formState.ngfChange(options.key,$file,$event.type)" 
                ng-model="files"
                class="Button Button--default u-text-r-xs u-inlineBlock" 
                accept="text/csv" 
                ngf-pattern="'application/pdf'"
                ngf-max-size="2MB" 
                ngf-min-size="1"
                required>
          </div>
       `
      });



    formlyConfigProvider.setType({
      name: 'description',
      template: `
          <h2 class="u-text-h3">{{options.templateOptions.title}}</h2>
          <p class="u-text-r-m">{{options.templateOptions.description}}</p>
          `
    });

    formlyConfigProvider.setType({
      name: 'infoAlert',
      template: `
      <div class="Callout Callout--could u-text-r-xs" role="note">
          <h2 class="u-text-h3">{{options.templateOptions.title}}</h2>
          <p class="u-text-p">{{options.templateOptions.description}}</p>
      </div>
      `
    });



    formlyConfigProvider.setWrapper([
      {
        template: [
          '<div class="formly-template-wrapper form-group"',
              'ng-class="{\'has-error\': options.validation.errorExistsAndShouldBeVisible}">',
            // '<label for="{{::id}}">WRAP - {{options.templateOptions.label}}</label>',
            '<formly-transclude></formly-transclude>',
            '<div class="validation"',
              'style="color:maroon"',
              'ng-if="options.validation.errorExistsAndShouldBeVisible"',
              'ng-messages="options.formControl.$error">',
              // '<div ng-messages-include="validation.html"></div>',
              '<div class="Prose Alert Alert--error Alert--withIcon u-layout-prose u-padding-r-bottom u-padding-r-right u-margin-r-bottom" ng-message="maxSize">Dimensione file eccessiva</div>',
              '<div class="Prose Alert Alert--error Alert--withIcon u-layout-prose u-padding-r-bottom u-padding-r-right u-margin-r-bottom" ng-message="pattern">Formato file non valido</div>',
              '<div class="Prose Alert Alert--error Alert--withIcon u-layout-prose u-padding-r-bottom u-padding-r-right u-margin-r-bottom" ng-message="required">Questo valore è obbligatorio</div>',
              '<div class="Prose Alert Alert--error Alert--withIcon u-layout-prose u-padding-r-bottom u-padding-r-right u-margin-r-bottom" ng-message="minlength">Valore troppo corto</div>',
              '<div class="Prose Alert Alert--error Alert--withIcon u-layout-prose u-padding-r-bottom u-padding-r-right u-margin-r-bottom" ng-message="maxlength">Valore troppo lungo</div>',
              '<div class="Prose Alert Alert--error Alert--withIcon u-layout-prose u-padding-r-bottom u-padding-r-right u-margin-r-bottom" ng-message="email">Formato email non valido</div>',
              '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
              '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
            '</div>',
          '</div>',
          '</div>'
        ].join(' ')
      }]);

    /*
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

*/

    /*  

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

    */  

    /*  

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

    */

    // formly Wrapper

    /*

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
    */

})


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