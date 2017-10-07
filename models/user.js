'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    pseudo: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  });
  User.associate = function(models){
      User.belongsTo(models.Role, {foreignKey: 'idRole'});
      User.belongsTo(models.Zone, {foreignKey: 'idZone'});
  }
  return User;
};