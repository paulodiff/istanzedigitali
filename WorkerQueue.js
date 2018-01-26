/*

    Worker Queue 

*/

var amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');


// https://github.com/tjmehta/amqplib-rpc
// https://facundoolano.wordpress.com/2016/06/26/real-world-rpc-with-rabbitmq-and-node-js/

// var databaseModule = require("../models/databaseModule.js");
var amqpConnection = 'amqp://user_test:12345678@test-webapi.ad.comune.rimini.it';
var amqpReqQueue = 'rpc_queue';
var myPID = "SERVER:" + process.pid;
var myQID = myPID + '@' + uuidv4();



amqp.connect(amqpConnection, function(err, conn) {
  if (err) { console.log(err); };

  conn.createChannel(function(err, ch) {
    if (err) { console.log(err); };

    var q = amqpReqQueue;
	

    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log('[' + myPID + '] Awaiting RPC requests');
    console.log('[' + myPID + '] :', amqpConnection);
    console.log('[' + myPID + '] :', amqpReqQueue);
	
	// rimane in ascolto sulla rpc_queue
    ch.consume(q, function reply(msg) {
		
		// legge il messaggio
		var msgJson = JSON.parse(msg.content);
				
		// console.log(msgJson);
		
		console.log("[" + myPID + "] <-:", JSON.stringify(msgJson));
		//console.log("[" + myPID + "] reply to:", msg.properties.replyTo);
		
		/* ESEGUE IL LAVORO */
		
		var msgReplay = { pidProcessReq: msgJson.processId, pidServer: process.pid, outValue : msgJson.ts, altro: 1};
		console.log("[" + myPID + "] ->:", JSON.stringify(msgReplay));
		console.log("[" + myPID + "] toq->:", msg.properties.replyTo);
		
		// invia la risposta sulla coda indicata dal richiedente
		ch.sendToQueue('rpc_out',
				new Buffer(JSON.stringify(msgReplay)),
				{
						correlationId: msg.properties.correlationId
						// , persistent: true
				},
				function(err, ok) {
                     if (err)
                       console.warn('Message nacked!');
                     else
                       console.log('Message acked');
				}
				);
		ch.ack(msg);
    });
  });
  
});


