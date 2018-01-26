'use strict';

/* sseService

    Gestione i log sse con EventSource

 */

angular.module('myApp.services')

.factory("EventSourceSse", ['$rootScope', function ($rootScope) {
    function EventSourceNg(url) {
      this._source = new EventSource(url);
    }
    EventSourceNg.prototype = {
      addEventListener: function(x, fn) {
        this._source.addEventListener(x, function(event) {
          $rootScope.$apply(fn.bind(null, event));
        });
      }
    }
    return EventSourceNg;
}])
  
  
.factory('SseService',           ['ENV', '$http', '$rootScope', '$log', '$localStorage', 'UtilsService',
                        function ( ENV,   $http,   $rootScope,   $log,   $localStorage,   UtilsService) {


  var tweets = [];
  var sseUserId = UtilsService.getRandomId();

  console.log('@SseService@ start id:', sseUserId);                            
  var messagesFeed = new EventSource($rootScope.base_url + '/sse/connect/' + sseUserId  + "/events");
  // var chatEvents = new EventSourceSse($rootScope.base_url + '/sse/connect/' + sseUserId  + "/events");


  return {

    getMessages: function(callback) {
        messagesFeed.addEventListener("message", callback, false);
    },

    getChannelId: function() {
        console.log('@SseService@ getChannelId id:', sseUserId)
        return sseUserId;
    }


  }

}]);

