"use strict"

/*

Modello dati per memorizzare la posta e/o raccomandate

*/

module.exports = function(sequelize, DataTypes) {
    var Posta = sequelize.define("Posta", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        tipo_spedizione: {
            type: DataTypes.STRING,
            allowNull: false
        },
        /* che deriva dall'autenticazione */
        userid : {
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