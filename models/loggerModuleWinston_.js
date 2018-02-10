/* winston logger module*/
var ENV = require('../config/configPROTOCOLLO.js'); // load configuration data

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const configWinstonLevelsColors = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta'
  }
};

const myFormat = printf(info => {
  var s = info.level;
  s = s.toUpperCase();
  // return `[${info.timestamp}] [${s}] ${info.level}: ${info.message}`;
  return `[${info.timestamp}] [${s}] ${info.message}`;
});

const logger = createLogger({
  levels: configWinstonLevelsColors.levels,
  // format: winston.format.json(),
  colorize: true,
  format: combine(
    label({ label: '[A]' }),
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.Console(),
    // new winston.transports.File({ filename: 'log/werror.log', level: 'error' }),
    new transports.File({ filename: 'log/' + ENV.log_filename })
  ]
});


logger.log({ level: 'info', message: 'START loggerModuleWinston.js' });

/*
exports.log2file = function(data) {
  return logFile.debug(data);
}

exports.log2console = function(data) {
  return logCon.debug(data);
}

exports.log2all = function(data) {
  return logCon.debug(data);
}
*/

exports.info = function(data) {
    // console.log(typeof(data));
    // console.log(typeof(arguments));
    // console.log(arguments.length);
    if (arguments.length == 1) {
        //logger.log('info', arguments[0]);
        // console.log(typeof(arguments[0]))
        if (typeof(arguments[0]) == 'object')  {
            // console.log('object');
            logger.log('info', JSON.stringify(arguments[0], null, 4));
            //listArgs = listArgs + ' ' + JSON.stringify(arguments[0]);
        } else {
            // console.log('other');
            logger.log('info', arguments[0]);
        }
    
    } else {
        var listArgs = "";
        for (var i = 0; i < arguments.length; i++) {
            // console.log(typeof(arguments[i]));
            if (typeof(arguments[i] == 'object'))  {
                listArgs = listArgs + ' ' + JSON.stringify(arguments[i]);
            } else {
                listArgs = listArgs + ' ' + arguments[i];
            }
        }
        logger.log('info',listArgs);    
    }

    /*
    
    if (arguments.length == 1) {
        logger.log({ level: 'info', message: arguments[0] });    
    } else {
        logger.log({ level: 'info', message: listArgs });    
    }
    */
    
    // logger.log("info", "Starting up with config %j", listArgs);
}

exports.error = function(data) {
    if (arguments.length == 1) {
        if (typeof(arguments[0]) == 'object')  {
            logger.log('error', JSON.stringify(arguments[0], null, 4));
        } else {
            logger.log('error', arguments[0]);
        }
    
    } else {
        var listArgs = "";
        for (var i = 0; i < arguments.length; i++) {
            // console.log(typeof(arguments[i]));
            if (typeof(arguments[i] == 'object'))  {
                listArgs = listArgs + ' ' + JSON.stringify(arguments[i], null, 4);
            } else {
                listArgs = listArgs + ' ' + arguments[i];
            }
        }
        logger.log('error',listArgs);    
    }
}

exports.log2email = function(data){
    console.log('########## LOG 2 EMAIL TO TO TO TO ');
}


/* EMAIL

type: 'smtp',
     recipients: 'ruggero.ruggeri@comune.rimini.it',
     sender: 'ruggero.ruggeri@comune.rimini.it',
     category: 'email-log',
     subject : '[ISTANZE DIGITALI]',
     sendInterval: 60,
     'SMTP': {
            "host": "srv-mail.comune.rimini.it",
            "secure": false,
            "port": 25
            // , "auth": { "user": "foo@bar.com", "pass": "bar_foo"  }
        }
    }



*/

