var log4js  = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', 
      filename: 'log/logfile.log', 
      category: 'file-logger',
      maxLogSize: 120480,
      backups: 10,
      category: 'file-logger' 
    }
  ]
});
var logger = log4js.getLogger();
// init logging
var logCon  = log4js.getLogger();
// var loggerDB = log4js.getLogger('mongodb');
var logFile = log4js.getLogger('file-logger');


exports.log2file = function(data) {
  return logFile.debug(data);
}

exports.log2console = function(data) {
  return logCon.debug(data);
}