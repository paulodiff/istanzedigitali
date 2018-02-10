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

