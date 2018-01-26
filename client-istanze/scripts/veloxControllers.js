'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// VeloxController ---------------------------------------------------------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
.controller('VeloxController', 
    ['$rootScope','$scope', '$state', '$location', 'Restangular', '$filter', 'Session', '$ionicModal','$ionicSideMenuDelegate','$ionicPopover', '$ionicPopup', '$ionicLoading', '$log', '$timeout','ENV',
     function($rootScope, $scope,  $state, $location, Restangular, $filter, Session, $ionicModal,   $ionicSideMenuDelegate,    $ionicPopover,  $ionicPopup,    $ionicLoading,   $log,   $timeout, ENV) {
    
  $log.debug('VeloxController>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 
  $log.debug('VeloxController start...');
  
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
  
  // gestione modal popup slide per i filtri --------------------------------------------------
  $ionicModal.fromTemplateUrl('templates/veloxOptionsModal.html', 
        function(sortModal) {
            $scope.sortModal = sortModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
           
  $ionicModal.fromTemplateUrl('templates/detailModal.html', 
        function(detailModal) {
            $scope.detailModal = detailModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
                                 
                                 
  $scope.openSortModal = function() {
        $log.debug('VeloxController Sort Modal ...');    
        $scope.sortModal.show();
  };
                                 
  $scope.openDetailModal = function(item) {
        $log.debug('VeloxController Detail Modal ... :');    
        $log.debug(item);
        item.data_servizi = $filter('date')(item.data_servizi, "dd/MM/yyyy"); 
        item.a_ora_servizi = item.a_ora_servizi.substr(11,5);
        item.da_ora_servizi = item.da_ora_servizi.substr(11,5);
        $scope.currentItemDetail = item;
        $scope.detailModal.show();
  };
                                 
                                 
  $scope.closeSortModal = function() {$scope.sortModal.hide();};
  $scope.closeDetailModal = function() {$scope.detailModal.hide();};
                                 
  $scope.applySortModal = function() {
    $log.debug("VeloxController: SORT MODAL " + this.filterTerm + " sort " + this.sortBy + ' id_selezione :' + this.id_utenti_selezione);
    $scope.filterCriteria.id_utenti_selezione = this.id_utenti_selezione;
    $log.debug($scope.filterCriteria);
    $scope.filterTerm = this.filterTerm;
    $scope.sortBy = this.sortBy;
    $scope.sortModal.hide();
    $scope.fetchResult();
  }
  
  $scope.OpenFilter = function() {
       $log.debug("VeloxController: OpenFilter .. sortModal.show()");
       $scope.sortModal.show();
  };                                 
                               
  $scope.tipiReportList = [
                              {
                             "id" : 1,
                             "checked" :  true,
                             "text" : "Tipi segnalazione per data"
                            },
                             {
                             "id" : 2,
                             "checked" :  true,
                             "text" : "Tipi segnalazione con tempi - TEST!"
                            }
                ];



  
  // inzializza la data di filtro   
  $log.debug('Init dateFilter');    
  $scope.frmData = {};     
  $scope.frmData.dateDwFilter = new Date(2015,12,1);
  $scope.frmData.dateUpFilter = new Date(2016,11,31);
  $scope.frmData.idReport = 1;
  $scope.frmData.descReport = "Tipi segnalazione per data";
  $scope.frmData.limitDataReport = 10;
  $scope.frmData.mailReport = "ruggero.ruggeri@comune.rimini.it";



  $scope.labelsChartLine = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug","Ago","Sett"];
  $scope.dataChartLine = [
    [65, 59, 80, 81,  56,  55, 40],
    [28, 48, 40, 19,  86,  27, 90, 33, 44],
    [38, 18, 10, 39, 186, 127, 50]
  ];
  $scope.seriesChartLine = ['Dati Esempio A', 'Dati Esempio B','Dati Esempio C'];


  // nei test setto una data opportuna
  if (ENV.name == 'developement') {
    //$scope.frmData.dateFilter = new Date(2015, 6, 20);
  }

  $scope.frmData.auto1 = 'asdasd';
  $log.debug($scope.frmData.dateFilter);


  $scope.dateChanged = function(){
    $log.debug('Date changed!');
    //$log.debug($scope);
    $log.debug($scope.frmData);
    $log.debug($filter('date')($scope.frmData.dateFilter, "yyyyMMdd"));
  };

  //default criteria that will be sent to the server

  $scope.filterCriteria = {
    //pageNumber: 1,
    //count: 0,
    //limit: $scope.pageSize,
    idReport: $scope.frmData.idReport,
    orderDirection : true,
    qDateUp: $filter('date')($scope.frmData.dateUpFilter, "yyyyMMdd"),
    qDateDw: $filter('date')($scope.frmData.dateDwFilter, "yyyyMMdd"),
    //start: 0,
    //sortDir: 'asc',
    //sortedBy: 'id',
    //id_utenti_selezione : Session.isAdmin ? 0 : Session.id_utenti,
    //mese_selezione : 0,
    //anno_selezione: 0
  };
    
  $log.debug('VeloxController SERVIZI INIT filterCriteria');
  $log.debug($scope.filterCriteria);
  $scope.labels = [ "Gennaio", 
                        "Febbraio", 
                        "Marzo", 
                        "Aprile", 
                        "Maggio", 
                        "Giugno", 
                        "Luglio", 
                        "Agosto", 
                        "Settembre",
                        "Ottobre",
                        "Novembre",
                        "Dicembre"];  
 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      $log.debug('VeloxController: fetchResult');
      $log.debug('VeloxController: impostazione criteri di filtro');

      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      //$scope.filterCriteria.start = offset_page;

      $log.debug('VeloxController: reset GroupHeader for print');
      $scope.currentGroupHeader = '';
     
      $scope.filterCriteria.idReport = $scope.frmData.idReport;
      $scope.filterCriteria.qDateUp = $filter('date')($scope.frmData.dateUpFilter, "yyyyMMdd"),
      $scope.filterCriteria.qDateDw = $filter('date')($scope.frmData.dateDwFilter, "yyyyMMdd"),
      $log.debug($scope.filterCriteria);
      $log.debug('VeloxController...fetchResult - GET Count');

      var serviziList = Restangular.all('getVelox');
      
      // Get items ...  
      $log.debug('VeloxController...fetchResult - GET data ... .... .... ');
      //$scope.filterCriteria.count = 0; // imposta la selezione standard sul server
      $ionicLoading.show({template: 'Dati in arrivo!' });
      serviziList.getList($scope.filterCriteria).then(function(data) {
               $log.debug(data);
          
                var fast_array = [];
                var fast_labelsChart = [];
                var fast_dataChart = [];
                var i = 0;
                var totalItemLimit = 0;
          
                //loop per modificare e preparare i dati in arrivo
                //$log.debug('ListSegnalazioniController .. preparing data...');
                /*
                data.forEach(function (idata) {

                    if (i < $scope.frmData.limitDataReport) {
                        fast_labelsChart.push(idata.tipo_segnalazione);
                        fast_dataChart.push(idata.num_segnalazione);
                    } else {
                        totalItemLimit = totalItemLimit + idata.num_segnalazione;
                    }

                    i = i + 1;
                     
                });
                */

                //fast_labelsChart.push('Altro');
                //fast_dataChart.push(totalItemLimit);
                
                //$log.debug(fast_labelsChart);
                //$log.debug(fast_dataChart);
          
                $scope.items = data;
                //$scope.items = fast_array;

                //$scope.dataChart = [300, 500, 100];
                //$scope.labelsChart = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
                //$scope.labelsChart = fast_labelsChart;
                //$scope.dataChart = fast_dataChart;

            
                $log.debug(' .. data loaded!');
                $ionicLoading.hide();  
              
          // in caso di errore azzera la lista...      
          }, function (error) {
                $log.debug('Errore ... da gestire ???');

             

                $log.debug(error);
                $scope.items = [];
                $log.debug(error);
                $ionicLoading.hide();
             
                /*


                if (error.status == 403) {
                    //event.preventDefault();    
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);
                }
                
                */
      });
          
      /*
      $scope.items = serviziList.getList($scope.filterCriteria).$object;
      $log.debug('@@@@@@@@@@@@@@@@@@ dati ritornati @@@@@@@@@@@@@@@@@@@');
      $log.debug($scope.items);
      */
          
 };
      
  //called when navigate to another page in the pagination
  $scope.selectPage = function () {
    var page = $scope.currentPage;
    $log.debug('VeloxController: SELECT PAGE ...');  
    $log.debug('VeloxController: Page changed to: ' + $scope.currentPage);  
    $log.debug('VeloxController...selectPage:' + page);
    $scope.currentPage = page;
    //$scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };
                  
  //manually select a page to trigger an ajax request to populate the grid on page load
  $log.debug('VeloxController : selectPage 1');
  
  $scope.selectPage();
    
  // COLLECTION REPEAT TEST                               
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 40 : 100;
  };
  $scope.getItemWidth = function(item) {
    return '100%';
  };                                 
                                 
                         
  // action new relazione
  $scope.new_relazione_action = function($id) {
        $log.debug('Route to newRelazioni con id : ' + $id);
        $scope.detailModal.hide();
        $state.go('menu.newProtocollo', { id: $id });
  };

    // action goto relazione
  $scope.goto_relazione_action = function($id) {
        $log.debug('Route to editRelazioni con id : ' + $id);
        $scope.detailModal.hide();
        $state.go('menu.editProtocollo', { id: $id });
  };                                 
                                 
                                 
  // callback for ng-click 'editUser':
  $scope.editItem = function (itemId) {
        $log.debug('editItem : change state');
        $log.debug(itemId);
        $location.path('/menu/edit/' + itemId);
  };
    
    // callback for ng-click 'editUser':
  $scope.editItem = function (itemId) {
        $log.debug('viewItem : change state');
        $log.debug(itemId);
        $location.path('/menu/view/' + itemId);
  };    
                                 
    
  $scope.debug_action = function(item){
        $log.debug('DEBUG_ACTION');
        $log.debug($scope);
  };
                   

     // callback for ng-click 'editUser':
    $scope.newProtocollo = function () {
        $log.debug('newProtocollo ... ');
        var alertPopup = $ionicPopup.alert({
            title: 'TEST',
            template: 'Versione di prova - Nessuna modifica'
        });
            alertPopup.then(function(res) {
            $log.debug('Versione di prova - Nessuna modifica');
        });
        //$state.go('menu.newProtocollo');
    };
    

    $scope.newItemFromPopover = function () {
        $log.debug('newItemFromPopover ... ');
        $log.debug('/menu/newProtocollo');

        var alertPopup = $ionicPopup.alert({
            title: 'TEST',
            template: 'Versione di prova - Nessuna modifica'
        });
            alertPopup.then(function(res) {
            $log.debug('Versione di prova - Nessuna modifica');
        });


        //$scope.popover.remove();
        //$state.go('menu.newProtocollo');
    };
                        
    $scope.OpenFilterFromPopover = function() {
        $log.debug('OpenFilterFromPopover');
        var alertPopup = $ionicPopup.alert({
            title: 'TEST',
            template: 'Versione di prova - Nessuna modifica'
        });
            alertPopup.then(function(res) {
            $log.debug('Versione di prova - Nessuna modifica');
        });

        //$scope.popover.hide();
        //$scope.sortModal.show();
    };                                   
                                 
    $scope.refreshDati = function() {
        $log.debug('refreshDati .... ');
        $scope.fetchResult();
        /* FAKE
        $log.debug($scope.frmData.dateFilter);
        $log.debug($scope);
        $ionicLoading.show({template: 'Aggiornamento dati ...'});
        $timeout(function () {

            $ionicLoading.hide();
            }, 2000);
        */
    };             


    $scope.sendEmailReport = function() {
      $log.debug('sendEmailReport .... ');
      $log.debug($scope.frmData.mailReport);


      var serviziList = Restangular.all('sendVeloxReport');
      
      // Get items ...  
      $log.debug('VeloxController...fetchResult - GET data ... .... .... ');
      $scope.filterCriteria.mailReport = $scope.frmData.mailReport;
      //$scope.filterCriteria.count = 0; // imposta la selezione standard sul server
      $ionicLoading.show({template: 'invio report ....!' });
      serviziList.getList($scope.filterCriteria).then(function(data) {
          $ionicLoading.hide();
          $log.debug(data);

        var alertPopup = $ionicPopup.alert({
            title: 'Ok',
            template: data[0].message
        });
            alertPopup.then(function(res) {
            $log.debug('Versione di prova - Nessuna modifica');
        });



      }, function (error) {
                $log.debug('Errore ... da gestire ???');
                $log.debug(error);
                $ionicLoading.hide();

        var alertPopup = $ionicPopup.alert({
            title: 'Errore',
            template: error.data[0].message
        });
            alertPopup.then(function(res) {
            $log.debug('Versione di prova - Nessuna modifica');
        });

             
                /*
                if (error.status == 403) {
                    //event.preventDefault();    
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);
                }
                */
      });


    };



    // Per la stampa del raggruppamento

  $scope.currentGroupHeader = '';
  $scope.CreateGroupHeader = function (value) {
          var showHeader = false;
          //console.log('value:' + value);
          //console.log('cgh:' + $scope.currentGroupHeader);
          if($scope.currentGroupHeader != value){
            showHeader = true;
          } 
          //console.log('sgh:' + showHeader);
          $scope.currentGroupHeader = value;
          return showHeader;
    };
 


                          

    // template popover per funzioni aggiuntive
                                 
    var templatePopover = '<ion-popover-view>';
    //templatePopover +=    '<ion-header-bar><h1 class="title">Azioni possibili</h1></ion-header-bar>';                                          
    templatePopover +=    '<ion-content>';                                      
    templatePopover +=    '<div class="list">';
    templatePopover +=    '<a class="item item-icon-left" ng-click="newItemFromPopover()" ><i class="icon ion-plus-circled"></i> Nuovo elemento</a>';
    templatePopover +=    '<a class="item item-icon-left" ng-click="OpenFilterFromPopover()"><i class="icon ion-funnel"></i>Filtro</a>';
    //templatePopover +=    '<a class="item item-icon-left" ng-click="ShowItemDetailFromPopover()"><i class="icon ion-funnel"></i>Item</a>';
    //templatePopover +=    '<button class="button button-clear button-positive" ng-click="debug_action()">Chiudi</button>';
    templatePopover +=    '</div>';
    templatePopover +=    '</ion-content>';                                      
    templatePopover +=    '</ion-popover-view>';

    //<ion-nav-buttons side="right" >
    //<button class="button button-icon button-clear ion-plus-circled" ng-click="newRelazioni()"></button>
    //</ion-nav-buttons>
                                 
    $log.debug(templatePopover);                                          
                             
    $scope.popover = $ionicPopover.fromTemplate(templatePopover,{ scope: $scope });                                     
                                          
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

                                 
                                 
}]);