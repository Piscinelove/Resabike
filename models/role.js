'use strict';
module.exports = function(sequelize, DataTypes)
{
  var Role = sequelize.define('Role', {
    name: DataTypes.STRING
  });
  Role.associate = function(models){
        Role.hasMany(models.User, {foreignKey: 'idRole'});
  }
  return Role;
};