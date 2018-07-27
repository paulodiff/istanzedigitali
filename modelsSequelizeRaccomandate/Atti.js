"use strict"

/* Contiene la tabella Atti */

module.exports = function(sequelize, DataTypes) {
    var Atti = sequelize.define("Atti", {

        atti_data_registrazione:      
        { type: DataTypes.DATE,     allowNull: false, comment: 'data registrazione'  },        
        atti_nominativo:              
        { type: DataTypes.STRING,   allowNull: false  },        
        atti_cronologico:   
        { type: DataTypes.STRING,   allowNull: false  },        

        // le consegne sono legate con l'associazione ma per comodità vengono riportati i dati 
        // anche sull'atto - da vedere

        atti_consegna_data: 
        { type: DataTypes.DATE,      allowNull: true  },        
        atti_consegna_documento_estremi:     
        { type: DataTypes.STRING,   allowNull: true, comment: 'registrazione degli estremi del documento' },        
        atti_consegna_soggetto:      
        { type: DataTypes.STRING,   allowNull: true },        
        atti_note:              
        { type: DataTypes.STRING,   allowNull: true  },        
        atti_consegna_flag:         
        { type: DataTypes.STRING,   allowNull: false  },
        atti_operatore_inserimento:     
        { type: DataTypes.STRING,   allowNull: false  },        
        atti_operatore_consegna:     { type: DataTypes.STRING,   allowNull: true  },        

    },
     {
       tableName: 'Atti',
       paranoid: true
    });

    // Sequelize
    // HasOne inserts the association key in target model whereas 
    // BelongsTo inserts the association key in the source model.

    Atti.associate = function (models) {
        // associazione con i consegnatari
        models.Atti.belongsTo(models.Consegnatari, { foreignKey: 'atti_consegnatario_id', constraints: false, as: 'atti_consegnatari'   });
        // associazione con le consegne
        models.Atti.belongsTo(models.Consegne, { foreignKey: 'atti_consegne_id', constraints: false, as: 'atti_consegne'  });
    };
 
    return Atti;
}