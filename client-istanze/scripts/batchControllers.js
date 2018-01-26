'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('BatchCtrl', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','formlyConfig','$q','$http','formlyValidationMessages', 'FormlyService','usSpinnerService','dialogs','UtilsService', 'socket', '$anchorScroll', 
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  formlyConfig,  $q,  $http,  formlyValidationMessages,   FormlyService,  usSpinnerService,  dialogs,   UtilsService,  socket, $anchorScroll) {
    
  $log.debug('BatchCtrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 


  $log.debug('Socket init');                                 


 $scope.messages = [];

// Socket listeners
  // ================

  socket.on('init', function (data) {
    console.log('SINIT', data);
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('send:message', function (message) {
    console.log('S-SEND:MESSAGE', message);
    $scope.messages.push(message);
  });

  socket.on('log:message', function (message) {
    console.log('S:LOG:MESSAGE', message);
    if (message.progress && message.msg)  $rootScope.$broadcast('dialogs.wait.progress',{
      'msg': message.msg,
      'progress' : message.progress
    });
    $scope.messages.push(message);
  });
  

  socket.on('change:name', function (data) {
    console.log('S-CHANGE:NAME', message);
    changeName(data.oldName, data.newName);
  });

  socket.on('user:join', function (data) {
    console.log('S-USER:JOIN', data);
    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + data.name + ' has joined.'
    });
    $scope.users.push(data.name);
  });

  // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user:left', function (data) {
    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + data.name + ' has left.'
    });
    var i, user;
    for (i = 0; i < $scope.users.length; i++) {
      user = $scope.users[i];
      if (user === data.name) {
        $scope.users.splice(i, 1);
        break;
      }
    }
  });

  // Private helpers
  // ===============

  var changeName = function (oldName, newName) {
    // rename user in list of users
    var i;
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i] === oldName) {
        $scope.users[i] = newName;
      }
    }

    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + oldName + ' is now known as ' + newName + '.'
    });
  }

  // Methods published to the scope
  // ==============================

  $scope.changeName = function () {
    socket.emit('change:name', {
      name: $scope.newName
    }, function (result) {
      if (!result) {
        alert('There was an error changing your name');
      } else {

        changeName($scope.name, $scope.newName);

        $scope.name = $scope.newName;
        $scope.newName = '';
      }
    });
  };

  $scope.sendMessage = function () {
    console.log('batchController:sendMessage');
    console.log('send:message');
    socket.emit('send:message', {
      message: 'GO!'
    });

    // add the message to our model locally
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });

    // clear message box
    $scope.message = '';
  };














    // http://www.technofattie.com/2014/07/01/using-angular-forms-with-controller-as-syntax.html
    this.form = $scope.form;

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
    vm.model.cellulareRichiedente = '3355703086';
    vm.model.dataNascitaRichiedente = '11/12/1912';
    vm.model.indirizzoRichiedente = 'VIA ROMA, 1';
    vm.model.cittaRichiedente = 'RIMINI';
    vm.model.capRichiedente = '47921';
    vm.model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    vm.model.oggettoRichiedente = 'Invio richiesta generica Sig. MARIO ROSSI, cortesemente ....';
    vm.model.hash = [];
    vm.responseMessage = {};
    vm.labelInputFileCSS = 'Scegli un file...';


    vm.testSocketIO = testSocketIO;
    vm.testSendData = testSendData;

    // function assignment
    vm.onSubmit = onSubmit;
    vm.calcHash = calcHash;
    vm.onInputFileChange = onInputFileChange;
    vm.show_Form = function(){ vm.bshowForm = true};
    vm.hide_Form = function(){ vm.bshowForm = false};

    function testSocketIO() {
      console.log('testSocketIO');
      $scope.sendMessage();
   }


// ###########################################################################################################################

    function testSendData() {
      console.log('testSendData');
      console.log(socket.getId());

          var dlg = dialogs.wait('Attendere ...','calcolo codice di controllo',0);

          var apiUrl = "http://localhost:9988/api/protocollo/testSIO";
          console.log('apiUrl', apiUrl);


         return $http({ 
                    url: apiUrl, 
                    method: "GET",
                    params: {
                        socketId : socket.getId()
                    }
                  })
        .then(function (res) {
            $rootScope.$broadcast('dialogs.wait.complete');
            console.log('Respo OK');
           console.log(res.data);

            
        });

   }




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
        var uploadUrl = $rootScope.base_url + '/api/protocollo/upload';
        console.log(uploadUrl);

       if (vm.userForm.$valid) {
          // vm.options.updateInitialValue();
          //alert(JSON.stringify(vm.model), null, 2);
          //usSpinnerService.spin('spinner-1');

          var dlg = dialogs.wait(undefined,undefined,_progress);

          console.log('upload!!');
          
          //var upFiles = [];
          //upFiles.push(vm.model.picFile1);
          //upFiles.push(vm.model.picFile2);
          
          

        Upload.upload({
            url: uploadUrl,
            method: 'POST',
            //files: vm.options.data.fileList
            //data: {files : upFiles, fields: vm.model  }
            data: {fields: vm.model  }
        }).then(function (resp) {
            console.log('Success ');
            console.log(resp);

               $rootScope.$broadcast('dialogs.wait.complete'); 
               // dialogs.notify('Richiesta correttamente pervenuta', resp.data);
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
            // dialogs.error('Errore - ' + resp.status, resp.data.msg);
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


