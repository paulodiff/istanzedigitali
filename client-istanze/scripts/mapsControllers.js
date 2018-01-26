'use strict';

/* Controllers */

// http://angular-ui.github.io/angular-google-maps

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')

.controller('MapsController', 
             ['$scope', '$state', '$compile','$location', 'Restangular', 'uiGmapGoogleMapApi', '$filter', 'Session', '$ionicModal','$ionicSideMenuDelegate','$ionicPopover', '$ionicPopup', '$ionicLoading', '$log', '$timeout', 'ENV','$interval',
     function( $scope,   $state,   $compile,  $location,    Restangular,  uiGmapGoogleMapApi ,  $filter,   Session,   $ionicModal,  $ionicSideMenuDelegate,    $ionicPopover,  $ionicPopup,    $ionicLoading, $log,   $timeout,   ENV, $interval) {
 

      // gestione modal popup i filtri --------------------------------------------------
      $ionicModal.fromTemplateUrl('templates/mapsOptionsModal.html', function(sortModal) {
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

      $scope.mapsOptionsApply = function() {
        $log.debug('MapsController: Apply ...');
        $log.debug($scope.filterCriteria); 
        $scope.sortModal.hide();
        $scope.refreshMap();
      };

      $scope.staticMarker = [];
      $scope.randomMarkers = [];
      $scope.refreshTime = $filter('date')( new Date(), "dd/MM/yyyy HH:mm"),

      $log.debug($scope.refreshTime);


      uiGmapGoogleMapApi.then(function(maps) {
        $log.log('uiGmapGoogleMapApi then . ...');

        $scope.map = { center: { latitude: 44.0357100000, longitude: 12.5573200000 }, zoom: 12 };
        $scope.refreshMap();

/*
$scope.randomMarkers = [
        {
          id: 1,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0668100000,
          longitude: 12.5173200000,
          showWindow: false,
          options: {
            labelContent: '0152',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        },
        {
          id: 2,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0768100000,
          longitude: 12.5473200000,
          showWindow: false,
          options: {
            labelContent: '0022',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        },
        {
          id: 3,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0358300000,
          longitude: 12.5573500000,
          showWindow: false,
          options: {
            labelContent: '0025',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        }
        
      ];
*/
/*

        $scope.staticMarker = {
          id: 0,
          title : 'Title',
          coords: {
            latitude: 44.0358300000,
            longitude: 12.5573500000
          },
          options: { 
            draggable: true,
            labelContent: 'Markers id 3',
            labelAnchor: "26 0",
            labelClass: "marker-labels"
          },
          events: {
            dragend: function (marker, eventName, args) {
              $log.log('marker dragend');
              $log.log(marker.getPosition().lat());
              $log.log(marker.getPosition().lng());
            }
          }
        };

*/


      });

      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };


  $scope.filterCriteria = {
    //pageNumber: 1,
    //count: 0,
    //limit: $scope.pageSize,
    numPosTracking: 10,
    soloPattuglie: true,
    infoTraffico: true,
    timeInterval: 10, // minuti di validità
    qDateUp: $filter('date')( new Date(2015, 6, 20), "yyyyMMdd"),
    qDateDw: $filter('date')( new Date(2015, 6, 20), "yyyyMMdd"),
    table : 'coord_' + $filter('date')(new Date(), "yyyyMM"),

    //start: 0,
    //sortDir: 'asc',
    //sortedBy: 'id',
    //id_utenti_selezione : Session.isAdmin ? 0 : Session.id_utenti,
    //mese_selezione : 0,
    //anno_selezione: 0
  };


  

  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.refreshMap = function () {
      $log.debug('MapsController: refreshMap');
      $log.debug('MapsController: impostazione criteri di filtro');

      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      //$scope.filterCriteria.start = offset_page;
      //$scope.filterCriteria.qDate =$filter('date')($scope.frmData.dateFilter, "yyyyMMdd");

      // build filter criterra


      if (ENV.mapsdemo) {
        var fakeToday = new Date(2015,7,14,11,11,11,0);
      } else {
        var fakeToday = new Date();
      }

      $log.debug('Map for : '+ fakeToday);


      var yesterday = new Date();
      yesterday.setDate(fakeToday.getDate());      
      yesterday.setMinutes(fakeToday.getMinutes() - $scope.filterCriteria.timeInterval);

      $scope.filterCriteria.qDateUp = $filter('date')( fakeToday, "yyyyMMdd@HHmmss");
      $scope.filterCriteria.qDateDw = $filter('date')( yesterday, "yyyyMMdd@HHmmss");



       var d1 = fakeToday;
       var n1 = d1.getHours();
       var n2 = '';

       var m1 = d1.getMinutes();
       var m2 = '';

/*
       if (n1 == 0) {
          n2 = 23;
          var yesterday = new Date();
          yesterday.setDate(fakeToday.getDate() - 1);
          $scope.filterCriteria.qDateUp = $filter('date')( yesterday, "yyyyMMdd@HHmmss");
          $scope.filterCriteria.qDateDw = $filter('date')( fakeToday, "yyyyMMdd@HHmmss");
        } else {
          n2 = n1 - 1;
          $scope.filterCriteria.qDateUp = $filter('date')( fakeToday, "yyyyMMdd@HHmmss");
          $scope.filterCriteria.qDateDw = $filter('date')( fakeToday, "yyyyMMdd@HHmmss");
        }
*/

      $log.debug($scope.filterCriteria);

      $log.debug('MapsController...fetchResult - GET Count');
    

      function getRandomColor() {
          var letters = '0123456789ABCDEF'.split('');
          var color = '#';
          for (var i = 0; i < 6; i++ ) {
              color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
      }

      var serviziList = Restangular.all('getPosizioni');
      
      // Get items ...  
      $log.debug('MapsController...fetchResult - GET data');
      //$scope.filterCriteria.count = 0; // imposta la selezione standard sul server
      $ionicLoading.show({template: 'Dati in arrivo!' });
      return serviziList.getList($scope.filterCriteria).then(function(data) {
               
                //$log.debug(data);
          
                var fast_array = []; // contiene le ultime posizioni
                var fast_path = []; // contiene i percorsi
                var iteratorId = 1;
          
                //loop per modificare e preparare i dati in arrivo

                $log.debug('MapsController .. preparing data... to view');
                data.forEach(function (idata) {
                    //$log.debug(idata);
                    //$scope.items.push(idata);
                    //if(idata.annullato_servizi == 1) idata.image_class="icon ion-close-circled assertive";
                    //if((idata.id_rapporto_valido_servizio != null) && (idata.annullato_servizi == 0)) idata.image_class="icon ion-share balanced";
                    //if((idata.id_rapporto_valido_servizio == null) && (idata.annullato_servizi == 0)) idata.image_class="icon ion-checkmark balanced";

                    //20150720@111555
                    
                    if (iteratorId < 1000) {
                   
                      var text2display = 'Nessuna informazione!';
                      var iconPath = '';

                      if (idata.InfoPattuglie.length){
                        text2display = idata.InfoPattuglie[0].nome + "<br>"  +  idata.InfoPattuglie[0].equipaggio_completo;
                      } 

                      // Se esiste un intervento in corso per la seguente pattuglia
                      if (idata.Intervento.length){
                          text2display =  text2display +  "<br>" +  idata.Intervento[0].tipo_segnalazione + "<br>" + idata.Intervento[0].descrizione_breve + "<br>" + idata.Intervento[0].evento_indirizzo1;
                          iconPath = 'images/red-dot.png';
                      } else {
                        iconPath = 'images/blue-dot.png';
                      }



                      fast_array.push(
                          {
                              "id": iteratorId,
                              "latitude": idata.LatitD,
                              "longitude": idata.LongiD,
                              "text2display": text2display,
                              "options": {
                                "icon" : iconPath,
                                "labelContent": idata.CodiceRadio,
                                "labelAnchor": "22 0",
                                "labelClass": "marker-labels",
                                "draggable": false
                              }

                              //"showWindow": false
                              /*,
                              "options": {
                                 "labelContent": idata.CodiceRadio,
                                 "labelAnchor": idata.CodiceRadio,
                                 "labelClass": "marker-labels"
                              }
                              */
                          }
                      );


                      var curr_path = [];
                      for (var i = 0; i < idata.Percorso[0].rows.length; i++){

                        curr_path.push(
                            {
                              latitude: idata.Percorso[0].rows[i].LatitD,
                              longitude: idata.Percorso[0].rows[i].LongiD
                            }
                          );
                      }


                      

                      fast_path.push(
                        {
                          id: iteratorId,
                          path: curr_path,
                          stroke: {
                              color: getRandomColor(),
                              weight: 3
                          },
                          editable: false,
                          draggable: false,
                          geodesic: true,
                          visible: true,
                          icons: [{
                              icon: {
                                  path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                              },
                          offset: '25px',
                          repeat: '50px'
                          }]
                        }

                      );

                    }

                    iteratorId = iteratorId + 1;
                    
                });
                
                //$log.debug(fast_array);
                //$log.debug(fast_path);

                $scope.randomMarkers = fast_array;
                $scope.polylines = fast_path;
                //$log.debug($scope.randomMarkers);
          
                $log.debug(' .. data loaded! : ' + iteratorId);

                $ionicLoading.hide();  

                if (iteratorId == 1 ) {

                  var alertPopup = $ionicPopup.alert({
                    title: 'Errore nel recupero dei dati',
                    template: 'Non ci sono dati da visualizzare!'
                  });
                    alertPopup.then(function(res) {
                    $log.debug('Nessun dato da visualizzare nella mappa');
                  });
                }

              
          // in caso di errore azzera la lista...      
          }, function () {
                $log.debug('Errore...azzero la lista');
                $scope.items = [];
      });
                    
 };

$log.debug('define .. $interval(function() {}, 10);');
$interval(function() {
  $log.debug('$interval............ refreshMap');
  $scope.refreshTime = $filter('date')( new Date(), "dd/MM/yyyy HH:mm"),
  $scope.refreshMap();
}, 60000);


      $scope.refreshMapFAKE = function () {

        $log.log('refreshMap ...');

    $ionicLoading.show({template: 'Aggiornamento dati'});


$timeout(function () {
    $ionicLoading.hide();
    


        var lt1 = 44.09 + (Math.floor(Math.random() * 9) + 1) * 0.01;
        var ln1 = 12.59 + (Math.floor(Math.random() * 9) + 1) * 0.01;

        $log.log('refreshMap ... ' + lt1 + ' # ' + ln1 );

        //optional param if you want to refresh you can pass null undefined or false or empty arg
        $scope.randomMarkers = [
        {
          id: 1,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0357100000,
          longitude: 12.5763200000,
          showWindow: false,
          options: {
            labelContent: '00012',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        },
        {
          id: 2,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0798100000,
          longitude: 12.5173200000,
          showWindow: false,
          options: {
            labelContent: '00024',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        },
        {
          id: 3,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0358300000,
          longitude: 12.5573500000,
          showWindow: false,
          options: {
            labelContent: '00025',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        },
        {
          id: 4,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0903500000,
          longitude: 12.5343200000,
          showWindow: false,
          options: {
            labelContent: '00027',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        },
        {
          id: 5,
          //icon: 'assets/images/blue_marker.png',
          latitude: 44.0381100000,
          longitude: 12.5593900000,
          showWindow: false,
          options: {
            labelContent: '00044',
            labelAnchor: "22 0",
            labelClass: "marker-labels",
            draggable: false
          }
        }

      ];


  }, 2000);
    


    };

    }]);   
      