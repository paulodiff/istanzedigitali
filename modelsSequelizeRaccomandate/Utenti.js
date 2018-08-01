"use strict"

/* Contiene la tabella Atti */

module.exports = function(sequelize, DataTypes) {
    var Utenti = sequelize.define("Utenti", {

        utente_matricola:        { type: DataTypes.STRING,   allowNull: false  },        
        utente_amministratore:    { type: DataTypes.BOOLEAN,   allowNull: false  }
    },
     {
       tableName: 'Utenti',
       paranoid: true
    });

    
 
    return Utenti;
}