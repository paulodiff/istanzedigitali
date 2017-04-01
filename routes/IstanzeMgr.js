// Modulo Gestione Istanze

var express = require('express');
var router = express.Router();
//var request = require('request');
var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var jwt = require('jwt-simple');
var ENV   = require('../config.js'); // load configuration data
//var Segnalazione  = require('../models/segnalazione.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var log = require('../models/loggerModule.js');

var _ = require('lodash');
var models = require("../modelsSequelize");

module.exports = function(){


router.get('/getList', utilityModule.ensureAuthenticated, function(req, res) {
      console.log('/getList .... ');
      console.log(req.query);
      console.log(req.user);
      var pagesize = parseInt(req.query.pageSize); 
      var n =  parseInt(req.query.currentPage);
      var collection = mongocli.get().collection('segnalazioni');
      var rand = Math.floor(Math.random()*100000000).toString();
      //db.users.find().skip(pagesize*(n-1)).limit(pagesize)
      var searchCriteria = { "userData.userProvider": req.user.userProvider, $and: [ { "userData.userId": req.user.userId } ] };

      collection.find( searchCriteria ).skip(pagesize*(n-1)).limit(pagesize).toArray(function(err, docs) {
        console.log("Found the following records ... ");
        //console.dir(err);
        console.log(err);
        if(err){
            res.status(500).json(err);
        }else{
            res.status(201).json(docs);
        }
      });      
});


router.post('/task-add', function(req, res) {
    models.Tasks
        .build({
            title: utilityModule.getTimestampPlusRandom(),
            completed: false})
        .save()
        .then(function() {
          models.Tasks.findAll({}).then(function(taskList) {
                return res.status(200).json(taskList);
            });
        });
});

router.get('/task-list', function(req, res) {
    models.Tasks.findAll({}).then(function(taskList) {
                return res.status(200).json(taskList);
    });
});

router.post('/spidlog-add', function(req, res) {
    models.SpidLog
        .build({
            issuer: utilityModule.getTimestampPlusRandom(),
            userid: '100'})
        .save()
        .then(function() {
          models.SpidLog.findAll({}).then(function(taskList) {
                return res.status(200).json(taskList);
            });
        });
});

router.get('/spidlog-list', function(req, res) {
  console.log(models);
    models.SpidLog.findAll({}).then(function(taskList) {
                return res.status(200).json(taskList);
    });
});

router.post('/create', function(req, res) {
  console.log(req.body.DICHIARANTI);
  console.log(req.body.NUCLEOFAMILIARE);
  console.log(req.body.UPLOADFILE);
  models.Person
        .build({
            email: req.body.DICHIARANTI.dichiarantePadre,
            title: req.body.DICHIARANTI.dichiaranteMadre,
            name: 'name',
            Blobs : req.body.UPLOADFILE,
            Tasks : [
              { title : 't1', completed : false},
              { title : 't2', completed : true}
              ],
            
            Nucleos: req.body.NUCLEOFAMILIARE,
            },
          {
             include: [ models.Tasks, models.Nucleos, models.Blobs ]
          })
        .save()
        .then(function() {
            models.Person.findAll({
                              include: [{
                                  model: models.Tasks
        //where: { state: Sequelize.col('project.state') }
                                        },
                                      {
                                  model: models.Nucleos
        //where: { state: Sequelize.col('project.state') }
                                        },
                                      {
                                  model: models.Blobs
        //where: { state: Sequelize.col('project.state') }
                                        },

                                        ]
                              }).then(function(taskList) {
                return res.status(200).json(taskList);
            });
        })
        .catch(function(error) {
          console.log(error);
          return res.status(500).json(error);
        });

});


  return router;
}