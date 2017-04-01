"use strict"

module.exports = function(sequelize, DataTypes) {
    var Tasks = sequelize.define("Tasks", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            get: function(){
                var title = this.getDataValue('title'); 
                // 'this' allows you to access attributes of the instance
                return this.getDataValue('completed') + ' (' + title + ')';
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
        /*
        ,completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
        */
    }, {
       tableName: 'Tasks'
    });

    return Tasks;
}