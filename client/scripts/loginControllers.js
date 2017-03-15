'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



.controller("AppCtrl", 
                    ['$scope', 'dialogs', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log', '$location','$localStorage', '$http',
            function($scope,    dialogs,   $rootScope,   AuthService,   Session,   $state, ENV,   $log,   $location,  $localStorage,   $http) {

                
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
            $rootScope.base_url = 'http://localhost:8009';
        } else {
            //$rootScope.base_url = 'https://istanze-dichiarazioni.comune.rimini.it/federa';
            $rootScope.base_url = ENV.apiEndpoint;
        }

        // autenticazione
        // Controlla se un reload ricarica il JWT su http header
        if ($localStorage.JWT){
            $log.debug('AppCtrl reload JWT http header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.JWT;
        } 

        


        //$rootScope.base_url = ENV.apiEndpoint;
        //$log.debug('Restangular set base Url '+ ENV.apiEndpoint);
        $log.debug('rootScope Url '+ $rootScope.base_url);



        //$rootScope.base_url = ENV.apiEndpoint;
        //$log.debug('Restangular set base Url:'+ ENV.apiEndpoint);
        // Restangular.setBaseUrl($rootScope.base_url);


        /*Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {

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
        });*/
        

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
            //Restangular.setDefaultHeaders({'rr-access-token': Session.token});

            //storePassword
            // $log.debug('set storage login to:',Session.token);
            // $localStorage.Session = Session;
            
            $log.debug(AuthService.isAuthorized());

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
            //Restangular.setDefaultHeaders({token: ''});

            //$log.debug('Destroy local session....');
            //delete $localStorage.Session;

            $state.go('login');
        });        
                
   
        $rootScope.$on(ENV.AUTH_EVENTS.loginFailed, function (event, next) {
            $log.debug('AppCtrl: AUTH_EVENTS.loginFailed ... ');
            $log.debug(event);
            $log.debug(next);

            dialogs.error('Errore di autenticazione','Immettere nome utente e password');
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
            
            dialogs.error('Errore di autenticazione','Immettere nome utente e password');
            $state.go('login');

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
                $state.go('home');
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
            // $log.debug(next);
            // $log.debug(event);
                        
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

    $scope.user ={
        email: 'a@a.com',
        password: '12345678'
    };

    $scope.credentials = {
        username: 'mario',
        password: ''
     };
    
     // loading exiting credentials..
     if ($localStorage.password){
        console.log('recupero password da cache');
        $scope.credentials.password = $localStorage.password;
     }

  var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogin;
  console.log(fullApiEndpoint);
  $scope.fullApiEndpoint = fullApiEndpoint;
    
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


  $scope.login = function () {

      $log.debug('LoginController : login');

      usSpinnerService.spin('spinner-1');
      //$ionicLoading.show({template: 'Attendere...' });
      
      $log.debug(credentials);

      var credentials = {
          username: $scope.user.email,
          password: $scope.user.password
      };

    AuthService.login(credentials).then(function (res) {
        $log.debug('LoginController : OK');
        $log.debug(res);

        usSpinnerService.stop('spinner-1');
        //$ionicLoading.hide();
        $rootScope.$broadcast(ENV.AUTH_EVENTS.loginSuccess);
    }, function (error) {
      $log.debug('LoginController : login : ERROR'); 
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
      $log.debug('LoginController : logout ');
      $log.debug(credentials);
      
    AuthService.logout(credentials).then(function () {
        $log.debug('LoginController : broadcast... ');
        $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
        
    }, function () {
      $rootScope.$broadcast(ENV.AUTH_EVENTS.logoutSuccess);
    });
  };

    
  $scope.isAuthenticated = function(){
      $log.debug('LoginController : isAuthenticated : ' + AuthService.isAuthenticated());
      return  AuthService.isAuthenticated();  
  }


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
                   [ '$scope', '$rootScope', 'ENV', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup','$ionicSlideBoxDelegate','$state','$log',
            function ($scope,   $rootScope,   ENV,   AuthService,  Session,  $location,  $ionicLoading,  $http,   $ionicPopup,  $ionicSlideBoxDelegate,  $state,$log ) {
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


// SNavbarCtrl ------------------------------------------------------------------------------------
.controller('landingSAMLCtrl',

           ['$scope', '$stateParams', 'dialogs', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log',
    function($scope,   $stateParams,   dialogs,   $rootScope,   AuthService,   Session,   $state,  ENV ,  $log ) {


    $log.debug('landingSAMLCtrl...');
    

    if($stateParams.tokenId) {
        $scope.tokenId = $stateParams.tokenId;
        $log.debug($scope.tokenId);
        AuthService.storeToken($stateParams.tokenId);
    } else {
        $log.debug('NO TOKEN');
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