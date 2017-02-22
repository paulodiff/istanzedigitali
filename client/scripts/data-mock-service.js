'use strict';
angular.module('myApp.mockService', [])
.service('DataMockModule', function DataMockModule() {
    this.data = [
  {
    "counter": 0,
    "guid": "25861582-65a4-4567-835e-ae10e7ecf944",
    "userName": "Ashley",
    "ipAddess": "100.102.90.200",
    "isActive": true,
    "balance": "$1,838.59",
    "picture": "http://placehold.it/32x32",
    "age": 40,
    "name": "Jeannette Mccormick",
    "gender": "female",
    "company": "MUSAPHICS",
    "email": "jeannettemccormick@musaphics.com",
    "phone": "+1 (956) 512-2572",
    "address": "597 Brigham Street, Delco, Montana, 6083",
    "registered": "2014-03-06T02:39:41",
    "inserted": "2015-02-21T07:38:20",
    "latitude": 32.955507,
    "longitude": 152.868777
  },
  {
    "counter": 1,
    "guid": "156454a3-48f4-495c-9b77-6830645f3916",
    "userName": "Gross",
    "ipAddess": "100.102.90.200",
    "isActive": true,
    "balance": "$1,384.82",
    "picture": "http://placehold.it/32x32",
    "age": 36,
    "name": "Henry Francis",
    "gender": "male",
    "company": "EMTRAK",
    "email": "henryfrancis@emtrak.com",
    "phone": "+1 (920) 464-2820",
    "address": "351 Strickland Avenue, Felt, Virginia, 4699",
    "registered": "2014-08-20T04:05:38",
    "inserted": "2015-04-02T09:18:28",
    "latitude": -74.130888,
    "longitude": -2.465771
  },
  {
    "counter": 2,
    "guid": "732328c7-1a63-45cd-9301-35d9f962e340",
    "userName": "Miles",
    "ipAddess": "100.102.90.197",
    "isActive": false,
    "balance": "$1,128.11",
    "picture": "http://placehold.it/32x32",
    "age": 39,
    "name": "Natalia Brennan",
    "gender": "female",
    "company": "ISOTRONIC",
    "email": "nataliabrennan@isotronic.com",
    "phone": "+1 (959) 430-3813",
    "address": "260 Blake Avenue, Nash, Arizona, 9062",
    "registered": "2015-02-07T20:02:00",
    "inserted": "2015-01-22T09:25:53",
    "latitude": 65.906242,
    "longitude": -20.763697
  },
  {
    "counter": 3,
    "guid": "4c71f705-aa04-4952-96b2-fb6653efafc2",
    "userName": "Ofelia",
    "ipAddess": "100.102.90.195",
    "isActive": true,
    "balance": "$3,592.41",
    "picture": "http://placehold.it/32x32",
    "age": 25,
    "name": "Sharon Hammond",
    "gender": "female",
    "company": "QUARX",
    "email": "sharonhammond@quarx.com",
    "phone": "+1 (930) 429-2725",
    "address": "749 Banker Street, Glenville, Nebraska, 8332",
    "registered": "2014-07-16T17:16:52",
    "inserted": "2015-05-20T22:09:47",
    "latitude": 84.753539,
    "longitude": -7.077866
  },
  {
    "counter": 4,
    "guid": "a58424fa-5890-406c-aefb-b5da93ca95b7",
    "userName": "Danielle",
    "ipAddess": "100.102.90.186",
    "isActive": true,
    "balance": "$3,693.47",
    "picture": "http://placehold.it/32x32",
    "age": 35,
    "name": "Bettie Callahan",
    "gender": "female",
    "company": "TURNLING",
    "email": "bettiecallahan@turnling.com",
    "phone": "+1 (869) 592-2932",
    "address": "937 Norman Avenue, Whitewater, Missouri, 6508",
    "registered": "2014-12-27T22:41:03",
    "inserted": "2015-01-11T02:33:34",
    "latitude": 51.971576,
    "longitude": 93.860054
  },
  {
    "counter": 5,
    "guid": "da75addd-d686-4523-b6a2-216fbb913402",
    "userName": "Myers",
    "ipAddess": "100.102.90.197",
    "isActive": true,
    "balance": "$1,582.19",
    "picture": "http://placehold.it/32x32",
    "age": 23,
    "name": "Mann Shannon",
    "gender": "male",
    "company": "EMPIRICA",
    "email": "mannshannon@empirica.com",
    "phone": "+1 (958) 429-2192",
    "address": "525 Hart Street, Salix, Washington, 7936",
    "registered": "2014-03-06T04:01:39",
    "inserted": "2015-02-17T11:12:50",
    "latitude": -34.1011,
    "longitude": -94.617387
  },
  {
    "counter": 6,
    "guid": "3cc367ab-d10e-4438-89ff-ff126714ad77",
    "userName": "Mara",
    "ipAddess": "100.102.90.197",
    "isActive": false,
    "balance": "$3,046.06",
    "picture": "http://placehold.it/32x32",
    "age": 32,
    "name": "Elva Kelly",
    "gender": "female",
    "company": "APPLIDEC",
    "email": "elvakelly@applidec.com",
    "phone": "+1 (823) 482-2447",
    "address": "853 Broome Street, Nicholson, Puerto Rico, 2540",
    "registered": "2015-04-28T22:17:17",
    "inserted": "2015-06-08T06:01:00",
    "latitude": 47.615483,
    "longitude": 60.151225
  },
  {
    "counter": 7,
    "guid": "b0dcfe7f-0588-467c-a307-631dd642fa9f",
    "userName": "Frankie",
    "ipAddess": "100.102.90.194",
    "isActive": false,
    "balance": "$1,486.95",
    "picture": "http://placehold.it/32x32",
    "age": 30,
    "name": "Tucker Irwin",
    "gender": "male",
    "company": "KEGULAR",
    "email": "tuckerirwin@kegular.com",
    "phone": "+1 (978) 588-2338",
    "address": "364 Java Street, Berlin, Marshall Islands, 1641",
    "registered": "2014-10-16T02:20:39",
    "inserted": "2015-03-24T18:14:25",
    "latitude": -88.638832,
    "longitude": -65.990503
  },
  {
    "counter": 8,
    "guid": "c28e574c-d4c9-46d6-bcab-520c2e1d1158",
    "userName": "Lakisha",
    "ipAddess": "100.102.90.186",
    "isActive": false,
    "balance": "$3,243.32",
    "picture": "http://placehold.it/32x32",
    "age": 21,
    "name": "Roman Oneil",
    "gender": "male",
    "company": "FIBEROX",
    "email": "romanoneil@fiberox.com",
    "phone": "+1 (859) 403-3760",
    "address": "609 Albee Square, Idledale, Mississippi, 9492",
    "registered": "2014-10-30T04:48:37",
    "inserted": "2015-05-09T10:52:53",
    "latitude": -11.50698,
    "longitude": -9.919708
  },
  {
    "counter": 9,
    "guid": "47b80f07-6419-47c0-b734-869e708810f5",
    "userName": "Ramirez",
    "ipAddess": "100.102.90.189",
    "isActive": false,
    "balance": "$2,733.73",
    "picture": "http://placehold.it/32x32",
    "age": 30,
    "name": "Rosario Cooke",
    "gender": "male",
    "company": "TROPOLI",
    "email": "rosariocooke@tropoli.com",
    "phone": "+1 (879) 443-3041",
    "address": "876 Beekman Place, Carrizo, Ohio, 3333",
    "registered": "2014-02-20T14:43:25",
    "inserted": "2015-02-01T06:33:45",
    "latitude": -26.506874,
    "longitude": 146.35568
  }
];
    
    this.getData = function() {
        return this.data;
    };
    
    this.setData = function(data) {
        this.data = data;
    };
   
    this.findOne = function(gameid) {
        // find the game that matches that id
        var list = $.grep(this.getData(), function(element, index) {
            return (element.gameid == gameid);
        });
        if(list.length === 0) {
            return {};
        }
        // even if list contains multiple items, just return first one
        return list[0];
    };
   
    this.findAll = function() {
        return this.getData();
    };
    
    // options parameter is an object with key value pairs
    // in this simple implementation, value is limited to a single value (no arrays)
    this.findMany = function(options) {
        // find games that match all of the options
        var list = $.grep(this.getData(), function(element, index) {
            var matchAll = true;
            $.each(options, function(optionKey, optionValue) {
                if(element[optionKey] != optionValue) {
                    matchAll = false;
                    return false;
                }
            });
            return matchAll;
        });        
    };
    
    // add a new data item that does not exist already
    // must compute a new unique id and backfill in
    this.addOne = function(dataItem) {
        // must calculate a unique ID to add the new data
        var newId = this.newId();
        dataItem.gameid = newId;
        this.data.push(dataItem);
        return dataItem;
    };
    
    // return an id to insert a new data item at
    this.newId = function() {
        // find all current ids
        var currentIds = $.map(this.getData(), function(dataItem) { return dataItem.gameid; });
        // since id is numeric, and we will treat like an autoincrement field, find max
        var maxId = Math.max.apply(Math, currentIds);
        // increment by one
        return maxId + 1;
    };
    
    this.updateOne = function(gameid, dataItem) {
        // find the game that matches that id
        var games = this.getData();
        var match = null;
        for (var i=0; i < games.length; i++) {
            if(games[i].gameid == gameid) {
                match = games[i];
                break;
            }
        }
        if(!angular.isObject(match)) {
            return {};
        }
        angular.extend(match, dataItem);
        return match;
    };
    
    this.deleteOne = function(gameid) {
        // find the game that matches that id
        var games = this.getData();
        var match = false;
        for (var i=0; i < games.length; i++) {
            if(games[i].gameid == gameid) {
                match = true;
                games.splice(i, 1);
                break;
            }
        }
        return match;
    };
    
});