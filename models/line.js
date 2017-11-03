'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {

  });
  Line.associate = function(models){

      Line.belongsTo(models.Zone, {foreignKey: 'idZone'});

      Line.belongsTo(models.Station, {foreignKey: 'idStartStation', as: 'departureStationLine'});
      Line.belongsTo(models.Station, {foreignKey: 'idEndStation',as: 'terminalStationLine'});

      //Line.hasMany(models.Booking, {foreignKey: 'idLine'});

      //Line.belongsToMany(models.Station, {through: 'lineStation',foreignKey: 'idLine'});
      Line.hasMany(models.LineStation, {onDelete: 'CASCADE',foreignKey: 'idLine'});

      Line.hasMany(models.Trip, {foreignKey: 'idLine'});
  }
  return Line;
};