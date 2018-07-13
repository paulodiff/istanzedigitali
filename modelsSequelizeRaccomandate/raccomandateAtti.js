"use strict"

/* Contiene la tabella Atti */

module.exports = function(sequelize, DataTypes) {
    var rAtti = sequelize.define("rAtti", {

        atti_ts:            { type: DataTypes.DATE,     defaultValue: sequelize.NOW },
        atti_data_reg:      { type: DataTypes.DATE,     allowNull: false  },        
        atti_nominativo:    { type: DataTypes.STRING,   allowNull: false  },        
        atti_consegnatario: { type: DataTypes.STRING,   allowNull: false  },        
        atti_cronologico:   { type: DataTypes.STRING,   allowNull: false  },        
        atti_data_consegna: { type: DataTypes.STRING,   allowNull: false  },        
        atti_data_consegna_ok: { type: DataTypes.DATE,   allowNull: true  }, 
        atti_documento:     { type: DataTypes.STRING,   allowNull: false  },        
        atti_data_doc:      { type: DataTypes.STRING,   allowNull: false  },        
        atti_data_doc_ok:      { type: DataTypes.DATE,   allowNull: true  },        
        atti_soggetto:      { type: DataTypes.STRING,   allowNull: false  },        
        atti_note:          { type: DataTypes.STRING,   allowNull: false  },        
        atti_operatore:     { type: DataTypes.STRING,   allowNull: false  },        
        atti_operatore_consegna:     { type: DataTypes.STRING,   allowNull: true  },        
        atti_flag_consegna: { type: DataTypes.STRING,   allowNull: false  }
    },
     {
       tableName: 'rAtti',
       paranoid: true
    });

    return rAtti;
}