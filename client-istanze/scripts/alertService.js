'use strict';

/* alert Services Display Errors..on device*/


angular.module('myApp.services')

.factory('AlertService',           ['ENV', '$http', '$rootScope', '$log', 'dialogs',
                         function (  ENV,   $http,   $rootScope,   $log,   dialogs) {
  return {

        displayError: function (obj) {
            $log.info('AlertService:displayError');
            $log.info(obj);

            var status = (obj.status ? obj.status : '');
            var statusText = (obj.statusText ? obj.statusText : '');
            var title = ((obj.data && obj.data.title) ? obj.data.title : '');
            var message = ((obj.data && obj.data.message) ? obj.data.message : '');
            var success =  ((obj.data && obj.data.success) ? obj.data.success : '');
            if (message == '') { message = obj.message };
            if (!title) { title = obj.title };
            $log.info('AlertService:dati:',title, message);
            var options = {}
            // options.windowClass = 'Dialog js-fr-dialogmodal Dialog-content Dialog-content--centered u-background-red u-layout-prose u-margin-all-xl u-padding-all-xl js-fr-dialogmodal-modal';
            options.backdrop = true;
            options.size = 'lg';
            var dlg = dialogs.error(title + '<small>(' + status + ')</small>', message, options);
        },

        displayNotify: function(title, text){
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