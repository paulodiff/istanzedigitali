var emitterBus = require('../models/emitterModule.js');

var io_root = {};
var io_socket = {};

emitterBus.eventBus.on('logMessage', function(data) {
    console.log('#SM#: on message!');
    console.log(data);
    
  
    var msg = {
      msg: data.msg,
      channelId: 'broadcast',
      rnd: Math.random(),
      sseId: data.sseId
    }
    

    console.log('#SM#:broadcast');
    io_root.sockets.emit('message', {type:'new-message', text: 'from_bus:' + new Date()});

    console.log('#SM#:list clients!');
    io_root.clients(function(error, clients) {
        if (error) throw error;
        console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
      });
    // io_socket.broadcast.emit(msg);
});


module.exports = function (io) {
    'use strict';
    io_root = io;
    io.on('connection', function (socket) {

        io_socket = socket;

        console.log('#SM# socket connected');
        socket.broadcast.emit('user connected');
    
        socket.on('message', function (from, msg) {
    
            console.log('#SM# recieved message from', from, 'msg', JSON.stringify(msg));
    
            console.log('#SM# broadcasting message');
            console.log('#SM# payload is', msg);
            io.sockets.emit('broadcast', {
                payload: msg,
                source: from
            });

            console.log('broadcast complete');
        });

        socket.on('add-message', function(message) {
            console.log('#SM# add-message');
            socket.emit('message', {type:'new-message', text: message + new Date()});    
        });
      
        socket.on('disconnect', function(){
            console.log('#SM# user disconnected');
        });

    });
  };