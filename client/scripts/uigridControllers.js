'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('UiGridCtrl', 
            ['$rootScope','$scope', '$http', '$state', '$location','uiGridConstants', '$filter', 'Session', '$log', '$timeout','ENV','$q', '$interval','UtilsService','ProfileService','PostaService','dialogs',
     function($rootScope,  $scope,   $http,  $state,   $location,  uiGridConstants ,  $filter,   Session,   $log,   $timeout,   ENV,  $q,   $interval,  UtilsService,  ProfileService, PostaService,dialogs) {
    
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
  $scope.cdc= [
  {
    "id": "0001",
    "name": "0001 - Personale Serv. Amm.Organizz."
  },
  {
    "id": "0002",
    "name": "0002 - Rapporti esterni"
  },
  {
    "id": "0003",
    "name": "0003 - U. R. P."
  },
  {
    "id": "0004",
    "name": "0004 - Servizio Stampa"
  },
  {
    "id": "0006",
    "name": "0006 - Organi Istituzionali"
  },
  {
    "id": "0007",
    "name": "0007 - Segreteria Generale"
  },
  {
    "id": "0008",
    "name": "0008 - Amministrazione affari generali (Archivio)"
  },
  {
    "id": "0009",
    "name": "0009 - Scuole infanzia"
  },
  {
    "id": "0010",
    "name": "0010 - Centri educativi estivi materni"
  },
  {
    "id": "0011",
    "name": "0011 - Asili nido"
  },
  {
    "id": "0012",
    "name": "0012 - Scuole elementari"
  },
  {
    "id": "0013",
    "name": "0013 - Scuole materne statali"
  },
  {
    "id": "0014",
    "name": "0014 - Amministrativo di servizio Diritto allo Studio"
  },
  {
    "id": "0015",
    "name": "0015 - Trasporto  scolastico"
  },
  {
    "id": "0016",
    "name": "0016 - Valorizzazione sistema scolastico"
  },
  {
    "id": "0017",
    "name": "0017 - Università"
  },
  {
    "id": "0018",
    "name": "0018 - Sistema scolastico paritario"
  },
  {
    "id": "0019",
    "name": "0019 - Istituto Musicale Lettimi"
  },
  {
    "id": "0020",
    "name": "0020 - Istruzione media"
  },
  {
    "id": "0024",
    "name": "0024 - Formazione professionale"
  },
  {
    "id": "0028",
    "name": "0028 - Politiche per l'immigrazione"
  },
  {
    "id": "0029",
    "name": "0029 - Servizi delegati a USL"
  },
  {
    "id": "0031",
    "name": "0031 - Emergenza abitativa"
  },
  {
    "id": "0032",
    "name": "0032 - Attività iniziative e promozioni turistiche"
  },
  {
    "id": "0034",
    "name": "0034 - Gestione Biblioteca"
  },
  {
    "id": "0035",
    "name": "0035 - Sagra Malatestiana"
  },
  {
    "id": "0036",
    "name": "0036 - Attività cinematografiche"
  },
  {
    "id": "0037",
    "name": "0037 - Attività teatrali"
  },
  {
    "id": "0038",
    "name": "0038 - Attività culturali biblioteca"
  },
  {
    "id": "0039",
    "name": "0039 - Concessione spazi settore cultura"
  },
  {
    "id": "0040",
    "name": "0040 - Attività collaterali"
  },
  {
    "id": "0041",
    "name": "0041 - Direzione Musei e Pinacoteca"
  },
  {
    "id": "0042",
    "name": "0042 - Archeologia e Cult.Extraeuropee"
  },
  {
    "id": "0051",
    "name": "0051 - Mobilità"
  },
  {
    "id": "0054",
    "name": "0054 - Pianificazione attuativa"
  },
  {
    "id": "0055",
    "name": "0055 - Edilizia"
  },
  {
    "id": "0056",
    "name": "0056 - Controlli edilizi"
  },
  {
    "id": "0057",
    "name": "0057 - Programma d'Area ed Edilizia Residenziale Pubblica"
  },
  {
    "id": "0058",
    "name": "0058 - Condono"
  },
  {
    "id": "0059",
    "name": "0059 - Servizi e valutazioni ambientali"
  },
  {
    "id": "0060",
    "name": "0060 - Gestione amm.va LL.PP."
  },
  {
    "id": "0061",
    "name": "0061 - Direzione Lavori Pubblici e Qualità Urbana"
  },
  {
    "id": "0064",
    "name": "0064 - Uffici Giudiziari"
  },
  {
    "id": "0067",
    "name": "0067 - Raccolta e smaltimento rifiuti"
  },
  {
    "id": "0068",
    "name": "0068 - Infrastrutture e reti tecnologiche per la qualità ambientale"
  },
  {
    "id": "0069",
    "name": "0069 - Verde pubblico e privato"
  },
  {
    "id": "0070",
    "name": "0070 - Gestione strade"
  },
  {
    "id": "0071",
    "name": "0071 - Gestione Economica e Previdenziale Risorse Umane"
  },
  {
    "id": "0072",
    "name": "0072 - Contabilità ed Investimenti"
  },
  {
    "id": "0075",
    "name": "0075 - Ragioneria Amm.vo e Controllo"
  },
  {
    "id": "0076",
    "name": "0076 - Bilancio - Contabilità Economica - Fiscale"
  },
  {
    "id": "0077",
    "name": "0077 - Servizio Tributi sugli immobili"
  },
  {
    "id": "0078",
    "name": "0078 - Pubblicita' e Affissioni"
  },
  {
    "id": "0079",
    "name": "0079 - TARI"
  },
  {
    "id": "0080",
    "name": "0080 -  Uff. Amm.vo Tributi"
  },
  {
    "id": "0081",
    "name": "0081 - Sistema Informativo e manutenzione sistemi"
  },
  {
    "id": "0082",
    "name": "0082 - Avvocatura civica"
  },
  {
    "id": "0083",
    "name": "0083 - Economato e Casa Comune"
  },
  {
    "id": "0085",
    "name": "0085 - Gestione parcheggi"
  },
  {
    "id": "0086",
    "name": "0086 - Patrimonio Immobiliare"
  },
  {
    "id": "0087",
    "name": "0087 - Pari opportunita'"
  },
  {
    "id": "0088",
    "name": "0088 - Polizia Municipale"
  },
  {
    "id": "0089",
    "name": "0089 - Protezione Civile"
  },
  {
    "id": "0090",
    "name": "0090 - Statistica"
  },
  {
    "id": "0091",
    "name": "0091 - Canile Municipale"
  },
  {
    "id": "0093",
    "name": "0093 - Mercato coperto"
  },
  {
    "id": "0094",
    "name": "0094 - Sicurezza del territorio"
  },
  {
    "id": "0095",
    "name": "0095 - Servizi gen.li attivita' econ."
  },
  {
    "id": "0096",
    "name": "0096 - Presidio territoriale"
  },
  {
    "id": "0098",
    "name": "0098 - Decentramento"
  },
  {
    "id": "0099",
    "name": "0099 - Politiche per l'immigrazione e l'integrazione"
  },
  {
    "id": "0100",
    "name": "0100 - Anagrafe"
  },
  {
    "id": "0101",
    "name": "0101 - Elettorale"
  },
  {
    "id": "0102",
    "name": "0102 - Servizi amministrativi di settore"
  },
  {
    "id": "0103",
    "name": "0103 - Servizi cimiteriali (compresa Polizia mortuaria)"
  },
  {
    "id": "0105",
    "name": "0105 - Autoparco"
  },
  {
    "id": "0106",
    "name": "0106 - Politiche Giovanili"
  },
  {
    "id": "0107",
    "name": "0107 - Politiche del Lavoro"
  },
  {
    "id": "0108",
    "name": "0108 - Amministrativo e Partecipazioni Comunali"
  },
  {
    "id": "0109",
    "name": "0109 - Pianificazione generale"
  },
  {
    "id": "0110",
    "name": "0110 - Ufficio Contratti"
  },
  {
    "id": "0111",
    "name": "0111 - Aministrativo di Settore Pubblica Istruzione"
  },
  {
    "id": "0113",
    "name": "0113 - Ufficio Amm.vo Direzione cultura e turismo"
  },
  {
    "id": "0114",
    "name": "0114 - Sicurezza sul lavoro e pubblica incolumità"
  },
  {
    "id": "0115",
    "name": "0115 - Espropri"
  },
  {
    "id": "0117",
    "name": "0117 - Gestione Edifici"
  },
  {
    "id": "0121",
    "name": "0121 - Amm.vo Programmazione e Pianificazione Territoriale"
  },
  {
    "id": "0122",
    "name": "0122 - Affitti e concessioni"
  },
  {
    "id": "0123",
    "name": "0123 - S.I.T. - Toponomastica"
  },
  {
    "id": "0124",
    "name": "0124 - Sportello Unico"
  },
  {
    "id": "0125",
    "name": "0125 - Consiglio Comunale"
  },
  {
    "id": "0126",
    "name": "0126 - Ufficio Europeo per lo Sviluppo della Comunità Locale"
  },
  {
    "id": "0127",
    "name": "0127 - Sistema gestione qualità"
  },
  {
    "id": "0128",
    "name": "0128 - Cosap"
  },
  {
    "id": "0129",
    "name": "0129 - Direzione Pianificazione e Gestione territoriale"
  },
  {
    "id": "0130",
    "name": "0130 - Interventi di riqualificazione urbana"
  },
  {
    "id": "0131",
    "name": "0131 - Direzione Affari Generali ed Istituzionali"
  },
  {
    "id": "0132",
    "name": "0132 - Organizzazione e gestione del personale"
  },
  {
    "id": "0133",
    "name": "0133 - Notifiche generiche"
  },
  {
    "id": "0134",
    "name": "0134 - Comando e passi carrabili"
  },
  {
    "id": "0135",
    "name": "0135 - Demanio"
  },
  {
    "id": "0136",
    "name": "0136 - Famiglie e minori"
  },
  {
    "id": "0137",
    "name": "0137 - Disagio adulti"
  },
  {
    "id": "0138",
    "name": "0138 - Anziani"
  },
  {
    "id": "0139",
    "name": "0139 - Area disabili"
  },
  {
    "id": "0142",
    "name": "0142 - Sanità"
  },
  {
    "id": "0143",
    "name": "0143 - Assegnazione alloggi edilizia residenziale pubblica"
  },
  {
    "id": "0146",
    "name": "0146 - Condono ter"
  },
  {
    "id": "0148",
    "name": "0148 - Piano strategico"
  },
  {
    "id": "0150",
    "name": "0150 - Lotta alla zanzara tigre"
  },
  {
    "id": "0151",
    "name": "0151 - Gestione protocollo generale"
  },
  {
    "id": "0152",
    "name": "0152 - Ufficio per il paesaggio"
  },
  {
    "id": "0153",
    "name": "0153 - Contributi economici"
  },
  {
    "id": "0154",
    "name": "0154 - Bandi ISEE"
  },
  {
    "id": "0160",
    "name": "0160 - Holding"
  },
  {
    "id": "0161",
    "name": "0161 - Impianti sportivi in uso a terzi"
  },
  {
    "id": "0162",
    "name": "0162 - Impianti sportivi in gestione a terzi"
  },
  {
    "id": "0163",
    "name": "0163 - Manifestazioni e progetti sportivi"
  },
  {
    "id": "0164",
    "name": "0164 - Impianti termici"
  },
  {
    "id": "0165",
    "name": "0165 - Direzione cultura e turismo"
  },
  {
    "id": "0166",
    "name": "0166 - Unità Progetti speciali"
  },
  {
    "id": "0167",
    "name": "0167 - Gestione amministrativa trasporto  scolastico"
  },
  {
    "id": "0168",
    "name": "0168 - Sportello Eventi"
  },
  {
    "id": "0169",
    "name": "0169 - Conservazione ed uso razionale dell'energia"
  },
  {
    "id": "0170",
    "name": "0170 - Gestione territoriale"
  },
  {
    "id": "0171",
    "name": "0171 - Piani attuativi privati"
  },
  {
    "id": "0172",
    "name": "0172 - Opere Strategiche"
  },
  {
    "id": "0173",
    "name": "0173 - Progettazione viabilità ed infrastrutture"
  },
  {
    "id": "0174",
    "name": "0174 - Edilizia pubblica e valorizzazione del patrimonio"
  },
  {
    "id": "0777",
    "name": "0777 - Personale a rimborso sevizi sociali"
  },
  {
    "id": "0888",
    "name": "0888 - Personale a rimborso I.A.T."
  },
  {
    "id": "0999",
    "name": "0999 - Personale a rimborso referendum"
  },
  {
    "id": "9999",
    "name": "9999 - Progettazione e gestione urbanistica"
  }
];

  $scope.cdcStampe = [];

  angular.copy($scope.cdc,$scope.cdcStampe);

  $scope.cdcStampe.unshift({
    "id": "0000",
    "name": "0000 - TUTTI i centri di costo"
  });


  console.log($scope.cdcStampe);
  console.log($scope.cdc);


  $scope.model = {};
  $scope.model.selectedCdc = {};
  
  var  MyeditDropdownOptionsArray = [
            { id: 'P01 - POSTA ORDINARIA', name: 'P01 - POSTA ORDINARIA' },
            { id: 'P02 - PIEGHI DI LIBRI', name: 'P02 - PIEGHI DI LIBRI' },
            { id: 'P03 - POSTA INTERNAZIONALE', name: 'P03 - POSTA INTERNAZIONALE' },
            { id: 'P04 - POSTA TARGHET (ex STAMPE)', name: 'P04 - POSTA TARGHET (ex STAMPE)' },
            { id: 'R01 - RACCOMANDATA A/R', name: 'R01 - RACCOMANDATA A/R' },
            { id: 'R02 - RACCOMANDATA ORDINARIA', name: 'R02 - RACCOMANDATA ORDINARIA' },
            { id: 'R03 - ACC. INTERNAZIONALI', name: 'R03 - RACC. INTERNAZIONALI' },
            { id: 'AG1 - ATTI GIUDIZIARI', name: 'AG1 - ATTI GIUDIZIARI' }
        ];

  var elencoTipiSpedizione = MyeditDropdownOptionsArray;
  
  $scope.elencoTipoPosta = [];

  angular.copy(MyeditDropdownOptionsArray,$scope.elencoTipoPosta);

  $scope.elencoTipoPosta.unshift({ id: 'P00 - TUTTI TIPI POSTA', name: 'P00 - TUTTI TIPI POSTA' });

  $scope.model.dataStampa = new Date();
  $scope.model.tipoPostaStampa = { id: 'P00 - TUTTI TIPI POSTA', name: 'P00 - TUTTI TIPI POSTA' };
  $scope.model.cdcStampa = {   id: "0000",    name: "0000 - TUTTI i centri di costo"  };
  $scope.model.matricolaStampa = 'DEMO';



  $scope.today = moment().format('DD/MM/YYYY');
  $scope.todayYYYMMDD = moment().format('YYYYMMDD');

  var nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
 
  $scope.gridOptions = {};
  $scope.gridOptions = {
    enableSorting: true,
    enableFiltering: true,
    enableGridMenu: true,
    enableRowSelection: true,
    enableSelectAll: true,
    showGridFooter:true,
    columnDefs: [
      { name: 'posta_id', visible: false, enableCellEdit: false },
      { name: 'cdc', visible: true, enableCellEdit: false },
      { name: 'Tipo', 
        field:  'tipo_spedizione',
        displayName: 'Tipo', 
        editableCellTemplate: 'ui-grid/dropdownEditor', 
        width: '20%',
        // cellFilter: 'mapTipoSpedizione', 
        editDropdownValueLabel: 'name', 
        editDropdownOptionsArray: MyeditDropdownOptionsArray,
        enableFiltering:true
        /*
      filters: [
        {
          condition: uiGridConstants.filter.GREATER_THAN,
          placeholder: 'greater than'
        },
        {
          condition: uiGridConstants.filter.LESS_THAN,
          placeholder: 'less than'
        }    
      ]*/
    },
      { name: 'Protocollo', field: 'protocollo', enableFiltering:true },
      { name: 'Destinatario', field: 'destinatario_denominazione', enableFiltering:true },
      { name: 'Città', field: 'destinatario_citta', enableFiltering:true },
      { name: 'Via', field: 'destinatario_via', enableFiltering:true },
      { name: 'CAP', field: 'destinatario_cap', enableFiltering:true },
      { name: 'Prov', field: 'destinatario_provincia'},
      { name: 'Note', field: 'note', enableSorting: true, enableCellEdit: true }
    ],
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [5, 5, 5, 5]},
    exporterPdfTableHeaderStyle: {fontSize: 8, bold: true, italics: true, color: 'black'},
    exporterPdfHeader: function ( currentPage, pageCount ) {
      return { text: 'Stampa elenco ...' + $scope.user.userid, style: 'headerStyle' };
    },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString() + $scope.user.userid, style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    }
    //,onRegisterApi: function( gridApi ) {
    //  $scope.grid1Api = gridApi;
    //}
  };

  $scope.gridOptions.multiSelect = true;
 
                                 
   
   /* SAVEROW */

   $scope.saveRow = function( rowEntity ) {
     console.log('saveRow....');
    // create a fake promise - normally you'd use the promise returned by $http or $resource
    var promise = $q.defer();
    $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
 
    /* TODO Fare service per posta*/
     var url2post = $rootScope.base_url +  '/postamgr/posta';
    console.log(url2post);

   $http.put(url2post, rowEntity)
            .then(function (res) {
                // dialogs.notify('ok','Profile has been updated');
                $log.debug(res);
                promise.resolve();
                // $scope.user = res.data.user;
         }).catch(function(response) {
           promise.reject();
           $log.debug(response);
            // var dlg = dialogs.confirm(response.data.message, response.status);
      
        });


   /*
    // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
    $interval( function() {
      if (rowEntity.gender === 'male' ){
        promise.reject();
      } else {
        promise.resolve();
      }
    }, 3000, 1);
    */
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

  /** RICARICA DATI */

  $scope.ricaricaDati = function() {
    console.log('Ricarica------------Data');

    console.log($scope.model.selectedCdc);

    var options = {
      dataStampaTxt: $scope.todayYYYMMDD
    };

    PostaService.getPosta(options)
      .then(function (res) {
        // dialogs.notify('ok','Profile has been updated');
        $scope.gridOptions.data = res.data;
        $log.info(res);
        // $scope.user = res.data.user;
      })
      .catch(function(response) {
        $log.error(response);
        var dlg = dialogs.error(response.data.message, response.status);
      });
  };

  /* ADD DATA */

  $scope.addData = function() {
    console.log('Add------------Data');
    console.log($scope.model.selectedCdc);

    if (angular.equals($scope.model.selectedCdc,{})){
      var dlg = dialogs.error('Manca il centro di costo di riferimento', 'Selezionare un Centro di Costo dalla lista');
      return;
    }



    var n = $scope.gridOptions.data.length + 1;


    var newItem  = {
      'posta_id': UtilsService.getTimestampPlusRandom(),
      'cdc': $scope.model.selectedCdc.id,
      'protocollo':'0000/000000',
      'tipo_spedizione':'P01 - POSTA ORDINARIA',
      'destinatario_denominazione':'DESTINATARIO',
      'destinatario_citta':'CITTA',
      'destinatario_via':'VIA XX',
      'destinatario_cap':'00000',
      'destinatario_provincia':'XX',
      'note':''
    };

    

    PostaService.addPosta(newItem)
      .then(function (res) {
        $scope.gridOptions.data.push(newItem);
        $log.debug(res);
        // $scope.user = res.data.user;
      })
      .catch(function(response) {
        $log.error(response);
        var dlg = dialogs.error(response.data.title, response.data.message);
      });

/*
    $http.post(url2post, newItem)
            .then(function (res) {
                // dialogs.notify('ok','Profile has been updated');
                $scope.gridOptions.data.push(newItem);
                $log.debug(res);
                // $scope.user = res.data.user;
         }).catch(function(response) {
           $log.debug(response);
           var dlg = dialogs.error(response.data.title, response.data.message);
        });
        */


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
        console.log(obj.posta_id);
        $scope.gridOptions.data.forEach(function(gridItem, index){
          console.log(gridItem.posta_id, obj.posta_id);
          if (gridItem.posta_id === obj.posta_id) {
            console.log(gridItem.posta_id + 'REMOVE!' + index);

            var url2post = $rootScope.base_url +  '/postamgr/posta/' + obj.posta_id;
            console.log(url2post);
            $http.delete(url2post)
            .then(function (res) {
                // dialogs.notify('ok','Profile has been updated');
                $log.info(res);
                $scope.gridOptions.data.splice(index,1);
                // $scope.user = res.data.user;
            })
            .catch(function(response) {
              $log.error(response);
              var dlg = dialogs.confirm(response.data.message, response.status);
					  });
            
          };
        })
      });
     
    } else {
      $log.error('No rows selected!');
    }

    //}
  };

  /////////////////// ############################### EXPORT PDF

  $scope.exportPdf = function(){

    console.log('Export PDF ------------------------  ');
    
    console.log($scope.model);

    // prendere i dati

      
      $scope.model.cdcStampaTxt = $scope.model.cdcStampa.id;
      $scope.model.tipoPostaStampaTxt = $scope.model.tipoPostaStampa.id;
      $scope.model.dataStampaTxt = moment($scope.model.dataStampa).format('YYYYMMDD');

      //console.log(moment($scope.model.dataStampa).format('YYYYMMDD'));

      //return;



      var contenutoStampa = [];


      PostaService.getPosta($scope.model)
      .then(function (res) {
        // dialogs.notify('ok','Profile has been updated');
        $scope.gridOptions.data = res.data;
        $log.info(res);

        // selezione dei dati
        var arraySelezione = [];
        var arraySelezioneTipi = [];

        elencoTipiSpedizione.forEach(function(obj){ 
          console.log(obj.id);
          var elenco = $filter('filter')(res.data, {tipo_spedizione: obj.id }); 
          console.log(elenco);
          if(elenco.length > 0){
            arraySelezione.push(elenco);
            arraySelezioneTipi.push(obj.id);
          }
        });

        console.log(arraySelezioneTipi);

        var maxPagina = arraySelezione.length;
        console.log(maxPagina);

       var numeroPagina = 1;
       arraySelezione.forEach(function(item){ 
         
          var elencoTabellare = [];
          var progressivo = 1;
          

          elencoTabellare.push([ 'Prog.', 'Protocollo', 'Destinatario', 'Destinazione', 'Cdc' ]);
          item.forEach(function(obj){
             elencoTabellare.push([
                  {text:progressivo++, fontSize:10}, 
                  {text:obj.protocollo, fontSize:10},
                  {text:obj.destinatario_denominazione, fontSize:10},
                  {text:obj.destinatario_citta + ' ' + obj.destinatario_via + ' ' + obj.destinatario_cap + ' ' + obj.destinatario_provincia, fontSize:10},
                  {text:obj.cdc, fontSize:10}
            ]);
          }
          );

          var tabellaStampa =
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 'auto', 'auto', '*', '*','auto' ],
              body: elencoTabellare
            }
          };

            contenutoStampa.push( { text: 'Comune di Rimini', fontSize: 15 } );
            contenutoStampa.push({ text: '  ', fontSize: 12, bold: true, margin: [0, 0, 0, 8] });
            contenutoStampa.push( { text: 'Gestione Posta del ' + $scope.model.dataStampa, fontSize: 12 } );
            contenutoStampa.push( { text: 'Tipo Posta : ' + arraySelezioneTipi[numeroPagina-1], fontSize: 12 } );
            contenutoStampa.push(tabellaStampa);
            contenutoStampa.push({ text: 'Totale: ' + item.length, fontSize: 12, bold: true, margin: [0, 0, 0, 8] });

            if(numeroPagina == maxPagina){
              contenutoStampa.push({ text: '  ', fontSize: 12, bold: true, margin: [0, 0, 0, 8] });
            }else{
              contenutoStampa.push({ text: ' ', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] });
            }

          http://intranet.comune.rimini.it/wp-content/uploads/2017/06/elenco-telefonico-PM-al-22-06-2017.pdf

            console.log(numeroPagina,maxPagina);
         
            numeroPagina++;
       });


       var docDefinition = { 
       pageSize: 'A4',
       pageMargins: [ 30, 30, 30, 30 ],
       footer: function(currentPage, pageCount) {  
         return    { text: 'pagina ' + currentPage.toString() + ' di ' + pageCount, alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8] }
        },
       header: function(currentPage, pageCount) {
          // you can apply any logic and return any valid pdfmake element

          return { text: 'Elenco posta stampato il: ' + $scope.today, alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8] };
       },
       content: [contenutoStampa]
      };


      console.log(docDefinition);

      pdfMake.createPdf(docDefinition).open();


        // $scope.user = res.data.user;
      })
      .catch(function(response) {
        $log.error(response);
        var dlg = dialogs.error(response.data.message, response.status);
      });
    
  
    

    // dati per la stampa

     var docDefinition = { 
       pageSize: 'A4',
       pageMargins: [ 10, 10, 10, 10 ],
       footer: function(currentPage, pageCount) { 
              return currentPage.toString() + ' of ' + pageCount; },
       header: function(currentPage, pageCount) {
          // you can apply any logic and return any valid pdfmake element

          return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
       },
       content: [
	        { text: 'Comune di Rimini', fontSize: 15 },
          { text: 'Gestione Posta del 00/00/0000 - M99999', fontSize: 12 },
          { text: 'Tipo Posta : TIPO', fontSize: 12 },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 'auto', 'auto', 'auto', 'auto','auto' ],
              body: [
                [ 'Prog.', 'Protocollo', 'Destinatario', 'Destinazione', 'Cdc' ],





                [ '1', 'Value 2', 'Value 3', 'Value 4' ],
                [ '2', 'Val 2', 'Val 3', 'Val 4' ]
              ]
            }
          },
          { text: 'Totale: XX', fontSize: 14, bold: true, margin: [0, 0, 0, 8] },
          { text: 'Pagina: 1 di NN', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] },
          
          /*pag 2*/


	        { text: 'Comune di Rimini (pag 2 di NN) - M99999', fontSize: 15 },
          { text: 'Posta del       : 00/00/0000', fontSize: 12 },
          { text: 'Centro di costo : CCCCCCC', fontSize: 12 },
          { text: 'Tipo            : P01-SDSSSSSS', fontSize: 12 },

     

          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 'auto', 'auto', 100, '*' ],
              body: [
                [ 'N.', 'Destinatario', 'Third', 'The last one' ],
                [ '1', 'Value 2', 'Value 3', 'Value 4' ],
                [ '2', 'Val 2', 'Val 3', 'Val 4' ]
              ]
            }
          },
          { text: 'Totale: XX', fontSize: 14, bold: true, margin: [0, 0, 0, 8] },
          { text: 'Pagina: 2 di NN', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] },



	]
      };


  //pdfMake.createPdf(docDefinition).open();


  // uiGridExporterService.pdfExport(grid, rowTypes, colTypes);


   //$scope.gridApi.exporter.pdfExport( $scope.export_row_type, $scope.export_column_type );
   /*
    if ($scope.export_format == 'csv') {
      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      $scope.gridApi.exporter.csvExport( $scope.export_row_type, $scope.export_column_type, myElement );
    } else if ($scope.export_format == 'pdf') {
      
    };
    */
  }



  // EXPORT EXCEL --------------------------------------------------------------------------------------------------

  $scope.exportExcel = function(){

    console.log('exportExcel PDF ------------------------  ');
    
    console.log($scope.model);

    // prendere i dati

      $scope.model.cdcStampaTxt = $scope.model.cdcStampa.id;
      $scope.model.tipoPostaStampaTxt = $scope.model.tipoPostaStampa.id;
      $scope.model.dataStampaTxt = moment($scope.model.dataStampa).format('YYYYMMDD');

      console.log($scope.model);

    PostaService.getPosta($scope.model)
      .then(function (res) {
        // dialogs.notify('ok','Profile has been updated');
        $log.info(res);

        // selezione dei dati
        var arraySelezione = [];
        var arraySelezioneTipi = [];

        elencoTipiSpedizione.forEach(function(obj){ 
          console.log(obj.id);
          var elenco = $filter('filter')(res.data, {tipo_spedizione: obj.id }); 
          console.log(elenco);
          if(elenco.length > 0){
            arraySelezione.push(elenco);
            arraySelezioneTipi.push(obj.id);
          }
        });

        console.log(arraySelezioneTipi);
        console.log(arraySelezione);
        
        var ws_name = "DISTINTA RACCOMANDATE AR";

      /* make worksheet 
      var ws_data = [
	      [ "S", "h", "e", "e", "t", "J", "S" ],
	      [  1 ,  2 ,  3 ,  4 ,  5 ]
      ];
      var ws = XLSX.utils.aoa_to_sheet(ws_data);

      wb.SheetNames.push(ws_name);

      wb.Sheets[ws_name] = ws;

      ws.A1 = 'SALUTI';


      var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

      */

var workbook = { SheetNames:[], Sheets:{} };

/* make worksheet */
var ws_data = [
	[ "", "CODICE CLIENTE X01125", "REFERENTE PAOLO CANINI", "", "TEL.  0541/704350", "MAIL:economato.comunale@comune.rimini.it" ],
	[  "" ,  "" ,  "" ,  ""  ],
  [ "LASCIARE VUOTO","DESTINATARIO","INDIRIZZO","CAP","CITTA'","PROVINCIA","CDC"]
];

arraySelezione.forEach(function(item){
  item.forEach(function(obj){
    ws_data.push([
      "",
      obj.destinatario_denominazione,
      obj.destinatario_via,
      obj.destinatario_cap,
      obj.destinatario_citta,
      obj.destinatario_provincia,
      obj.cdc,
      obj.tipo_spedizione,
      obj.userid,
      obj.posta_id
    ]);
  });
});


var ws = XLSX.utils.aoa_to_sheet(ws_data)

workbook.SheetNames.push(ws_name);
workbook.Sheets[ws_name] = ws;

/* bookType can be any supported output type */
var wopts = { bookType:'xlml', bookSST:false, type:'binary' };

var wbout = XLSX.write(workbook,wopts);

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

/* the saveAs call downloads a file on the local machine */
saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), $scope.todayYYYMMDD + "-test.xls");


    });
  }

 



  $scope.resetDebug = function () {
    console.log('Reset------------Data');
    console.log($scope.gridOptions.data);
    
    // data1 = angular.copy(origdata1);
    // data2 = angular.copy(origdata2);
 
    // $scope.gridOpts.data = data1;
    // $scope.gridOpts.columnDefs = columnDefs1;
  }


  var sourceData =  [
    {
      'posta_id':UtilsService.getTimestampPlusRandom(),
      'tipo_spedizione': 'P01 - POSTA ORDINARIA',
      'destinatario_denominazione':'da compilare',
      'destinatario_citta':'da compilare',
      'destinatario_via':'da compilare',
      'destinatario_cap':'da compilare',
      'destinatario_provincia':'da compilare',
      'note':'da compilare'
    }
  ];

  console.log('uiGrid: loading data ....');


  $scope.ricaricaDati();

  ProfileService.getProfile().then(function (res) {
            $log.info('uigrid profileMgrCtrl : setting data');
            $log.info(res.data);
            $scope.user = res.data;
         })
        .catch(function(response) {
            $log.error(response);
  				});

  // $scope.gridOptions.data = sourceData;
  

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
    'P01 - POSTA ORDINARIA': 'P01 - POSTA ORDINARIA',
    'P02 - PIEGHI DI LIBRI': 'P02 - PIEGHI DI LIBRI',
    'P03 - POSTA INTERNAZIONALE': 'P03 - POSTA INTERNAZIONALE',
    'P04 - POSTA TARGHET (ex STAMPE)': 'P04 - POSTA TARGHET (ex STAMPE)',
    'R01 - RACCOMANDATA A/R': 'R01 - RACCOMANDATA A/R',
    'R02 - RACCOMANDATA ORDINARIA': 'R02 - RACCOMANDATA ORDINARIA',
    'AG1 - RACC. INTERNAZIONALI': 'AG1 - RACC. INTERNAZIONALI',
    'AG2 - ATTI GIUDIZIARI': 'AG2 - ATTI GIUDIZIARI'
  };
 
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})


/*------------------------------------------------------------------------------------------------------------*/

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