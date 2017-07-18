'use strict';

/* alert Services Display Errors..on device*/


angular.module('myApp.services')

.factory('AlertService',           ['ENV', '$http', '$rootScope', '$log', 'dialogs',
                         function (  ENV,   $http,   $rootScope,   $log,   dialogs) {
  return {

        displayError: function (title, text) {
            $log.debug( 'displayError');
            var dlg = dialogs.error(title, text);
        },

        displayInfo: function(title, text){
            var dlg = dialogs.notify(title, text);
        },

        displayConfirm: function(title, text){
            return dialogs.confirm(title, text).result;
        },

        createDialog: function(url, ctrlr, data, opts, ctrlAs){
            return dialogs.create(url, ctrlr, data, opts, ctrlAs).result;
        }

        
    }
}
]
);