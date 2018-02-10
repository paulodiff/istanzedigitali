'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller("AppCtrl", 
                    ['$scope',  '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log', '$location','$localStorage', '$http',
            function($scope,     $rootScope,   AuthService,   Session,   $state, ENV,   $log,   $location,  $localStorage,   $http) {

                
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
            $rootScope.base_url = 'http://localhost:9988';
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

            // AlertService.displayError({title:'Errore di autenticazione',message:'Immettere nome utente e password'});
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

