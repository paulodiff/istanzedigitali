'use strict';

/* sigControllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller("sigPhotoController", 
                    ['$scope', 'dialogs', '$state', '$log', 'sigService', 'usSpinnerService',
            function($scope,    dialogs,   $state,   $log,   sigService ,  usSpinnerService) {

                
        $log.debug("sigPhoto  start");
        $scope.imagSrc = '';
        $scope.singleModel = 1;
          
        $scope.selectImageFile = function(){
              console.log('selectImageFile............');
              document.getElementById("idImageFileInput").click();
        }

        $scope.nextStep = function(){
              console.log('nextStep............');
              $state.go('sigPosition');
        }

        $scope.testService = function(){
            console.log('testService............');
            sigService.setAddress('Via AAAAAAAA');
            sigService.getAddress('Via AAAAAAAA');
        }
        
       $scope.getFile = function () {
         $scope.progress = 0;
         console.log('getFile');
         usSpinnerService.spin('spinner-1');
            sigService.fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                          usSpinnerService.stop('spinner-1');
                      });
        };
      
        /*
        $scope.$on("imageProgressLoading", function(e, progress) {
            console.log(progress);
            $scope.progress = progress.loaded / progress.total;
            $scope.$apply;
        });
        */
       
        $scope.addImagesOnChange = function(files, errFiles) {
            console.log('addImagesOnChange ...');
            var files = event.target.files;
            console.log(files[0]);
            usSpinnerService.spin('spinner-1');

            //sigService.addNewFile(files[0]);

            sigService.readAsDataURL(files[0], $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                          usSpinnerService.stop('spinner-1');
                      });
            

            /*
            var fileInfo = [];
            var i = 0;
            for(i=0;i<files.length;i++){
              console.log('adding file ..', files[i].name);
              sigService.addNewFile(files[i]);
            }
            */
      }
 
    
}])

.controller('sigPositionController', 
                    ['$scope', 'dialogs', '$state', '$log', 'sigService', 'usSpinnerService',
            function($scope,    dialogs,   $state,   $log,   sigService ,  usSpinnerService) {
                
    $log.debug('sigPosition...');

        $scope.addresses = [];

        function isGeolocationSupported() {
            return 'geolocation' in $window.navigator;
        }


        $scope.nextStep = function(){
              console.log('nextStep............');
              $state.go('sigType');
        }


        $scope.getLocationGPS = function(params) {
            console.log('getPositionGPS............');
            usSpinnerService.spin('spinner-1');
            sigService.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000
         }).then(function(position) {
            $scope.myPosition = position;
            sigService.mapLocation(position).then(function(address) {
                console.log(address);
                $scope.addresses = address.data.results;
                $scope.$apply;
                usSpinnerService.stop('spinner-1');
            });

         });

        }

        $scope.testService = function(){
            console.log('testService............');
            sigService.setAddress('Via AAAAAAAA');
            sigService.getAddress('Via AAAAAAAA');
        }

    
}])

// sigType ------------------------------------------------------------------------------------
.controller('sigTypeController', 
            [ '$scope',  '$log',
            function ($scope,  $log ) {
    $log.debug('sigType...');
           
                
    
}])

// sigSend ------------------------------------------------------------------------------------
.controller('sigSendController', 
            [ '$scope', '$log', 'sigService',
            function ($scope, $log, sigService ) {
    $log.debug('sigSend...');
    
}]);
