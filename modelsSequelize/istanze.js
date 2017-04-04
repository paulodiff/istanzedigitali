"use strict"

module.exports = function(sequelize, DataTypes) {
    var Istanze = sequelize.define("Istanze", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        tipoIstanza: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        /* che deriva dall'autenticazione */
        userid : {
            type: DataTypes.STRING,
            allowNull: false
        },
        AuthUuidV4 : {
            type: DataTypes.STRING,
            allowNull: false
        },
        statoIter : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue : 0
        },
        emailNotifiche: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /* reqId identificativo di salvataggio sul fileSystem*/
        fileSystemId : {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue : 0
        },
        protocolloIdDocumento : {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        protocolloAnno : {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        protocolloNumero : {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    },
     {
       tableName: 'Istanze'
    });

    return Istanze;
}