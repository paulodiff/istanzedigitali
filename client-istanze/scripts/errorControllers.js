angular.module('myApp.controllers')

  .controller('errorMgrCtrl', 

           ['$scope', '$stateParams', '$http',  '$rootScope', '$state','ENV', '$log', 'usSpinnerService',
    function($scope,   $stateParams, $http,     $rootScope,    $state,  ENV ,  $log,   usSpinnerService ) {

    
    $log.info('errorMgrCtrl: startUp!');
    $log.info($stateParams);

    var obj = $stateParams.response;
    
    if(!obj) {
        $scope.title = 'Non specificato';
        $scope.message = 'controllare il messaggio originale';
    } else {

        var status = (obj.status ? obj.status : '');
        var statusText = (obj.statusText ? obj.statusText : '');
        var title = ((obj.data && obj.data.title) ? obj.data.title : '');
        var message = ((obj.data && obj.data.message) ? obj.data.message : '');
        var success =  ((obj.data && obj.data.success) ? obj.data.success : '');
        if (message == '') { message = obj.message };
        if (!title) { title = obj.title };
        $scope.title = title;
        $scope.message = message;
    }
    $scope.obj = $stateParams;


  }]);


 


