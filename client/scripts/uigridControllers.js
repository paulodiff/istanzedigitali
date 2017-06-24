'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('UiGridCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','uiGridConstants', '$filter', 'Session', '$log', '$timeout','ENV','$q', '$interval','UtilsService',
     function($rootScope,  $scope,   $http,  $state,   $location,  uiGridConstants ,  $filter,   Session,   $log,   $timeout, ENV, $q, $interval,UtilsService) {
    
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
  $scope.msg = {};
  
  var today = new Date();
  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
 
  $scope.gridOptions = {};
  $scope.gridOptions = {
    enableSorting: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableSelectAll: true,
    showGridFooter:true,
    columnDefs: [
      { name: 'id', visible: false },
      { name: 'Tipo', 
        field:  'tipo_spedizione',
        displayName: 'Tipo', 
        editableCellTemplate: 'ui-grid/dropdownEditor', 
        width: '20%',
        cellFilter: 'mapTipoSpedizione', 
        editDropdownValueLabel: 'gender', 
        editDropdownOptionsArray: [
            { id: 1, gender: 'P01 - POSTA ORDINARIA' },
            { id: 2, gender: 'P02 - PIEGHI DI LIBRI' },
            { id: 3, gender: 'P03	POSTA INTERNAZIONALE' },
            { id: 4, gender: 'P04	POSTA TARGHET (ex STAMPE)' },
            { id: 5, gender: 'R01	RACCOMANDATA A/R' },
            { id: 6, gender: 'R02	RACCOMANDATA ORDINARIA' },
            { id: 7, gender: 'AG1	RACC. INTERNAZIONALI' },
            { id: 8, gender: 'AG1	ATTI GIUDIZIARI' }
        ] },
      { name: 'Denominazione', field: 'destinatario_denominazione', enableFiltering:true },
      { name: 'Città', field: 'destinatario_citta', enableFiltering:true },
      { name: 'Via', field: 'destinatario_via', enableFiltering:true },
      { name: 'CAP', field: 'destinatario_cap', enableFiltering:true },
      { name: 'Prov', field: 'destinatario_provincia'},
      { name: 'Altro', field: 'note', enableSorting: true, enableCellEdit: true }
    ]
    //,onRegisterApi: function( gridApi ) {
    //  $scope.grid1Api = gridApi;
    //}
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
   

   $scope.saveRow = function( rowEntity ) {
     console.log('saveRow....');
    // create a fake promise - normally you'd use the promise returned by $http or $resource
    var promise = $q.defer();
    $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
 
    // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
    $interval( function() {
      if (rowEntity.gender === 'male' ){
        promise.reject();
      } else {
        promise.resolve();
      }
    }, 3000, 1);
  };
 
  $scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
    });
    gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row selected ' + row.isSelected;
        $log.log(row);
        $log.log(msg);
      });

  };


  $scope.addData = function() {
    console.log('Add------------Data');
    var n = $scope.gridOptions.data.length + 1;
    $scope.gridOptions.data.push({
      'id': UtilsService.getTimestampPlusRandom(),
      'tipo_spedizione':1,
      'destinatario_denominazione':'T##' + n,
      'destinatario_citta':'T##' + n,
      'destinatario_via':'T##' + n,
      'destinatario_cap':'T##' + n,
      'destinatario_provincia':'T##' + n,
      'note':'T##' + n

              });
  };

  $scope.removeRow = function() {
    console.log('Remove Row....');
    //if($scope.gridOpts.data.length > 0){
       // $scope.gridOptions.data.splice(0,1);
    // console.log($scope.gridApi.selection.getSelectedCount());
    // console.log($scope.gridApi.selection.getSelectedRows());

    if ( $scope.gridApi.selection.getSelectedCount() > 0 ) {
      $log.log('.... .... '); 
      var selectedRows = $scope.gridApi.selection.getSelectedRows()

      // console.log(selectedRows);

      selectedRows.forEach(function(obj){
        console.log(obj.id);
        $scope.gridOptions.data.forEach(function(gridItem, index){
          console.log(gridItem.id, obj.id);
          if (gridItem.id === obj.id) {
            console.log(gridItem.id + 'REMOVE!' + index);
            $scope.gridOptions.data.splice(index,1);
          };

        })
      });
     
    } else {
      $log.log('No rows selected!');
    }

    //}
  };


  $scope.reset = function () {
    console.log('Reset------------Data');
    $scope.gridOptions.data = sourceData;
    // data1 = angular.copy(origdata1);
    // data2 = angular.copy(origdata2);
 
    // $scope.gridOpts.data = data1;
    // $scope.gridOpts.columnDefs = columnDefs1;
  }


  var sourceData =  [
    {
      'id':UtilsService.getTimestampPlusRandom(),
      'tipo_spedizione':1,
      'destinatario_denominazione':'da compilare',
      'destinatario_citta':'da compilare',
      'destinatario_via':'da compilare',
      'destinatario_cap':'da compilare',
      'destinatario_provincia':'da compilare',
      'note':'da compilare'
    }
  ];

  console.log('loading data ....');

  $scope.gridOptions.data = sourceData;
  

  /*
  $http.get(  $rootScope.base_url +  '/helpdesk/getList')
    .success(function(data) {
      console.log(data);
      $scope.gridOptions.data = data;
      //$scope.gridOptions2.data = data;
    });                  
  */                             
}])


.filter('mapTipoSpedizione', function() {
  var genderHash = {
    1: 'P01 - POSTA ORDINARIA',
    2: 'P02 - PIEGHI DI LIBRI',
    3: 'P03	POSTA INTERNAZIONALE',
    4: 'P04	POSTA TARGHET (ex STAMPE)',
    5: 'R01	RACCOMANDATA A/R',
    6: 'R02	RACCOMANDATA ORDINARIA',
    7: 'AG1	RACC. INTERNAZIONALI',
    8: 'AG1	ATTI GIUDIZIARI',
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.controller('GraphPhoneCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','UtilsService', '$filter', 'Session', '$log', '$timeout','ENV', 'usSpinnerService', 'NgTableParams',
     function($rootScope,  $scope,   $http, $state,   $location,  UtilsService ,  $filter,   Session,   $log,   $timeout, ENV, usSpinnerService, NgTableParams) {
    
  $log.debug('GraphPhoneCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 

    

  function getDatasource($column){
    console.log('getDatasource------------------------');
    console.log($column.title());
    if ($column.title() === "Country") {
        console.log('getDatasource ... ok');
        return [{ id: '2017-01-23', title: "2017-01-23"}, { id: '2017-01-24', title: "2017-01-24"}];
    }
   }

 


  $scope.reloadData = function(){
    console.log('reloadData .....');

    console.log('Format Date');
    
    
    var pars = {};
    pars.daData = moment(vm.model.daData, 'DD/MM/YYYY', false).format('YYYY-MM-DD');
    pars.aData = moment(vm.model.aData).format('YYYY-MM-DD');
    pars.numTel = vm.model.numTel;

    console.log(pars);
    
    var dataset = [{ name: 'christian', age: 21 }, { name: 'anthony', age: 88 }];
    vm.tableParams = new NgTableParams({}, { dataset: dataset });
        
    usSpinnerService.spin('spinner-1');
    $http({
        url : $rootScope.base_url +  '/phone/getData',
        method : 'GET',
        params : pars
    })
    .success(function(data) {
        console.log(data);
       
        $scope.labels = [];
        $scope.data = [];
    

       console.log('reloadData ..... RESPONSE ....');

        angular.forEach(data.dataset, function(item) {
            $scope.data.push(item.numTelefonate);
            // console.log(moment(item.tel_data).format('YYYY-MM-DD'));
            $scope.labels.push(moment(item.tel_data).format('YYYY-MM-DD'));

            dataset.push({
              name: moment(item.tel_data).format('YYYY-MM-DD'),
              age: item.numTelefonate,
              country : moment(item.tel_data).format('YYYY-MM-DD')
            })

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
  vm.getDatasource = getDatasource;
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
      numTel: '4607',
      daData: new Date('01-19-2017'),
      aData: new Date('01-31-2017')
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
          key: 'numTel',
          type: 'input',
          templateOptions: {
            required: true,
            type: 'text',
            label: 'Interno telefonico abbreviato'
          }
        },
        {
          key: 'daData',
          type: 'datepicker',
          templateOptions: {
              label: 'Data di Partenza',
              type: 'date',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
         }

      ,
        {
          key: 'aData',
          type: 'datepicker',
          templateOptions: {
              label: 'Data di Arrivo',
              type: 'date',
              datepickerPopup: 'dd-MMMM-yyyy'
            }
         }
         
    ];


    vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
       if (vm.form.$valid) {
          vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');

          console.log(vm.model);
          $scope.reloadData();

          
        }
    }


     // spinner test control
    $scope.startSpin = function(){
        usSpinnerService.spin('spinner-1');
    }

    $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-1');
    }

}]);