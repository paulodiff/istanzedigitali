"use strict"

/* Contiene la tabella Consegne */ 

module.exports = function(sequelize, DataTypes) {
    var Consegne = sequelize.define("Consegne", {

        consegna_ts:            { type: DataTypes.DATE,     defaultValue: sequelize.NOW },
        consegna_data_reg:      { type: DataTypes.DATE,     allowNull: false  },        
        consegna_documento:     { type: DataTypes.STRING,   allowNull: true  },        
        consegna_soggetto:      { type: DataTypes.STRING,   allowNull: true },        
        consegna_note:          { type: DataTypes.STRING,   allowNull: true  },        
        consegna_stato:         { type: DataTypes.STRING,   allowNull: true  },        
        consegna_protocollo:    { type: DataTypes.STRING,   allowNull: true  },        
        consegna_filename:      { type: DataTypes.STRING,   allowNull: true  },        
        consegna_filedata:      { type: DataTypes.BLOB,     allowNull: true  },        
        consegna_operatore:     { type: DataTypes.STRING,   allowNull: false  }
    },
     {
       tableName: 'Consegne',
       paranoid: true
    });

    Consegne.associate = function (models) {
        return models.Consegne.hasMany(models.Attiinconsegna, { foreignKey: 'attiinconsegna_codice_consegna', as: 'atti_in_consegna'  });
    };
 
    return Consegne;
}