'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('eseguiIstanzaCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$stateParams', 'Upload', '$log', '$timeout','ENV','UtilsService','AlertService','dialogs',
     function($rootScope,  $scope,   $http,   $state,  $stateParams,    Upload , $log,   $timeout,  ENV,  UtilsService,  AlertService,  dialogs ) {
    
  $log.info('eseguiIstanzaCtrl', $stateParams.id);    
  

  $scope.iC = {
      titles: [
          { head: 'TITOLO1', description: 'Descrizione uno'},
          { head: 'TITOLO2', description: 'Descrizione due'},
      ],
      allegatiNumero : 3,
      allegato1: { description : '>>M48.07.11 (pdf)'},
      allegato2: { description : '>>Autorizzazione firmata da chi autorizzazione/licenza  al pubblico spettacolo'},
      allegato3: { description : '>>Documenti di identità'},
      allegato4: { description : ''},
      allegato5: { description : ''}
      
  };


  $scope.info = {};
  $scope.info.file1 = {};
  $scope.info.file2 = {};
  $scope.info.file3 = {};
  
  $scope.modelForm = {};

  
  $scope.model = { progressValue : 22, name : 'oooook' };
  $scope.multistepForm = {};
  $scope.multistepFormCurrentStep = '000'; // status 000 001 002 003 121 ecc .
  $scope.user = {};
  
  

  $scope.info.Descrizione = 'Descrizione di esempio';
  $scope.info.file1.description = 'M48.07.11 (pdf)';
  $scope.info.file2.description = 'Autorizzazione firmata da chi autorizzazione/licenza  al pubblico spettacolo';
  $scope.info.file3.description = 'Documenti di identità';  

  

  $scope.inviaDati = function() {
    $log.info('eseguiIstanzaCtrl: updateProfile');
    var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiIstanzeUpload + '/' + $stateParams.id;
    $log.info('eseguiIstanzaCtrl: updateProfile : ' + fullApiEndpoint );


    Upload.upload({
        url: fullApiEndpoint,
        method: 'POST',
        //files: vm.options.data.fileList
        data: { fields: $scope.modelForm } 
    }).then(function (resp) {
        $log.info('Success ');
        //usSpinnerService.stop('spinner-1');
    }, function (resp) {
        $log.info('Error status: ' + resp.status);
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
                $log.info(response.data.titles);
                $log.info($scope.iC.titles);

                $scope.iC.titles = response.data.titles;

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
            $log.info(response);
        });      
};

    $scope.caricaImpostazioni();


}]);

