'use strict';
module.exports = (sequelize, DataTypes) => {
  var Station = sequelize.define('Station', {
    name: DataTypes.STRING
  });
  Station.associate = function(models){

      Station.hasOne(models.Line, {foreignKey: 'idStartStation'});
      Station.hasOne(models.Line, {foreignKey: 'idEndStation'});

      Station.hasMany(models.Booking, {foreignKey: 'idStartStation'});
      Station.hasMany(models.Booking, {foreignKey: 'idEndStation'});

      Station.belongsToMany(models.Line, {through: 'lineStation',foreignKey: 'idStation'});

      Station.hasMany(models.Trip, {foreignKey: 'idStartStation'});
      Station.hasMany(models.Trip, {foreignKey: 'idEndStation'});
  }
  return Station;
};