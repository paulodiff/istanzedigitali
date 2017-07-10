"use strict"

/*

Contiene la tabella elenco dei DCD

*/

module.exports = function(sequelize, DataTypes) {
    var PostaCDC = sequelize.define("PostaCDC", {

        ts: { type: DataTypes.DATE, defaultValue: sequelize.NOW },
        codice: {
            type: DataTypes.STRING,
            allowNull: false
        },        
        cdc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        note: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
     {
       tableName: 'PostaCDC',
       paranoid: true
    });

    return PostaCDC;
}