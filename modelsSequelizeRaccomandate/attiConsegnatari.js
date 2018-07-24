"use strict"

/* Contiene la tabella elenco dei consegnatari  */

module.exports = function(sequelize, DataTypes) {
    var AttiConsegnatari = sequelize.define("AttiConsegnatari", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        atticonsegnatario_codice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },        
        atticonsegnatario_descrizione: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        atticonsegnatario_note: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
     {
       tableName: 'AttiConsegnatari',
       paranoid: true
    });

    return AttiConsegnatari;
}