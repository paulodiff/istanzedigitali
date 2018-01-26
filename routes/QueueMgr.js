/*

  Modulo gestione delle code

*/ 


var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var ENV   = require('../config/config.js'); // load configuration data
// var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var log = require('../models/loggerModule.js');
var async = require('async');
var amqp = require('amqplib');
// var amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

// var databaseModule = require("../models/databaseModule.js");
var amqpConnection = 'amqp://user_test:12345678@test-webapi.ad.comune.rimini.it';
var amqpReqQueue = 'rpc_queue';
var myPID = "CLIENT:" + process.pid;
var myQID = myPID + '@' + uuidv4();


module.exports = function(){

/*
const createClient = (settings) => amqp.connect(settings.url, settings.socketOptions)
 
const sendRPCMessage = (client, message, rpcQueue) => conn.createChannel()
  .then((channel) => new Promise((resolve, reject) => {
    const replyToQueue = 'amq.rabbitmq.reply-to';
    const timeout = setTimeout(() => channel.close(), 10000);
 
    const correlationId = uuid.v4();
    const msgProperties = {
      correlationId,
      replyTo: replyToQueue
    };
 
    function consumeAndReply (msg) {
      if (!msg) return reject(Error.create('consumer cancelled by rabbitmq'));
 
      if (msg.properties.correlationId === correlationId) {
        resolve(msg.content);
        clearTimeout(timeout);
        channel.close();
      }
    }
 
    channel.consume(replyToQueue, consumeAndReply, {noAck: true})
    .then(() => channel.sendToQueue(rpcQueue, new Buffer(content), msgProperties))
  });

------------------------------------------------------------------------------------------------

const createClient = (settings) => amqp.connect(settings.url, settings.socketOptions)
  .then((conn) => conn.createChannel())
  .then((channel) => {
    // create an event emitter where rpc responses will be published by correlationId
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    channel.consume(REPLY_QUEUE,
      (msg) => channel.responseEmitter.emit(msg.properties.correlationId, msg.content),
      {noAck: true});
 
    return channel;
  });
 
const sendRPCMessage = (channel, message, rpcQueue) => new Promise((resolve) => {
  const correlationId = uuid.v4();
  // listen for the content emitted on the correlationId event
  channel.responseEmitter.once(correlationId, resolve);
  channel.sendToQueue(rpcQueue, new Buffer(message), { correlationId, replyTo: REPLY_QUEUE })
});


*/



function sendRPCMessage(settings, message, rpcQueue) { 
    // amqp.connect(settings.url, settings.socketOptions)
    console.log('sendRPCMessage...1');
    amqp.connect(settings)
        .then(
            function(conn){
                console.log('sendRPCMessage...2');
                conn.createChannel().then(
                    function(channel){
                        return new Promise(
                            function (resolve, reject){
                                console.log('sendRPCMessage...3');
                                var replyToQueue = 'amq.rabbitmq.reply-to';
                                var timeout = setTimeout(() => channel.close(), 10000);
                                var correlationId = uuidv4();
                                var msgProperties = {  correlationId,  replyTo: replyToQueue };
                            
                                function consumeAndReply (msg) {
                                    console.log('sendRPCMessage...4');
                                    if (!msg) return reject(Error.create('consumer cancelled by rabbitmq'));
                                
                                    if (msg.properties.correlationId === correlationId) {
                                        console.log('sendRPCMessage...5');
                                        resolve(msg.content);
                                        clearTimeout(timeout);
                                        channel.close();
                                    }
                                }
                            
                                channel.consume(replyToQueue, consumeAndReply, {noAck: true})
                                    .then(
                                        function() { 
                                            console.log('sendRPCMessage...7');
                                            channel.sendToQueue(rpcQueue, new Buffer(message), msgProperties)
                                        },
                                        function(err) { console.error('ERROR 3 %s', err);  }
                                    )
                            }
                        );
                    }, function(err) { console.error('ERROR 2 %s', err);  }
                )
            }, function(err) { console.error('ERROR 1 %s', err);  }
        )
    }
/*
function sendRPCMessage (client, message, rpcQueue) { 
    conn.createChannel()
    .then(function(channel) { new Promise( function(resolve, reject)  {
   const replyToQueue = 'amq.rabbitmq.reply-to';
   const timeout = setTimeout(function(){ channel.close()}, 10000);
   const correlationId = uuidv4();
   const msgProperties = {
     correlationId,
     replyTo: replyToQueue
   };

   function consumeAndReply (msg) {
     if (!msg) return reject(Error.create('consumer cancelled by rabbitmq'));

     if (msg.properties.correlationId === correlationId) {
       resolve(msg.content);
       clearTimeout(timeout);
       channel.close();
     }
   }

   channel.consume(replyToQueue, consumeAndReply, {noAck: true})
   .then(function() { channel.sendToQueue(rpcQueue, new Buffer(content), msgProperties)) }
 });
*/

// GET /api/me
router.get('/getData', 
// utilityModule.ensureAuthenticated, 
function(req, res) {
    log.log2console('QueueMgr:queue');

    sendRPCMessage(amqpConnection,{test: 'prova'}, amqpReqQueue).then(
        function(result){
                return res.status(200).send(result);
        },
        function(err) { 
            console.error('ERROR 100 %s', err);  
            return res.status(444).send(err);
        }
    );
    
    /*

    amqp.connect(amqpConnection, function(err, conn) {
        if (err) { console.log(err); };
        log.log2console('QueueMgr:connection,OK');
        conn.createChannel(function(err, ch) {
            if (err) { console.log(err); };
            log.log2console('QueueMgr:createChannel,OK');
            
            ch.assertQueue(amqpReqQueue, {exclusive: false}, function(err, q) {
                
                if (err) {  console.log(err);  };
                log.log2console('QueueMgr:assertQueue,OK',q.queue);
              
                              
                var num = Math.random();
                var par = Math.random();
                var count = 0;
        
                console.log('[' + myPID + '] num:', num);
                console.log('[' + myPID + '] myQID:' + myQID);
                console.log('[' + myPID + '] q.queue:' + q.queue);
        
              // resta in ascolto sulla coda per i risultati
              ch.consume(q.queue, function(msg) {
                  if (msg.properties.correlationId === myQID) {
                    console.log('[' + myPID + '] Return %s', msg.content.toString());
                    // setTimeout(function() { conn.close(); process.exit(0) }, 500);
                  } else {
                      console.log('no corr');
                  }
              }, {noAck: false});
      
      
              
              // invia un messaggio alla cora rpc_queue
              var sendMessage = function(msgJson, q) {
                  console.log('[' + myPID + '] sendMessage: %s', JSON.stringify(msgJson));
                  ch.sendToQueue(
                          'rpc_queue',
                              new Buffer(JSON.stringify(msgJson)),
                          { correlationId: myQID, replyTo: q.queue });
              }
              var msgJ = {
                                  processId: myPID,
                                  num: count,
                                  ts: new Date()				
                              };
              // sendMessage(msgJ, q);
              
            
                  
          });	
        });
      });

      */
   
});


router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.log2console('ProfileMgr PUT /me');
  log.log2console(req.user);
  log.log2console(req.data);
  return res.status(200).send('ok');
});

router.post('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.log2console('ProfileMgr POST /me');
  return res.status(200).send('ok');
});


	return router;
}