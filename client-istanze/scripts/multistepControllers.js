angular.module('myApp.controllers')

  .controller('multistepCtrl', 

           ['$scope', '$http', 'dialogs',  '$rootScope', 'AuthService', 'DatabaseService', '$state','ENV', '$log', 'usSpinnerService','Upload','AlertService',
    function($scope,   $http,  dialogs,     $rootScope,   AuthService,   DatabaseService,  $state,  ENV ,  $log,   usSpinnerService,  Upload, AlertService ) {

    
    $log.info('multistepCtrl: startUp!');
    
    $scope.model = { progressValue : 22, name : 'oooook' };

    $scope.multistepForm = {};
    $scope.multistepFormCurrentStep = '000'; // status 000 001 002 003 121 ecc .

    $scope.user = {};
    $scope.vm = {}; $scope.vm.model = {}; $scope.vm.userForm = {};
   
    
    $scope.maxProgressBar = 1000;
    $scope.currentProgressBar = 0;

    $scope.multistepFormIsCurrentStep = function(status){
        console.log('multistepFormIsCurrentStep');
        return status == $scope.multistepFormCurrentStep;
    };

    $scope.multistepFormIsCurrentStepValid = function(){
        console.log('multistepFormIsCurrentStepValid', $scope.multistepFormCurrentStep);
        switch($scope.multistepFormCurrentStep) {
            case '000': 
                return ($scope.vm.userForm.nomeRichiedente.$valid &&  $scope.vm.userForm.cognomeRichiedente.$valid);
            case '001': 
                return ($scope.vm.userForm.file.$valid);
                return true;
            case '002': 
                return true;
            default:
                return true;
        }
    }

    $scope.formNextStatus = function(){
        switch($scope.multistepFormCurrentStep) {
            case '000': $scope.multistepFormCurrentStep = '001'; break;
            case '001': $scope.multistepFormCurrentStep = '002'; break;
        }
    };
    $scope.formPreviousStatus= function(){
        switch($scope.multistepFormCurrentStep) {
            case '001': $scope.multistepFormCurrentStep = '000'; break;
            case '002': $scope.multistepFormCurrentStep = '001'; break;
        }
    };
    


    $scope.isProfileOk = function() {
        $log.info('multistepCtrl: isProfileOk');
        if ($scope.multistepForm.cognomeRichiedente) {
            return true;
        } else {
            return false;
        }
    };

    $scope.checkSse = function() {
        $log.info('multistepCtrl: checkSse');
        $log.info(SseService.getChannelId());
    };

    $scope.testSse = function() {
        $scope.maxProgressBar = 1000;
        $scope.currentProgressBar = 0;
        $log.info('multistepCtrl: uploadCsv');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiDemanio + '/test/' + SseService.getChannelId(); 
        $log.info('multistepCtrl: api : ' + fullApiEndpoint );

        return $http({ 
            url: fullApiEndpoint, 
            method: "GET"
          })
            .then(function (res) {
                $log.info('multistepCtrl : setting data');
                $log.info(res.data);
                // $scope.user = res.data;
            })
            .catch(function(response) {
                console.log(response);
            });
    };

    $scope.uploadCsv = function () {

        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiDemanio + '/updata/' + SseService.getChannelId(); 

        $scope.isSubmitting = true;

        console.log('multistepCtrl : uploadCsv POST');
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





    // caricamento dati grid

    /*
    var options = {};
    DatabaseService.getSID_F24_PAGAMENTIlist(options)
    .then(function (res) {
      $scope.gridOptions.data = res.data;
      $log.info(res);
      // $scope.user = res.data.user;
    })
    .catch(function(response) {
      $log.error(response);
      // AlertService.displayError(response);
      AlertService.displayNotify(response);
    });
    */






  }]);


 



  