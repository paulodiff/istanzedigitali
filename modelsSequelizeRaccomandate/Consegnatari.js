"use strict"

/* Contiene la tabella elenco dei consegnatari  */

module.exports = function(sequelize, DataTypes) {
    var Consegnatari = sequelize.define("Consegnatari", {

        consegnatario_descrizione: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
     {
       tableName: 'Consegnatari',
       paranoid: true
    });

    return Consegnatari;
}