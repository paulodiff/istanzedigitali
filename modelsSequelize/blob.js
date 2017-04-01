"use strict"

module.exports = function(sequelize, DataTypes) {
    var Blobs = sequelize.define("Blobs", {
        tipoDocumento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: true
        },        
        fileSize: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        base64: {
            type: DataTypes.BLOB,
            allowNull: true
        }
        /*
        ,completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
        */
    }, {
       tableName: 'Blobs'
    });

    return Blobs;
}