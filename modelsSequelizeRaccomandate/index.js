"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var ENV       = require('../config/config-RACCOMANDATE.js'); 

// load configuration data
 
var sequelize = new Sequelize(ENV.mysql_sequelize.MYSQLdatabase, 
                              ENV.mysql_sequelize.MYSQLusername, 
                              ENV.mysql_sequelize.MYSQLpassword, {

    host: ENV.mysql_sequelize.MYSQLhost,
    // logging: console.log, // log sql generated
    dialect: 'mysql',
    dialectOptions: {
        ssl: false
    },
    define: {
        timestamps: true
    },
    freezeTableName: true,
    pool: {
        max: 9,
        min: 0,
        idle: 10000
    }
});

var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        // console.log('Sequelize:reading...:',file);
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        // db[modelName].associate(db);
        db[modelName].association = db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

/*
  const Product = db.sequelize.define('1product', {
    title: Sequelize.STRING
  });
*/
/*
  const User = db.sequelize.define('user', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING
  }, {  tableName: '00user' });

  const Address = db.sequelize.define('address', {
    type: Sequelize.STRING,
    line_1: Sequelize.STRING,
    line_2: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    zip: Sequelize.STRING,
  }, {  tableName: '00address' });
  
  // Product.User = Product.belongsTo(User);
  // User.Addresses = User.hasMany(Address);
  // Product.belongsTo(User); 

  User.hasMany(Address, { foreignKey: 'attiinconsegna_codice_id', as: 'atti_in_consegna'  } );
  // User.hasMany(Address);

  Address.create({
    type: 'home',
    line_1: 'Via roma 25 ain St.',
    city: 'Romca',
    state: 'IT',
    zip: '47500'
  });
  
  User.create({
    first_name: 'Mario1',
    last_name: 'Rossi33',
    atti_in_consegna: [
     
    {
      type: 'work',
      line_1: '1100 St.',
      city: 'Milan',
      state: 'IT',
      zip: '09999'
    },
    {
        type: 'home',
        line_1: '1200 St.',
        city: 'Rome',
        state: 'IT',
        zip: '08888'
    }

    ]
  },{
    include: [ {model : Address, as: 'atti_in_consegna'} ]
  });

  
  Product.create({
    title: 'Chair',
    user: {
      first_name: 'Mick',
      last_name: 'Broadstone',
      addresses: [{
        type: 'home',
        line_1: '100 Main St.',
        city: 'Austin',
        state: 'TX',
        zip: '78704'
      }]
    }
  }, {
    include: [{
      association: Product.User,
      include: [ User.Addresses ]
    }]
  });
  */

// definizione delle relazioni ... 

// db.rAtti.belongsTo(db.attiConsegnatari,     {foreignKey: 'atti_consegnatario_codice'}  );

module.exports = db;