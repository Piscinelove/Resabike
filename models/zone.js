'use strict';
module.exports = (sequelize, DataTypes) => {
  var Zone = sequelize.define('Zone', {
    name: DataTypes.STRING
  });
  Zone.associate = function(models){

      Zone.hasMany(models.User, {foreignKey: 'idZone'});

      Zone.hasMany(models.Line, {foreignKey: 'idZone'});
  }
  return Zone;
};