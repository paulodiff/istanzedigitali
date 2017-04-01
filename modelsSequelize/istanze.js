"use strict"

module.exports = function(sequelize, DataTypes) {
    var Istanze = sequelize.define("Istanze", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        tipoIstanza: {
            type: DataTypes.INTEGER,
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
        fileSystemId : {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue : 0
        },
        protocolloIdDocumento : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        protocolloAnno : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        protocolloNumero : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
     {
       tableName: 'Istanze'
    });

    return Istanze;
}