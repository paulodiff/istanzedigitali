'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('eseguiIstanzaDinamicaCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$stateParams', 'Upload', '$log', '$timeout','ENV','UtilsService', 'vcRecaptchaService',
     function($rootScope,  $scope,   $http,   $state,  $stateParams,    Upload ,  $log,   $timeout,  ENV,  UtilsService,   vcRecaptchaService  ) {
    
  $log.info('eseguiIstanzaDinamicaCtrl', $stateParams.id);    
  
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
  var files = [];

  $scope.vm = {};
  $scope.vm.form = 'form1';
  $scope.vm.exampleTitle = 'Introduction';

  $scope.token = '';

  // $scope.showLoader = function() { $scope.iC.statoIstanza = 199; }

  $scope.inviaDati = function() {
    $log.info('eseguiIstanzaDinamicaCtrl: updateProfile');
    var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiIstanzeUploadDinamico + '/' + $stateParams.id;
    $log.info('eseguiIstanzaDinamicaCtrl: updateProfile : ' + fullApiEndpoint );
    // $scope.modelForm.RecaptchaResponse = 'RecaptchaResponseMARIO';
    $log.info($scope.modelForm.RecaptchaResponse);

    var data = angular.copy($scope.vm.model);
    console.log(files);
    console.log(data); //data contains files if uploaded

    $scope.iC.statoIstanza = 199;
    $scope.iC.btnInviaDati = 'INVIO IN CORSO...ATTENDERE';
    $scope.iC.btnDisabled = true;
    Upload.upload({
        url: fullApiEndpoint,
        method: 'POST',
        //files: vm.options.data.fileList
        headers: {  'ISTANZE-API-KEY': $scope.iC.token, 
                    'RECAPTCHA-TOKEN': $scope.modelForm.RecaptchaResponse}, // only for html5
        data: { fields: $scope.vm.model, files: files } 
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
        $log.info('eseguiIstanzaDinamicaCtrl: caricaImpostazioni');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiIstanzeRecuperaImpostazioni + '/' + $stateParams.id;
        $log.info('eseguiIstanzaDinamicaCtrl: caricaImpostazioni : ' + fullApiEndpoint );
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

                //$scope.vm.fields =  response.data.vm_fields;         
                $scope.vm.fields = JSON.parse(response.data.vm_fields, UtilsService.functionReviver);
                
                $scope.vm.model =  response.data.vm_model;         

        }).catch(function(response) {
            $log.info('eseguiIstanzaDinamicaCtrl: caricaImpostazioni:ERRORE');
            $log.info(response);
            $log.info(response.status);
            $scope.iC.statoIstanza = response.status;
            $scope.iC.errorMsg= response.data.msg;
            $scope.iC.errorTitle= response.data.title;

            if (response.status == 999) {
                $log.info('redirect to login page');
                $state.go('login', {id: $stateParams.id});
            }

        });      
};

$scope.caricaImpostazioni();

$log.info('eseguiIstanzaDinamicaCtrl: caricaImpostazioni');



$scope.vm.options = {
    formState:{
        ngfChange: function(id, file, eventType){

          console.log('--ngfChange--');
          console.log(id);
          console.log(file);
          console.log(eventType);
          
          if(eventType == "click"){
            delete files[id];
          } 
          
          if(eventType == "change"){
            files[id] = file;
          }
         
        }
      }
};



}]);

