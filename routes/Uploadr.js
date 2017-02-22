// Route for upload

var express = require('express');
var router = express.Router();
//var request = require('request');
var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var jwt = require('jwt-simple');
var ENV   = require('../config.js'); // load configuration data
var flow = require('../models/flow-node.js')('tmp'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;
//var DW_PATH = (path.join(__dirname, './storage'));
var DW_PATH = './storage';


module.exports = function(){


router.post('/upload', multipartMiddleware, function(req, res) {
  console.log('/uploading.....');
  console.log(req.files);
  console.log('/body.....');
  console.log(req.body);

  var transactionId = req.body.fields.transactionId;
  var dir = DW_PATH + "/" +  transactionId;
  if (!fs.existsSync(dir)){fs.mkdirSync(dir);}

  if (req.files && req.files.files && req.files.files.length) {
    for (var i = 0; i < req.files.files.length; i++) {
      console.log(req.files.files[i].path);
      console.log(req.files.files[i].originalFilename);
      console.log(req.files.files[i].size);

      fs.renameSync(req.files.files[i].path, dir + "/" + req.files.files[i].originalFilename);

    }
  }
  

  res.status(200).send();

});

router.post('/uploadOld', multipartMiddleware, function(req, res) {
  console.log('/upload call $flow.post ...');
  console.log(req);
  var transactionId = req.body.transactionId;
  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log('callback POST', status, original_filename, identifier);
    console.log('status', status);
    console.log('original_filename', original_filename);
    console.log('identifier', identifier);

    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'partly_done') {
      status = 200;
    }

    if (status == 'done') {

      var dir = DW_PATH + "/" +  transactionId;
      if (!fs.existsSync(dir)){fs.mkdirSync(dir);}
      var dw_fileName = dir + "/" + original_filename;
      console.log('writing ...',dw_fileName);
      var stream = fs.createWriteStream(dw_fileName);
      flow.write(identifier, stream);
      //stream.on('data', function(data){...});
      //stream.on('finish', function(){...});
      
      status = 200;
    }

    if (status == 'invalid_flow_request')  {   status = 501;  } 
    if (status == 'non_flow_request')      {   status = 501;  } 
    if (status == 'invalid_flow_request1') {   status = 501;  } 
    if (status == 'invalid_flow_request2') {   status = 502;  } 
    if (status == 'invalid_flow_request3') {   status = 503;  } 
    if (status == 'invalid_flow_request4') {   status = 504;  } 

    res.status(status).send();
  });
});

router.options('/upload', function(req, res){
  console.log('OPTIONS');
  if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.status(200).send();
});

// Handle status checks on chunks through Flow.js
router.get('/upload', function(req, res) {
  console.log('GET / upload', status);
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log('GET', status);
    if (ACCESS_CONTROLL_ALLOW_ORIGIN) {
      res.header("Access-Control-Allow-Origin", "*");
    }

    if (status == 'found') {
      status = 200;
    } else {
      status = 204;
    }

    res.status(status).send();
  });
});

router.get('/download/:identifier', function(req, res) {
  console.log('Get /download/identifier : '+ req.params.identifier);
  flow.write(req.params.identifier, res);
});


router.get('/test', function(req, res) {
  console.log('Get /download/identifier : '+ req.params.identifier);
  res.status(200).send({ok:1});
});


/*
router.get('/map',function(req, res) {
  console.log('/map');
  
  var gUrl = "http://maps.googleapis.com/maps/api/geocode/json?address="+ req.query.address +  "&sensor=false";

  console.log(req.query);

  request.get({
          url: gUrl,
          proxy:'http://M05831:_Giugno2016@proxy1.comune.rimini.it:8080'
        },function (error, response, body) {
            //console.log(body);
            //console.log(response);
            if(error){
              return res.status(500).json(error);    
            } else {
              return res.status(200).send(body);    
            }
        });
  
});


router.post('/add-task', function(req, res) {
  models.Tasks
        .build({
            title: req.body.taskName,
            completed: false})
        .save()
        .then(function() {
          models.Tasks.findAll({}).then(function(taskList) {
                return res.status(200).json(taskList);
            });
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

*/

  return router;
}