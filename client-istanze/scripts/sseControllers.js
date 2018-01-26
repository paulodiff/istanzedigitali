'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('sseController', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','$q','$http', 'usSpinnerService','dialogs','UtilsService', 'Upload', '$anchorScroll', 'EventSourceSse', 
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  $q,  $http,   usSpinnerService,  dialogs,  UtilsService,   Upload,   $anchorScroll,   EventSourceSse) {
    
  $log.debug('sseController>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 

    var vm = this;
    var unique = 1;
    var _progress = 0;
  
    vm.sseMessages = [];

  $scope.listOfChannels = [];

  $scope.sseUserId = UtilsService.getRandomId();


 /*
  console.log('>loginOrSignup');
  // viene creato un utente con un Id dato dal server {Id, $promise}
  $scope.user = sseUsers.loginOrSignup();
  console.log('>user', $scope.user);

  $scope.user.$promise.then(function() {
     console.log('user:promise:...', $scope.user.id);
     $scope.chats = sseChats.forRoom("demo", $scope.user.id);
  });

  $scope.sendChat = function() {

    $scope.chats.send($scope.newChat)
      .then(resetChat, resetChat);
  }

  // controlla se la chat è dell'utente
  $scope.isMine = function(chat) {
    return chat.userId === $scope.user.id;
  }

  function resetChat() {
    $scope.newChat = {};
  }
  */

  function updateReport(data){
    for (var i in $scope.listOfChannels) {
        console.log(data);
        console.log($scope.listOfChannels[i].id);
        if ($scope.listOfChannels[i].id == data.channelId) {
            $scope.listOfChannels[i].cnt = $scope.listOfChannels[i].cnt + 1;
            break; //Stop this loop, we found it!
        }
    }
  }

  function sseConnect() {
        console.log('sseConnect');
        var id = $scope.sseUserId;
        var chatEvents = new EventSourceSse($rootScope.base_url + '/sse/connect/' + id  + "/events");

        chatEvents.addEventListener('chat', function(event) {
            console.log(event);
        });

        chatEvents.addEventListener('message', function(e) {
            console.log(event);
            // vm.sseMessages.push(e.data);
            // console.log(e.data);
            // var data = JSON.parse(e.data);
            // console.log(data);
            // updateReport(data);
            // $scope.listOfChannels
            
        });

        chatEvents.addEventListener('open', function(e) {
            console.log(e);
        });

        $.snackbar({content: 'Client connected!'});

  }

  function sseSelectChannel(item){
      console.log(item);
      if (item.value) {
          console.log('subscribe!');
          var url = $rootScope.base_url + '/sse/subChannel/'  + item.id + '/' + $scope.sseUserId;
      } else {
          console.log('unsubscribe!');
          var url = $rootScope.base_url + '/sse/unsubChannel/'  + item.id + '/' + $scope.sseUserId;
      }
      console.log(url);
       $http.get(url).then(function(data) {
                console.log(data);
                var msg = data.data.channelId + ":" + data.data.action;
                console.log(msg);
                $.snackbar({content: msg});
        }, function() {
                console.log('test! - error');
                console.log(data);
        });
  }

  function  sseSubscribe(){
      console.log('sseSubscribe');
  }

  function  sseUnsubscribe(){
      console.log('sseUnsubscribe');
      
  }

  function sseSendData(item){
      console.log('sseSendData');
      console.log(item);
      var url = $rootScope.base_url + '/sse/pubChannel/'  + item.id;
      console.log(url);

     $http.get(url)
        .then(function(data) {
          console.log(data);
          var msg = data.data.channelId + ":" + data.data.action;
          $.snackbar({content: msg});

        }, function() {
          console.log(data);
        });
  }


  function sseTest(){
      console.log('sseTest ....');

      var options =  {
            content: "Some text" // text of the snackbar
            // style: "toast", // add a custom class to your snackbar
            //timeout: 100, // time in milliseconds after the snackbar autohides, 0 is disabled
            //htmlAllowed: true, // allows HTML as content value
            //onClose: function(){ } // callback called when the snackbar gets closed.        
    }

    //$.snackbar({content: 'This is a JS generated snackbar, it rocks!'});
    $.snackbar(options);


      $http.get($rootScope.base_url + '/sse/test')
        .then(function(data) {
          console.log(data);
        }, function() {
          console.log('test! - error');
        });
  }

  var vm = this;
  vm.sseConnect = sseConnect;
  vm.sseSendData = sseSendData;
  vm.sseSubscribe = sseSubscribe;
  vm.sseUnsubscribe = sseUnsubscribe;
  vm.sseSelectChannel = sseSelectChannel;
  vm.sseTest = sseTest;

  // init channel - da muovere nei services
  $http.get($rootScope.base_url + '/sse/getChannels')
        .then(function(result) {
            console.log('>getChannels ...')
            console.log(result);


        angular.forEach(result.data, function(item) {
            //$scope.data.push(item.numTelefonate);
            //$scope.labels.push(moment(item.tel_data).format('YYYY-MM-DD'));
            console.log(item);

            $scope.listOfChannels.push({
                id : item.id,
                desc: item.desc,
                cnt : 0
            });

            /*
            dataset.push({
              name: moment(item.tel_data).format('YYYY-MM-DD'),
              age: item.numTelefonate,
              country : moment(item.tel_data).format('YYYY-MM-DD')
            })
            */

        });
        console.log($scope.listOfChannels);


            //$scope.listOfChannels = data;
        }, function() {
          console.log('getChannels! - error');
   });

                                 
}]);


