"use strict"

module.exports = function(sequelize, DataTypes) {

var Person = sequelize.define('Person', {
 // instantiating will automatically set the flag to true if not set
 email: { type: DataTypes.STRING, allowNull: false},
 
 name: { type: DataTypes.STRING, allowNull: true},
 surname: { type: DataTypes.STRING, allowNull: true},
 flag: { type: DataTypes.BOOLEAN, allowNull: true},

 // default values for dates => current time
 myDate: { type: DataTypes.DATE, defaultValue: sequelize.NOW },

 // setting allowNull to false will add NOT NULL to the column, which means an error will be
 // thrown from the DB when the query is executed if the column is null. If you want to check that a value
 // is not null before querying the DB, look at the validations section below.
 title: { type: DataTypes.STRING, allowNull: false},

 // Creating two objects with the same value will throw an error. The unique property can be either a
 // boolean, or a string. If you provide the same string for multiple columns, they will form a
 // composite unique key.
 someUnique: {type: DataTypes.STRING},
 
 // The unique property is simply a shorthand to create a unique index.
 someUnique: {type: DataTypes.STRING}
 
 // autoIncrement can be used to create auto_incrementing integer columns
 //incrementMe: { type: DataTypes.INTEGER, autoIncrement: true },
 
},
	{
		tableName: 'Person'
	}
);

return Person;

};