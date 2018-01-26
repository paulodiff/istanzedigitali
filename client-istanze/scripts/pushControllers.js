'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// SFormlyCtrl ---------------------------------------------------------------------------------
.controller('pushController', 
          ['$rootScope','$scope', '$state', '$location', 'Session', '$log', '$timeout','ENV','$q','$http', 'usSpinnerService','dialogs','UtilsService', 'Upload', '$anchorScroll', 'EventSourceSse', 
   function($rootScope,  $scope,   $state,   $location,   Session,   $log,   $timeout,  ENV,  $q,  $http,   usSpinnerService,  dialogs,  UtilsService,   Upload,   $anchorScroll,   EventSourceSse) {
    
  $log.debug('pushController>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 

    var vm = this;
    var unique = 1;
    var _progress = 0;
  
  vm.sseMessages = [];

  $scope.listOfChannels = [];
  $scope.sseUserId = UtilsService.getRandomId();

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
            vm.sseMessages.push(e.data);
            console.log(e.data);
            var data = JSON.parse(e.data);
            console.log(data);
            updateReport(data);
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


      $http.get($rootScope.base_url + '/push/test')
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




var pars = {};

// pars.daData = moment(vm.model.daData, 'DD/MM/YYYY', false).format('YYYY-MM-DD');
// pars.aData = moment(vm.model.aData).format('YYYY-MM-DD');
// pars.numTel = vm.model.numTel;


 $scope.pushContent = "";
 $scope.swSupport = ('serviceWorker' in navigator);
 $scope.pushSupport = ('PushManager' in window);

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}



/**** */

function send_message_to_sw(msg){
    console.log('.... ', msg);
    //navigator.serviceWorker.controller.postMessage(msg);
    
    sendMessageToSW(msg).then( (m) => { 
        console.log(m); 
        $.snackbar({content: m});    
    });
    
}


function sendMessageToSW(message) {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  console.log('sendMessageToSW', message);
  return new Promise(function(resolve, reject) {
    var messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
          console.log(event.data.error);
        reject(event.data.error);
      } else {
          console.log(event.data);
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
}




/**** START register-sw 1. ****/
function registerServiceWorker() {
    console.log('..registerServiceWorker');

navigator.serviceWorker.register('./service-worker.js').then(function(reg) {
    // updatefound is fired if service-worker.js changes.
    reg.onupdatefound = function() {
      // The updatefound event implies that reg.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      var installingWorker = reg.installing;

      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will
              // have been added to the cache.
              // It's the perfect time to display a "New content is available; please refresh."
              // message in the page's interface.
              console.log('New or updated content is available.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('Content is now available offline!');
            }
            break;

          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}
/**** END register-sw ****/


// This is just to make sample code eaier to read.
// TODO: Move into a variable rather than register each time.
function getSWRegistration() {
  return navigator.serviceWorker.register('service-worker.js');
}

/**** START request-permission ****/
function askPermission() {
  console.log('....askPermission');
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
}
/**** END request-permission ****/

function unsubscribeUserFromPush() {
  return registerServiceWorker()
    .then(function(registration) {
      // Service worker is active so now we can subscribe the user.
      return registration.pushManager.getSubscription();
    })
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .then(function(subscription) {
      pushCheckbox.disabled = false;
      pushCheckbox.checked = false;
    })
    .catch(function(err) {
      console.error('Failed to subscribe the user.', err);
      pushCheckbox.disabled = Notification.permission === 'denied';
      pushCheckbox.checked = false;
    });
}

/**** START send-subscription-to-server ****/
function sendSubscriptionToBackEnd(subscription) {
  return fetch('/push/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
}
/**** END send-subscription-to-server ****/


/**** START subscribe-user ****/
function subscribeUserToPush() {
  return getSWRegistration()
  .then(function(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    };

    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(function(pushSubscription) {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  });
}
/**** END subscribe-user ****/

function setUpPush() {


  return registerServiceWorker()
  .then(function(registration) {
    if (Notification.permission === 'denied') {
      console.warn('The notification permission has been blocked. Nothing we can do.');
      return;
    }

    pushCheckbox.addEventListener('change', function(event) {
      // Disable UI until we've handled what to do.
      event.target.disabled = true;

      if (event.target.checked) {
        // Just been checked meaning we need to subscribe the user
        // Do we need to wait for permission?
        let promiseChain = Promise.resolve();
        if (Notification.permission !== 'granted') {
          promiseChain = askPermission();
        }

        promiseChain
          .then(subscribeUserToPush)
          .then(function(subscription) {
            if (subscription) {
              return sendSubscriptionToBackEnd(subscription)
              .then(function() {
                return subscription;
              });
            }

            return subscription;
          })
          .then(function(subscription) {
            // We got a subscription AND it was sent to our backend,
            // re-enable our UI and set up state.
            pushCheckbox.disabled = false;
            pushCheckbox.checked = subscription !== null;
          })
          .catch(function(err) {
            console.error('Failed to subscribe the user.', err);

            // An error occured while requestion permission, getting a
            // subscription or sending it to our backend. Re-set state.
            pushCheckbox.disabled = Notification.permission === 'denied';
            pushCheckbox.checked = false;
          });
      } else {
        // Just been unchecked meaning we need to unsubscribe the user
        unsubscribeUserFromPush();
      }
    });

    if (Notification.permission !== 'granted') {
      // If permission isn't granted than we can't be subscribed for Push.
      pushCheckbox.disabled = false;
      return;
    }

    return registration.pushManager.getSubscription()
    .then(function(subscription) {
      pushCheckbox.checked = subscription !== null;
      pushCheckbox.disabled = false;
    });
  })
  .catch(function(err) {
    console.log('Unable to register the service worker: ' + err);
  });
}

 

function triggerPushBtn() {

    console.log('triggerPushBtn');

    const payload = $scope.pushContent;
    const headers = {};
    
    try {
      JSON.parse(payload);
      headers['Content-Type'] = 'application/json';
    } catch (err) {
      headers['Content-Type'] = 'text/plain';
    }

    
    $http({
        url: $rootScope.base_url + '/push/trigger-push-msg/',
        method: 'POST',
        headers: headers,
        data: payload
    })
    .then( (response) => {
        console.log(response);
     }, (response) => {
        console.log(response);
    });

}

function getSubscriptionList() {

    console.log('triggerPushBtn');
    $http({
    url: $rootScope.base_url + '/push/get-subscriptions',
    method: 'POST'
  })
  .then((response) => {
        console.log(response);
  }, (response) => {
        console.log(response);
    });

}

function pushAskPermission(){
      // Disable UI until we've handled what to do.
      // event.target.disabled = true;

      console.log('pushAskPermission .... and ..');

      var promiseChain = Promise.resolve();

      if (Notification.permission !== 'granted') {
          promiseChain = askPermission();
      }

      promiseChain
          .then(subscribeUserToPush)
          .then(function(subscription) {
            if (subscription) {
                console.log(subscription);
                return sendSubscriptionToBackEnd(subscription)
                    .then(function() {
                        return subscription;
                    });
                }
                return subscription;
          })
          .then(function(subscription) {
            // We got a subscription AND it was sent to our backend,
            // re-enable our UI and set up state.
            console.log(subscription);
            //pushCheckbox.disabled = false;
            //pushCheckbox.checked = subscription !== null;
          })
          .catch(function(err) {
            console.error('Failed to subscribe the user.', err);

            // An error occured while requestion permission, getting a
            // subscription or sending it to our backend. Re-set state.
            pushCheckbox.disabled = Notification.permission === 'denied';
            pushCheckbox.checked = false;
          });
    /*  
    } else {
          console.log('pushAskPermission .... and  ELSE');
      }
    });
    */



   // UNSUBSCRIBE!!!
   // Just been unchecked meaning we need to unsubscribe the user
   // unsubscribeUserFromPush();


   /*
    if (Notification.permission !== 'granted') {
      // If permission isn't granted than we can't be subscribed for Push.
      pushCheckbox.disabled = false;
      return;
    }
    */
}

// vm.pushEnable = triggerPushBtn;
vm.pushGetList = getSubscriptionList;
// vm.pushSendMessage = function(){console.log('pushSendMessage')};
vm.pushTest = sseTest;
vm.pushRegisterService = registerServiceWorker;
vm.pushSendMessage2SW = send_message_to_sw;
vm.pushAskPermission = pushAskPermission;

/*
window.addEventListener('load', () => {
  getSubscriptionList()
  .then((subscriptionCount) => {
    if (subscriptionCount > 0) {
      return enableSendingPushes();
    } else {
      console.error('No subscriptions on the server, so can\'t ' +
        'trigger any push messages');
    }
  });
});
*/

// setUpPush();

                                 
}]);


