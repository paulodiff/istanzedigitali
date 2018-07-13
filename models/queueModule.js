/* Modulo per la gestione di chiamate API in sequenze o coda 

 funzioni exportate


*/

const delay = require('delay');
const PQueue = require('p-queue');
const got = require('got');

// TODO LOG ERRORS
// imposta un timeout alla chiamata delle coda
const API_TIME_OUT = 10000;

// imposta il numero di chiamate concorrenti nella coda
const API_CONCURRENCY = 1;

const queue = new PQueue({concurrency: API_CONCURRENCY});



// getSizeQueue
exports.getSizeQueue = function() {  return queue.size; }

// getPendingQueue
exports.getPendingQueue = function() {  return queue.pending; }

// addToQueue aggiunge una richiesta alla coda
exports.addToQueue = function(opts) {
	 console.log(`addToQueue ${opts.id} Queue size: ${queue.size} Pending promises: ${queue.pending}`);

	var runId = opts.id;
	var url = "https://jsonplaceholder.typicode.com/photos/" + opts.id;
	var myPromise = new Promise((resolve, reject) => {
		 console.log('addToQueue url: '  + url);
		 
		 setTimeout(function() {
        		 
		 got(url)
			.then(function(resp) {
				var obj = JSON.parse(resp.body);
				// console.log(typeof(obj));
				// console.log(obj.id);
				
				// console.log(obj.title);
				resolve(runId + ' ' + obj.title);
			})
			.catch(function(error){ 
				// console.log(runId + ' reject! ');
				reject(runId + ' Reject! ');
			});

		}, API_TIME_OUT);
		
	});	
	queue.add(() => myPromise)
		.then(function(res){ console.log(  'Queue RESULT : ' + res)})
		.catch(function(error){console.log('Queue ERROR  : ' + error)});
	 
};

// addToQueuePromise aggiunge una richiesta alla coda e ritorna una promise
exports.addToQueuePromise = function(opts) {
	 console.log(`addToQueuePromise ${opts.id} Queue size: ${queue.size} Pending promises: ${queue.pending}`);

	var runId = opts.id;
	var url = "https://jsonplaceholder.typicode.com/photos/" + opts.id;
	var myPromise = new Promise((resolve, reject) => {
		 console.log('addToQueuePromise url: '  + url);
		 
		 setTimeout(function() {
        		 
		 got(url)
			.then(function(resp) {
				var obj = JSON.parse(resp.body);
				// console.log(typeof(obj));
				// console.log(obj.id);
				
				console.log('addToQueuePromise resolved : ' + runId +' '  + obj.title);
				resolve(runId + ' ' + obj.title);
			})
			.catch(function(error){ 
				console.log('addToQueuePromise rejected! : ' + runId +' '  + error);
				reject(runId + ' Reject! ');
			});

		}, API_TIME_OUT);
		
	});	
	return queue.add(() => myPromise);
		
};
