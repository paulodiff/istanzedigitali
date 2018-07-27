"use strict"

/* Contiene la tabella Consegne */   

module.exports = function(sequelize, DataTypes) {
    var Attiinconsegna = sequelize.define("Attiinconsegna", {

        attiinconsegna_ts:            { type: DataTypes.DATE,     defaultValue: sequelize.NOW },
        attiinconsegna_note:          { type: DataTypes.STRING,   allowNull: true  }
    },
     {
       tableName: 'Attiinconsegna',
       paranoid: true
    });

    
    Attiinconsegna.associate = function (models) {
        models.Attiinconsegna.belongsTo(models.Atti, { foreignKey: 'attiinconsegna_codice_atto', as: 'codice_atto'  });
    };
    
 
    return Attiinconsegna;
}