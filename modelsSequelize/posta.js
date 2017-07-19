"use strict"

/*

Modello dati per memorizzare la posta e/o raccomandate

*/

module.exports = function(sequelize, DataTypes) {
    var Posta = sequelize.define("Posta", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        protocollo: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        cdc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        tipo_spedizione: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /* che deriva dall'autenticazione */
        userid : {
            type: DataTypes.STRING,
            allowNull: false
        },
        userEmail : {
            type: DataTypes.STRING,
            allowNull: false
        },
        userDisplayName : {
            type: DataTypes.STRING,
            allowNull: false
        },
        /* uuid generato dall'applicazione*/
        posta_id : {
            type: DataTypes.STRING,
            allowNull: false
        },
        destinatario_denominazione: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destinatario_citta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destinatario_via: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destinatario_cap: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destinatario_provincia: {
            type: DataTypes.STRING,
            allowNull: false
        },
        barCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verbale: {
            type: DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
     {
       tableName: 'Posta',
       paranoid: true
    });

    return Posta;
}