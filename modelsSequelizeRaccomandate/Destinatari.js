"use strict"

/* Contiene la tabella elenco dei destinatari  */

module.exports = function(sequelize, DataTypes) {
    var Destinatari = sequelize.define("Destinatari", {

        destinatario_descrizione: {
            type: DataTypes.STRING,
            allowNull: false
        },

        destinatario_codice: {
            type: DataTypes.STRING,
            allowNull: false
        },

        destinatario_visibile: {
            type: DataTypes.INTEGER,
            allowNull: false
        }


    },
     {
       tableName: 'Destinatari',
       paranoid: true
    });

    return Destinatari;
}