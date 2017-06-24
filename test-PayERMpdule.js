
var jwt = require('jsonwebtoken');
var moment = require('moment');
var fs = require('fs');
var PER = require('./models/PayERModule.js');
var crypto = require('crypto');

PER.initPayER('726838938','1823763823929','PORTEXT1');
PER.getTagOrario();
PER.getMD5Hash('A');
PER.getBufferPaymentRequest('A');
PER.getBufferPID('PID');
PER.getBufferRID('RID');