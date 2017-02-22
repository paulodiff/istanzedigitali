'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
.controller('EditItemSegnalazioneController', 
    ['$scope', '$filter', '$state', '$stateParams', 'Restangular',  'rService', 'Session', '$ionicPopup','$log',   
                    function( $scope,   $filter,   $state,   $stateParams,   Restangular, rService, Session, $ionicPopup, $log) {

    // azione deriva dalla configurazione del controller new/edit
    $log.debug('EditItemProtocolloCtrl:  configAction :' +  $state.current.configAction);
    $log.debug($state);
    $log.debug($stateParams);
            
    var configAction = $state.current.configAction;
    $scope.configAction = configAction;
    $scope.item = {};
    $scope.openedPopupDate = false;   
                            
    $log.debug(  'EditItemProtocolloController:  load button action :');      
                        
    $scope.toggleRight = function() {
        $state.go('menu.list');
    };                                 
 
    $scope.rightButtons =  [{
        type: 'button-icon button-clear ion-email',
        tap: function(e) {
                alert('EditItemProtocolloController : rightButton fired!');
        }
    }];    
                                     
                        
    if (( configAction == 'edit') || ( configAction == 'view') || ( configAction == 'new'))  {
        $log.debug('EditItemProtocolloController : get data from serviziAll : ' +  $stateParams.id + ' ACTION ' + configAction );

        
        if ( configAction == 'new') {
            $log.debug('EditItemProtocolloController : NEW : set ID === 0');
            $stateParams.id = 0;
        }
        
        var baseAccounts = Restangular.all('serviziAll');
        // This will query /accounts and return a promise.
        baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
            //$scope.projects = accounts;
            //$log.debug(accounts);
            $scope.item = accounts[0];

            $log.debug('EditItemProtocolloController : load data ....');
            // patch date object
            $log.debug('EditItemProtocolloController : patch time object - 1');
            $log.debug(accounts[0].da_ora_servizi);
            $log.debug(accounts[0].a_ora_servizi);
            $log.debug(accounts[0].data_servizi);
            $log.debug('EditItemProtocolloController : patch time object - 2 - change format');
            //$scope.item.data_servizi = $filter('date')(accounts[0].data_servizi, "yyyy-MM-dd"); 
            //$scope.item.a_ora_servizi = $filter('date')(($filter('asDate')(accounts[0].a_ora_servizi)), "HH:mm"); 
            //$scope.item.a_ora_servizi = accounts[0].a_ora_servizi.substr(11,5);
            //$scope.item.da_ora_servizi = $filter('date')(accounts[0].da_ora_servizi, "HH:mm"); 
            //$scope.item.da_ora_servizi = accounts[0].da_ora_servizi.substr(11,5);
            $log.debug($scope.item.data_servizi);
            $log.debug($scope.item.a_ora_servizi);
            $log.debug($scope.item.da_ora_servizi);
            
            $log.debug('EditItemProtocolloController : elenco_id_volontari');
            $log.debug(accounts[0].elenco_id_volontari);
            //$log.debug(accounts[0].elenco_id_volontari.split(','));

            /*
            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.lista_volontari_servizi = accounts[0].elenco_id_volontari.split(',');
            $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
            $scope.elenco_id_rapporti_servizio = accounts[0].elenco_id_rapporti_servizio;
            $scope.id_rapporto_valido_servizio = accounts[0].id_rapporto_valido_servizio;
            $scope.item.annullato_servizi = accounts[0].annullato_servizi;
            */

            if ( configAction == 'new') {
                $log.debug('EditItemProtocolloController : NEW : INIT DATA');
                $scope.item = [];
                $scope.item.id_utenti = null;
                $scope.item.lista_volontari_servizi = [];
                $scope.item.data_servizi = $filter('date')(new Date(), "yyyy-MM-dd"); 
                $scope.item.a_ora_servizi = $filter('date')(new Date(), "HH:mm"); 
                $scope.item.da_ora_servizi = $filter('date')(new Date(), "HH:mm"); 
                $scope.item.annullato_servizi = 0;
            }
            
            
            // fill tipi documento    
            var tipiDocumentoList = Restangular.all('tipiDocumentoAll');    
            tipiDocumentoList.getList().then(function(data) {
                $log.debug('EditItemProtocolloController :' + data );    
               $scope.tipiDocumentoList = data;     
            });

            // fill tipi documento    
            var oggettiDocumentoList = Restangular.all('oggettiDocumentoAll');    
            oggettiDocumentoList.getList().then(function(data) {
               $scope.oggettiDocumentoList = data;     
            });
            

            /*

            // fill volontari --------------------------------
            
            //##check null data
            if ( (!(typeof $scope.item.id_utenti === "undefined")) && ($scope.item.id_utenti != null)) {
                        
            $log.debug('EditItemProtocolloController : populate volontariList per : ' + $scope.item.id_utenti);
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : $scope.item.id_utenti }).then(function(users) {
                    
            $log.debug('EditItemProtocolloController : patch accounts');
        


            var fancyArray = [];
            var arrayLength = users.length;
            $log.debug('EditItemProtocolloController : patch accounts for ' + arrayLength );
            // build array per la lista di controllo fatta secondo il suo template    
            for (var i = 0; i < arrayLength; i++) {
                //users[i].id = users[i].id_;
                var more = {
                            id : users[i].id,
                            checked :  (accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1)  ?  true : false ,
                            text : users[i].nome_completo_volontari
                        };
                $log.debug(more);
                fancyArray.push(more);
                //Do something
            }
        
            $log.debug(users);
            $scope.volontariList = fancyArray;
            $log.debug($scope.volontariList);
        
            //$scope.volontariList = users;
            });
   
            }//##check null data

            */
              
            /*

            //fill utenti ------------------------------------------------------------------------------------
            if(Session.isAdmin) {
                $log.debug('EditItemProtocolloController : populate list : isAdmin ' + Session.id_utenti + ' ' + Session.nome_breve_utenti);
                var utentiList = Restangular.all('utentiAll');
                    utentiList.getList().then(function(accounts) {
                    //$log.debug(accounts);
                    $scope.utentiList = accounts;
                        
                    var fancyArray = [];
                    var arrayLength = accounts.length;
                    $log.debug('EditItemProtocolloController : patch accounts for UTENTI LIST FANCY ' + arrayLength );
                    for (var i = 0; i < arrayLength; i++) {
                        //accounts[i].id = accounts[i].id_;
                        var more = {
                                    id : accounts[i].id_utenti,
                                    checked : (accounts[i].id_utenti === $scope.item.id_utenti)  ?  true : false ,
                                    text : accounts[i].nome_breve_utenti
                                };
                        $log.debug(more);
                        fancyArray.push(more);
                        //Do something
                    }   
                    $scope.utentiList = fancyArray;    
                        
                });
            } else {
                $log.debug('EditItemProtocolloController : populate list : NOT isAdmin ');
                $log.debug(Session.id_utenti);
                $scope.utentiList = [];
                var fancyArray = [];
                var more = {
                                    id : Session.id_utenti,
                                    checked : true,
                                    text : Session.nome_breve_utenti
                                };
                fancyArray.push(more);
                $scope.utentiList = fancyArray;
                //$scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
                $scope.item.id_utenti = Session.id_utenti;
                $scope.item.nome_breve_utenti = Session.nome_breve_utenti;
            }

            */
        });
    }
                        
    
    $scope.master = {};
    $scope.timeCalculated = 0;
    
 
    // time change event
    $scope.timechanged = function () {
        $log.debug('EditItemProtocolloController : Time changed to: ' + $scope.item.da_ora_servizi);
        $log.debug('EditItemProtocolloController : Time changed to: ' + $scope.item.a_ora_servizi);
        $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
        if ( $scope.timeCalculated < 1 ) {
            $scope.timeCalculated = $scope.timeCalculated + 24;
        }
    };
    
    //#### DELETE ACTION
    $scope.cancel_action = function(item){
        
        $log.debug('EditItemProtocolloController : cancel_action....');
        var confirmPopup = $ionicPopup.confirm({
                title: 'Messaggio',
                template: 'Annullare il presente elemento?'
        });
            
        confirmPopup.then(function(res) {
             if(res) {
                   $log.debug('EditItemProtocolloController : Deleting....');
                   $log.debug(item.id_servizi);
                   Restangular.oneUrl('servizi', '/api1/servizi/' + item.id ).get().then(
                     function(account){
                            $log.debug('get!');
                            $log.debug(account);
                            account.annullato_servizi = 1;
                            $log.debug('put!');
                            //Restangular.setBaseUrl('/api1/servizi/' + item.id_servizi);
                            Restangular.setBaseUrl('/api1');
                            account.customPUT({annullato_servizi : 1},item.id, {}, {});
                            //account.put();
                            Restangular.setBaseUrl('/apiQ');
                            $state.go('menu.list');
                   });     
                 } else {
                   $log.debug('EditItemProtocolloController : Canceled....');
                 }
        });
    }

    

    $scope.save_action_fake = function(item){

            var alertPopup = $ionicPopup.alert({
                title: 'TEST',
                template: 'Versione di prova - Nessuna modifica'
            });
                alertPopup.then(function(res) {
                $log.debug('Thank you for not eating my delicious ice cream cone');
            });



    }

    
    
    //#### SAVE ACTION
    $scope.save_action = function(item){
        
        // validate form
        $log.debug('EditItemProtocolloController:save_action:Start validator : ');
        
        var msg = '';
    
        if (typeof $scope.item.elenco_id_volontari === "undefined"){
            msg = 'Selezionare un volontario!';
        }
        
        if ($scope.item.elenco_id_volontari == ''){
            msg = 'Selezionare un volontario!';
        }
        
        $log.debug('EditItemProtocolloController:save_action:Start validator :data_servizi :' + $scope.item.data_servizi);
        $log.debug('EditItemProtocolloController:save_action:Start validator :data_servizi :' + new Date());
        
        if ( (!Session.isAdmin) && ($scope.item.data_servizi < new Date())  ){
            msg = 'Non è possibile selezionare date del servizio precedenti a quelle odierna.';
        }
    
        if (msg != ''){
            $log.debug('validate KO');
            var alertPopup = $ionicPopup.alert({
                title: 'Errori di input',
                template: msg
            });
                alertPopup.then(function(res) {
                $log.debug('Thank you for not eating my delicious ice cream cone');
            });
            
        } else {
            
            $log.debug('validate OK ... saving data ...');
        
            var new_servizio = {
                //id_volontari_servizi :  $scope.item.id_volontari_servizi,
                id_utenti : $scope.item.id_utenti,
                data_servizi : $scope.item.data_servizi,
                da_ora_servizi : '1900-01-01T' + $scope.item.da_ora_servizi + ':00.000Z',
                a_ora_servizi : '1900-01-01T' + $scope.item.a_ora_servizi + ':00.000Z',
                note_servizi : $scope.item.note_servizi,
                //lista_volontari : $scope.item.lista_volontari_servizi,
                // split to array
                lista_volontari : $scope.item.elenco_id_volontari.split(','),
                rapporto_servizi :  $scope.item.rapporto_servizi
            };
            
            $log.debug('Posting ... ');
            $log.debug(new_servizio);
            
            var baseServizi = Restangular.allUrl('servizi', '/api1/servizi');
            baseServizi.post(new_servizio).then(
            function(msg){
                $log.debug("Object saved OK");
                $log.debug(msg.id);
                
                
                $log.debug('Saving detail....data ');
                
            
                var alertPopup = $ionicPopup.alert({
                    title: 'Messaggio',
                    template: 'Dato inserito con successo!'
                });
                    alertPopup.then(function(res) {
                    $log.debug('ok redirect to id: ' + msg.id);
                    $state.go('menu.edit', { id: msg.id });
                });

            }, 
            function(msg) {
                $log.debug("There was an error saving ... ");
                $log.debug(msg);
            }
            );
        }
       
    }
    
    // action new relazione
    $scope.new_relazione_action = function($id) {
        $log.debug('Route to newRelazioni con id : ' + $id);
        $state.go('menu.newRelazioni', { id: $id });
    };

    // action goto relazione
    $scope.goto_relazione_action = function($id) {
        $log.debug('Route to editRelazioni con id : ' + $id);
        $state.go('menu.editRelazioni', { id: $id });
    };
                        
    
    // click on date field
    $scope.popupDate = function($event) {
        $log.debug('EditItemCtrl : popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    }; 
    
    $scope.debug_action = function(item){
        $log.debug('DEBUG_ACTION');
        $log.debug(item);
    }
                        
                        
    $log.debug('EditItemCtrl : watching item.id_utenti');
    // on change id_utenti 
    $scope.$watch('item.id_utenti', function(newValue, oldValue) {
        $log.debug('EditItemCtrl : WATCH! id_utenti changed!' + newValue + ' ' +  oldValue);
        
        if ( (configAction == 'new') &&  (!(typeof newValue === "undefined")) && (newValue != null)) {
            
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : newValue }).then(function(users) {
                    
            $log.debug('EditItemCtrl : WATCH! get list for value ' + newValue);
        
            var fancyArray = [];
            var arrayLength = users.length;
            $log.debug('EditItemCtrl : WATCH! patch accounts for ' + arrayLength );
            // build array per la lista di controllo fatta secondo il suo template    
            for (var i = 0; i < arrayLength; i++) {
                //users[i].id = users[i].id_;
                var more = {
                            id : users[i].id,
                            //checked :  (accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1)  ?  true : false ,
                            checked :   false ,
                            text : users[i].nome_completo_volontari
                        };
                $log.debug(more);
                fancyArray.push(more);
                //Do something
            }
        
            $log.debug(users);
            $scope.item.elenco_volontari = '';
            $scope.item.elenco_id_volontari = '';
            $scope.volontariList = fancyArray;
            $log.debug($scope.volontariList);
        
            //$scope.volontariList = users;
            });

            
            /*
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : newValue }).then(function(accounts) {
                $log.debug('EditItemCtrl: RESET volontariList e list_volontari_servizi');
                $scope.volontariList = accounts;
                $scope.item.lista_volontari_servizi = [];
            });
            */
        }
        
    });
                        
    $scope.$watch('item.volontariList1', function(newValue, oldValue){
        $log.debug('EditItemCtrl : DA_item.lista_volontari_servizi' + newValue + ' ' +  oldValue);
    });                    
                        
                        
}])



// ListSegnalazioniController ---------------------------------------------------------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
.controller('ListSegnalazioniController', 
    ['$rootScope','$scope', '$state', '$location', 'Restangular', '$filter', 'Session', '$ionicModal','$ionicSideMenuDelegate','$ionicPopover', '$ionicPopup', '$ionicLoading', '$log', '$timeout','ENV',
     function($rootScope, $scope,  $state, $location, Restangular, $filter, Session, $ionicModal,   $ionicSideMenuDelegate,    $ionicPopover,  $ionicPopup,    $ionicLoading,   $log,   $timeout, ENV) {
    
  $log.debug('ListSegnalazioniController>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 
  $log.debug('ListSegnalazioniController start...');
  
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
  $ionicModal.fromTemplateUrl('templates/sortModal.html', 
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
        $log.debug('ListSegnalazioniController Sort Modal ...');    
        $scope.sortModal.show();
  };
                                 
  $scope.openDetailModal = function(item) {
        $log.debug('ListSegnalazioniController Detail Modal ... :');    
        $log.debug(item);
        item.data_servizi = $filter('date')(item.data_servizi, "dd/MM/yyyy"); 
        item.a_ora_servizi = item.a_ora_servizi.substr(11,5);
        item.da_ora_servizi = item.da_ora_servizi.substr(11,5);
        $scope.currentItemDetail = item;
        $scope.detailModal.show();
  };
                                 
                                 
  $scope.closeSortModal = function() {$scope.sortModal.hide();};
  $scope.closeDetailModal = function() {$scope.detailModal.hide();};
                                 
  $scope.saveSort = function() {
    $log.debug("ListSegnalazioniController: SORT MODAL " + this.filterTerm + " sort " + this.sortBy + ' id_selezione :' + this.id_utenti_selezione);
    $scope.filterCriteria.id_utenti_selezione = this.id_utenti_selezione;
    $log.debug($scope.filterCriteria);
    $scope.filterTerm = this.filterTerm;
    $scope.sortBy = this.sortBy;
    $scope.sortModal.hide();
    $scope.fetchResult();
  }
  
  $scope.OpenFilter = function() {
       $log.debug("ListSegnalazioniController: OpenFilter .. sortModal.show()");
       $scope.sortModal.show();
  };                                 
                               
  
  // inzializza la data di filtro   
  $log.debug('Init dateFilter');    
  $scope.frmData = {};     
  $scope.frmData.dateFilter = new Date();

  // nei test setto una data opportuna
  if (ENV.name == 'developement') {
    //$scope.frmData.dateFilter = new Date(2015, 6, 20);
  }

  $scope.frmData.auto1 = 'asdasd';
  $log.debug($scope.frmData.dateFilter);


  $scope.dateChanged = function(){
    $log.debug('Date changed!');
    //$log.debug($scope);
    $log.debug($scope.frmData.dateFilter);
    $log.debug($filter('date')($scope.frmData.dateFilter, "yyyyMMdd"));
  };

  //default criteria that will be sent to the server

  $scope.filterCriteria = {
    //pageNumber: 1,
    //count: 0,
    //limit: $scope.pageSize,
    qDate: $filter('date')($scope.frmData.dateFilter, "yyyyMMdd"),
    //start: 0,
    //sortDir: 'asc',
    //sortedBy: 'id',
    //id_utenti_selezione : Session.isAdmin ? 0 : Session.id_utenti,
    //mese_selezione : 0,
    //anno_selezione: 0
  };
    
  $log.debug('ListSegnalazioniController SERVIZI INIT filterCriteria');
  $log.debug($scope.filterCriteria);
    

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      $log.debug('ListSegnalazioniController: fetchResult');
      $log.debug('ListSegnalazioniController: impostazione criteri di filtro');

      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      //$scope.filterCriteria.start = offset_page;
      $scope.filterCriteria.qDate =$filter('date')($scope.frmData.dateFilter, "yyyyMMdd");
      $log.debug($scope.filterCriteria);
      $log.debug('ListSegnalazioniController...fetchResult - GET Count');
    

      var serviziList = Restangular.all('getSegnalazioni');
      
      // Get items ...  
      $log.debug('ListSegnalazioniController...fetchResult - GET data');
      //$scope.filterCriteria.count = 0; // imposta la selezione standard sul server
      $ionicLoading.show({template: 'Dati in arrivo!' });
      return serviziList.getList($scope.filterCriteria).then(function(data) {
                //$log.debug(data);
          
                var fast_array = [];
          
                //loop per modificare e preparare i dati in arrivo

                //$log.debug('ListSegnalazioniController .. preparing data...');
                //data.forEach(function (idata) {
                    //$log.debug(idata);
                    //$scope.items.push(idata);
                    //if(idata.annullato_servizi == 1) idata.image_class="icon ion-close-circled assertive";
                    //if((idata.id_rapporto_valido_servizio != null) && (idata.annullato_servizi == 0)) idata.image_class="icon ion-share balanced";
                    //if((idata.id_rapporto_valido_servizio == null) && (idata.annullato_servizi == 0)) idata.image_class="icon ion-checkmark balanced";
                    
                    /*
                    fast_array.push(
                        {
                            id: idata.id,
                            data_servizi: idata.data_servizi,
                            image_class: idata.image_class,
                            nome_breve_utenti: idata.nome_breve_utenti,
                            elenco_volontari: idata.elenco_volontari
                        }
                    
                    );
                    */
                    
                //});
                
                //$log.debug(fast_array);
          
                $scope.items = data;
                //$scope.items = fast_array;
            
                $log.debug(' .. data loaded!');
                $ionicLoading.hide();  
              
          // in caso di errore azzera la lista...      
          }, function (error) {
                $scope.items = [];
                $log.debug(error);
                $ionicLoading.hide();

                if (error.status == 403) {
                    //event.preventDefault();    
                    $rootScope.$broadcast(ENV.AUTH_EVENTS.notAuthenticated);
                }
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
    $log.debug('ListSegnalazioniController: SELECT PAGE ...');  
    $log.debug('ListSegnalazioniController: Page changed to: ' + $scope.currentPage);  
    $log.debug('ListSegnalazioniController...selectPage:' + page);
    $scope.currentPage = page;
    //$scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };
                  
  //manually select a page to trigger an ajax request to populate the grid on page load
  $log.debug('ListSegnalazioniController : selectPage 1');
  
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
                                 
    //$log.debug(templatePopover);                                          
                             
    $scope.popover = $ionicPopover.fromTemplate(templatePopover,{ scope: $scope });                                     
                                          
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

                                 
                                 
}]);