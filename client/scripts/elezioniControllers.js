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


console.log('START ');

particlesJS.load('particles-js', 'data/particlesjs-config.json', function() {
  console.log('callback - particles.js config loaded');
});

console.log('ok');




}]);