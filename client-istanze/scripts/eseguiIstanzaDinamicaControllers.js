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
            $log.info('eseguiIstanzaDinamicaCtrl: caricaImpostazioni:ERRORE');
            $log.info(response);
            $log.info(response.status);
            $scope.iC.statoIstanza = response.status;
            $scope.iC.errorMsg= response.data.msg;
            $scope.iC.errorTitle= response.data.title;

            if (response.status = 999) {
                $log.info('redirect to login page');
                $state.go('login', {id: $stateParams.id});
            }

        });      
};

$scope.caricaImpostazioni();

$log.info('eseguiIstanzaDinamicaCtrl: caricaImpostazioni');

$scope.vm = {};
$scope.vm.form = 'form1';
$scope.vm.exampleTitle = 'Introduction';

$scope.vm.model = {
    richiedenteNome : 'MARIO',
    richiedenteCognome : 'ROSSI',
    richiedenteNatoA : 'RIMINI',
    minoreNome : 'MARIOLINO',
    minoreCognome : 'ROSSI',
    minoreNatoA : 'ROMA',    
    dataInizioFrequenza : '01/01/2000',
    dataFineFrequenza : '01/01/2003',
    centroRicreativo: "Centro_ricreativo_1",
    occupazionePadre: "DIPENDENTE_A_TEMPO_INDERTERMINATO_O_AUTONOMO"
};

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

$scope.vm.fields = [
    {
        "key": "desc01",
        "type": "description",
        "templateOptions": {
          "title": "Modulo di domanda contributo per la frequenza ....",  
          "description": "Il presente modulo deve essere compilato correttamente in ogni sua parte ecc. ecc. ",
          "type": "text",
        }
    },

    // PARTE 1 -------------------------------------------------------------------------------
/*
    {
        "key": "parte01",
        "type": "infoAlert",
        "templateOptions": {
          "title": "Parte 1 - Dati relativi al richiedente (genitore ecc. ecc.)",  
          "description": "In questa parte del modulo vanno indicati i dati relativi a . ",
          "type": "text",
        }
    },
    
    {
        "key": "richiedenteNome",
        "type": "input",
        "templateOptions": {
          "label": "Nome Richiedente",
          "required": true,
          "type": "text",
          "placeholder": ""
        }
    },

    {
        "key": "richiedenteCognome",
        "type": "input",
        "templateOptions": {
          "label": "Cognome Richiedente",
          "required": true,
          "type": "text",
          "placeholder": ""
        }
    },
    {
        "key": "richiedenteNatoA",
        "type": "input",
        "templateOptions": {
          "label": "Città di Nascita",
          "required": true,
          "type": "text",
          "placeholder": ""
        }
    },

    // PARTE 1 -------------------------------------------------------------------------------

    {
        "key": "parte02",
        "type": "infoAlert",
        "templateOptions": {
          "title": "Parte 2 - Dati relativi al figlio minore per il quale si richiede il contributo",  
          "description": "In questa parte del modulo vanno indicati i dati relativi a . ",
          "type": "text",
        }
    },

    {
        "key": "minoreNome",
        "type": "input",
        "templateOptions": {
          "label": "Nome del figlio minore",
          "required": true,
          "type": "text",
          "placeholder": ""
        }
    },

    {
        "key": "minoreCognome",
        "type": "input",
        "templateOptions": {
          "label": "Cognome del figlio minore",
          "required": true,
          "type": "text",
          "placeholder": ""
        }
    },
    {
        "key": "minoreNatoA",
        "type": "input",
        "templateOptions": {
          "label": "Città di Nascita del figlio minore",
          "required": true,
          "type": "text",
          "placeholder": ""
        }
    },

    // PARTE 3 --------------------------------------------------------------------------------

    {
        "key": "parte03",
        "type": "infoAlert",
        "templateOptions": {
          "title": "Parte 3 - Dati relativi alla richiesta del contributo",  
          "description": "In questa parte del modulo vanno indicati i dati relativi a . ",
          "type": "text",
        }
    },

    {
        "key": "dataInizioFrequenza",
        "type": "input",
        "templateOptions": {
          "label": "Data INIZIO periodo di frequenza",
          "required": true,
          "type": "text",
          "placeholder": "gg/mm/aaaa"
        },
        "validators": {
            "validDate": {
              "expression": function(viewValue, modelValue) {
                var value = modelValue || viewValue;
                return /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/.test(value);
              },
              message: '$viewValue + " is not a valid date"'
            }
        },

    },


    {
        "key": "dataFineFrequenza",
        "type": "input",
        "templateOptions": {
          "label": "Data FINE periodo di frequenza",
          "required": true,
          "type": "text",
          "placeholder": "gg/mm/aaaa"
        },
        "validators": {
            "validDate": {
              "expression": function(viewValue, modelValue) {
                var value = modelValue || viewValue;
                return /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/.test(value);
              },
              message: '$viewValue + " is not a valid date"'
            }
        },

    },

    {
        "key": "centroRicreativo",
        "type": "select",
        "templateOptions": {
          "required": true,
          "label": "Scelta del centro ricreativo",
          "options": [
            {
              "name": "Centro ricreativo 1",
              "value": "Centro_ricreativo_1"
            },
            {
                "name": "Centro ricreativo 2",
                "value": "Centro_ricreativo_2"
            },
            {
                "name": "Centro ricreativo 2",
                "value": "Centro_ricreativo_2"
            }
          ]
        }
      },

    // PARTE 3 --------------------------------------------------------------------------------

    {
        "key": "parte03",
        "type": "infoAlert",
        "templateOptions": {
          "title": "Parte 3 - Dati relativi alla occupazione del padre o di chi ne fa le veci",  
          "description": "In questa parte del modulo vanno indicati i dati relativi a . ",
          "type": "text",
        }
    },

    {
        "key": "occupazionePadre",
        "type": "select",
        "templateOptions": {
          "required": true,
          "label": "Scelta del tipo di occupazione del padre o di chi ne fa le veci",
          "options": [
            {
              "name": "DIPENDENTE_A_TEMPO_INDERTERMINATO_O_AUTONOMO",
              "value": "DIPENDENTE_A_TEMPO_INDERTERMINATO_O_AUTONOMO"
            },
            {
                "name": "Centro ricreativo 2",
                "value": "Centro_ricreativo_2"
            },
            {
                "name": "Centro ricreativo 2",
                "value": "Centro_ricreativo_2"
            }
          ]
        }
      },
*/
    // PARTE 3 --------------------------------------------------------------------------------

    {
        "key": "parte03",
        "type": "infoAlert",
        "templateOptions": {
          "title": "Parte 3 - Dati relativi alla occupazione del padre o di chi ne fa le veci",  
          "description": "In questa parte del modulo vanno indicati i dati relativi a . ",
          "type": "text",
        }
    },


    {
        key: 'documentoIdentitaMadre',
        type: 'upload',
        templateOptions: {
          label: 'File input 11',
          required: true
        }
     },

     {
        key: 'tesseraSanitariaPadre',
        type: 'upload',
        templateOptions: {
          label: 'Allegato 3 documentazione comprovante lo stato dichiarato',
          required: true
        }
     },
     /*
    {
        "key": "ip",
        "type": "input",
        "validators": {
            "ipAddress": {
              "expression": function(viewValue, modelValue) {
                var value = modelValue || viewValue;
                return /(\d{1,3}\.){3}\d{1,3}/.test(value);
              },
              message: '$viewValue + " is not a valid IP Address"'
            }
        },
        // "validation": {   "show": true    },
        "templateOptions": {
          "label": "IP Address",
          "required": true,
          "type": "text",
          "placeholder": "127.0.0.1"
        }
    },

*/



/*
    {
        "key": "desc01",
        "type": "description",
        "templateOptions": {
          "title": "(PARTE 2) Dati di ecc. ecc. Nome richiedente1",  
          "description": "Nome richiedente2",
          "type": "text",
        }
    },

    {
        "key": "desc02",
        "type": "infoAlert",
        "templateOptions": {
          "title": "(PARTE 2) Dati di ecc. ecc. Nome richiedente1",  
          "description": "Nome richiedente2",
          "type": "text",
        }
    },

    {
        "key": "nome",
        "type": "input",
        "templateOptions": {
          "label": "Nome richiedente",
          "required": true,
          "type": "text",
          "placeholder": "... nome ...."
        }
    },


    {
        "key": "se_compreso_",
        "type": "select",
        "templateOptions": {
          "required": true,
          "label": "Compreso?",
          "options": [
            {
              "name": "Iron Man",
              "value": "iron_man"
            },
            {
              "name": "Captain America",
              "value": "captain_america"
            },
            {
              "name": "Black Widow",
              "value": "black_widow"
            },
            {
              "name": "Hulk",
              "value": "hulk"
            },
            {
              "name": "Captain Marvel",
              "value": "captain_marvel"
            }
          ]
        }
      },

    {
        "key": "data_richiedente",
        "type": "input",
        "templateOptions": {
          "label": "data r",
          "required": true,
          "type": "text",
          "placeholder": "gg/mm/aaaa"
        },
        "validators": {
            "validDate": {
              "expression": function(viewValue, modelValue) {
                var value = modelValue || viewValue;
                return /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/.test(value);
              },
              message: '$viewValue + " is not a valid date"'
            }
        },

    },

    {
        "key": "mac",
        "type": "input",
        "validators": {
            "macAddress": {
              "expression": function(viewValue, modelValue) {
                var value = modelValue || viewValue;
                return /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/.test(value);
              },
              message: '$viewValue + " is not a valid MAC Address"'
            }
        },
        "templateOptions": {
          "label": "MAC Address",
          "required": true,
          "type": "text",
          "placeholder": "49-8A-BD-4E-00-1D",
        }
    },

    {
        "key": "email",
        "type": "input",
        "templateOptions": {
          "label": "Email",
          "required": true,
          "type": "email",
          "maxlength": 10,
          "minlength": 6,
          "placeholder": "example@example.com"
        }
    },
  */  
    /*,
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        placeholder: 'Password'
      }
    }
    */
    /*,
    {
      key: 'file',
      type: 'file',
      templateOptions: {
        label: 'File input',
        description: 'Example block-level help text here',
        url: 'https://example.com/upload'
      }
    },
    {
      key: 'checked',
      type: 'checkbox',
      templateOptions: {
        label: 'Check me out'
      }
    }*/
  ];


}]);

