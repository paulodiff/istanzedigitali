'use strict';

/* Directives */


angular.module('myApp.directives')

/*
.directive('progressbar', [function() {
    return {
        restrict: 'E',
        scope: {
            'progress': '=pbv'
        },
        controller: function($scope, $element, $attrs) {
            $element.progressbar({ value: $scope.progress  });

            $scope.$watch(function() {
                $element.progressbar({value: $scope.progress})
            })
        }
    }
}])
*/
.directive('myDirective', function(){
    return {

      restrict: 'E',
      template: [
          '<b>From directive scope:</b> {{ directivevariable }}<br/>',
          '<b>From directive controller:</b> {{ vm.controllerVariable }} - {{ vm.controllerCounter }} <br/>',
          '<b>Adapted by directive controller:</b> {{ vm.controllerAdapted }}  <br/>',
          '<b>Test Parent Scope:</b> {{ vm.model.nomeRichiedente }}  <br/>',
          '<button class="Button Button--info u-text-r-xs" ng-click="vm.addItem()">INTERNAL</button></div>'
        ].join(''),
      scope: {
      },
      bindToController: {
        directivevariable: '=',
        directivefunction: '&'
      },
      controller: function(){
        var vm = this;
        vm.controllerCounter = 0;
        vm.controllerVariable = 'Hi, I am from the controller';
        vm.controllerAdapted = vm.directivevariable + '(ctrl adapted)';

        console.log('directive init parameters');
        console.log(vm.directivevariable);
        console.log(vm.directivefunction());

        vm.addItem = function () {
            vm.controllerCounter = vm.controllerCounter + 1;
            console.log('INTERNAL add Item click', vm.controllerCounter);
            vm.directivefunction();
            scope.$apply(function(){
                vm.model.scope.text = '2';
           });
        };


      },
      controllerAs: 'vm'
    }
  })


// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_progressbar_3
 .directive('crProgressBar', function() {
    return {
        restrict: 'EA', //attribute or element
        scope: {
            p1: '=',
            t1: '=',
            f1: '&'
           //bindAttr: '='
          },
          template: '<div class="u-background-20 u-padding-all-s u-text-r-xxl">' + 
                    '<progress value="{{p1}}" max="1000"></progress></br>' +
                    '<small>{{t1}}</small></br>' +
                    // '<button class="Button Button--info u-text-r-xs" ng-click="addItem()">ADD(int)</button>' + 
                    // '<button class="Button Button--info u-text-r-xs" ng-click="resetItem()">RESET(int)</button>' + 
                    '</div>',
          /*
          template: '<div class="u-text-r-xxl u-padding-all-s u-background-60"><input ng-model="progressBarValue">' +
          '<progress max="100" value="80"></progress></div>',
          */
          replace: true,
          //require: 'ngModel',
          link: function($scope, element, attrs, ctrl) {

            element.on('click', function () {
                // console.log('click');
                // element.html('You clicked me!');
            });
            element.on('mouseenter', function () {
                // console.log('mouseenter');
                // $scope.f1();
                // console.log($scope.progressBarValue);
                // $scope.progressBarFunction();
            });
            element.on('mouseleave', function () {
                // console.log('mouseleave');
                // $scope.progressBarFunction();
            });

            // var elem = angular.element(document.querySelector('#klik'))
            // angular.element(elem).triggerHandler('click');
            
            //var textField = $('input', elem).attr('ng-model', 'myDirectiveVar');
            // $compile(textField)($scope.$parent);

          },
          controller: function($scope) {
            
            console.log('INIT directive');
            console.log($scope.progressBarValue);
            console.log($scope.p1);

            $scope.addItem = function () {
                console.log('INTERNAL add Item click');
                console.log($scope.progressBarValue);
                console.log($scope.progressBarValue2);
                console.log($scope.progressBarFunction);
                console.log($scope.p1);
                console.log($scope.p2);
   
                $scope.p1 = $scope.p1 + 1;

                $scope.f1();
                // $scope.$apply(function(){
                //     $scope.progressBarFunction();
                // });
            };

            $scope.resetItem = function () {
                console.log('Reset INTERNAL');
   
                $scope.p1 = 0;
                console.log($scope.p1);

                $scope.f1();
                // $scope.$apply(function(){
                //     $scope.progressBarFunction();
                // });
            };


          }
    };
  })

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      console.log('appVersion');
      elm.text(version);
    };
  }])

.directive('formlyExampleDirective', function() {
    return {
      templateUrl: 'templates/formly-directive-template.html'
    };
 })


.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
})


.directive('browserVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
            var agentStr = navigator.userAgent;
            this.IsIE = false;
            this.IsOn = undefined;  //defined only if IE
            this.Version = undefined;
            console.log('browserVersion');

        if (agentStr.indexOf("MSIE 7.0") > -1) {
          this.IsIE = true;
          this.IsOn = true;
          if (agentStr.indexOf("Trident/6.0") > -1) {
            this.Version = 'IE10';
          } else if (agentStr.indexOf("Trident/5.0") > -1) {
            this.Version = 'IE9';
          } else if (agentStr.indexOf("Trident/4.0") > -1) {
            this.Version = 'IE8';
          } else {
            this.IsOn = false; // compatability mimics 7, thus not on
            this.Version = 'IE7';
          }
        } //IE 7
  };
  }])

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.directive('fancySelect', [ '$ionicModal',function($ionicModal) 
            {
            return {
                /* Only use as <fancy-select> tag */
                restrict : 'E',

                /* Our template */
                templateUrl: 'templates/fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items'        : '=', /* Items list is mandatory */
                    'text'         : '=', /* Displayed text is mandatory */
                    'value'        : '=', /* Selected value binding is mandatory */
                    'callback'     : '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText    = attrs.headerText || '';
                    scope.labelText     = attrs.labelText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText   = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText      = attrs.noteText || '';
                    scope.noteImg       = attrs.noteImg || '';
                    scope.noteImgClass  = attrs.noteImgClass || '';
                    
                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here : 
                     * 
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector. 
                     * 
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view. 
                     * 
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     * 
                     * Also, seems that animations do not work 
                     * anymore.
                     * 
                     */
                    $ionicModal.fromTemplateUrl(
                        'templates/fancy-select-items.html',
                          {'scope': scope}
                    ).then(function(modal) {
                        scope.modal = modal;
                    });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id+',';
                                    scope.text = scope.text + '\r' + item.text+', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0,scope.value.length - 1);
                            scope.text = scope.text.substr(0,scope.text.length - 2);
                            
                            console.log('#DIRECTIVE#Fancy#value:'+  scope.value);
                            console.log('#DIRECTIVE#Fancy#text:'+  scope.text);
                            
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();
                        
                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }

                    /* Show list */
                    scope.showItems = function (event) {
                        event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();
                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function() {
                      scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;

                        // Hide items
                        scope.hideItems();
                        
                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }
                }
            };
        }
    ]
);