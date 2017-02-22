//var Promise = require('bluebird');
//var redis = require('redis');
//https://www.terlici.com/2015/04/03/mongodb-node-express.html
var MongoClient = require('mongodb').MongoClient;
var MongoDb = require('mongodb');
var log4js  = require('log4js');
var logger  = log4js.getLogger();

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done();
  console.log('mongocli2:connecting:'+url);
  logger.info('mongocli2:connecting:'+url);
  MongoClient.connect(url, function(err, db) {
    if (err) return done(err);
    logger.info('mongocli2:connected!');
    state.db = db;
    done();
  })
}

exports.get = function() {
  return state.db;
}

exports.ObjectID = function(params) {
  return new MongoDb.ObjectID(params); 
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      state.mode = null;
      done(err);
    })
  }
}