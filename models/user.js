'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING

  });
  User.associate = function(models){
      User.belongsTo(models.Role, {onDelete: 'CASCADE', foreignKey: 'idRole'});
      User.belongsTo(models.Zone, {onDelete: 'CASCADE', foreignKey: 'idZone'});
  }
  return User;
};