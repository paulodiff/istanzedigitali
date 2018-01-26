'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('PlaylistsCtrl', function($ionicPlatform, $scope, $cordovaDevice) {
    $ionicPlatform.ready(function() {
        $scope.$apply(function() {
            // sometimes binding does not work! :/
 
            // getting device infor from $cordovaDevice
            var device = $cordovaDevice.getDevice();
 
            $scope.manufacturer = device.manufacturer;
            $scope.model = device.model;
            $scope.platform = device.platform;
            $scope.uuid = device.uuid;
 
        });
 
    });
});

