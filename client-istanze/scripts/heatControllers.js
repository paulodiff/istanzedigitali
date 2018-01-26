'use strict';

/* Controllers */

// http://angular-ui.github.io/angular-google-maps

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('HeatLegendController', 
             ['$scope', '$rootScope', '$state', '$compile','$location', 'Restangular', 'uiGmapGoogleMapApi', '$filter', 'Session', '$ionicModal','$ionicSideMenuDelegate','$ionicPopover', '$ionicPopup', '$ionicLoading', '$log', '$timeout', 'ENV',
     function( $scope, $rootScope,  $state,   $compile,  $location,    Restangular,  uiGmapGoogleMapApi ,  $filter,   Session,   $ionicModal,  $ionicSideMenuDelegate,    $ionicPopover,  $ionicPopup,    $ionicLoading, $log,   $timeout, ENV) {

     $scope.legend = {}; 
     $scope.legend.CodiceRadio = 'XX'; 
     $scope.legend.raggio = 'XX'; 
     $scope.legend.opacita = 'XX'; 
     $scope.controlClick = function() {console.log('ddd');};
     $rootScope.$on("UpdateFilterData", function(event, message) {
        console.log('UpdateFilterData');
        console.log(message);
        $scope.legend.CodiceRadio = message.CodiceRadio;
        $scope.legend.opacita = message.opacita;
        $scope.legend.raggio = message.raggio;
     });
     console.log('INIT - HeatLegendController');

}])

.controller('HeatController', 
             ['$scope', '$rootScope', '$state', '$compile','$location', 'Restangular', 'uiGmapGoogleMapApi', '$filter', 'Session', '$ionicModal','$ionicSideMenuDelegate','$ionicPopover', '$ionicPopup', '$ionicLoading', '$log', '$timeout', 'ENV', '$http',
     function( $scope, $rootScope,  $state,   $compile,  $location,    Restangular,  uiGmapGoogleMapApi ,  $filter,   Session,   $ionicModal,  $ionicSideMenuDelegate,    $ionicPopover,  $ionicPopup,    $ionicLoading, $log,   $timeout, ENV, $http) {
 

      $scope.elencoTipiIntervento =[
        {
          id : 100,
          text: '101 Sopralluogo',
          checked: false, 
          icon: null
        },
        {
          id : 200,
          text: '201 Sopralluogo 2',
          checked: false, 
          icon: null
        },
        {
          id : 300,
          text: '301 Sopralluogo 3',
          checked: false, 
          icon: null
        }
      ];

      // gestione modal popup i filtri --------------------------------------------------
      $ionicModal.fromTemplateUrl('templates/heatOptionsModal.html', function(sortModal) {
            $scope.sortModal = sortModal;
          },{
            scope: $scope,
            animation: 'slide-in-up'
      });

      $scope.openSortModal = function() {
        $log.debug('MapsController: Sort Modal ...');    
        $scope.sortModal.show();
      };     

      $scope.closeSortModal = function() {
        $log.debug('MapsController: Close Modal ...');    
        $scope.sortModal.hide();
      };

     $scope.applySortModal = function() {
        $log.debug('MapsController: Apply ...');
        $log.debug($scope.filterCriteria); 

        console.log($filter('date')($scope.filterCriteria.qDateUp, "yyyyMMdd"));  
        console.log($filter('date')($scope.filterCriteria.qDateDw, "yyyyMMdd"));  


        $scope.sortModal.hide();
        $scope.refreshMap();
      };


     $scope.getRandomColor = function() {
              var letters = '0123456789ABCDEF'.split('');
              var color = '#';
              for (var i = 0; i < 6; i++ ) {
                  color += letters[Math.floor(Math.random() * 16)];
              }
              return color;
      };

     $scope.clickTest = function() {
       alert('Example of infowindow with ng-click')
     };

     $log.log('HeatController then . ...');


     $scope.staticMarker = [];
     $scope.randomMarkers = [];

      function createRandomMarker(i, bounds, idKey) {
        var lat_min = bounds.southwest.latitude,
          lat_range = bounds.northeast.latitude - lat_min,
          lng_min = bounds.southwest.longitude,
          lng_range = bounds.northeast.longitude - lng_min;

        if (idKey === null)
          idKey = "id";

        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        var ret = {
          geometry: {
            type: "Point",
            coordinates: [ longitude, latitude ]
          },
          latitude: latitude,
          longitude: longitude,
          title: 'm' + i
        };
        ret[idKey] = i;
        return ret;
      }



    $scope.refreshMap = function () {
      //optional param if you want to refresh you can pass null undefined or false or empty arg
      //console.log($scope.map);
      //console.log($scope.maps);
      console.log('Refresh Map');
      $scope.map.control.refresh({ latitude: 44.0357100000, longitude: 12.5573200000});
      $scope.map.control.getGMap().setZoom(12);
      $scope.getHeatData($scope.map.layer);
      return;
    };
    

    $scope.getHeatData = function(layer){


      $log.debug('*****--------getHeatData');

/*
      // fill elencoTipiIntervento
      var tipiDocList = Restangular.all('getCroTipologie');
      tipiDocList.getList().then(function(data) {

          $log.debug('Fill tipiDocList');

           $scope.elencoTipiIntervento = [];

           data.forEach(function (idata) {

                    
            $scope.elencoTipiIntervento.push(
            {
              id: idata.CONTEGGIO,
              text: idata.TESTO,
              checked: false, 
              icon: null
            }
           );

          });
          $log.debug('Filled tipiDocList');
      });
*/


      $scope.map.layer = layer;  
      var markers = [];
      var numberOfMarkers = 100;
      var bound = {
              southwest: { latitude: 44.003957, longitude: 12.6118760 },
              northeast : { latitude: 44.086997, longitude: 12.471457 }
          };

          $log.debug('Set data filter')
          

          $scope.filterCriteria.qDateUp = $filter('date')($scope.filterCriteria.frmDataFine, "yyyyMMdd") + '@000000';  
          $scope.filterCriteria.qDateDw = $filter('date')($scope.filterCriteria.frmDataInizio, "yyyyMMdd") + '@000000';  

          $rootScope.$broadcast("UpdateFilterData", $scope.filterCriteria);


          //Restangular.setBaseUrl('/api/heat');
          var serviziList = Restangular.all('getHeat');
              
              // Get items ...  
              $log.debug('HeatController...fetchResult - GET data con filtri:');
              $log.debug($scope.filterCriteria);

              //$scope.filterCriteria.count = 0; // imposta la selezione standard sul server
              $ionicLoading.show({template: 'Dati in arrivo!<br><ion-spinner></ion-spinner>' });
              return serviziList.getList($scope.filterCriteria).then(function(data) {

                    var heatMapData = [];
                    var heatMapDataSimple = [];

                    $log.debug('MapsController .. preparing data... to view');
                    data.forEach(function (idata) {

                       //if (idata.status == "OK") {
                        //console.log(idata.location.latitude, idata.location.longitude, idata.countPoint);
                        //{location: new google.maps.LatLng(37.782, -122.447), weight: 0.5}
                        var itemG = {};
                        itemG.location = new google.maps.LatLng(idata.location.latitude, idata.location.longitude);
                        itemG.weight = idata.countPoint;
                        heatMapData.push(itemG);
                        //heatMapDataSimple.push(idata.latitude, idata.longitude);
                        //console.log('new google.maps.LatLng(' + idata.latitude + ',' + idata.longitude + ')' );
                       //}
                    });
                    
                    //$log.debug(heatMapDataSimple);
                    //$log.debug(taxiData);
                    var pointArray = new google.maps.MVCArray(heatMapData);
                    //var pointArray = new google.maps.MVCArray(taxiData);
                    layer.setData(pointArray);
                    layer.set('radius', $scope.filterCriteria.raggio);
                    layer.set('opacity', $scope.filterCriteria.opacita);
                    var gradient = [
                        'rgba(0, 255, 255, 0)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(0, 191, 255, 1)',
                        'rgba(0, 127, 255, 1)',
                        'rgba(0, 63, 255, 1)',
                        'rgba(0, 0, 255, 1)',
                        'rgba(0, 0, 223, 1)',
                        'rgba(0, 0, 191, 1)',
                        'rgba(0, 0, 159, 1)',
                        'rgba(0, 0, 127, 1)',
                        'rgba(63, 0, 91, 1)',
                        'rgba(127, 0, 63, 1)',
                        'rgba(191, 0, 31, 1)',
                        'rgba(255, 0, 0, 1)'
                    ];
                    layer.set('gradient', gradient);

                    $log.debug(pointArray);
                    $ionicLoading.hide();  
                        
                  // in caso di errore azzera la lista...      
                  }, function () {
                    $scope.items = [];
          });


      /* SAMPLE DATA GENERATOR
     for (var i = 0; i < numberOfMarkers; i++) {
          markers.push(createRandomMarker(i, bound));
      }
      
      
      var heatMapData = [];
      for (var j = 0; j < markers.length; j++){
          //console.log(markers[j]);
          heatMapData.push(new google.maps.LatLng(markers[j].latitude, markers[j].longitude));
      }
      //console.log(heatMapData);
      */

      
     
    };
    

    uiGmapGoogleMapApi.then(function(maps) {
        $log.log('uiGmapGoogleMapApi then . ...');

        $scope.googleVersion = maps.version;

        //$scope.map = { center: { latitude: 44.0357100000, longitude: 12.5573200000 }, zoom: 12 };
        maps.visualRefresh = true;

        angular.extend($scope, {
          map: { 
          center: { latitude: 44.0357100000, longitude: 12.5573200000 }, 
          zoom: 12,
          control: {},
          showHeat: true,
          heatLayerCallback: function (layer) {
                //set the heat layers backend data
              var mockHeatLayer = new MockHeatLayer(layer);
          },
          
          // NE bound Latitude - Longitude: 44.086997,12.471457
          // SW bound Latitude - Longitude: 44.003957,12.611876
          
          bounds: {
              southwest: { latitude: 44.003957, longitude: 12.6118760 },
              northeast : { latitude: 44.086997, longitude: 12.471457 }
          }
         
        }
        });


        //$scope.refreshMap();

      }); //chiude uiGmapGoogleMapApi.then



  $scope.filterCriteria = {
    //pageNumber: 1,
    //count: 0,
    //limit: $scope.pageSize,
    frmDataFine : new Date(2015, 12, 31),
    frmDataInizio : new Date(2015, 1, 1),
    qDateUp : '',
    qDateDw : '',
    tipo_segnalazione : '0106 Contr veicoli in sosta',
    opacita : 0.5,
    raggio : 10,
    table : 'coord_201507',
    soloPattuglie : true,
    tipo_intervento : '',
    CodiceRadio : '00531',
    desc_intervento : ''
    //start: 0,
    //sortDir: 'asc',
    //sortedBy: 'id',
    //id_utenti_selezione : Session.isAdmin ? 0 : Session.id_utenti,
    //mese_selezione : 0,
    //anno_selezione: 0
  };


  

  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.refreshMap1 = function () {
      $log.debug('MapsController: fetchResult');
      $log.debug('MapsController: impostazione criteri di filtro : ' + ENV.mapsdemo);

      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      //$scope.filterCriteria.start = offset_page;
      //$scope.filterCriteria.qDate =$filter('date')($scope.frmData.dateFilter, "yyyyMMdd");

      // build filter criterra
      /*
      if (ENV.mapsdemo == true) {
        var fakeToday = new Date(2015,6,7,11,11,11,0);
      } else {
        var fakeToday = new Date();
      }


      var yesterday = new Date(fakeToday.getTime());
      yesterday.setMinutes(fakeToday.getMinutes() - 30);

      $log.debug('MapsController: ' + fakeToday);
      $log.debug('MapsController: ' + yesterday);

      $scope.filterCriteria.qDateUp = $filter('date')( fakeToday, "yyyyMMdd@HHmmss");
      $scope.filterCriteria.qDateDw = $filter('date')( yesterday, "yyyyMMdd@HHmmss");

      var d1 = fakeToday;
      var n1 = d1.getHours();
      var n2 = '';
      var m1 = d1.getMinutes();
      var m2 = '';
      */


      $log.debug($scope.filterCriteria);

      $log.debug('MapsController...fetchResult - GET Count');
    


      var serviziList = Restangular.all('getHeat');
      
      // Get items ...  
      $log.debug('HeatController...fetchResult - GET data');
      //$scope.filterCriteria.count = 0; // imposta la selezione standard sul server
      $ionicLoading.show({template: 'Dati in arrivo!' });
      return serviziList.getList($scope.filterCriteria).then(function(data) {
               
          
                var fast_array = []; // contiene le ultime posizioni
                var fast_path = []; // contiene i percorsi
    
                $log.debug('MapsController .. preparing data... to view');
                data.forEach(function (idata) {
                   
                      fast_array.push(
                          {
                              "id": iteratorId,
                              "latitude": idata.LatitD,
                              "longitude": idata.LongiD,
                              "icon": 'images/map-blue.png',
                              "text2display": 'Testo' + iteratorId + ' - ' + idata.CodiceRadio
                         }
                      );
               
                });
                
     
  

            $scope.randomMarkers = fast_array;
            $scope.polylines = fast_path;
            $log.debug($scope.randomMarkers);
          
                $log.debug(' .. data loaded!');
                $ionicLoading.hide();  
              
          // in caso di errore azzera la lista...      
          }, function () {
                $scope.items = [];
      });
          

          
 };

}]);      