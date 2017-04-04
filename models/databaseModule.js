/* modulo che gestisce le interazioni con il database attraverso Sequelize */

var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV   = require('../config.js'); // load configuration data
var fs = require('fs');
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var request = require('request');
var qs = require('querystring');
var path = require('path');
var models = require("../modelsSequelize");
var log = require('../models/loggerModule.js');
var uuidV4 = require('uuid/v4');


module.exports = {

// rende persistente su database i dati della transazione di autenticazione
saveAuthTransaction: function(user){

  return new Promise(function(resolve, reject) {

    console.log('saveAuthTransaction');
    console.log(user);
    models.SpidLog.build(
      { 
          ts: new Date(),
          issuer: user.issuer,
          nameID: user.nameID,
          nameIDFormat: user.nameIDFormat,
          nameQualifier: user.nameQualifier,
          spNameQualifier: user.spNameQualifier,        
          authenticationMethod: user.authenticationMethod,
          dataNascita: user.dataNascita,
          userid: user.userid,
          statoNascita: user.statoNascita,
          policyLevel: user.policyLevel,
          nome: user.nome,
          CodiceFiscale: user.CodiceFiscale,
          trustLevel: user.trustLevel,
          luogoNascita: user.luogoNascita,
          authenticatingAuthority: user.authenticatingAuthority,
          cognome: user.cognome,
          getAssertionXml: user.getAssertionXml,
          uuidV4:  user.uuidV4,
      })
    .save()
    .then(function(anotherTask) {
      resolve(anotherTask)
    }).catch(function(error) {
       reject(error);
    });
  });

},


saveIstanza: function(data){

    console.log('saveIstanza');
    console.log(data);
    models.Istanza.build({

        ts: new Date(),
        tipoIstanza: 0
    })
    .save()
    .then(function(anotherTask) {
      resolve(anotherTask)
    }).catch(function(error) {
       reject(error);
    });
  }

    /*
        userid : {
        AuthUuidV4 : {
        statoIter : {
        emailNotifiche: {
        fileSystemId : {
        protocolloIdDocumento : {
        protocolloAnno : {
        protocolloNumero : {
    */


}