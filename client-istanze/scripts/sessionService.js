
'use strict';
 
/* Fake Logon Service */

angular.module('myApp.services',[])

.service('Session', function () {
  this.create = function (data) {
    console.log('Session ....');
    console.log(data);
    this.session_data = data;
  };
  this.destroy = function () {
    console.log('Session destroy');
    this.session_data = {};
  };
  return this;
});