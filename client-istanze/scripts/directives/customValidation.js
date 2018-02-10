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

/* verifica che un valore sia di soli numeri */


/*
.directive('onlyNumber', function (){ 
    return {
       require: 'ngModel',
       restrict: 'A',
       
       
 link: function(scope, element, attr, ctrl) {
 
     // please note you can name your function & argument anything you like
     function customValidator(ngModelValue) {
         
         // check if contains uppercase
         // if it does contain uppercase, set our custom `uppercaseValidator` to valid/true
         // otherwise set it to non-valid/false
  
         // check if contains number
         // if it does contain number, set our custom `numberValidator`  to valid/true
         // otherwise set it to non-valid/false
         if (/^[0-9]*$/.test(ngModelValue)) {
             ctrl.$setValidity('numberValidator', true);
         } else {
             ctrl.$setValidity('numberValidator', false);
         }
 
         // check if the length of our input is exactly 6 characters
         // if it is 6, set our custom `sixCharactersValidator` to valid/true
         // othwise set it to non-valid/false
 
 
         // we need to return our ngModelValue, to be displayed to the user(value of the input)
         return ngModelValue;
     }
 
     // we need to add our customValidator function to an array of other(build-in or custom) functions
     // I have not notice any performance issues, but it would be worth investigating how much
     // effect does this have on the performance of the app
     ctrl.$parsers.push(customValidator);
     
 }
    };
 })
*/

// /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

.directive('onlyNumber', function (){ 
    return {
       require: 'ngModel',
       link: function(scope, elem, attr, ngModel) {
           //var blacklist = attr.blacklist.split(',');
            ngModel.$validators.onlyNumber = function(modelValue,viewValue){
                var myValue = modelValue || viewValue;
                // console.log(myValue);

                if (/^[0-9]*$/.test(myValue)) {
                   ngModel.$setValidity('numberValidator', true);
                   return true;
                } else {
                    ngModel.$setValidity('numberValidator', false);
                    return false;
                }
           }
        }
    };
 })



.directive('emailValida', function (){ 
    return {
       require: 'ngModel',
       link: function(scope, elem, attr, ngModel) {
           //var blacklist = attr.blacklist.split(',');
            ngModel.$validators.emailValida = function(modelValue,viewValue){
                var myValue = modelValue || viewValue;
                // console.log(myValue);

                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(myValue)) {

                
                   ngModel.$setValidity('emailValidator', true);
                   return true;
                
                } else {
                    ngModel.$setValidity('emailValidator', false);
                    return false;
                }
      
                
           }
        }
    };
 })



 .directive('datanascitaValida', function (){ 
    return {
       require: 'ngModel',
       link: function(scope, elem, attr, ngModel) {
           //var blacklist = attr.blacklist.split(',');
            ngModel.$validators.datanascitaValida = function(modelValue,viewValue){
                var myValue = modelValue || viewValue;
                // console.log(myValue);

                if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(myValue)) {

                    var anno = parseInt(myValue.substr(6),10);
                    var mese = parseInt(myValue.substr(3, 2),10);
                    var giorno = parseInt(myValue.substr(0, 2),10);

                    // console.log(anno, mese, giorno, myValue);
                    var newData = new Date(anno, mese-1, giorno);
                    // console.log(newData.getFullYear(), newData.getMonth()+1, newData.getDate());
                    // console.log(newData.getFullYear() == anno);
                    // console.log((newData.getMonth()+1) == mese);
                    // console.log((newData.getDate() == giorno));


                    if ( (newData.getFullYear() == anno) && ((newData.getMonth()+1) == mese) && (newData.getDate() == giorno) ) {
                        ngModel.$setValidity('dateValidator', true);    
                        return true;
                    } else {
                        ngModel.$setValidity('dateValidator', false);
                        return false;
                    }

                } else {
                    ngModel.$setValidity('dateValidator', false);
                    return false;
                }
      
           }
        }
    };
 })

/* 
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

*/

/*
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
*/