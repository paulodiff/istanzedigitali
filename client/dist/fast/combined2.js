/**
 * angular-recaptcha build:2016-07-19 
 * https://github.com/vividcortex/angular-recaptcha 
 * Copyright (c) 2016 VividCortex 
**/

/*global angular, Recaptcha */
(function (ng) {
    'use strict';

    ng.module('vcRecaptcha', []);

}(angular));

/*global angular */
(function (ng) {
    'use strict';

    function throwNoKeyException() {
        throw new Error('You need to set the "key" attribute to your public reCaptcha key. If you don\'t have a key, please get one from https://www.google.com/recaptcha/admin/create');
    }

    var app = ng.module('vcRecaptcha');

    /**
     * An angular service to wrap the reCaptcha API
     */
    app.provider('vcRecaptchaService', function(){
        var provider = this;
        var config = {};
        provider.onLoadFunctionName = 'vcRecaptchaApiLoaded';

        /**
         * Sets the reCaptcha configuration values which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param defaults  object which overrides the current defaults object.
         */
        provider.setDefaults = function(defaults){
            ng.copy(defaults, config);
        };

        /**
         * Sets the reCaptcha key which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param siteKey  the reCaptcha public key (refer to the README file if you don't know what this is).
         */
        provider.setSiteKey = function(siteKey){
            config.key = siteKey;
        };

        /**
         * Sets the reCaptcha theme which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param theme  The reCaptcha theme.
         */
        provider.setTheme = function(theme){
            config.theme = theme;
        };

        /**
         * Sets the reCaptcha stoken which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param stoken  The reCaptcha stoken.
         */
        provider.setStoken = function(stoken){
            config.stoken = stoken;
        };

        /**
         * Sets the reCaptcha size which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param size  The reCaptcha size.
         */
        provider.setSize = function(size){
            config.size = size;
        };

        /**
         * Sets the reCaptcha type which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param type  The reCaptcha type.
         */
        provider.setType = function(type){
            config.type = type;
        };

        /**
         * Sets the reCaptcha configuration values which will be used by default is not specified in a specific directive instance.
         *
         * @since 2.5.0
         * @param onLoadFunctionName  string name which overrides the name of the onload function. Should match what is in the recaptcha script querystring onload value.
         */
        provider.setOnLoadFunctionName = function(onLoadFunctionName){
            provider.onLoadFunctionName = onLoadFunctionName;
        };

        provider.$get = ['$rootScope','$window', '$q', function ($rootScope, $window, $q) {
            var deferred = $q.defer(), promise = deferred.promise, recaptcha;

            $window.vcRecaptchaApiLoadedCallback = $window.vcRecaptchaApiLoadedCallback || [];

            var callback = function () {
                recaptcha = $window.grecaptcha;

                deferred.resolve(recaptcha);
            };

            $window.vcRecaptchaApiLoadedCallback.push(callback);

            $window[provider.onLoadFunctionName] = function () {
                $window.vcRecaptchaApiLoadedCallback.forEach(function(callback) {
                    callback();
                });
            };


            function getRecaptcha() {
                if (!!recaptcha) {
                    return $q.when(recaptcha);
                }

                return promise;
            }

            function validateRecaptchaInstance() {
                if (!recaptcha) {
                    throw new Error('reCaptcha has not been loaded yet.');
                }
            }


            // Check if grecaptcha is not defined already.
            if (ng.isDefined($window.grecaptcha)) {
                callback();
            }

            return {

                /**
                 * Creates a new reCaptcha object
                 *
                 * @param elm  the DOM element where to put the captcha
                 * @param conf the captcha object configuration
                 * @throws NoKeyException    if no key is provided in the provider config or the directive instance (via attribute)
                 */
                create: function (elm, conf) {

                    conf.sitekey = conf.key || config.key;
                    conf.theme = conf.theme || config.theme;
                    conf.stoken = conf.stoken || config.stoken;
                    conf.size = conf.size || config.size;
                    conf.type = conf.type || config.type;

                    if (!conf.sitekey || conf.sitekey.length !== 40) {
                        throwNoKeyException();
                    }
                    return getRecaptcha().then(function (recaptcha) {
                        return recaptcha.render(elm, conf);
                    });
                },

                /**
                 * Reloads the reCaptcha
                 */
                reload: function (widgetId) {
                    validateRecaptchaInstance();

                    // $log.info('Reloading captcha');
                    recaptcha.reset(widgetId);

                    // Let everyone know this widget has been reset.
                    $rootScope.$broadcast('reCaptchaReset', widgetId);
                },

                /**
                 * Gets the response from the reCaptcha widget.
                 *
                 * @see https://developers.google.com/recaptcha/docs/display#js_api
                 *
                 * @returns {String}
                 */
                getResponse: function (widgetId) {
                    validateRecaptchaInstance();

                    return recaptcha.getResponse(widgetId);
                }
            };

        }];
    });

}(angular));

/*global angular, Recaptcha */
(function (ng) {
    'use strict';

    var app = ng.module('vcRecaptcha');

    app.directive('vcRecaptcha', ['$document', '$timeout', 'vcRecaptchaService', function ($document, $timeout, vcRecaptcha) {

        return {
            restrict: 'A',
            require: "?^^form",
            scope: {
                response: '=?ngModel',
                key: '=?',
                stoken: '=?',
                theme: '=?',
                size: '=?',
                type: '=?',
                tabindex: '=?',
                required: '=?',
                onCreate: '&',
                onSuccess: '&',
                onExpire: '&'
            },
            link: function (scope, elm, attrs, ctrl) {
                scope.widgetId = null;

                if(ctrl && ng.isDefined(attrs.required)){
                    scope.$watch('required', validate);
                }

                var removeCreationListener = scope.$watch('key', function (key) {
                    var callback = function (gRecaptchaResponse) {
                        // Safe $apply
                        $timeout(function () {
                            scope.response = gRecaptchaResponse;
                            validate();

                            // Notify about the response availability
                            scope.onSuccess({response: gRecaptchaResponse, widgetId: scope.widgetId});
                        });
                    };

                    vcRecaptcha.create(elm[0], {

                        callback: callback,
                        key: key,
                        stoken: scope.stoken || attrs.stoken || null,
                        theme: scope.theme || attrs.theme || null,
                        type: scope.type || attrs.type || null,
                        tabindex: scope.tabindex || attrs.tabindex || null,
                        size: scope.size || attrs.size || null,
                        'expired-callback': expired

                    }).then(function (widgetId) {
                        // The widget has been created
                        validate();
                        scope.widgetId = widgetId;
                        scope.onCreate({widgetId: widgetId});

                        scope.$on('$destroy', destroy);

                        scope.$on('reCaptchaReset', function(event, resetWidgetId){
                          if(ng.isUndefined(resetWidgetId) || widgetId === resetWidgetId){
                            scope.response = "";
                            validate();
                          }
                        })

                    });

                    // Remove this listener to avoid creating the widget more than once.
                    removeCreationListener();
                });

                function destroy() {
                  if (ctrl) {
                    // reset the validity of the form if we were removed
                    ctrl.$setValidity('recaptcha', null);
                  }

                  cleanup();
                }

                function expired(){
                    // Safe $apply
                    $timeout(function () {
                        scope.response = "";
                        validate();

                        // Notify about the response availability
                        scope.onExpire({ widgetId: scope.widgetId });
                    });
                }

                function validate(){
                    if(ctrl){
                        ctrl.$setValidity('recaptcha', scope.required === false ? null : Boolean(scope.response));
                    }
                }

                function cleanup(){
                  // removes elements reCaptcha added.
                  ng.element($document[0].querySelectorAll('.pls-container')).parent().remove();
                }
            }
        };
    }]);

}(angular));

/*!
 * angular-ui-validate
 * https://github.com/angular-ui/ui-validate
 * Version: 1.2.2 - 2015-11-28T04:00:20.151Z
 * License: MIT
 */


(function () { 
'use strict';
/**
 * General-purpose validator for ngModel.
 * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.) but using
 * an arbitrary validation function requires creation of custom directives for interact with angular's validation mechanism.
 * The ui-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
 * A validator function will trigger validation on both model and input changes.
 *
 * This utility bring 'ui-validate' directives to handle regular validations and 'ui-validate-async' for asynchronous validations.
 *
 * @example <input ui-validate=" 'myValidatorFunction($value)' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
 * @example <input ui-validate="{ foo : '$value > anotherModel' }" ui-validate-watch=" 'anotherModel' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }" ui-validate-watch=" { foo : 'anotherModel' } ">
 * @example <input ui-validate-async=" 'myAsyncValidatorFunction($value)' ">
 * @example <input ui-validate-async="{ foo: 'myAsyncValidatorFunction($value, anotherModel)' }" ui-validate-watch=" 'anotherModel' ">
 *
 * @param ui-validate {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * In both cases validator function should take a value to validate as its argument and should return true/false indicating a validation result.
 * It is possible for a validator function to return a promise, however promises are better handled by ui-validate-async.
 *
 * @param ui-validate-async {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * Async validator function should take a value to validate as its argument and should return a promise that resolves if valid and reject if not,
 * indicating a validation result.
 * ui-validate-async supports non asyncronous validators. They are wrapped into a promise. Although is recomented to use ui-validate instead, since
 * all validations declared in ui-validate-async are registered un ngModel.$asyncValidators that runs after ngModel.$validators if and only if
 * all validators in ngModel.$validators reports as valid.
 */
angular.module('ui.validate',[])
  .directive('uiValidate', ['$$uiValidateApplyWatch', '$$uiValidateApplyWatchCollection', function ($$uiValidateApplyWatch, $$uiValidateApplyWatchCollection) {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var validateFn, validateExpr = scope.$eval(attrs.uiValidate);

      if (!validateExpr) {
        return;
      }

      if (angular.isString(validateExpr)) {
        validateExpr = {
          validator: validateExpr
        };
      }

      angular.forEach(validateExpr, function(exprssn, key) {
        validateFn = function(modelValue, viewValue) {
          // $value is left for retrocompatibility
          var expression = scope.$eval(exprssn, {
            '$value': modelValue,
            '$modelValue': modelValue,
            '$viewValue': viewValue,
            '$name': ctrl.$name
          });
          // Keep support for promises for retrocompatibility
          if (angular.isObject(expression) && angular.isFunction(expression.then)) {
            expression.then(function() {
              ctrl.$setValidity(key, true);
            }, function() {
              ctrl.$setValidity(key, false);
            });
            // Return as valid for now. Validity is updated when promise resolves.
            return true;
          } else {
            return !!expression; // Transform 'undefined' to false (to avoid corrupting the NgModelController and the FormController)
          }
        };
        ctrl.$validators[key] = validateFn;
      });

      // Support for ui-validate-watch
      if (attrs.uiValidateWatch) {
        $$uiValidateApplyWatch(scope, ctrl, scope.$eval(attrs.uiValidateWatch), attrs.uiValidateWatchObjectEquality);
      }
      if (attrs.uiValidateWatchCollection) {
        $$uiValidateApplyWatchCollection(scope, ctrl, scope.$eval(attrs.uiValidateWatchCollection));
      }
    }
  };
}])
  .directive('uiValidateAsync', ['$$uiValidateApplyWatch', '$$uiValidateApplyWatchCollection', '$timeout', '$q', function ($$uiValidateApplyWatch, $$uiValidateApplyWatchCollection, $timeout, $q) {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var validateFn, validateExpr = scope.$eval(attrs.uiValidateAsync);

      if (!validateExpr){ return;}

      if (angular.isString(validateExpr)) {
        validateExpr = { validatorAsync: validateExpr };
      }

      angular.forEach(validateExpr, function (exprssn, key) {
        validateFn = function(modelValue, viewValue) {
          // $value is left for ease of use
          var expression = scope.$eval(exprssn, {
            '$value': modelValue,
            '$modelValue': modelValue,
            '$viewValue': viewValue,
            '$name': ctrl.$name
          });
          // Check if it's a promise
          if (angular.isObject(expression) && angular.isFunction(expression.then)) {
            return expression;
            // Support for validate non-async validators
          } else {
            return $q(function(resolve, reject) {
              setTimeout(function() {
                if (expression) {
                  resolve();
                } else {
                  reject();
                }
              }, 0);
            });
          }
        };
        ctrl.$asyncValidators[key] = validateFn;
      });

      // Support for ui-validate-watch
      if (attrs.uiValidateWatch){
          $$uiValidateApplyWatch( scope, ctrl, scope.$eval(attrs.uiValidateWatch), attrs.uiValidateWatchObjectEquality);
      }
      if (attrs.uiValidateWatchCollection) {
        $$uiValidateApplyWatchCollection(scope, ctrl, scope.$eval(attrs.uiValidateWatchCollection));
      }
    }
  };
}])
  .service('$$uiValidateApplyWatch', function () {
    return function (scope, ctrl, watch, objectEquality) {
      var watchCallback = function () {
        ctrl.$validate();
      };

      //string - update all validators on expression change
      if (angular.isString(watch)) {
        scope.$watch(watch, watchCallback, objectEquality);
        //array - update all validators on change of any expression
      } else if (angular.isArray(watch)) {
        angular.forEach(watch, function (expression) {
          scope.$watch(expression, watchCallback, objectEquality);
        });
        //object - update appropriate validator
      } else if (angular.isObject(watch)) {
        angular.forEach(watch, function (expression/*, validatorKey*/) {
          //value is string - look after one expression
          if (angular.isString(expression)) {
            scope.$watch(expression, watchCallback, objectEquality);
          }
          //value is array - look after all expressions in array
          if (angular.isArray(expression)) {
            angular.forEach(expression, function (intExpression) {
              scope.$watch(intExpression, watchCallback, objectEquality);
            });
          }
        });
      }
    };
  })
  .service('$$uiValidateApplyWatchCollection', function () {
    return function (scope, ctrl, watch) {
      var watchCallback = function () {
        ctrl.$validate();
      };

      //string - update all validators on expression change
      if (angular.isString(watch)) {
        scope.$watchCollection(watch, watchCallback);
        //array - update all validators on change of any expression
      } else if (angular.isArray(watch)) {
        angular.forEach(watch, function (expression) {
          scope.$watchCollection(expression, watchCallback);
        });
        //object - update appropriate validator
      } else if (angular.isObject(watch)) {
        angular.forEach(watch, function (expression/*, validatorKey*/) {
          //value is string - look after one expression
          if (angular.isString(expression)) {
            scope.$watchCollection(expression, watchCallback);
          }
          //value is array - look after all expressions in array
          if (angular.isArray(expression)) {
            angular.forEach(expression, function (intExpression) {
              scope.$watchCollection(intExpression, watchCallback);
            });
          }
        });
      }
    };
  });

}());
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
                         'formly',
                         'formlyBootstrap',
                         'satellizer',
                         'ngResource',
                         'ngSanitize',
                         'ngMessages',
                         //'naif.base64',
                         //'ngCordova',
                         'angularSpinner',
                         'restangular',
                         'ngAnimate',
                         //'ngMockE2E',
                         'ngStorage',
                         'ngFileUpload',
                         'ui.grid',
                         'ui.grid.selection',
                         'ui.validate',
                         'chart.js',
                         'vcRecaptcha',
                         //'uiGmapgoogle-maps',
                         'myApp.filters',
                         'myApp.services',
                         'myApp.directives',
                         'myApp.controllers',
                         'myApp.config'])
                         //'myApp.mockBackend',
                         //'myApp.mockService'])


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
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider.state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/mainDashboard.html"
    });
    
   
    $stateProvider.state('menu.home',{
            url: '/home',
            templateUrl: "templates/loginDashboard.html",
            controller:'LoginController',
            accessLogged: false,
            accessLevel: 'free1' 
    });


    $stateProvider.state('home', {
        url: '/',
        controller: 'SHomeCtrl',
        templateUrl: 'templates/Shome.html',
        accessLogged: false,
        accessLevel: 'free1' 
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/Slogin.html',
        controller: 'SLoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
    });

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'templates/Ssignup.html',
        controller: 'SSignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
    });

    $stateProvider.state('logout', {
        url: '/logout',
        template: null,
        controller: 'SLogoutCtrl'
    });
      
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'templates/Sprofile.html',
        controller: 'SProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
    });

    $stateProvider.state('form', {
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


    $stateProvider.state('protocollo', {
        url: '/protocollo',
        templateUrl: 'templates/protocollo.html',
        controller: 'ProtocolloCtrl',
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


    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

}])


// satellizer

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
    console.log('hide loading screen...');
    //loading_screen.finish();
});
"use strict";

 angular.module('myApp.config', [])

.constant('ENV', 
		{	
			name:'development',
			apiEndpoint:'http://localhost:9988/segnalazioni/upload',
			apiLogin:'auth/login',
			apiLogout:'auth/logout',
			routeAfterLogon:'profile',
			mapsdemo:false,
			loginUserName:'',
			loginUserPassword:'',
			AUTH_EVENTS:{loginSuccess:'auth-login-success',loginFailed:'auth-login-failed',logoutSuccess:'auth-logout-success',sessionTimeout:'auth-session-timeout',notAuthenticated:'auth-not-authenticated',notAuthorized:'auth-not-authorized',serverError:'server-error'},USER_ROLES:{all:'*',admin:'admin',editor:'editor',guest:'guest'}
		});
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', [])
   
  .service('VersionService', [function() {
      return '1.0.2';
  }])


.factory('AuthService',           ['ENV', '$http', 'Session', '$rootScope', '$log',
                         function ( ENV,   $http,   Session,   $rootScope,   $log) {
  return {

    login: function (credentials) {

      $log.debug( $rootScope.base_url + ENV.apiLogin);
        
      return $http({ 
                    url: $rootScope.base_url + ENV.apiLogin, 
                    method: "GET",
                    params: {username: credentials.username, password: credentials.password }
                  })
        .then(function (res) {
            $log.debug('AuthService login then');
            $log.debug(res.data);
            Session.create(res.data);
        });
    },
      
    logout: function (credentials) {
        $log.debug('AuthService logout');
        $log.debug( $rootScope.base_url + ENV.apiLogout);
      return $http
        .get( $rootScope.base_url + ENV.apiLogout, credentials)
        .then(function (res) {
            $log.debug('AuthService logout ...');
            $log.debug(res);
            $log.debug(res.data.id_utenti);
            $log.debug('Destroy session ...');
            Session.destroy();
        });
    },  
      
    isAuthenticated: function () {
        $log.debug('AuthService isAuthenticated');
        return !!Session.id_utenti;
    },
      
    isAuthorized: function (authorizedRoles) {
        $log.debug('AuthService isAuthorized');
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
    $log.debug('Session create ...');
    $log.debug(data);
    this.session_data = {};
    this.session_data = data;
  };
  this.destroy = function () {
    $log.debug('Session destroy');
    this.session_data = {};
  };
  return this;
}]);
angular.module('myApp.services')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/s/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/s/me', profileData);
      }
    };
  });
angular.module('myApp.services')
  .factory('FormlyService', function($http) {
    return {
      getFormly: function() {
        return $http.get('/api/s/me');
      },
      updateFormly: function(data) {
        return $http.put('/api/seq/me', data);
      },
      createFormly: function(data) {
        return $http.post('/api/seq/create', data);
      },
      mapFormly : function(data) {
        console.log(data);
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=rimini%20via%20n&sensor=false');
      }
    };
  });
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

          // Create a date object with the current time
          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          console.log('UtilsService');
          console.log(time);

          var suffix = Math.floor(Math.random()*90000) + 10000;

          //time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
          
          //time[0] = time[0] || 12;

          // If seconds and minutes are less than 10, add a zero
            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          

          console.log(time.join(""));  

          // Return the formatted string
          return [year, month, day].join('') + "@" + time.join("") + "@" + ms + "@" + suffix;
          //return date.join("") + "@" + time.join("") + "@" + suffix;
        },

      updateProfile: function(profileData) {
        return $http.put('/api/s/me', profileData);
      }
    };
  });
'use strict';

/* sigService */


angular.module('myApp.services')
   

.service('sigService',  ['$http','$rootScope', '$window', '$q','$log', function ($http, $rootScope, $window, $q, $log) {

  var FileItem = [];
  var DataType = {};
  var Address = {};
  
    this.onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    this.onError = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    this.onProgress = function(reader, scope) {
        return function (event) {
            /*
            console.log(event.loaded);
            scope.$broadcast("imageProgressLoading",
                {
                    total: event.total,
                    loaded: event.loaded
                });
            */
        };
    };


  this.getReader = function(deferred, scope) {
            console.log('getReader');
            var reader = new FileReader();
            reader.onload = this.onLoad(reader, deferred, scope);
            reader.onerror = this.onError(reader, deferred, scope);
            reader.onprogress = this.onProgress(reader, scope);
            return reader;
   };

    this.readAsDataURL = function(file, scope) {
            console.log('readAsDataURL');
            var deferred = $q.defer();
             
            var reader = this.getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };



  this.setAddress = function(a){
    console.log(a);
    this.Address = a;
  };

  this.getAddress = function(){
    console.log(this.Address);
    return this.Address;
  };

  this.addNewFile = function(fileInfo){
    console.log('sigService addNewFile');
    console.log(fileInfo);
    this.FileItem.push(fileInfo);
  };

  this.setFile = function name(f) {
    console.log('sigService setFile');
    console.log(f);
  };

  this.sayHello = function () {
    console.log('hello');
    return 'Hello';
  };

  this.create = function (data) {
    $log.debug('Session create ...');
    $log.debug(data);
    this.session_data = {};
    this.session_data = data;
  };

  this.destroy = function () {
    $log.debug('Session destroy');
    this.session_data = {};
  };
  
  /* geoLocation */

  this.geoLocatoniSupported = function(){
      return 'geolocation' in $window.navigator;
  }

  this.mapLocation = function(position) {
        console.log('mapLocation');
        console.log(position);

        
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=true";
        console.log(url);
        return $http.get(url);
        /*
        $http.get(url)
            .then(function(result) {
                var address = result.data.results[2].formatted_address;
                $scope.address = address;
        });
        */
        //return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=rimini%20via%20n&sensor=false');
 }

  this.getCurrentPosition = function(options) {
      var deferred = $q.defer();
            if(this.geoLocatoniSupported()) {
                    $window.navigator.geolocation.getCurrentPosition(
                        function(position) {
                            $rootScope.$apply(function() {
                                //retVal.position.coords = position.coords;
                                //retVal.position.timestamp = position.timestamp;
                                console.log(position);
                                deferred.resolve(position);
                            });
                        },
                        function(error) {
                            console.log(error);
                            $rootScope.$apply(function() {
                                deferred.reject({error: error});
                            });
                        }, options);
                } else {
                    console.log('geo error');
                    deferred.reject({error: {
                        code: 2,
                        message: 'This web browser does not support HTML5 Geolocation'
                    }});
                }
                return deferred.promise;
  };



  return this;

}]);
'use strict';

/* Controllers */

angular.module('myApp.controllers', []);
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



.controller("AppCtrl", 
                    ['$scope', 'dialogs', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log', '$location',
            function($scope,    dialogs,   $rootScope,   AuthService,   Session,   Restangular,    $state, ENV,   $log,   $location) {

                
        $log.debug("AppCtrl ... start");
        $log.debug(ENV);
        $scope.currentUser = null;
        $scope.userRoles = ENV.USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
        $scope.isCollapsed = false;
    
        $scope.go = function ( path ) {
            $log.debug("AppCtrl ... go");
            $state.go(path);
        };
                
        if(window.ionic){
            $log.debug('IONIC defined! : ' + window.ionic.version);
        }
                
        $scope.toggleLeft = function() {
             $log.debug("AppCtrl ... toggleLeft");
             $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        };
          
        // CONFIGURAZIONI -----------------------------------------------------------------        

        //console.log($location.host());
        //console.log($location.absUrl());

        var host = $location.host();
        //console.log(host); 

        if( host  == 'localhost') {
            $rootScope.base_url = 'http://localhost:9988';
        } else {
            $rootScope.base_url = 'https://pmlab.comune.rimini.it/SostaSelvaggia';
        }

        //$rootScope.base_url = ENV.apiEndpoint;
        //$log.debug('Restangular set base Url '+ ENV.apiEndpoint);
        $log.debug('Restangular Url '+ $rootScope.base_url);



        //$rootScope.base_url = ENV.apiEndpoint;
        //$log.debug('Restangular set base Url:'+ ENV.apiEndpoint);
        Restangular.setBaseUrl($rootScope.base_url);


        Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {

            if(response.status === 0) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 0');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            if(response.status === 403) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 403');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.sessionTimeout);
                    return false; // error handled
            }

            if(response.status === 500) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 500');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 502) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 502');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }

            if(response.status === 504) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 504');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            if(response.status === 404) {
                    $ionicLoading.hide();
                    $log.debug('setErrorInterceptor 404');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
                    return false; // error handled
            }


            //return false; // error handled
            return true; // error not handled
        });
        

        /*
        if (ENV.name === 'development') {        
            $log.debug("AppCtrl ... development ... ");
            Session.create(1, 'PROVINCIA', ENV.token,  true);
            $scope.currentUser = ENV.userName;
            $scope.isAuthorized = ENV.isAuthorized;
            Restangular.setDefaultRequestParams({ apiKey: Session.token });
        }
        */
  
                
        //$log.debug('WEB SERVICE WEB URL  : ' + $rootScope.base_url);
                
        
        //AUTH_EVENTS.loginFailed
    
        $rootScope.$on(ENV.AUTH_EVENTS.loginSuccess , function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.loginSuccess ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = Session.nome_breve_utenti;
            Restangular.setDefaultHeaders({'rr-access-token': Session.token});

            //storePassword
            // $log.debug('set storage login to:',Session.token);
            // $localStorage.Session = Session;
            

            //$state.go('menu.list');
            $state.go(ENV.routeAfterLogon);
        });
                
                
        $rootScope.$on(ENV.AUTH_EVENTS.logoutSuccess , function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.logoutSuccess ... ');
            $log.debug(event);
            $log.debug(next);
            $log.debug('AppCtrl: destroy session & token ... ');
            $scope.currentUser = '';
            Session.token = '123';
            Restangular.setDefaultHeaders({token: ''});

            //$log.debug('Destroy local session....');
            //delete $localStorage.Session;

            $state.go('menu.home');
        });        
                
   
        $rootScope.$on(ENV.AUTH_EVENTS.loginFailed, function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.loginFailed ... ');
            $log.debug(event);
            $log.debug(next);

            dialogs.error('errre','sdfsdfsdf');
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
                    $log.debug('AppCtrl : Login errato OK');
                    $state.go('menu.home');
               });
*/
      

        }); 

         $rootScope.$on(ENV.AUTH_EVENTS.notAuthenticated, function (event, next) {
            $log.debug('AppCtrl : AUTH_EVENTS.notAuthenticated ... ');
            $log.debug(event);
            $log.debug(next);
            //$scope.currentUser = Session.nome_breve_utenti;
            

                var alertPopup = $ionicPopup.alert({
                    title: 'Utente non autenticato o sessione di lavoro scaduta',
                    template: 'Immettere nome utente e password'
                });
                alertPopup.then(function(res) {
                    $log.debug('AppCtrl: alertPopup : OK');
                    $state.go('menu.home');
                });
            


        }); 
    

        $rootScope.$on(ENV.AUTH_EVENTS.sessionTimeout, function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.sessionTimeout ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = Session.nome_breve_utenti;
            
             var alertPopup = $ionicPopup.alert({
                title: 'Utente non autenticato o sessione di lavoro scaduta',
                template: 'Immettere nome utente e password'
                });
            alertPopup.then(function(res) {
                $log.debug('AppCtrl: alertPopup : OK');
                $state.go('menu.home');
           });

        }); 

        $rootScope.$on(ENV.AUTH_EVENTS.serverError, function (event, next) {
            $log.debug('AppCtrl : AUTH_EVENTS.serverError ... ');
            $log.debug(event);
            $log.debug(next);
            $scope.currentUser = Session.nome_breve_utenti;
            
             var alertPopup = $ionicPopup.alert({
                title: 'ERRORE di SISTEMA!',
                template: 'Contattare il gestore del sistema!'
                });
            alertPopup.then(function(res) {
             $log.debug('AppCtrl: alertPopup : OK');
                $state.go('menu.home');
           });

        }); 

        $rootScope.$on('$stateChangeStart', function (event, next) {

            $log.debug('AppCtrl on $stateChangeStart: ' + next.accessLogged);
            $log.debug(next);
            $log.debug(event);
                        
            if(next.accessLogged){
                $log.debug('AppCtrl on $stateChangeStart: check if isAuthenticated : ' + AuthService.isAuthenticated());
                if(!AuthService.isAuthenticated()){

                    event.preventDefault();    
                    $log.debug('AppCtrl on $stateChangeStart: notAuthenticated broadcast event');
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);

                }
            } else {
                $log.debug('AppCtrl on $stateChangeStart: PATH free');
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
                    [ '$scope', 'usSpinnerService', '$localStorage', '$rootScope', 'ENV', 'AuthService','$state', '$log',
            function ( $scope,   usSpinnerService,   $localStorage,   $rootScope,   ENV,   AuthService,  $state,   $log) {
                
    $log.debug('LoginController...');
    $log.debug('LoginController...currentUser:' + $scope.currentUser );
    $log.debug('LoginController...hide nav bar');

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

    $scope.credentials = {
        username: 'mario',
        password: ''
     };
    
     // loading exiting credentials..
     if ($localStorage.password){
        console.log('recupero password da cache');
        $scope.credentials.password = $localStorage.password;
     }

    
  // title ion-view
  // console.log('LoginController...set title' );
  // $scope.navTitle = '**Gestione Volontari**';
  //$scope.navTitle = '<img style="height:100px; width:auto;" src="img/logo2.jpg" />';
             
    $scope.goto_help = function($id) {
        $log.debug('HelpController : Route to login');
        $state.go('menu.help');
    };     
                
    $scope.fullscreenOn = function(){
        $log.debug('AboutController : fullscreenOn');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.request();
    };

    $scope.fullscreenOff = function(){
        $log.debug('AboutController : fullscreenOff');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.exit();
    };            
                        
       
    $scope.clearPasswordCache = function(){
        $log.debug('login:clearPasswordCache');
        $localStorage.password = '';
        $scope.credentials.password = '';
    };


  $scope.login = function (credentials) {

      usSpinnerService.spin('spinner-1');
      //$ionicLoading.show({template: 'Attendere...' });
      $log.debug('login:calling .. AuthService. ..');
      $log.debug(credentials);

    AuthService.login(credentials).then(function () {
        console.log('store password');
        $localStorage.password = $scope.credentials.password;
        usSpinnerService.stop('spinner-1');
        //$ionicLoading.hide();
        $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);
    }, function (error) {
      $log.debug('loginController.login ERROR'); 
      $log.debug(error); 
      //$ionicLoading.hide();
      usSpinnerService.stop('spinner-1');

      if(error.status == 0){
        $rootScope.$broadcast(ENV.AUTH_EVENTS.serverError);
      } else {
        $rootScope.$broadcast(ENV.AUTH_EVENTS.loginFailed);
      }

    });
  };


  $scope.logout = function (credentials) {
      $log.debug('logout:calling .. AuthService. ..');
      $log.debug(credentials);
    AuthService.logout(credentials).then(function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
    }, function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
    });
  };

    
}])

// AboutController ------------------------------------------------------------------------------------
.controller('AboutController', 
            [ '$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$http', '$log',
            function ($scope, $rootScope, ENV, AuthService, Session, $location, $http, $log ) {
    $log.debug('AboutController...');
    $log.debug(Session);
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
        $log.debug('AboutController : fullscreenOn');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.request();
    };

    $scope.fullscreenOff = function(){
        $log.debug('AboutController : fullscreenOff');
        //console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        //screenfull.exit();
    };
                
    $scope.test_connection = function(){
        $log.debug('AboutController : test_connection');
        $ionicLoading.show({   template: 'Loading...'   }); 
      
        $http({method: 'GET', url: $rootScope.base_url + '/mv/testconnection'}).
        success(function(data, status, headers, config) {
                $log.debug($rootScope.base_url + '/mv/testconnection');
                $log.debug(data);
                $log.debug(status);
                $log.debug(headers);
                $log.debug(config);
            
                var alertPopup = $ionicPopup.alert({
                title: 'OK!',
                template: 'Test di connessione ok'
                });
                    alertPopup.then(function(res) {
                    $log.debug('Quit popup');
                });
        }).
        error(function(data, status, headers, config) {
                $log.debug($rootScope.base_url + '/mv/testconnection');
                $log.debug(data);
                $log.debug(status);
                $log.debug(headers);
                $log.debug(config);
                var alertPopup = $ionicPopup.alert({
                title: 'Errori!',
                template: 'Test di connessione FALLITO'
                });
                    alertPopup.then(function(res) {
                    $log.debug('Quit popup');
                });
        });
        
        
        $ionicLoading.hide();
        
    };
                
                
    
}])

// HelpController ------------------------------------------------------------------------------------
.controller('HelpController', 
                   [ '$scope', 'Restangular', '$rootScope', 'ENV', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup','$ionicSlideBoxDelegate','$state','$log',
            function ($scope,   Restangular,   $rootScope,   ENV,   AuthService,  Session,  $location,  $ionicLoading,  $http,   $ionicPopup,  $ionicSlideBoxDelegate,  $state,$log ) {
    $log.debug('HelpController...');
    
    //Restangular.setBaseUrl($rootScope.base_url); 

    $scope.UrlApi = $rootScope.base_url
        // action new relazione
    $scope.goto_login = function($id) {
        $log.debug('HelpController : Route to login');
        $state.go('menu.login');
    };            
    
    $scope.change_Api1 = function() {
        $scope.UrlApi = "http://localhost:9988/segnalazioni/upload";
        $rootScope.base_url = $scope.UrlApi;
        Restangular.setBaseUrl($rootScope.base_url); 
    }

    $scope.change_Api2 = function() {
        $scope.UrlApi = "https://pmlab.comune.rimini.it/api/";
        $rootScope.base_url = $scope.UrlApi;
        Restangular.setBaseUrl($rootScope.base_url); 
    }


}])

// HelpController ------------------------------------------------------------------------------------
.controller('ModalController', 
            [  '$uibModalInstance','$scope', 'Restangular', '$rootScope', 'ENV', 'AuthService','Session','$location','$http', '$state','$log',
       function ( $uibModalInstance, $scope, Restangular, $rootScope, ENV, AuthService, Session, $location,  $http, $state,$log ) {
    $log.debug('HelpController...');
    
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

/* sigControllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller("sigPhotoController", 
                    ['$scope', 'dialogs', '$state', '$log', 'sigService', 'usSpinnerService',
            function($scope,    dialogs,   $state,   $log,   sigService ,  usSpinnerService) {

                
        $log.debug("sigPhoto  start");
        $scope.imagSrc = '';
        $scope.singleModel = 1;
          
        $scope.selectImageFile = function(){
              console.log('selectImageFile............');
              document.getElementById("idImageFileInput").click();
        }

        $scope.nextStep = function(){
              console.log('nextStep............');
              $state.go('sigPosition');
        }

        $scope.testService = function(){
            console.log('testService............');
            sigService.setAddress('Via AAAAAAAA');
            sigService.getAddress('Via AAAAAAAA');
        }
        
       $scope.getFile = function () {
         $scope.progress = 0;
         console.log('getFile');
         usSpinnerService.spin('spinner-1');
            sigService.fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                          usSpinnerService.stop('spinner-1');
                      });
        };
      
        /*
        $scope.$on("imageProgressLoading", function(e, progress) {
            console.log(progress);
            $scope.progress = progress.loaded / progress.total;
            $scope.$apply;
        });
        */
       
        $scope.addImagesOnChange = function(files, errFiles) {
            console.log('addImagesOnChange ...');
            var files = event.target.files;
            console.log(files[0]);
            usSpinnerService.spin('spinner-1');

            //sigService.addNewFile(files[0]);

            sigService.readAsDataURL(files[0], $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                          usSpinnerService.stop('spinner-1');
                      });
            

            /*
            var fileInfo = [];
            var i = 0;
            for(i=0;i<files.length;i++){
              console.log('adding file ..', files[i].name);
              sigService.addNewFile(files[i]);
            }
            */
      }
 
    
}])

.controller('sigPositionController', 
                    ['$scope', 'dialogs', '$state', '$log', 'sigService', 'usSpinnerService',
            function($scope,    dialogs,   $state,   $log,   sigService ,  usSpinnerService) {
                
    $log.debug('sigPosition...');

        $scope.addresses = [];

        function isGeolocationSupported() {
            return 'geolocation' in $window.navigator;
        }


        $scope.nextStep = function(){
              console.log('nextStep............');
              $state.go('sigType');
        }


        $scope.getLocationGPS = function(params) {
            console.log('getPositionGPS............');
            usSpinnerService.spin('spinner-1');
            sigService.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
            sigService.mapLocation(position).then(function(address) {
                console.log(address);
                $scope.addresses = address.data.results;
                $scope.$apply;
                usSpinnerService.stop('spinner-1');
            });

         });

        }

        $scope.testService = function(){
            console.log('testService............');
            sigService.setAddress('Via AAAAAAAA');
            sigService.getAddress('Via AAAAAAAA');
        }

    
}])

// sigType ------------------------------------------------------------------------------------
.controller('sigTypeController', 
            [ '$scope',  '$log',
            function ($scope,  $log ) {
    $log.debug('sigType...');
           
                
    
}])

// sigSend ------------------------------------------------------------------------------------
.controller('sigSendController', 
            [ '$scope', '$log', 'sigService',
            function ($scope, $log, sigService ) {
    $log.debug('sigSend...');
    
}]);

angular.module('myApp.controllers')
  .controller('SLoginCtrl', 
           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    $scope.NTLMLogin = function() {
      $log.debug('NTLMLogin');
      $auth.loginUrl = "/auth/NTLMlogin";
      var options = {  url: '/auth/NTLMlogin' };
      $auth.login($scope.user, options)
        .then(function() {
          dialogs.notify('ok','You have successfully signed in!');
          $state.go('home');
        })
        .catch(function(error) {
          $log.debug('login error:');
          $log.debug(error);
          if (error.data) {
            dialogs.error('Errore',error.data.message);
          } else
            dialogs.error('Errore','Errore generico di accesso');
        });
    };



    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          dialogs.notify('ok','You have successfully signed in!');
          $state.go('home');
        })
        .catch(function(error) {
          $log.debug('login error:');
          $log.debug(error);
          if (error.data) {
            dialogs.error('Errore',error.data.message);
          } else
            dialogs.error('Errore','Errore generico di accesso');
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          dialogs.notify('ok','You have successfully signed in with ' + provider + '!');
          $state.go('home');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            $log.error(error);
            dialogs.error(error);
          } else if (error.data) {
            // HTTP response error from server
            $log.error(error);
            dialogs.error(error);
          } else {
            $log.error(error);
            dialogs.error(error);
          }
        });
    };
  }])

  .controller('SLogoutCtrl', 

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        dialogs.notify('ok','You have been logged out');
        $state.go('home');
      });
  }])

  .controller('SProfileCtrl', 

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log', 'Account',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log, Account ) {


    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          dialogs.error('err', response.data.message + response.status);
        });
    };
    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          dialogs.notify('ok','Profile has been updated');
        })
        .catch(function(response) {
          dialogs.error('err',response.data.message, response.status);
        });
    };
    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          dialogs.notify('You have successfully linked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          dialogs.error(response.data.message, response.status);
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          dialogs.notify('You have unlinked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          dialogs.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
        });
    };

    $scope.getProfile();
  }])


  .controller('SSignupCtrl', 

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $state.go('home');
          dialogs.notify('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          console.log(response);
          dialogs.error('Errore','Signup Error');
        });
    };
  }])


.controller('SHomeCtrl', function($scope, $http) {
    $http.jsonp('https://api.github.com/repos/sahat/satellizer?callback=JSON_CALLBACK')
      .success(function(data) {
        if (data) {
          if (data.data.stargazers_count) {
            $scope.stars = data.data.stargazers_count;
          }
          if (data.data.forks) {
            $scope.forks = data.data.forks;
          }
          if (data.data.open_issues) {
            $scope.issues = data.data.open_issues;
          }
        }
      });
  })

  .controller('SNavbarCtrl',

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };


    $scope.getUserId = function() {

      if ($auth.isAuthenticated()) {
        return $auth.getPayload().sub.userId;
      } else {
        return '';
      }
      
    };


  }]);    
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('SFormlyCtrl', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','formlyConfig','$q','$http','formlyValidationMessages', 'FormlyService','usSpinnerService','dialogs','UtilsService', 'Upload',
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  formlyConfig,  $q,  $http,  formlyValidationMessages,   FormlyService,  usSpinnerService,  dialogs,   UtilsService,  Upload ) {
    
  $log.debug('SFormlyCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 



    var vm = this;
    var unique = 1;
    var _progress = 0;

    var ElencoPlessi = [
      {
        "id": "LA VELA - Torre Pedrera",
        "label":"LA VELA - Torre Pedrera"
      },
      {
        "id": "IL VOLO - Rimini Centro",
        "label":"IL VOLO - Rimini Centro"
      },
      {
        "id": "IL DELFINO - Bellariva",
        "label":"IL DELFINO - Bellariva"
      }
    ];

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

*/

  function refreshAddresses(address, field) {
      var promise;
      if (!address) {
        promise = $q.when({data: {results: []}});
      } else {
        var params = {address: address, sensor: false};
        var endpoint = '/api/seq/map';
        promise = $http.get(endpoint, {params: params});
      }
      return promise.then(function(response) {
        field.templateOptions.options = response.data.results;
      });
  };

/*

  var ngModelAttrs = {};

  angular.forEach(attributes, function(attr) {
    ngModelAttrs[camelize(attr)] = {attribute: attr};
  });

  angular.forEach(bindings, function(binding) {
    ngModelAttrs[camelize(binding)] = {bound: binding};
  });

  formlyConfig.extras.removeChromeAutoComplete = true;


  formlyConfig.setWrapper({    
        name: 'panel',
        templateUrl: 'templates/formly-wrapper-panel-template.html'
  });


  formlyConfig.setWrapper([
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
/*


    formlyConfig.setType({
      name: 'ui-select-single',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select-single-template.html'
    });

    formlyConfig.setType({
      name: 'ui-select-single-select2',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select2-single-template.html'
    });

    formlyConfig.setType({
      name: 'ui-select-single-search',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select-single-async-template.html'
    });

    formlyConfig.setType({
      name: 'ui-select-multiple',
      extends: 'select',
      templateUrl: 'templates/formly-ui-select-multiple-template.html'
    });

  formlyConfig.setType({
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

    formlyConfig.setType({
      name: 'repeatSection',
      templateUrl: 'templates/formly-repeatSection-template.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        $scope.copyFields = copyFields;
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
    });
    
    formlyConfig.setType({
      name: 'repeatUploadSection',
      templateUrl: 'templates/formly-repeatUploadSection-template.html',
      controller: function($scope) {

        $scope.formOptions = {formState: $scope.formState};
                
        $scope.openSelectFile = function(){
              console.log('openSelectFile............');
              document.getElementById("upfile").click();
          }

        $scope.copyFields = function(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }

        $scope.delItem = function(itemId) {
          console.log('delItem');
          console.log(itemId);
          $scope.model[$scope.options.key].splice(itemId, 1);
          vm.options.data.fileList.splice(itemId,1);
          console.log(vm.options.data.fileList);
        }
        
        $scope.addNew = function () {
          console.log('repeatUploadSection addNew');
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          console.log($scope.options.key);
          console.log($scope.model[$scope.options.key]);
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          console.log(lastSection);
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
            newsection.fileSize = "9999";
          } else {
            newsection.fileName = 'Nuovo';
          }
          repeatsection.push(newsection);
        }
    

        $scope.startUpload = function (){
          console.log('endUpload ...');
          return;
        }

        $scope.addFiles = function(files, errFiles) {
            console.log('addFiles ...');
            var files = event.target.files;
            console.log(files);
            console.log($scope.parent);
            console.log($scope);
            
            var fileInfo = [];
            var i = 0;
            for(i=0;i<files.length;i++){
              console.log('adding file ..', files[i].name);
              addNewFile(files[i]);
              fileInfo[i]  = {
                  'name' : files[i].name,
                  'error' : '',
                  'paused' : '',
                  'type' : files[i].type,
                  'size' : files[i].size,
                  'uniqueIdentifier' : '',
                  '_prevProgress' : ''
                }
            }

            //$scope.userData.Files = fileInfo;
            //$scope.$apply();
            //HelloWorldService.doWorkF(files);

            //console.log($scope.fFiles);
            //console.log($scope.userData.Files);
            $scope.$apply();
      }

      function addNewFile(fileInfo){
          console.log('addNewFile');
          console.log(fileInfo);
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          
          newsection.tipoDocumento = 'CI';
          newsection.fileName = fileInfo.name;
          newsection.fileSize = fileInfo.size;
          vm.options.data.fileList.push(fileInfo);
          console.log(vm.options.data.fileList);
          
          repeatsection.push(newsection);
      }


        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
    });
/*
    formlyConfig.setType({
      name: 'uploadFile',
      templateUrl: 'templates/formly-file-upload-template.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        $scope.copyFields = copyFields;
        
        function showEv(f){
          console.log(f);
        }

        $scope.onErrorHandler = function (event, reader, fileList, fileObjs, file) {
          console.log('onErrorHandler');
          console.log(event);
          console.log(reader);
          console.log(fileList);
          console.log(fileObjs);
          console.log(file);
        }

        $scope.onAfterValidateFunc = function (event, fileObjs, fileList) {
          console.log('onAfterValidate');
          console.log(event);
          console.log(fileObjs);
          console.log(fileList);
        }

        $scope.onChangeHandlerFunc = function (event, fileList){
          console.log('onChangeHandlerFunc');
          console.log(event);
          console.log(fileList);
        }

        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }

      }

  });        
*/

formlyConfig.setType({
      name: 'uploaderFile',
      templateUrl: 'templates/formly-file-uploader-template.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        $scope.copyFields = copyFields;
        
        function showEv(f){
          console.log(f);
        }

        $scope.onErrorHandler = function (event, reader, fileList, fileObjs, file) {
          console.log('onErrorHandler');
          console.log(event);
          console.log(reader);
          console.log(fileList);
          console.log(fileObjs);
          console.log(file);
        }

        $scope.onAfterValidateFunc = function (event, fileObjs, fileList) {
          console.log('onAfterValidate');
          console.log(event);
          console.log(fileObjs);
          console.log(fileList);
        }

        $scope.onChangeHandlerFunc = function (event, fileList){
          console.log('onChangeHandlerFunc');
          console.log(event);
          console.log(fileList);
        }

        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

      }
    });
    
// imageUpload blocco per selezionare una foto da archivio o fotocamera

formlyConfig.setType({
      name: 'imageUpload',
      templateUrl: 'templates/formly-image-upload-template.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        $scope.copyFields = copyFields;
        
        function showEv(f){
          console.log(f);
        }

        // attiva il 
        $scope.selectImageFile = function(){
              console.log('selectImageFile............');
              document.getElementById("idImageFileInput").click();
        }

        $scope.onErrorHandler = function (event, reader, fileList, fileObjs, file) {
          console.log('onErrorHandler');
          console.log(event);
          console.log(reader);
          console.log(fileList);
          console.log(fileObjs);
          console.log(file);
        }

        $scope.onAfterValidateFunc = function (event, fileObjs, fileList) {
          console.log('onAfterValidate');
          console.log(event);
          console.log(fileObjs);
          console.log(fileList);
        }

        $scope.onChangeHandlerFunc = function (event, fileList){
          console.log('onChangeHandlerFunc');
          console.log(event);
          console.log(fileList);
        }

        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }


        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

      }
    });
    

    formlyValidationMessages.messages.required = 'to.label + " è obbligatorio"';
    formlyValidationMessages.messages.email = '$viewValue + " is not a valid email address"';
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', '#### is the minimum length', '**** Too short');
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', '## is the maximum length', '** **Too long');

    /*  ---  */

    vm.id = 'form01';
    vm.showError = true;

    // function assignment
    vm.onSubmit = onSubmit;

    // variable assignment

    vm.author = { // optionally fill in your info below :-)
      name: 'RR',
      url: 'https://www.comune.rimini.it' // a link to your twitter/github/blog/whatever
    };

    vm.exampleTitle = 'Iscrizioni Nidi Comunali 2016';
    vm.exampleDescription = 'Descrizione operativa del modulo';

    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: '1.0.0'
    };

    vm.model = {
      showErrorState: true,
      transactionId : UtilsService.getTimestampPlusRandom()
      /*
      awesome: true,
      nucleo: [
          {
            CognomeNome:'abc',
            DataNascita:(new Date()).toDateString(),
            CodiceFiscale:''
          }
      ]
      */
    };

    vm.errors = {};

    // dati globali del form  

    vm.options = {
      formState: {
        awesomeIsForced: false
      },
      // contiene i dati dei file da upload di per usare il componente esternamente a due passaggi
      data: {
            fileCount: 0,
            fileList: []
        }
    };
    
    vm.fields = [
    /*
    {
        key: 'singleOption',
        type: 'ui-select-single',
        templateOptions: {
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Single Select',
          valueProp: 'id',
          labelProp: 'label',
          placeholder: 'Select option',
          description: 'Template includes the allow-clear option on the ui-select-match element',
          options: testData
        }
      },
      {
        key: 'multipleOption',
        type: 'ui-select-multiple',
        templateOptions: {
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Multiple Select',
          valueProp: 'id',
          labelProp: 'label',
          placeholder: 'Select options',
          options: testData
        }
      },
      {
        key: 'singleOptionAsync',
        type: 'ui-select-single-search',
        templateOptions: {
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Async Search',
          valueProp: 'formatted_address',
          labelProp: 'formatted_address',
          placeholder: 'Search',
          options: [],
          refresh: refreshAddresses,
          refreshDelay: 0
        }
      },
      {
        key: 'text',
        type: 'input',
        templateOptions: {
          label: 'Text',
          placeholder: 'insert ...',
          required: true
        },
        validators : { 
          isUnique: function($viewValue, $modelValue, scope){
            var value = $viewValue || $modelValue;
            console.log(value);
            if (value == "aaaa" || value == "") {
              //throw new Error('IS aaaa');
              return false;
            } else {
              return true;
            }
          },
          message: '$viewValue + " is not a valid IP Address"'
        },
        validation: {
         messages: {
              required: 'to.label + " is required"'
         }
        }
      },*/
      /*
      {
        key: 'image',
        type: 'uploadFile',
        templateOptions: {
          label: '',
          maxsize: '500'
        }
      },
      */


      {
        key: 'DICHIARANTI',
        wrapper: 'panel',
        className: 'to-uppercase',
        templateOptions: { 
          label: '1.0 Dichiaranti',
          info: 'In questa sezione devono essere indicati i dichiaranti',
          help: 'In questa sezione devono essere indicati i dichiaranti'
        },
        fieldGroup: [
        {
          key: 'dichiarantePadre',
          type: 'input',
          wrapper: 'inputWithError',
          templateOptions: {
            required: false,
            placeholder: 'This is required min 3 max 8 ...',
            label: 'Il sottoscritto (padre)',
            maxlength: 8,
            minlength: 3
          }
        },
        {
          key: 'dichiaranteMadre',
          type: 'input',
          wrapper: 'inputWithError',
          templateOptions: {
            required: false,
            type: 'text',
            label: 'La sottoscritta (madre)'
          }
        },
        {
        key: 'cittaDichiaranti',
        type: 'ui-select-single-search',
        templateOptions: {
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'GMap Async Search via proxy',
          valueProp: 'formatted_address',
          labelProp: 'formatted_address',
          placeholder: 'Search',
          options: [],
          refresh: refreshAddresses,
          refreshDelay: 10
        }
      },
        ]
      },
      /*
      {
        key: 'FATTURAZIONE',
        wrapper: 'panel',
        templateOptions: { 
          label: '2.0 Dati fatturazione',
          info: 'Inserire in questa sezione i dati relativi alla fatturazione',
          help: 'Inserire in questa sezione i dati relativi alla fatturazione'
        },
        fieldGroup: [
        {
          key: 'CodiceFiscale',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Codice Fiscale'
          }
        },
        {
          key: 'NatoA',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Nato A:'
          }
        },
        {
          key: 'DataNascita',
          type: 'datepicker',
          templateOptions: {
              label: 'Data Nascita',
              type: 'text',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
         }

        ]
      },
      */
      
      {
        key: 'PLESSO',
        wrapper: 'panel',
        templateOptions: { 
          label: '2.0 Scelta del centro estivo',
          info: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione</br>LA VELA</br>IL VOLO</br>DELFINO',
          warn: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          help: 'Inserire in questa sezione i dati relativi alla fatturazione'
        },
        fieldGroup: [
      {
        key: 'PLESSISELEZIONE',
        type: 'ui-select-multiple',
        wrapper: 'inputWithError',
         validators: {
          conteggio: {
            expression: function(viewValue, modelValue) {
              console.log(modelValue);
              console.log(viewValue);
              var value = modelValue || viewValue;
              if(modelValue){
                if ((modelValue.length > 0) && (modelValue.length < 3))  {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            },
            message: '$viewValue + " o uno o due"'
          }
        },
        templateOptions: {
          required: true,
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Selezionare una o due scuole in ordine di scelta',
          valueProp: 'id',
          labelProp: 'label',
          placeholder: 'Cliccare qui per selezionare',
          options: ElencoPlessi
        }
      }
        ]
      },
      
      {
        key: 'UPLOADFILE',
        type: 'repeatUploadSection',
        wrapper: 'panel',
        //templateOptions: { label: 'Address', info: 'info!' },
        //templateUrl: 'templates/formly-custom-template.html',
        templateOptions: 
        {
          label: 'labelUpload', 
          info: 'infoUpload',
          warn: 'wUpload',
          btnText:'Nuovo elemento btn',
          help: 'helpUpload',
          fields: [
            {
              //className: 'row',
              fieldGroup: 
              [
               {
                key: 'tipoDocumento',
                className: 'col-md-3',
                type: 'input',
                templateOptions: {
                  required: false,
                  label: 'tipo_Documento_label'
                }
              },
              {
                key: 'fileName',
                type: 'input',
                className: 'col-md-6',
                templateOptions: {
                  required: false,
                  label: 'fileName'
                }
              },
              {
                key: 'fileSize',
                type: 'input',
                className: 'col-md-2',
                templateOptions: {
                  required: false,
                  label: 'fileSize'
                }
              }

              ] // fieldGroup
            }
          ], //fields
        } //templateOptions
      },

      {
        key: 'IMMAGINE_SINGOLA',
        wrapper: 'panel',
        templateOptions: { 
          label: '99.0 Immagine Singola',
          info: '99 La sceltaInserire in questa sezione i dati relativi alla fatturazione</br>LA VELA</br>IL VOLO</br>DELFINO',
          warn: '99 La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          help: '99 Inserire in questa sezione i dati relativi alla fatturazione'
        },
        fieldGroup: [
       {
          key: 'IMMAGINE_1',
          type: 'imageUpload',
          wrapper: 'inputWithError',
          templateOptions: {
            required: false,
            placeholder: 'This is required min 3 max 8 ...',
            label: 'Il sottoscritto (padre)'
          }
        },
        ]
      },

      /*
      {
        key: 'SITUAZIONEPARENTALE',
        wrapper: 'panel',
        templateOptions: { 
          label: '99.0 Situazione parentale',
          info: '---',
          warn: '--',
          help: '---'
        },
        fieldGroup: [
              {
                key: 'SITUAZIONEPARENTALE_1',
                type: 'multiCheckbox',
                templateOptions: {
                  label: 'Nucleo inco......',
                  options: [{id: 1, title : "Stato uno"}, 
                            {id: 2, title : "Stato due "},
                            {id: 3, title : "Stato tre"}],
                  valueProp: 'id',
                  labelProp: 'title'
                }
              },
              {
                template: '<p>Description ...</p>'
              },
              {
                key: 'SITUAZIONEPARENTALE_2',
                type: 'multiCheckbox',
                templateOptions: {
                  label: 'Presenza altri dati',
                  options: [{id: 1, title : "Stato 1"}, {id: 2, title : "Stato 2"}],
                  valueProp: 'id',
                  labelProp: 'title'
                }
              }
            ]
      },
      */

      /*
      {
        key: 'certo',
        type: 'input',
        templateOptions: {
          label: 'CertoLabel',
          placeholder: 'visible se text presente',
          required: true
        },
        expressionProperties: {
          hideExpression: '!model.text',
          'templateOptions.disabled': function($viewValue, $modelValue, scope){
              var value = $viewValue || $modelValue;
              if (scope.model.text == "aaaaaaa" ) {
              //throw new Error('IS aaaa');
              return false;
            } else {
              return true;
            }
          }
        }
      },

      {
        template : '<hr/>'
      },

      {
        key: 'nested.story',
        type: 'textarea',
        templateOptions: {
          label: 'Some sweet story',
          placeholder: 'It allows you to build and maintain your forms with the ease of JavaScript :-)',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },

      {
        key: 'awesome',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': 'formState.awesomeIsForced',
          'templateOptions.label': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Is formly totally awesome? (uncheck this and see what happens)';
            }
          }
        }
      },
      */
      /*
      {
        key: 'UPLOADDATA',
        type: 'uploadSection',
        wrapper: 'panel',
        //templateOptions: { label: 'Address', info: 'info!' },
        //templateUrl: 'templates/formly-custom-template.html',
        templateOptions: 
        {
          label: 'X.0 CARICAMENTO DATI', 
          info: 'A tal fine .... ai sensi della La sceltaInserire in questa sezione i dati relativi alla fatturazione</br>LA VELA</br>IL VOLO</br>DELFINO',
          warn: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          btnText:'Nuova persona',
          help: 'help......',
          fields: [
            {
              //className: 'row',
              fieldGroup: 
              [
              {
                  key: 'TipoDato',
                  className: 'col-md-2',
                  type: 'select',
                  templateOptions: {
                    label: '',
                    options: [
                      {label: 'CI', id: 'CI'},
                      {label: 'AA', id: 'AA'},
                      {label: 'FF', id: 'FF'}
                    ],
                    ngOptions: 'option as option.label group by option.gender for option in to.options'
                  }
                },
                {
                  type: 'input',
                  className: 'col-md-3',
                  key: 'Description',
                  templateOptions: 
                  {
                    label: '',
                    required: true
                  }
                },
                {
                  type: 'input',
                  key: 'CodiceFiscale',
                  className: 'col-md-2',
                  templateOptions: 
                  {
                        label: '',
                        required: true
                  }
                },

              ] // fieldGroup
            }
          ], //fields
        } //templateOptions
      },
      */
      
      {
        key: 'NUCLEOFAMILIARE',
        type: 'repeatSection',
        wrapper: 'panel',
        //templateOptions: { label: 'Address', info: 'info!' },
        //templateUrl: 'templates/formly-custom-template.html',
        templateOptions: 
        {
          label: '4.0 DICHIARAZIONE NUCLEO FAMILIARE', 
          info: 'La sceltaInserire in questa sezione i dati rela',
          warn: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          btnText:'Aggiungi nuovo membro del nucleo familiare',
          help: 'help......',
          fields: [
            {
              //className: 'row',
              fieldGroup: 
              [
              {
                  key: 'tipoMembro',
                  className: 'col-md-3',
                  type: 'select',
                  templateOptions: {
                    label: 'Tipo dichiarante',
                    options: [
                      {name: 'DICHIARANTE', value: 'DICHIARANTE'},
                      {name: 'ALTRO GENITORE', value: 'ALTRO GENITORE'},
                      {name: 'FIGLIO O AFFIDATO', value: 'FIGLIO O AFFIDATO'}
                    ]
                  }
                },
                {
                  type: 'input',
                  className: 'col-md-4',
                  key: 'cognomeNome',
                  templateOptions: 
                  {
                    label: 'Cognome Nome',
                    required: true
                  }
                },
                {
                  type: 'input',
                  key: 'codiceFiscale',
                  className: 'col-md-4',
                  templateOptions: 
                  {
                        label: 'Codice Fiscale',
                        required: true
                  }
                }
              ] // fieldGroup
            }
          ], //fields
        } //templateOptions
      }
      /*  
      ,
      {
        key: 'custom',
        type: 'custom',
        templateOptions: {
          label: 'Custom template inlined',
        }
      },
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Example Directive',
        }
      }
      */
    ];


    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
       if (vm.form.$valid) {
          vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');


          var dlg = dialogs.wait(undefined,undefined,_progress);

          console.log('upload!!');

        Upload.upload({
            url: 'uploadmgr/upload',
            method: 'POST',
            //files: vm.options.data.fileList
            data: {files : vm.options.data.fileList, fields: { transactionId : vm.model.transactionId } }
        }).then(function (resp) {
            console.log('Success ');

          FormlyService.createFormly(vm.model)
            .then(function() {
              //usSpinnerService.stop('spinner-1');
              dialogs.notify('ok','Form has been updated');
            })
            .catch(function(response) {
              //usSpinnerService.stop('spinner-1');
              dialogs.error('500 - Errore server',response.data.message, response.status);
            });



            //usSpinnerService.stop('spinner-1');
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
            if (progressPercentage < 100) {
              _progress = progressPercentage
              $rootScope.$broadcast('dialogs.wait.progress',{'progress' : _progress});
            }else{
              $rootScope.$broadcast('dialogs.wait.complete');
            }
        });
          
          /*
          FormlyService.createFormly(vm.model)
            .then(function() {
              usSpinnerService.stop('spinner-1');
              dialogs.notify('ok','Form has been updated');
            })
            .catch(function(response) {
              usSpinnerService.stop('spinner-1');
              dialogs.error('500 - Errore server',response.data.message, response.status);
            });

          */
        }
    }

    // spinner test control
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }

   
/*
      flow.on('fileSuccess', function(file, message, chunk){
        console.log('fileSuccess');
        console.log(file,message, chunk);
      });

      flow.on('fileError', function(file, message){
        console.log('fileErrorUpload');
        console.log(file, message);
      });

*/



                                 
}]);
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('SFormlyJirideCtrl', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','formlyConfig','$q','$http','formlyValidationMessages', 'FormlyService','usSpinnerService','dialogs','UtilsService', 'Upload', 
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  formlyConfig,  $q,  $http,  formlyValidationMessages,   FormlyService,  usSpinnerService,  dialogs,   UtilsService,  Upload) {
    
  $log.debug('SFormlyJirideCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 



    var vm = this;
    var unique = 1;
    var _progress = 0;

    var ElencoSoftware = [
      { "id": "IRIDE", "label":"IRIDE"  },
      { "id": "JIRIDE", "label":"JIRIDE"  },
      { "id": "FIRMA_DIGITALE",  "label":"FIRMA_DIGITALE" },
      { "id": "WORD_PROCESSOR",  "label":"WORD_PROCESSOR" },
      { "id": "VELOX_PM",  "label":"VELOX_PM" },
      { "id": "PDF_CREATOR",  "label":"PDF_CREATOR" },
      { "id": "ALTRO",  "label":"ALTRO" }
    ];


 // richiede la lista degli utenti IRIDE da Mysql
 function refreshUtenteIride(address, field) {
      var promise;
      if (!address) {
        promise = $q.when({data: {results: []}});
      } else {
        var params = {address: address, sensor: false};
        var endpoint = '/api/seq/user';
        promise = $http.get(endpoint, {params: params});
      }
      return promise.then(function(response) {
        //console.log(response);
        field.templateOptions.options = response.data.rows;
      });
  };



    formlyValidationMessages.messages.required = 'to.label + " è obbligatorio"';
    formlyValidationMessages.messages.email = '$viewValue + " is not a valid email address"';
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', '#### is the minimum length', '**** Too short');
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', '## is the maximum length', '** **Too long');

    /*  ---  */

    vm.id = 'form01';
    vm.showError = true;

    // function assignment
    vm.onSubmit = onSubmit;

    // variable assignment

    vm.author = { // optionally fill in your info below :-)
      name: 'RR',
      url: 'https://www.comune.rimini.it' // a link to your twitter/github/blog/whatever
    };

    vm.exampleTitle = 'Assistenza _';
    vm.exampleDescription = '';

    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: '1.0.0'
    };

    vm.model = {
      showErrorState: true,
      transactionId : UtilsService.getTimestampPlusRandom(),
      
      /*
      awesome: true,
      nucleo: [
          {
            CognomeNome:'abc',
            DataNascita:(new Date()).toDateString(),
            CodiceFiscale:''
          }
      ]
      */
    };

    vm.errors = {};

    // dati globali del form  

    vm.options = {
      formState: {
        awesomeIsForced: false
      },
      // contiene i dati dei file da upload di per usare il componente esternamente a due passaggi
      data: {
            fileCount: 0,
            fileList: []
        }
    };
    
    vm.fields = [

      {
        key: 'segnalazione',
        wrapper: 'panel',
        className: 'to-uppercase',
        templateOptions: { 
          label: '1.0 Modulo di assistenza JIRIDE',
          info: '',
          help: ''
        },
        fieldGroup: [
          /*
        {
          key: 'dichiarantePadre',
          type: 'input',
          wrapper: 'inputWithError',
          templateOptions: {
            required: false,
            placeholder: 'This is required min 3 max 8 ...',
            label: 'Il sottoscritto (padre)',
            maxlength: 8,
            minlength: 3
          }
        },
        {
          key: 'dichiaranteMadre',
          type: 'input',
          wrapper: 'inputWithError',
          templateOptions: {
            required: false,
            type: 'text',
            label: 'La sottoscritta (madre)'
          }
        },
        */
        {
        key: 'utenteRichiedenteAssistenza',
        type: 'ui-select-single-search',
        templateOptions: {
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Utente richiedente assistenza',
          valueProp: 'descFull',
          labelProp: 'descFull',
          placeholder: 'Inserire un testo da ricercare',
          options: [],
          refresh: refreshUtenteIride,
          refreshDelay: 10
        }
      },
      {
        key: 'softwareLista',
        type: 'ui-select-single',
        wrapper: 'inputWithError',
         validators: {
          conteggio: {
            expression: function(viewValue, modelValue) {
              console.log(modelValue);
              console.log(viewValue);
              var value = modelValue || viewValue;
              return true;
              /*
              if(modelValue){
                if ((modelValue.length > 0) && (modelValue.length < 3))  {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
              */
            },
            message: '$viewValue + " o uno o due"'
          }
        },
        templateOptions: {
          required: true,
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Selezionare il software oggetto della richiesta',
          valueProp: 'id',
          labelProp: 'label',
          placeholder: 'Cliccare qui per selezionare',
          options: ElencoSoftware
        }
      },
      /*
      {
        key: 'tipoIntervento',
        type: 'ui-select-single',
        wrapper: 'inputWithError',
         validators: {
          conteggio: {
            expression: function(viewValue, modelValue) {
              console.log(modelValue);
              console.log(viewValue);
              var value = modelValue || viewValue;
              return true;
        
            },
            message: '$viewValue + " o uno o due"'
          }
        },
        templateOptions: {
          required: true,
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Selezionare il tipo di intervento richiesto',
          valueProp: 'id',
          labelProp: 'label',
          placeholder: 'CLICCARE QUI PER SELEZIONARE',
          options: ElencoSoftware
        }
      },
      */
      {
        "type": "textarea",
        "key": "descIntervento",
        "templateOptions": {
          "placeholder": "",
          "label": "Descrizione problema",
          "rows": 2,
          "cols": 15
        }
      },
      {
        "key": "dataRisoluzione",
        "type": "datepicker",
        "templateOptions": {
          "label": "Data risoluzione",
          "type": "text",
          "datepickerPopup": "dd-MMMM-yyyy"
        }
      },
      {
        "type": "textarea",
        "key": "descAttivitaSvolta",
        "templateOptions": {
          "placeholder": "",
          "label": "Attività svolta",
          "rows": 2,
          "cols": 15
        },
      },
      {
        "type": "textarea",
        "key": "descNote",
        "templateOptions": {
          "placeholder": "",
          "label": "Note",
          "rows": 2,
          "cols": 15
        }
      }

        ]
      },
      /*
      {
        key: 'FATTURAZIONE',
        wrapper: 'panel',
        templateOptions: { 
          label: '2.0 Dati fatturazione',
          info: 'Inserire in questa sezione i dati relativi alla fatturazione',
          help: 'Inserire in questa sezione i dati relativi alla fatturazione'
        },
        fieldGroup: [
        {
          key: 'CodiceFiscale',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Codice Fiscale'
          }
        },
        {
          key: 'NatoA',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Nato A:'
          }
        },
        {
          key: 'DataNascita',
          type: 'datepicker',
          templateOptions: {
              label: 'Data Nascita',
              type: 'text',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
         }

        ]
      },
      */
      /*
      {
        key: 'PLESSO',
        wrapper: 'panel',
        templateOptions: { 
          label: '2.0 Scelta del centro estivo',
          info: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione</br>LA VELA</br>IL VOLO</br>DELFINO',
          warn: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          help: 'Inserire in questa sezione i dati relativi alla fatturazione'
        },
        fieldGroup: [
      {
        key: 'PLESSISELEZIONE',
        type: 'ui-select-multiple',
        wrapper: 'inputWithError',
         validators: {
          conteggio: {
            expression: function(viewValue, modelValue) {
              console.log(modelValue);
              console.log(viewValue);
              var value = modelValue || viewValue;
              if(modelValue){
                if ((modelValue.length > 0) && (modelValue.length < 3))  {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            },
            message: '$viewValue + " o uno o due"'
          }
        },
        templateOptions: {
          required: true,
          optionsAttr: 'bs-options',
          ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
          label: 'Selezionare una o due scuole in ordine di scelta',
          valueProp: 'id',
          labelProp: 'label',
          placeholder: 'Cliccare qui per selezionare',
          options: ElencoPlessi
        }
      }
        ]
      },
      */
      /*
      {
        key: 'UPLOADFILE',
        type: 'repeatUploadSection',
        wrapper: 'panel',
        //templateOptions: { label: 'Address', info: 'info!' },
        //templateUrl: 'templates/formly-custom-template.html',
        templateOptions: 
        {
          label: 'labelUpload', 
          info: 'infoUpload',
          warn: 'wUpload',
          btnText:'Nuovo elemento btn',
          help: 'helpUpload',
          fields: [
            {
              //className: 'row',
              fieldGroup: 
              [
               {
                key: 'tipoDocumento',
                className: 'col-md-3',
                type: 'input',
                templateOptions: {
                  required: false,
                  label: 'tipo_Documento_label'
                }
              },
              {
                key: 'fileName',
                type: 'input',
                className: 'col-md-6',
                templateOptions: {
                  required: false,
                  label: 'fileName'
                }
              },
              {
                key: 'fileSize',
                type: 'input',
                className: 'col-md-2',
                templateOptions: {
                  required: false,
                  label: 'fileSize'
                }
              }

              ] // fieldGroup
            }
          ], //fields
        } //templateOptions
      }
      */

      /*

      {
        key: 'IMMAGINE_SINGOLA',
        wrapper: 'panel',
        templateOptions: { 
          label: '99.0 Immagine Singola',
          info: '99 La sceltaInserire in questa sezione i dati relativi alla fatturazione</br>LA VELA</br>IL VOLO</br>DELFINO',
          warn: '99 La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          help: '99 Inserire in questa sezione i dati relativi alla fatturazione'
        },
        fieldGroup: [
       {
          key: 'IMMAGINE_1',
          type: 'imageUpload',
          wrapper: 'inputWithError',
          templateOptions: {
            required: false,
            placeholder: 'This is required min 3 max 8 ...',
            label: 'Il sottoscritto (padre)'
          }
        },
        ]
      },

      */

      /*
      {
        key: 'SITUAZIONEPARENTALE',
        wrapper: 'panel',
        templateOptions: { 
          label: '99.0 Situazione parentale',
          info: '---',
          warn: '--',
          help: '---'
        },
        fieldGroup: [
              {
                key: 'SITUAZIONEPARENTALE_1',
                type: 'multiCheckbox',
                templateOptions: {
                  label: 'Nucleo inco......',
                  options: [{id: 1, title : "Stato uno"}, 
                            {id: 2, title : "Stato due "},
                            {id: 3, title : "Stato tre"}],
                  valueProp: 'id',
                  labelProp: 'title'
                }
              },
              {
                template: '<p>Description ...</p>'
              },
              {
                key: 'SITUAZIONEPARENTALE_2',
                type: 'multiCheckbox',
                templateOptions: {
                  label: 'Presenza altri dati',
                  options: [{id: 1, title : "Stato 1"}, {id: 2, title : "Stato 2"}],
                  valueProp: 'id',
                  labelProp: 'title'
                }
              }
            ]
      },
      */

      /*
      {
        key: 'certo',
        type: 'input',
        templateOptions: {
          label: 'CertoLabel',
          placeholder: 'visible se text presente',
          required: true
        },
        expressionProperties: {
          hideExpression: '!model.text',
          'templateOptions.disabled': function($viewValue, $modelValue, scope){
              var value = $viewValue || $modelValue;
              if (scope.model.text == "aaaaaaa" ) {
              //throw new Error('IS aaaa');
              return false;
            } else {
              return true;
            }
          }
        }
      },

      {
        template : '<hr/>'
      },

      {
        key: 'nested.story',
        type: 'textarea',
        templateOptions: {
          label: 'Some sweet story',
          placeholder: 'It allows you to build and maintain your forms with the ease of JavaScript :-)',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },

      {
        key: 'awesome',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': 'formState.awesomeIsForced',
          'templateOptions.label': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Is formly totally awesome? (uncheck this and see what happens)';
            }
          }
        }
      },
      */
      /*
      {
        key: 'UPLOADDATA',
        type: 'uploadSection',
        wrapper: 'panel',
        //templateOptions: { label: 'Address', info: 'info!' },
        //templateUrl: 'templates/formly-custom-template.html',
        templateOptions: 
        {
          label: 'X.0 CARICAMENTO DATI', 
          info: 'A tal fine .... ai sensi della La sceltaInserire in questa sezione i dati relativi alla fatturazione</br>LA VELA</br>IL VOLO</br>DELFINO',
          warn: 'La sceltaInserire in questa sezione i dati relativi alla fatturazione',
          btnText:'Nuova persona',
          help: 'help......',
          fields: [
            {
              //className: 'row',
              fieldGroup: 
              [
              {
                  key: 'TipoDato',
                  className: 'col-md-2',
                  type: 'select',
                  templateOptions: {
                    label: '',
                    options: [
                      {label: 'CI', id: 'CI'},
                      {label: 'AA', id: 'AA'},
                      {label: 'FF', id: 'FF'}
                    ],
                    ngOptions: 'option as option.label group by option.gender for option in to.options'
                  }
                },
                {
                  type: 'input',
                  className: 'col-md-3',
                  key: 'Description',
                  templateOptions: 
                  {
                    label: '',
                    required: true
                  }
                },
                {
                  type: 'input',
                  key: 'CodiceFiscale',
                  className: 'col-md-2',
                  templateOptions: 
                  {
                        label: '',
                        required: true
                  }
                },

              ] // fieldGroup
            }
          ], //fields
        } //templateOptions
      },
      */
      /*  
      ,
      {
        key: 'custom',
        type: 'custom',
        templateOptions: {
          label: 'Custom template inlined',
        }
      },
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Example Directive',
        }
      }
      */
    ];


    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
       if (vm.form.$valid) {
          vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');


          var dlg = dialogs.wait(undefined,undefined,_progress);

          console.log('upload!!');

        Upload.upload({
            url: $rootScope.base_url + '/helpdesk/hdupload',
            method: 'POST',
            //files: vm.options.data.fileList
            data: {files : vm.options.data.fileList, fields: { formModel : vm.model } }
        }).then(function (resp) {
            console.log('Success ');

               dialogs.notify('ok','Azione completata con successo!');
              //dialogs.error('500 - Errore server',response.data.message, response.status);
          
            //usSpinnerService.stop('spinner-1');
        }, function (resp) {
            console.log('Error status: ' + resp.status);
            dialogs.error('500 - Errore server',response.data.message, response.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
            if (progressPercentage < 100) {
              _progress = progressPercentage
              $rootScope.$broadcast('dialogs.wait.progress',{'progress' : _progress});
            }else{
              $rootScope.$broadcast('dialogs.wait.complete');
            }
        });
          
          /*
          FormlyService.createFormly(vm.model)
            .then(function() {
              usSpinnerService.stop('spinner-1');
              dialogs.notify('ok','Form has been updated');
            })
            .catch(function(response) {
              usSpinnerService.stop('spinner-1');
              dialogs.error('500 - Errore server',response.data.message, response.status);
            });

          */
        }
    }

    // spinner test control
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }

   
/*
      flow.on('fileSuccess', function(file, message, chunk){
        console.log('fileSuccess');
        console.log(file,message, chunk);
      });

      flow.on('fileError', function(file, message){
        console.log('fileErrorUpload');
        console.log(file, message);
      });

*/



                                 
}])


.controller('SFormlyJirideListCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','uiGridConstants', '$filter', 'Session', '$log', '$timeout','ENV','$uibModal',
     function($rootScope,  $scope,   $http, $state,   $location,  uiGridConstants ,  $filter,   Session,   $log,   $timeout, ENV, $uibModal) {
    
  $log.debug('SFormlyJirideListCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 
  
  
  $scope.totalPages = 0;
  $scope.txtGlobalSearch = '';
  $scope.itemsCount = 0;
  $scope.currentPage = 1; 
  $scope.currentItemDetail = null;
  $scope.totalItems = 0;
  $scope.pageSize = 100; // impostato al massimo numero di elementi
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
  $scope.id_utenti_selezione = 0;        
  $scope.items = [];
  $scope.loadMoreDataCanBeLoaded = true;
  


  var filterObj = {
    "pageInfo" : {
      "totalPages" : 0,
      "currentPage" : 0
    },
    "filterData" : {
      "globalTxt" : '',
      "descUtente" : '',
      "descAttivitaSvolta" : ''
    },
    "filterButton" : null,
    "orderBy" : {
      "dateInsert" : 'asc'
    }

  };


  var today = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
 
 $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };


  $scope.gridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableSelectAll: true,
    showGridFooter:true,
    columnDefs: [
      { name: 'Data Ins.',  field:  'ts', cellFilter:'date', width:80, type:'date', enableFiltering:false },
      { name: 'Matr. Ins.', field: 'userData.userId', width:80 , enableFiltering:true },
      { name: 'tipoIntervento', field: 'formModel.segnalazione.tipoIntervento'},
      { name: 'Utente', field: 'formModel.segnalazione.utenteRichiedenteAssistenza'},
      { field: 'company', enableSorting: false }
    ],
    onRegisterApi: function( gridApi ) {
      $scope.grid1Api = gridApi;
    }
  };
  $scope.gridOptions.multiSelect = true;
 
  $scope.toggleGender = function() {
    if( $scope.gridOptions1.data[64].gender === 'male' ) {
      $scope.gridOptions1.data[64].gender = 'female';
    } else {
      $scope.gridOptions1.data[64].gender = 'male';
    };
    $scope.grid1Api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );
  };
                                 
                                 
  $scope.closeSortModal = function() {$scope.sortModal.hide();};
  $scope.closeDetailModal = function() {$scope.detailModal.hide();};
                                 
  $scope.applySortModal = function() {
    $log.debug("ListReportController: SORT MODAL " + this.filterTerm + " sort " + this.sortBy + ' id_selezione :' + this.id_utenti_selezione);
    $scope.filterCriteria.id_utenti_selezione = this.id_utenti_selezione;
    $log.debug($scope.filterCriteria);
    $scope.filterTerm = this.filterTerm;
    $scope.sortBy = this.sortBy;
    $scope.sortModal.hide();
    $scope.fetchResult();
  }
  
//  $scope.OpenFilter = function() {
//       $log.debug("ListReportController: OpenFilter .. sortModal.show()");
//       $scope.sortModal.show();
//  };                                 
                               
  $http.get(  $rootScope.base_url +  '/helpdesk/getList')
    .success(function(data) {
      console.log(data);
      $scope.data = data;
      //$scope.gridOptions2.data = data;
    });                  


  $scope.setFilter = function(strFilter){
    console.log($scope.filterModelButton);

  };

  $scope.filterModelButton = {};
  $scope.checkResults = [];

  $scope.DoSearch = function(){
      console.log('DoSearch');

      filterObj.filterData.globalTxt = $scope.txtGlobalSearch;
      filterObj.filterButton = $scope.filterModelButton;

      $scope.checkResults = [];
      angular.forEach($scope.filterModelButton, function (value, key) {
        if (value) {
          $scope.checkResults.push(key);
        }
      });

      filterObj.filterButton = $scope.checkResults;
      console.log(filterObj);
      console.log($scope.checkResults);

    $http( 
            {
              url: $rootScope.base_url +  '/helpdesk/getList', 
              method: "GET",
              params: filterObj
        })
      .success(function(data) {
      //console.log(data);
      $scope.data = data;
      //$scope.gridOptions2.data = data;
    });                  

   }                   

    //http://angular-formly.com/#/example/integrations/ui-bootstrap-modal
    $scope.OpenFilter = function(model, add) {
      console.log('OpenFilter');
      var result = $uibModal.open({
        templateUrl: 'templates/searchOptionsModal.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: 'vm',
        resolve: {
          formData: function() {
            return {
              //fields: getFormFields(),
              fields :
              [
                {'key':'txtUtente','type':'input','templateOptions':{'label':'Utente Richiedente','placeholder':''}},
                {'key':'txtApplicativo','type':'input','templateOptions':{'label':'Applicativo','placeholder':''}},
                {'key':'txtProblema','type':'input','templateOptions':{'label':'Testo Problema','placeholder':''}},
                {'key':'txtSoluzione','type':'input','templateOptions':{'label':'Testo Soluzione','placeholder':''}}
              ],
              model: model
            }
          }
        }
      }).result;

      console.log('');
      

      if (add) {
        result.then(function(model) {
          console.log(model);
          //vm.history.push(model);
        });
      }
    }

}])

.controller('ModalInstanceCtrl', 
    ['$uibModalInstance', 'formData', 
      function ($uibModalInstance, formData) {

    var vm = this;

    // function assignment
    vm.ok = ok;
    vm.cancel = cancel;

    // variable assignment
    vm.formData = formData;
    vm.originalFields = angular.copy(vm.formData.fields);

    // function definition
    function ok() {
      console.log(vm.formData.model);
      $uibModalInstance.close(vm.formData.model);
    }

    function cancel() {
      vm.formData.options.resetModel()
      $uibModalInstance.dismiss('cancel');
    };
}]);



'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('UiGridCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','uiGridConstants', '$filter', 'Session', '$log', '$timeout','ENV',
     function($rootScope,  $scope,   $http,  $state,   $location,  uiGridConstants ,  $filter,   Session,   $log,   $timeout, ENV) {
    
  $log.debug('UiGridCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 
  
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1; 
  $scope.currentItemDetail = null;
  $scope.totalItems = 0;
  $scope.pageSize = 100; // impostato al massimo numero di elementi
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
  $scope.id_utenti_selezione = 0;        
  $scope.items = [];
  $scope.loadMoreDataCanBeLoaded = true;
  
  var today = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
 
  $scope.gridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableSelectAll: true,
    showGridFooter:true,
    columnDefs: [
      { name: 'Data Ins.',  field:  'ts', cellFilter:'date', width:80, type:'date', enableFiltering:false },
      { name: 'Matr. Ins.', field: 'userData.userId', width:80 , enableFiltering:true },
      { name: 'tipoIntervento', field: 'formModel.segnalazione.tipoIntervento'},
      { name: 'Utente', field: 'formModel.segnalazione.utenteRichiedenteAssistenza'},
      { field: 'company', enableSorting: false }
    ],
    onRegisterApi: function( gridApi ) {
      $scope.grid1Api = gridApi;
    }
  };
  $scope.gridOptions.multiSelect = true;
 
  $scope.toggleGender = function() {
    if( $scope.gridOptions1.data[64].gender === 'male' ) {
      $scope.gridOptions1.data[64].gender = 'female';
    } else {
      $scope.gridOptions1.data[64].gender = 'male';
    };
    $scope.grid1Api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );
  };
                                 
                                 
  $scope.closeSortModal = function() {$scope.sortModal.hide();};
  $scope.closeDetailModal = function() {$scope.detailModal.hide();};
                                 
  $scope.applySortModal = function() {
    $log.debug("ListReportController: SORT MODAL " + this.filterTerm + " sort " + this.sortBy + ' id_selezione :' + this.id_utenti_selezione);
    $scope.filterCriteria.id_utenti_selezione = this.id_utenti_selezione;
    $log.debug($scope.filterCriteria);
    $scope.filterTerm = this.filterTerm;
    $scope.sortBy = this.sortBy;
    $scope.sortModal.hide();
    $scope.fetchResult();
  }
  
  $scope.OpenFilter = function() {
       $log.debug("ListReportController: OpenFilter .. sortModal.show()");
       $scope.sortModal.show();
  };                                 
                               
  $http.get(  $rootScope.base_url +  '/helpdesk/getList')
    .success(function(data) {
      console.log(data);
      $scope.gridOptions.data = data;
      //$scope.gridOptions2.data = data;
    });                  
                                 
}])

.controller('GraphPhoneCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','UtilsService', '$filter', 'Session', '$log', '$timeout','ENV', 'usSpinnerService',
     function($rootScope,  $scope,   $http, $state,   $location,  UtilsService ,  $filter,   Session,   $log,   $timeout, ENV, usSpinnerService) {
    
  $log.debug('GraphPhoneCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 


  $scope.reloadData = function(){
    console.log('reloadData');
    usSpinnerService.spin('spinner-1');
    $http(  {
        url : $rootScope.base_url +  '/phone/getData',
        method : 'GET',
        params : vm.model
    })
      .success(function(data) {
        console.log(data);

         

        $scope.labels = [];
        $scope.data = [];

        angular.forEach(data.dataset, function(item) {
            $scope.data.push(item.numTelefonate);
            $scope.labels.push(item.tel_data.substring(0, 10));
            
        });

        usSpinnerService.stop('spinner-1');
      });  

  }

/*
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
*/
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  /*
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };
  */

  // popup date input

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd', 'shortDate'];
  $scope.format = $scope.formats[2];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };


  // simple form with formly

  
  var vm = this;
  var unique = 1;
  var _progress = 0;

  var ElencoSoftware = [
      { "id": "IRIDE", "label":"IRIDE"  },
      { "id": "JIRIDE", "label":"JIRIDE"  },
      { "id": "FIRMA DIGITALE",  "label":"FIRMA DIGITALE" },
      { "id": "WORD PROCESSOR",  "label":"WORD PROCESSOR" },
      { "id": "VELOX PM",  "label":"VELOX PM" },
      { "id": "PDF CREATOR",  "label":"PDF CREATOR" },
      { "id": "Altro",  "label":"Altro" }
    ];



  vm.id = 'form01';
  vm.showError = true;
  vm.onSubmit = onSubmit;
  vm.author = { // optionally fill in your info below :-)
      name: 'RR',
      url: 'https://www.comune.rimini.it' // a link to your twitter/github/blog/whatever
    };

  vm.exampleTitle = '';
  vm.exampleDescription = '';

  vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: '1.0.0'
  };

  vm.model = {
      //showErrorState: true,
      //transactionId : UtilsService.getTimestampPlusRandom(),
      numTel: '4607',
      daData: new Date('08-08-2016'),
      aData: new Date('08-20-2016')
  };

  vm.errors = {};

  // dati globali del form  

    vm.options = {
      formState: {
        awesomeIsForced: false
      },
      // contiene i dati dei file da upload di per usare il componente esternamente a due passaggi
      data: {
            fileCount: 0,
            fileList: []
        }
    };
    
    vm.fields = [
         {
          key: 'numTel',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Interno telefonico abbreviato'
          }
        },
        {
          key: 'daData',
          type: 'datepicker',
          templateOptions: {
              label: 'Data di Partenza',
              type: 'text',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
         }

      ,
        {
          key: 'aData',
          type: 'datepicker',
          templateOptions: {
              label: 'Data di Arrivo',
              type: 'text',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
         }
         
    ];


    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
       if (vm.form.$valid) {
          vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');

          console.log(vm.model);
          $scope.reloadData();

          
        }
    }


     // spinner test control
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }

}]);
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('ELEUiGridCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','uiGridConstants', '$filter', 'Session', '$log', '$timeout','ENV',
     function($rootScope,  $scope,   $http,  $state,   $location,  uiGridConstants ,  $filter,   Session,   $log,   $timeout, ENV) {
    
  $log.debug('UiGridCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 
  
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1; 
  $scope.currentItemDetail = null;
  $scope.totalItems = 0;
  $scope.pageSize = 100; // impostato al massimo numero di elementi
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
  $scope.id_utenti_selezione = 0;        
  $scope.items = [];
  $scope.loadMoreDataCanBeLoaded = true;
  
  var today = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
 
  $scope.gridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableSelectAll: true,
    showGridFooter:true,
    columnDefs: [
      { name: 'Data Ins.',  field:  'ts', cellFilter:'date', width:80, type:'date', enableFiltering:false },
      { name: 'Matr. Ins.', field: 'userData.userId', width:80 , enableFiltering:true },
      { name: 'tipoIntervento', field: 'formModel.segnalazione.tipoIntervento'},
      { name: 'Utente', field: 'formModel.segnalazione.utenteRichiedenteAssistenza'},
      { field: 'company', enableSorting: false }
    ],
    onRegisterApi: function( gridApi ) {
      $scope.grid1Api = gridApi;
    }
  };
  $scope.gridOptions.multiSelect = true;
 
  $scope.toggleGender = function() {
    if( $scope.gridOptions1.data[64].gender === 'male' ) {
      $scope.gridOptions1.data[64].gender = 'female';
    } else {
      $scope.gridOptions1.data[64].gender = 'male';
    };
    $scope.grid1Api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );
  };
                                 
                                 
  $scope.closeSortModal = function() {$scope.sortModal.hide();};
  $scope.closeDetailModal = function() {$scope.detailModal.hide();};
                                 
  $scope.applySortModal = function() {
    $log.debug("ListReportController: SORT MODAL " + this.filterTerm + " sort " + this.sortBy + ' id_selezione :' + this.id_utenti_selezione);
    $scope.filterCriteria.id_utenti_selezione = this.id_utenti_selezione;
    $log.debug($scope.filterCriteria);
    $scope.filterTerm = this.filterTerm;
    $scope.sortBy = this.sortBy;
    $scope.sortModal.hide();
    $scope.fetchResult();
  }
  
  $scope.OpenFilter = function() {
       $log.debug("ListReportController: OpenFilter .. sortModal.show()");
       $scope.sortModal.show();
  };                                 
                               
  $http.get(  $rootScope.base_url +  '/helpdesk/getList')
    .success(function(data) {
      console.log(data);
      $scope.gridOptions.data = data;
      //$scope.gridOptions2.data = data;
    });                  
                                 
}])

.controller('ElezioniCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','UtilsService', '$filter', 'Session', '$log', '$timeout','ENV', 'usSpinnerService',
     function($rootScope,  $scope,   $http, $state,   $location,  UtilsService ,  $filter,   Session,   $log,   $timeout, ENV, usSpinnerService) {
    
  $log.debug('GraphPhoneCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 


  $scope.reloadData = function(){
    console.log('reloadData');
    usSpinnerService.spin('spinner-1');
    $http(  {
        url : $rootScope.base_url +  '/phone/getData',
        method : 'GET',
        params : vm.model
    })
      .success(function(data) {
        console.log(data);

         

        $scope.labels = [];
        $scope.data = [];

        angular.forEach(data.dataset, function(item) {
            $scope.data.push(item.numTelefonate);
            $scope.labels.push(item.tel_data.substring(0, 10));
            
        });

        usSpinnerService.stop('spinner-1');
      });  

  }

/*
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
*/
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  /*
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };
  */

  // popup date input

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd', 'shortDate'];
  $scope.format = $scope.formats[2];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };


  // simple form with formly

  
  var vm = this;
  var unique = 1;
  var _progress = 0;

  var ElencoSoftware = [
      { "id": "IRIDE", "label":"IRIDE"  },
      { "id": "JIRIDE", "label":"JIRIDE"  },
      { "id": "FIRMA DIGITALE",  "label":"FIRMA DIGITALE" },
      { "id": "WORD PROCESSOR",  "label":"WORD PROCESSOR" },
      { "id": "VELOX PM",  "label":"VELOX PM" },
      { "id": "PDF CREATOR",  "label":"PDF CREATOR" },
      { "id": "Altro",  "label":"Altro" }
    ];



  vm.id = 'form01';
  vm.showError = true;
  vm.onSubmit = onSubmit;
  vm.author = { // optionally fill in your info below :-)
      name: 'RR',
      url: 'https://www.comune.rimini.it' // a link to your twitter/github/blog/whatever
    };

  vm.exampleTitle = '';
  vm.exampleDescription = '';

  vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: '1.0.0'
  };

  vm.model = {
      //showErrorState: true,
      //transactionId : UtilsService.getTimestampPlusRandom(),
      OperationId : 'recuperaEventiElettorali',
      ActionId : 'showXML',
      UserID : 'cm4ucmltaW5pLndlYnNlcnZpY2UuZ2lhY29taW5p',
      Password : 'UklNSU5JLnJlZjEyMjAxNg==',
      CodiceProvincia : '101',
      CodiceComune : '140',
      TipoElezione : '7',
      DataElezione : '2016-12-04'
  };

  vm.errors = {};

  // dati globali del form  

    vm.options = {
      formState: {
        awesomeIsForced: false
      },
      // contiene i dati dei file da upload di per usare il componente esternamente a due passaggi
      data: {
            fileCount: 0,
            fileList: []
        }
    };
    
    vm.fields = [

     {
        className: 'row',
        fieldGroup: [


        {
        key: 'OperationId',
        className: 'col-sm-6',
        type: 'select',
        templateOptions: {
          label: 'SelezioneOperazione',
          options: [
            {name: 'recuperaEventiElettorali', value: 'recuperaEventiElettorali'},
            {name: 'recuperaInfoAreaAcquisizione', value: 'recuperaInfoAreaAcquisizione'},
            {name: 'recuperaInfoAreaAcquisizioneVotantiReferendum', value: 'recuperaInfoAreaAcquisizioneVotantiReferendum'},
            {name: 'recuperaInfoQuesiti', value: 'recuperaInfoQuesiti'},
          ]
        }
      },

       {
        key: 'ActionId',
        className: 'col-sm-6',
        type: 'select',
        templateOptions: {
          label: 'SelezioneAzione',
          options: [
            {name: 'showXML', value: 'showXML'},
            {name: 'sendXML', value: 'sendXML'}
          ]
        }
      }
    ]
     },



     {
        className: 'row',
        fieldGroup: [

        {
          key: 'UserID',
          className: 'col-sm-6',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'UserID'
          }
        },
        {
          key: 'Password',
          className: 'col-sm-6',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Password'
          }
        }
        ]
     },
    {
        className: 'row',
        fieldGroup: [

        {
          key: 'CodiceProvincia',
          className: 'col-sm-3',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'CodiceProvincia'
          }
        },
        {
          key: 'CodiceComune',
          className: 'col-sm-3',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'CodiceComune'
          }
        },
        {
          key: 'TipoElezione',
          className: 'col-sm-3',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'TipoElezione'
          }
        },
        {
          key: 'DataElezione',
          className: 'col-sm-3',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'DataElezione'
          }
        }
        ]
    }
    ];

    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
       if (vm.form.$valid) {
          vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');
          

          var apiUrl = "http://localhost:9988/elezioni/produzione/" + vm.model.OperationId + "/" + vm.model.ActionId;
          console.log('apiUrl', apiUrl);


         usSpinnerService.spin('spinner-1');
          return $http({ 
                    url: apiUrl, 
                    method: "GET",
                    params: vm.model
                  })
        .then(function (res) {
            console.log(res.data);

            if(vm.model.ActionId == "showXML") {
                $scope.outputResponse = res.data.replace(/['"]+/g, '');
                $scope.outputStatusCode = res.data.replace(/['"]+/g, '');
            } else {
                $scope.outputResponse = vkbeautify.xml(res.data.response);
                // someStr.replace(/['"]+/g, '')
                $scope.outputStatusCode = res.data.statusCode;
            }
            

            
            usSpinnerService.stop('spinner-1');
            
        });
          
          
        }
    }


     // spinner test control
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }




}]);
'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('ProtocolloCtrl', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','formlyConfig','$q','$http','formlyValidationMessages', 'FormlyService','usSpinnerService','dialogs','UtilsService', 'Upload', 
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  formlyConfig,  $q,  $http,  formlyValidationMessages,   FormlyService,  usSpinnerService,  dialogs,   UtilsService,  Upload) {
    
  $log.debug('ProtocolloCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 


    // http://www.technofattie.com/2014/07/01/using-angular-forms-with-controller-as-syntax.html
    this.form = $scope.form;

    var vm = this;
    var unique = 1;
    var _progress = 0;

    var ElencoSoftware = [
      { "id": "IRIDE", "label":"IRIDE"  },
      { "id": "JIRIDE", "label":"JIRIDE"  },
      { "id": "FIRMA_DIGITALE",  "label":"FIRMA_DIGITALE" },
      { "id": "WORD_PROCESSOR",  "label":"WORD_PROCESSOR" },
      { "id": "VELOX_PM",  "label":"VELOX_PM" },
      { "id": "PDF_CREATOR",  "label":"PDF_CREATOR" },
      { "id": "ALTRO",  "label":"ALTRO" }
    ];


 // richiede la lista degli utenti IRIDE da Mysql
 function refreshUtenteIride(address, field) {
      var promise;
      if (!address) {
        promise = $q.when({data: {results: []}});
      } else {
        var params = {address: address, sensor: false};
        var endpoint = '/api/seq/user';
        promise = $http.get(endpoint, {params: params});
      }
      return promise.then(function(response) {
        //console.log(response);
        field.templateOptions.options = response.data.rows;
      });
  };



    
    /*  ---  */

    vm.id = 'form01';
    vm.showError = true;
    vm.bshowForm = true;
    vm.name  = "NAME01";
    vm.email  = "a@a.com";
    vm.userForm = {};
    vm.model = {};
    vm.model.nomeRichiedente = 'MARIO';
    vm.model.cognomeRichiedente = 'ROSSI';
    vm.model.emailRichiedente = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.codiceFiscaleRichiedente = 'RGGRGR70E25H294T';
    vm.model.cellulareRichiedente = '3355703086';
    vm.model.dataNascitaRichiedente = '11/12/1912';
    vm.model.indirizzoRichiedente = 'VIA ROMA, 1';
    vm.model.cittaRichiedente = 'RIMINI';
    vm.model.capRichiedente = '47921';
    vm.model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.oggettoRichiedente = 'Invio richiesta generica Sig. MARIO ROSSI, cortesemente ....';
    vm.model.hash = [];
    vm.responseMessage = {};


    // function assignment
    vm.onSubmit = onSubmit;
    vm.calcHash = calcHash;
    vm.show_Form = function(){ vm.bshowForm = true};
    vm.hide_Form = function(){ vm.bshowForm = false};

    function calcHash(f){
        console.log('calcHash', f);
        vm.model.picFile1_info = "";

        if(f) {
            var dlg = dialogs.wait('Controllo...','calcolo codice di controllo',0);

            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                    file = f,
                    chunkSize = 2097152,                           // read in chunks of 2MB
                    chunks = Math.ceil(file.size / chunkSize),
                    currentChunk = 0,
                    spark = new SparkMD5(),
                    running = false,
                    time,
                    uniqueId = 'chunk_' + (new Date().getTime()),
                    chunkId = null,
                    fileReader = new FileReader();

                fileReader.onload = function (e) {
                    if (currentChunk === 0) {
                        console.log('Read chunk number <strong id="' + uniqueId + '">' + (currentChunk + 1) + '</strong> of <strong>' + chunks + '</strong><br/>', 'info');
                    } else {
                        if (chunkId === null) {
                            chunkId = document.getElementById(uniqueId);
                        }
                        // chunkId.innerHTML = currentChunk + 1;
                        var progressPercentage = parseInt(100.0 * currentChunk / chunks);
                        console.log('progress: ' + progressPercentage + '% ');
                        //dialogs.wait('Controllo...','calcolo codice di controllo',{'progress' : progressPercentage});
                        $rootScope.$broadcast('dialogs.wait.progress',{'progress' : progressPercentage});
                        $scope.$apply();
                    }
                    spark.appendBinary(e.target.result);                 // append array buffer
                    currentChunk += 1;
                    if (currentChunk < chunks) {
                        loadNext();
                    } else {
                        running = false;
                        var hashSpark = spark.end();
                        console.log('<strong>Finished loading!</strong><br/>', 'success');
                        console.log('<strong>Computed hash:</strong> ' + hashSpark + '<br/>', 'success'); // compute hash
                        console.log('<strong>Total time:</strong> ' + (new Date().getTime() - time) + 'ms<br/>', 'success');
                        $rootScope.$broadcast('dialogs.wait.complete');
                        vm.model.hash.push({ "name" : f.name, "hash" : hashSpark });
                    }
                };
                fileReader.onerror = function () {
                    running = false;
                    console.log('<strong>Oops, something went wrong.</strong>', 'error');
                };


                function loadNext() {
                    var start = currentChunk * chunkSize,
                        end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                    fileReader.readAsBinaryString(blobSlice.call(file, start, end));
                }
                running = true;
                console.log('<p></p><strong>Starting incremental test (' + file.name + ')</strong><br/>', 'info');
                time = new Date().getTime();
                loadNext();
        } // check f
    }

    // vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
        console.log('onSubmit ...');
        console.log(vm.model);
        var uploadUrl = $rootScope.base_url + '/api/protocollo/upload';
        console.log(uploadUrl);

       if (vm.userForm.$valid) {
          // vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');

          var dlg = dialogs.wait(undefined,undefined,_progress);

          console.log('upload!!');
          
          //var upFiles = [];
          //upFiles.push(vm.model.picFile1);
          //upFiles.push(vm.model.picFile2);
          
          

        Upload.upload({
            url: uploadUrl,
            method: 'POST',
            //files: vm.options.data.fileList
            //data: {files : upFiles, fields: vm.model  }
            data: {fields: vm.model  }
        }).then(function (resp) {
            console.log('Success ');
            console.log(resp);

               $rootScope.$broadcast('dialogs.wait.complete'); 
               // dialogs.notify('Richiesta correttamente pervenuta', resp.data);
               vm.responseMessage = resp.data;
               vm.bshowForm = false;
               console.log(vm.responseMessage);
              //dialogs.error('500 - Errore server',response.data.message, response.status);
          
            //usSpinnerService.stop('spinner-1');
        }, function (resp) {
            $rootScope.$broadcast('dialogs.wait.complete');
            console.log('Error status: ' + resp.status);
            console.log(resp);

            if (resp.status == -1){
                vm.responseMessage.title = "Errore di connessione";
                vm.responseMessage.msg = "Verificare la connessione internet e riprovare la trasmissione";
                vm.responseMessage.code = 999;
            } else {
                vm.responseMessage = resp.data;
            }

            vm.bshowForm = false;
            // dialogs.error('Errore - ' + resp.status, resp.data.msg);
            console.log(vm.responseMessage);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
            if (progressPercentage < 100) {
              _progress = progressPercentage
              $rootScope.$broadcast('dialogs.wait.progress',{'msg' : progressPercentage, 'progress' : _progress});
            }else{
              //$rootScope.$broadcast('dialogs.wait.complete');
              $rootScope.$broadcast('dialogs.wait.progress',{'msg' : 'Elaborazione in corso', 'progress' : _progress});
            }
        });

    
          
        }
    }

    // spinner test control
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }

   

                                 
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
'use strict';
angular.module('myApp.directives')
  .directive('passwordMatch', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=passwordMatch'
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };
        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
});

'use strict';

angular.module('myApp.directives')
  .directive('passwordStrength', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        var indicator = element.children();
        var dots = Array.prototype.slice.call(indicator.children());
        var weakest = dots.slice(-1)[0];
        var weak = dots.slice(-2);
        var strong = dots.slice(-3);
        var strongest = dots.slice(-4);

        element.after(indicator);

        element.bind('keyup', function() {
          var matches = {
                positive: {},
                negative: {}
              },
              counts = {
                positive: {},
                negative: {}
              },
              tmp,
              strength = 0,
              letters = 'abcdefghijklmnopqrstuvwxyz',
              numbers = '01234567890',
              symbols = '\\!@#$%&/()=?¿',
              strValue;

          angular.forEach(dots, function(el) {
            el.style.backgroundColor = '#ebeef1';
          });
          
          if (ngModel.$viewValue) {
            // Increase strength level
            matches.positive.lower = ngModel.$viewValue.match(/[a-z]/g);
            matches.positive.upper = ngModel.$viewValue.match(/[A-Z]/g);
            matches.positive.numbers = ngModel.$viewValue.match(/\d/g);
            matches.positive.symbols = ngModel.$viewValue.match(/[$-/:-?{-~!^_`\[\]]/g);
            matches.positive.middleNumber = ngModel.$viewValue.slice(1, -1).match(/\d/g);
            matches.positive.middleSymbol = ngModel.$viewValue.slice(1, -1).match(/[$-/:-?{-~!^_`\[\]]/g);

            counts.positive.lower = matches.positive.lower ? matches.positive.lower.length : 0;
            counts.positive.upper = matches.positive.upper ? matches.positive.upper.length : 0;
            counts.positive.numbers = matches.positive.numbers ? matches.positive.numbers.length : 0;
            counts.positive.symbols = matches.positive.symbols ? matches.positive.symbols.length : 0;

            counts.positive.numChars = ngModel.$viewValue.length;
            tmp += (counts.positive.numChars >= 8) ? 1 : 0;

            counts.positive.requirements = (tmp >= 3) ? tmp : 0;
            counts.positive.middleNumber = matches.positive.middleNumber ? matches.positive.middleNumber.length : 0;
            counts.positive.middleSymbol = matches.positive.middleSymbol ? matches.positive.middleSymbol.length : 0;

            // Decrease strength level
            matches.negative.consecLower = ngModel.$viewValue.match(/(?=([a-z]{2}))/g);
            matches.negative.consecUpper = ngModel.$viewValue.match(/(?=([A-Z]{2}))/g);
            matches.negative.consecNumbers = ngModel.$viewValue.match(/(?=(\d{2}))/g);
            matches.negative.onlyNumbers = ngModel.$viewValue.match(/^[0-9]*$/g);
            matches.negative.onlyLetters = ngModel.$viewValue.match(/^([a-z]|[A-Z])*$/g);

            counts.negative.consecLower = matches.negative.consecLower ? matches.negative.consecLower.length : 0;
            counts.negative.consecUpper = matches.negative.consecUpper ? matches.negative.consecUpper.length : 0;
            counts.negative.consecNumbers = matches.negative.consecNumbers ? matches.negative.consecNumbers.length : 0;

            // Calculations
            strength += counts.positive.numChars * 4;
            if (counts.positive.upper) {
              strength += (counts.positive.numChars - counts.positive.upper) * 2;
            }
            if (counts.positive.lower) {
              strength += (counts.positive.numChars - counts.positive.lower) * 2;
            }
            if (counts.positive.upper || counts.positive.lower) {
              strength += counts.positive.numbers * 4;
            }
            strength += counts.positive.symbols * 6;
            strength += (counts.positive.middleSymbol + counts.positive.middleNumber) * 2;
            strength += counts.positive.requirements * 2;

            strength -= counts.negative.consecLower * 2;
            strength -= counts.negative.consecUpper * 2;
            strength -= counts.negative.consecNumbers * 2;

            if (matches.negative.onlyNumbers) {
              strength -= counts.positive.numChars;
            }
            if (matches.negative.onlyLetters) {
              strength -= counts.positive.numChars;
            }

            strength = Math.max(0, Math.min(100, Math.round(strength)));

            if (strength > 85) {
              angular.forEach(strongest, function(el) {
                el.style.backgroundColor = '#008cdd';
              });
            } else if (strength > 65) {
              angular.forEach(strong, function(el) {
                el.style.backgroundColor = '#6ead09';
              });
            } else if (strength > 30) {
              angular.forEach(weak, function(el) {
                el.style.backgroundColor = '#e09115';
              });
            } else {
              weakest.style.backgroundColor = '#e01414';
            }
          }
        });
      },
      template: '<span class="password-strength-indicator"><span></span><span></span><span></span><span></span></span>'
    };
  });