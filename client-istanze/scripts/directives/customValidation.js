// Direttive per custom validation
'use strict';

angular.module('myApp.directives')
.directive('blacklist', function (){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
          var blacklist = attr.blacklist.split(',');
          ngModel.$parsers.unshift(function (value) {
             ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
             return value;
          });
      }
   };
})

.directive('codiceFiscale', function (){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
          var blacklist = attr.blacklist.split(',');
          ngModel.$parsers.unshift(function (value) {
             ngModel.$setValidity('codiceFiscale', blacklist.indexOf(value) === -1);
             return value;
          });
      }
   };
})

// direttiva che controlla il contenuto di un altro campo
.directive('compareTo', function (){ 
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            console.log('compareTo', modelValue);     
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})