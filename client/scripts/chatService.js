'use strict';

/* chat Room and User factory */

angular.module('myApp.services')
   
// .service('VersionService', [function() {  return '1.0.2'; }])

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


.factory("sseUsers", ['$http', '$q', function ($http, $q) {
  var api = {
    create: function() {
      console.log('sseUsers:create');
      var user = {}; // {Id, $promise}

      user.$promise = $http.post('/sseusers')
        .success(function(data) {
          console.log('.. ritorna un Id dal server ..');
          //localStorage.userId = data.id;
          sessionStorage.userId = data.id;
          user.id = data.id;
        })
      return user;
    },
    me: function() {
      return {id: parseInt(sessionStorage.userId), $promise: $q.when(true)};
    },
    loginOrSignup: function() {
        console.log('sseUsers:loginOrSignup', sessionStorage.userId );
      if(sessionStorage.userId) {
        console.log(this.me());
        return this.me();
      }
      console.log('sseUsers:loginOrSignup:create');
      return api.create();
    }
  }

  return api;
}])

.factory("sseChats", ['$http', '$rootScope', 'EventSourceSse', function ($http, $rootScope, EventSourceSse) {

  function getForRoom(id, userId) {

    console.log('sseChats:getForRoom', id, userId);

    var chats = [];

    // live-updates
    var chatEvents = new EventSource('/sserooms/' + id  + "/events");
    chatEvents.addEventListener("chat", function(event) {
      var chat = JSON.parse(event.data);
      if(chat.userId != userId) {
        chats.unshift(chat);
      }
    });

    retrieveInitial(id)
      .then(function(existing) {
        existing.forEach(function(chat) {
          chat.createdAt = new Date(Date.parse(chat.createdAt));
          chats.push(chat);
        });
      });
    
    // ability to send a chat
    chats.send = function(chatData) {
      chatData.userId = userId;
      chatData.createdAt = new Date;
      chatData.sending = true; 

      chats.unshift(chatData);

      return $http.post('/sserooms/' + id + '/chats', _.omit(chatData, "sending"))
        .then(function() {
          chatData.sending = false;
        }, function() {
          chatData.failed = true;
          chatData.sending = false;
        });
    }

    function sortChats() {
       _.sortBy(chats, "createdAt").reverse();
    }

    return chats;
  }

  function retrieveInitial(id) {
    // initial chats
    return $http.get('/sserooms/' + id + '/chats')
      .then(function(result) {
        return result.data;
      });
  }

  return {
    forRoom: getForRoom
  }
}]);

/*

.factory('AuthService',           ['ENV', '$http', 'Session', '$rootScope', '$log',
                         function ( ENV,   $http,   Session,   $rootScope,   $log) {
  return {

    login: function (credentials) {

      $log.debug( $rootScope.base_url + ENV.apiLogin);
        
      return $http({ 
                    url: $rootScope.base_url + ENV.apiLogin, 
                    method: "GET",
                    params: {username: credentials.username, password: credentials.password }
                  })
        .then(function (res) {
            $log.debug('AuthService login then');
            $log.debug(res.data);
            Session.create(res.data);
        });
    },
      
    logout: function (credentials) {
        $log.debug('AuthService logout');
        $log.debug( $rootScope.base_url + ENV.apiLogout);
      return $http
        .get( $rootScope.base_url + ENV.apiLogout, credentials)
        .then(function (res) {
            $log.debug('AuthService logout ...');
            $log.debug(res);
            $log.debug(res.data.id_utenti);
            $log.debug('Destroy session ...');
            Session.destroy();
        });
    },  
      
    isAuthenticated: function () {
        $log.debug('AuthService isAuthenticated');
        return !!Session.id_utenti;
    },
      
    isAuthorized: function (authorizedRoles) {
        $log.debug('AuthService isAuthorized');
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
}])

.service('Session',  ['$log', function ($log) {
  this.create = function (data) {
    $log.debug('Session create ...');
    $log.debug(data);
    this.session_data = {};
    this.session_data = data;
  };
  this.destroy = function () {
    $log.debug('Session destroy');
    this.session_data = {};
  };
  return this;
}]);
*/