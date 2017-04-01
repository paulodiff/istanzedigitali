"use strict"

module.exports = function(sequelize, DataTypes) {
    var Nucleos = sequelize.define("Nucleos", {
        tipoMembro: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cognomeNome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codiceFiscale: {
            type: DataTypes.STRING,
            allowNull: false
        }
        /*
        ,completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
        */
    }, {
       tableName: 'Nucleos'
    });

    return Nucleos;
}