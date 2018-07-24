'use strict';
module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    title: DataTypes.STRING
  });

  Task.associate = function (models) {
    models.Task.belongsTo(models.User, { foreignKey: 'tast_user_id'  });
  };

  return Task;
};