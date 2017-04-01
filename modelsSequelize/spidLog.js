"use strict"

module.exports = function(sequelize, DataTypes) {
    var SpidLog = sequelize.define("SpidLog", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        issuer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nameID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nameIDFormat: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nameQualifier: {
            type: DataTypes.STRING,
            allowNull: true
        },
        spNameQualifier: {  type: DataTypes.STRING, allowNull: true  },        
        authenticationMethod: {  type: DataTypes.STRING, allowNull: true  },
        dataNascita: {  type: DataTypes.STRING, allowNull: true  },
        userid: {  type: DataTypes.STRING, allowNull: true  },
        statoNascita: {  type: DataTypes.STRING, allowNull: true  },
        policyLevel: {  type: DataTypes.STRING, allowNull: true  },
        nome: {  type: DataTypes.STRING, allowNull: true  },
        CodiceFiscale: {  type: DataTypes.STRING, allowNull: true  },
        trustLevel: {  type: DataTypes.STRING, allowNull: true  },
        luogoNascita: {  type: DataTypes.STRING, allowNull: true  },
        authenticatingAuthority: {  type: DataTypes.STRING, allowNull: true  },
        cognome: {   type: DataTypes.STRING, allowNull: true  },
        getAssertionXml: {  type: DataTypes.BLOB,  allowNull: true  },
        uuidV4: {  type: DataTypes.STRING,  allowNull: true  }
    },
     {
       tableName: 'SpidLog'
    });

    return SpidLog;
}