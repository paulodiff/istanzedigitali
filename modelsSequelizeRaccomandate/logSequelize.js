"use strict"

/* logSequelize logga tutte le modifiche alle tabelle */

module.exports = function(sequelize, DataTypes) {
    var logSequelize = sequelize.define("logSequelize", {

        ts:                 { type: DataTypes.DATE,     defaultValue: sequelize.NOW },
        tblName:            { type: DataTypes.STRING,   allowNull: false  },
        tblId:              { type: DataTypes.INTEGER,   allowNull: false  },
        fldName:            { type: DataTypes.STRING,   allowNull: false  },        
        oldValue:           { type: DataTypes.STRING,   allowNull: true  },        
        newValue:           { type: DataTypes.STRING,   allowNull: true  },        
        userId:             { type: DataTypes.STRING,   allowNull: false  }
    },
     {
       tableName: 'logSequelize',
       paranoid: true
    });

    return logSequelize;
}