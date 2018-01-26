angular.module('myApp.controllers')

  .controller('anagraficaDemanioCtrl', 

           ['$scope', '$q', '$http', 'dialogs',  '$rootScope', 'AuthService', 'AlertService', 'DatabaseService', '$state','ENV', '$log', 'usSpinnerService','Upload',
    function($scope,   $q,   $http,   dialogs,    $rootScope,   AuthService,   AlertService,   DatabaseService,  $state,  ENV ,  $log,    usSpinnerService,  Upload ) {

    
    $log.info('anagraficaDemanioCtrl: startUp!');
    
    $scope.model = { progressValue : 22, name : 'oooook' };

    $scope.formStatus = "Browse";
    $scope.errorMessage = "";
    

    $scope.my_progressBarValue = 33;
    $scope.my_progressBarValue2 = 21;
    $scope.my_progressText = '';
    $scope.logOperazioni = ["nulla"];
    $scope.isSubmitting = false;

    $scope.my_progressBarFunction = function(){
        $log.info('sid24pCtrl: progressBarFunction',$scope.my_progressBarValue,$scope.my_progressBarValue2);
        $scope.my_progressBarValue = $scope.my_progressBarValue + 10;
        $scope.my_progressBarValue2 = $scope.my_progressBarValue2 + 10;
        $scope.my_progressText = $scope.my_progressBarValue2 + 10;
    }


    $scope.user = {};
    
    $scope.vm = {}; $scope.vm.model = {}; $scope.vm.userForm = {};

    
    $scope.model.id = '';
    $scope.model.id_concessione = '';
    $scope.model.importo_canone_richiesto = '';

    $scope.maxProgressBar = 1000;
    $scope.currentProgressBar = 0;

    $scope.getProfile = function() {
        $log.info('sid24pCtrl: getProfile');
    };

   

    
    $scope.uploadCsv = function () {

        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiDemanio + '/updata/' + SseService.getChannelId(); 

        $scope.isSubmitting = true;

        console.log('sid24pCtrl : uploadCsv POST');
        console.log(fullApiEndpoint);

       
        Upload.upload({
            url: fullApiEndpoint,
            method: 'POST',
            //files: vm.options.data.fileList
            //data: {files : upFiles, fields: vm.model  }
            data: {fields: $scope.vm.model  }
        }).then(function (resp) {
            console.log('Success ');
            console.log(resp);
            $scope.isSubmitting = false;
            $scope.logOperazioni = resp.data.msg;

               //$rootScope.$broadcast('dialogs.wait.complete'); 
               // dialogs.notify('Richiesta correttamente pervenuta', resp.data);
               //vm.responseMessage = resp.data;
               //vm.bshowForm = false;
               // console.log(vm.responseMessage);
              //dialogs.error('500 - Errore server',response.data.message, response.status);
          
            //usSpinnerService.stop('spinner-1');
        }, function (resp) {
            $rootScope.$broadcast('dialogs.wait.complete');
            console.log('Error status: ' + resp.status);
            console.log(resp);
            $scope.isSubmitting = false;
            $scope.logOperazioni = resp.data.msg;


            /*
            if (resp.status == -1){
                vm.responseMessage.title = "Errore di connessione";
                vm.responseMessage.msg = "Verificare la connessione internet e riprovare la trasmissione";
                vm.responseMessage.code = 999;
            } else {
                vm.responseMessage = resp.data;
            }

            vm.bshowForm = false;
            // dialogs.error('Errore - ' + resp.status, resp.data.msg);
            console.log(vm.responseMessage);
            */
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            var _progress = progressPercentage;
            console.log('progress: ' + progressPercentage + '% ');
            if (progressPercentage < 100) {
              _progress = progressPercentage;
              // $scope.my_progressBarValue = _progress;
              $rootScope.$broadcast('dialogs.wait.progress',{'msg' : progressPercentage, 'progress' : _progress});
            }else{
              //$rootScope.$broadcast('dialogs.wait.complete');
              // $scope.my_progressBarValue = _progress;
              $rootScope.$broadcast('dialogs.wait.progress',{'msg' : 'Elaborazione in corso', 'progress' : _progress});
            }
        });


    };

    // aggancia il servizio dei messaggi per la chiamata

    


    $scope.gridOptions = {};
    $scope.gridOptions = {
      enableSorting: true,
      enableFiltering: true,
      enableGridMenu: true,
      enableRowSelection: true,
      enableSelectAll: true,
      showGridFooter:true,
      columnDefs: [
        { name: 'ID_Q_ANAGRAFICA_VERDE', field: 'ID_Q_ANAGRAFICA_VERDE', visible: false, enableCellEdit: false },
        { name: 'Identificativo SID', field: 'IDENTIFICATIVO_SID', width: '10%', visible: true, enableCellEdit: false },
        { name: 'Ragione Sociale', field: 'RAGIONE_SOCIALE', visible: true, enableCellEdit: false,  width: '15%', enableFiltering: true },
        { name: 'Cooperativa', width: '5%', field: 'COOPERATIVA', enableFiltering: true },
        { name: 'P. IVA',  width: '10%', field: 'PARTITA_IVA', enableFiltering: true },
        { name: 'Indirizzo', field: 'INDIRIZZO',width: '20%', enableFiltering: true },
        { name: 'email', field: 'EMAIL', width: '20%', enableFiltering: true }
      ],
      exporterPdfDefaultStyle: {fontSize: 9},
      exporterPdfTableStyle: {margin: [5, 5, 5, 5]},
      exporterPdfTableHeaderStyle: {fontSize: 8, bold: true, italics: true, color: 'black'},
      exporterPdfHeader: function ( currentPage, pageCount ) {
        return { text: 'Stampa elenco ...' + 'Anagrafica', style: 'headerStyle' };
      },
      exporterPdfFooter: function ( currentPage, pageCount ) {
        return { text: currentPage.toString() + ' of ' + pageCount.toString() + ' anagrafica ' + new Date().toDateString() , style: 'footerStyle' };
      },
      exporterPdfCustomFormatter: function ( docDefinition ) {
        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        return docDefinition;
      }
    };
  
    $scope.gridOptions.multiSelect = true;


    $scope.saveRow = function( rowEntity ) {
        console.log('saveRow....');
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
        promise.resolve();
        /*
        PostaService.updatePosta(rowEntity)
        .then(function (res) {
            $log.debug(res);
            promise.resolve();
        })
        .catch(function(response) {
            promise.reject();
            $log.debug(response);
        });
        */
    };
    
    $scope.gridOptions.onRegisterApi = function( gridApi ) {
      $scope.gridApi = gridApi;
      gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
          var msg = 'row selected ' + row.isSelected;
          $log.log(row);
          $log.log(msg);
      });
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
          console.log('edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
          $scope.$apply();
      });

    }

    // INIT caricamento dati grid

    var options = {};
    DatabaseService.getQ_ANAGRAFICA_VERDElist(options)
    .then(function (res) {
      $scope.gridOptions.data = res.data;
      $log.info(res);
      // $scope.user = res.data.user;
    })
    .catch(function(response) {
      $log.error(response);
      AlertService.displayError(response);
    });

    $scope.annullaInserimentoOModifica = function(){
        $scope.formStatus = "Browse";
    };

    $scope.showDialog = function(){
        $log.info('showDialog');
        AlertService.displayError('TEST');
    };

    $scope.editData = function(){
        $log.info('editData');
        if ( $scope.gridApi.selection.getSelectedCount() == 1 ) {
            $log.info($scope.gridApi.selection.getSelectedRows());

            var row = $scope.gridApi.selection.getSelectedRows();

            $scope.model.ID_Q_ANAGRAFICA_VERDE = row[0].ID_Q_ANAGRAFICA_VERDE;
            $scope.model.RAGIONE_SOCIALE = row[0].RAGIONE_SOCIALE;
            $scope.model.EMAIL = row[0].EMAIL;

            $scope.formStatus = "EditUpdate";
        
        } else {
            $log.info('no Selection...');
            $scope.errorMessage = 'Selezionare almeno un elemento della lista';
        }
    }
    
    $scope.saveData = function(){
        $log.info('saveData');
        $log.info($scope.model);
        $scope.errorMessage = 'Dato salvato';

        DatabaseService.updateQ_ANAGRAFICA_VERDE($scope.model)
        .then(function (res) {
            $log.info(res);
        })
        .catch(function(response) {
            $log.info(response);
            $scope.errorMessage = response;
        });
    }

    $scope.resetErrorMessage = function (){$scope.errorMessage = ''}

    /* Aggiungi anangrafica */
    $scope.addData = function(){
        console.log('Add2------------Data');
        $scope.formStatus = "EditUpdate";

    /*
    AlertService.createDialog('templates/postaDialogFormITALIA.html','anagraficaAddDataDialogCtrl')
    .then(function(dialogData){
      console.log(dialogData);
      console.log('Adding data ....');

      var n = $scope.gridOptions.data.length + 1;

      var newItem  = {
        'posta_id': UtilsService.getTimestampPlusRandom(),
        'cdc': $scope.model.selectedCdc.codice,
        'protocollo':dialogData.Protocollo,
        'tipo_spedizione':dialogData.tipoPostaStampa.id,
        'destinatario_denominazione':dialogData.Destinatario,
        'destinatario_citta':dialogData.Citta,
        'destinatario_via':dialogData.Via,
        'destinatario_cap':dialogData.Cap,
        'destinatario_provincia':dialogData.Provincia,
        'barCode' : dialogData.BarCode ? dialogData.BarCode : '',
        'verbale' : dialogData.Verbale ? dialogData.Verbale : '',
        'note': dialogData.Note ? dialogData.Note : ''
      };

      console.log(dialogData);
      console.log('Saving ..... ');

      PostaService.addPosta(newItem)
      .then(function (res) {
        $scope.gridOptions.data.push(newItem);
        $log.debug(res);
        // $scope.user = res.data.user;
      })
      .catch(function(response) {
        $log.error(response);
        AlertService.displayError(response);
      });


    },function(btn){
      console.log('Operazione annullata.');
    });
    */
  


	}; // end addData



  }])


 
.controller('anagraficaAddDataDialogCtrl',
  // ['$scope','$modalInstance', 'data',
function($location, $rootScope, $scope , $uibModalInstance ,  data  ){
 
console.log('customDialogCtrl ....');
console.log($location.absUrl());
console.log($location.path());

//-- Variables --//
$scope.elencoTipoPosta = data;

$scope.modal = {};
$scope.modal.imgSource = $rootScope.base_url + 'images/popup-unlock.jpg';
// $scope.modal.tipoPostaStampa = data[0];
$scope.modal.dataAttuale = moment().format('DD/MM/YYYY');;
//-- Methods --//

$scope.cancel = function(){
    $uibModalInstance.dismiss('Canceled');
}; // end cancel

$scope.save = function(){
    console.log($scope.modal);
    $uibModalInstance.close($scope.modal);
}; // end save

/*
$scope.hitEnter = function(evt){
if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.user.name,null) || angular.equals($scope.user.name,'')))
 $scope.save();
};
*/

}
//]
); // end controller(customDialogCtrl)

