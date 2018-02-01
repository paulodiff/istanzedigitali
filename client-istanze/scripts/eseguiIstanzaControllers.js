'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('eseguiIstanzaCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$stateParams', '$location','uiGridConstants', '$filter', 'Session', '$log', '$timeout','ENV','$q', '$interval','UtilsService','ProfileService','AlertService','dialogs',
     function($rootScope,  $scope,   $http,  $state,  $stateParams,  $location,  uiGridConstants ,  $filter,   Session,   $log,   $timeout,   ENV,  $q,   $interval,  UtilsService,  ProfileService,  AlertService, dialogs ) {
    
  $log.info('eseguiIstanzaCtrl', $stateParams.id);    
  
  $scope.info = {};
  $scope.info.file1 = {};
  $scope.info.file2 = {};
  $scope.info.file3 = {};
  

  $scope.model = { progressValue : 22, name : 'oooook' };
  $scope.multistepForm = {};
  $scope.multistepFormCurrentStep = '000'; // status 000 001 002 003 121 ecc .
  $scope.user = {};
  $scope.vm = {}; $scope.vm.model = {}; $scope.vm.userForm = {};
  

  $scope.info.Descrizione = 'Descrizione di esempio';
  $scope.info.file1.description = 'M48.07.11 (pdf)';
  $scope.info.file2.description = 'Autorizzazione firmata da chi autorizzazione/licenza  al pubblico spettacolo';
  $scope.info.file3.description = 'Documenti di identità';  
}]);

