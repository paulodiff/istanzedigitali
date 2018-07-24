"use strict"

/* Contiene la tabella Atti */

module.exports = function(sequelize, DataTypes) {
    var Raccomandate = sequelize.define("Raccomandate", {

        raccomandate_ts:            { type: DataTypes.DATE,     defaultValue: sequelize.NOW },
        raccomandate_data_reg:      { type: DataTypes.DATE,     allowNull: false  },        
        raccomandate_numero:        { type: DataTypes.STRING,   allowNull: false  },        
        raccomandata_mittente:      { type: DataTypes.STRING,   allowNull: false  },        
        raccomandata_note:          { type: DataTypes.STRING,   allowNull: true  },        
        raccomandata_operatore:     { type: DataTypes.STRING,   allowNull: false  }
    },
     {
       tableName: 'Raccomandate',
       paranoid: true
    });

    Raccomandate.associate = function (models) {
        models.Raccomandate.belongsTo(models.Destinatari, { foreignKey: 'raccomandate_destinatario_codice'  });
    };
 
    return Raccomandate;
}