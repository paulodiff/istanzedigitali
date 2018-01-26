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


