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
                    [ '$scope', 'usSpinnerService', '$localStorage', '$rootScope', 'ENV', 'AuthService', 'UtilsService', '$state', '$stateParams', '$log',
            function ( $scope,   usSpinnerService,   $localStorage,   $rootScope,   ENV,   AuthService,   UtilService,    $state, $stateParams,   $log) {
                
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

  $scope.fullApiEndpoint = '';

  AuthService.getGatewayFederaUrl($stateParams.id)
  .then(function (res) {
    $log.info('LoginController: getGatewayFederaUrl : OK');
    $log.info(res);
    $scope.fullApiEndpoint = res.data.url;
  }, function (error) {
    $log.info('LoginController : getGatewayFederaUrl : ERROR'); 
    $log.info('error:', error); 
    //$ionicLoading.hide();
    $scope.loading = false;
    $scope.errorMessage = error;
    if(error.status == 0){
        $scope.errorMessage = '0';
    } else {
        $scope.errorMessage = 'Login getGatewayFederaUrl! Riprova!';
    }
 });
  
    
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


// landingSAMLCtrl ------------------------------------------------------------------------------------
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

// landingGatewayFederaCtrl ------------------------------------------------------------------------------------
// azione di ritorno chiamato dal gateway federa
.controller('landingGatewayFederaCtrl',

           ['$scope', '$stateParams', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log',
    function($scope,   $stateParams,   $rootScope,   AuthService,   Session,   $state,  ENV ,  $log ) {

        $log.info('landingGatewayFederaCtrl...');
        
        // Verifica presenza del token
        if($stateParams.tokenId) {
            $log.info('landingGatewayFederaCtrl: STORE TOKEN. ..');
            AuthService.storeToken($stateParams.tokenId);
            $log.info('landingGatewayFederaCtrl: go to profile. ..');
            // $state.go('profile');
        } else{
            $log.info('landingSAMLCtrl: No TokenId');
        };
    

        $scope.isAuthenticated = function() {
        // return $auth.isAuthenticated();
            return AuthService.isAuthenticated();
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