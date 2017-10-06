'use strict';
module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define('Zone', {
    name: DataTypes.STRING
  });
  Zone.associate = function(models){
      Zone.hasMany(models.User, {foreignKey: 'zone'});
      Zone.hasMany(models.Line, {foreignKey: 'line'});
  }
  return Zone;
};