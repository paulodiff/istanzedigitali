angular.module('myApp.controllers')

  .controller('profileMgrCtrl', 

           ['$scope', '$http', '$rootScope', 'AuthService', 'ProfileService', '$state','ENV', '$log','usSpinnerService', '$interval',
    function($scope,   $http,   $rootScope,   AuthService,   ProfileService,   $state,  ENV ,  $log, usSpinnerService, $interval ) {

    console.log('StartUP!');
    $log.info('DEBUG############### profileMgrCtrl: startUp!');
    $log.info('INFO############### profileMgrCtrl: startUp!');
    console.log(moment().format());

        $scope.user = {};

    $scope.getProfile = function() {

        $log.info('profileMgrCtrl: getProfile');
        usSpinnerService.spin('spinner-1');
        
        ProfileService.getProfile().then(function (res) {
            $log.info('profileMgrCtrl : getting data');
            $log.info(res.data);

            console.log(moment.unix(res.data.timeout).format('llll'));

            var mExpirationTime = moment.unix(res.data.sessionTimeout);
            console.log(mExpirationTime);
            console.log(mExpirationTime.format('DD/MM/YYYY, HH:mm:ss'));

            var mNow = moment();
            var duration = moment.duration(mExpirationTime.diff(mNow));
            console.log(duration.as('minutes'));
            

            /*
            var timeOut = moment().add(8, 'h').unix();
            console.log(timeOut);
            var day2 = moment.unix(timeOut);
            console.log(day2.format('DD/MM/YYYY, HH:mm:ss'));

            var duration = moment.duration(day2.diff(day));
            console.log(duration);
            console.log(duration.as('minutes'));
            */


            // split data csv

            $scope.user = res.data;
            $scope.user.timeOutFormatted = mExpirationTime.format('DD/MM/YYYY, HH:mm:ss') + ' fra ' + duration.as('seconds') + ' secondi ';

            $scope.countDown = 1000;
            $interval(function(){
              var mNow = moment();
              var duration = moment.duration(mExpirationTime.diff(mNow));

              if (duration < 0) {
                  $scope.user.timeOutFormatted = 'SESSIONE SCADUTA - ATTENZIONE!';
                  $state.go('profile');

              } else {
                  $scope.user.timeOutFormatted = mExpirationTime.format('DD/MM/YYYY, HH:mm:ss') + ' fra ' + duration.as('seconds') + ' secondi ';
              }

              
            },1000, $scope.countDown);


            usSpinnerService.stop('spinner-1');
         })
        .catch(function(response) {
            usSpinnerService.stop('spinner-1');
            $log.info('profileMgrCtrl : CATCH ERROR!!!');
            console.log(response);
            $state.go('error', {response:response, info : {source: 'profileController', action : 'profile'}});
            /*
            var dlg = dialogs.error(response.data.title, response.data.message, {});
					  dlg.result.then(function(btn){
                        $state.go('error', {response:response});
						$scope.confirmed = 'You confirmed "Yes."';
					},function(btn){
                        $state.go('error');
						$scope.confirmed = 'You confirmed "No."';
          });
          */
       
        });

    };


    $scope.updateProfile = function() {
        $log.info('profileMgrCtrl: updateProfile');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiProfile;
        $log.info('profileMgrCtrl: api : ' + fullApiEndpoint );
        $http.put(fullApiEndpoint, $scope.user)
            .then(function (res) {
                dialogs.notify('ok','Profile has been updated');
                $log.info(res);
                // $scope.user = res.data.user;
         }).catch(function(response) {
                    var dlg = dialogs.confirm(response.data.message, response.status);
					dlg.result.then(function(btn){
						$scope.confirmed = 'You confirmed "Yes."';
					},function(btn){
						$scope.confirmed = 'You confirmed "No."';
					});
       
        });
   
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          dialogs.notify('You have successfully linked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          dialogs.error(response.data.message, response.status);
        });
    };

    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          dialogs.notify('You have unlinked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          dialogs.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
        });
    };

    $scope.getProfile();
  }]);


 


