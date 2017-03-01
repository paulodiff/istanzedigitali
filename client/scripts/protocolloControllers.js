'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('ProtocolloCtrl', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','formlyConfig','$q','$http','formlyValidationMessages', 'FormlyService','usSpinnerService','dialogs','UtilsService', 'Upload', '$anchorScroll', 
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  formlyConfig,  $q,  $http,  formlyValidationMessages,   FormlyService,  usSpinnerService,  dialogs,   UtilsService,  Upload, $anchorScroll) {
    
    $log.debug('ProtocolloCtrl');
    var apiUploadUrl = $rootScope.base_url + '/' + ENV.apiUpload;  
    $log.debug(apiUploadUrl);


    // http://www.technofattie.com/2014/07/01/using-angular-forms-with-controller-as-syntax.html
    this.form = $scope.form;

    var vm = this;
    var unique = 1;
    var _progress = 0;


    
    /*  ---  */

    vm.id = 'form01';
    vm.showError = true;
    vm.bshowForm = true;
    vm.name  = "NAME01";
    vm.email  = "a@a.com";
    vm.userForm = {};
    vm.model = {};
    vm.model.nomeRichiedente = 'MARIO';
    vm.model.cognomeRichiedente = 'ROSSI';
    vm.model.emailRichiedente = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.codiceFiscaleRichiedente = 'RGGRGR70E25H294T';
    vm.model.cellulareRichiedente = 3355703086;
    vm.model.dataNascitaRichiedente = '01/11/1912';
    vm.model.indirizzoRichiedente = 'VIA ROMA, 1';
    vm.model.cittaRichiedente = 'RIMINI';
    vm.model.capRichiedente = 47921;
    vm.model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.oggettoRichiedente = 'Invio richiesta generica Sig. MARIO ROSSI, cortesemente ....';
    vm.model.hash = [];
    vm.responseMessage = {};
    vm.labelInputFileCSS = 'Scegli un file...';


    // function assignment
    vm.onSubmit = onSubmit;
    vm.calcHash = calcHash;
    vm.onInputFileChange = onInputFileChange;
    vm.show_Form = function(){ vm.bshowForm = true};
    vm.hide_Form = function(){ vm.bshowForm = false};

    function onInputFileChange(f){
        console.log('onInputFileChange', f);
        if(f){
            vm.labelInputFileCSS = f.name + '(' + f.size + ')'; 
        } else {
            vm.labelInputFileCSS = "Scegliere un file...";
        }
    }


    function calcHash(f){
        console.log('calcHash', f);
        vm.model.picFile1_info = "";

        if(f) {
            var dlg = dialogs.wait('Controllo...','calcolo codice di controllo',0);

            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                    file = f,
                    chunkSize = 2097152,                           // read in chunks of 2MB
                    chunks = Math.ceil(file.size / chunkSize),
                    currentChunk = 0,
                    spark = new SparkMD5(),
                    running = false,
                    time,
                    uniqueId = 'chunk_' + (new Date().getTime()),
                    chunkId = null,
                    fileReader = new FileReader();

                fileReader.onload = function (e) {
                    if (currentChunk === 0) {
                        console.log('Read chunk number <strong id="' + uniqueId + '">' + (currentChunk + 1) + '</strong> of <strong>' + chunks + '</strong><br/>', 'info');
                    } else {
                        if (chunkId === null) {
                            chunkId = document.getElementById(uniqueId);
                        }
                        // chunkId.innerHTML = currentChunk + 1;
                        var progressPercentage = parseInt(100.0 * currentChunk / chunks);
                        console.log('progress: ' + progressPercentage + '% ');
                        //dialogs.wait('Controllo...','calcolo codice di controllo',{'progress' : progressPercentage});
                        $rootScope.$broadcast('dialogs.wait.progress',{'progress' : progressPercentage});
                        $scope.$apply();
                    }
                    spark.appendBinary(e.target.result);                 // append array buffer
                    currentChunk += 1;
                    if (currentChunk < chunks) {
                        loadNext();
                    } else {
                        running = false;
                        var hashSpark = spark.end();
                        console.log('<strong>Finished loading!</strong><br/>', 'success');
                        console.log('<strong>Computed hash:</strong> ' + hashSpark + '<br/>', 'success'); // compute hash
                        console.log('<strong>Total time:</strong> ' + (new Date().getTime() - time) + 'ms<br/>', 'success');
                        $rootScope.$broadcast('dialogs.wait.complete');
                        vm.model.hash.push({ "name" : f.name, "hash" : hashSpark });
                    }
                };
                fileReader.onerror = function () {
                    running = false;
                    console.log('<strong>Oops, something went wrong.</strong>', 'error');
                };


                function loadNext() {
                    var start = currentChunk * chunkSize,
                        end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                    fileReader.readAsBinaryString(blobSlice.call(file, start, end));
                }
                running = true;
                console.log('<p></p><strong>Starting incremental test (' + file.name + ')</strong><br/>', 'info');
                time = new Date().getTime();
                loadNext();
        } // check f
    }

    // vm.originalFields = angular.copy(vm.fields);

    // function definition
    function onSubmit() {
        console.log('onSubmit ...');
        console.log(vm.model);
        
       if (vm.userForm.$valid) {
          // vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');

          var dlg = dialogs.wait('Elaborazione in corso',undefined,_progress);

          console.log('upload!!');
          
          //var upFiles = [];
          //upFiles.push(vm.model.picFile1);
          //upFiles.push(vm.model.picFile2);
          
          

        Upload.upload({
            url: apiUploadUrl,
            method: 'POST',
            //files: vm.options.data.fileList
            //data: {files : upFiles, fields: vm.model  }
            data: {fields: vm.model  }
        }).then(function (resp) {
            console.log('Success ');
            console.log(resp);

               $rootScope.$broadcast('dialogs.wait.complete'); 
               dialogs.notify('Richiesta correttamente pervenuta', resp.data);
               vm.responseMessage = resp.data;
               vm.bshowForm = false;
               console.log(vm.responseMessage);
              //dialogs.error('500 - Errore server',response.data.message, response.status);
          
            //usSpinnerService.stop('spinner-1');
        }, function (resp) {
            $rootScope.$broadcast('dialogs.wait.complete');
            console.log('Error status: ' + resp.status);
            console.log(resp);

            if (resp.status == -1){
                vm.responseMessage.title = "Errore di connessione";
                vm.responseMessage.msg = "Verificare la connessione internet e riprovare la trasmissione";
                vm.responseMessage.code = 999;
            } else {
                vm.responseMessage = resp.data;
            }

            vm.bshowForm = false;
            dialogs.error('Errore - ' + resp.status, resp.data.msg);
            console.log(vm.responseMessage);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
            if (progressPercentage < 100) {
              _progress = progressPercentage
              $rootScope.$broadcast('dialogs.wait.progress',{'msg' : progressPercentage, 'progress' : _progress});
            }else{
              //$rootScope.$broadcast('dialogs.wait.complete');
              $rootScope.$broadcast('dialogs.wait.progress',{'msg' : 'Elaborazione in corso', 'progress' : _progress});
            }
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


    console.log('....goToTop');
    $location.hash('topPosition');
     // call $anchorScroll()
    $anchorScroll();
   

                                 
}]);


