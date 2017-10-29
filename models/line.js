'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {

  });
  Line.associate = function(models){

      Line.belongsTo(models.Zone, {foreignKey: 'idZone'});

      Line.belongsTo(models.Station, {foreignKey: 'idStartStation'});
      Line.belongsTo(models.Station, {foreignKey: 'idEndStation'});

      //Line.hasMany(models.Booking, {foreignKey: 'idLine'});

      //Line.belongsToMany(models.Station, {through: 'lineStation',foreignKey: 'idLine'});
      Line.hasMany(models.LineStation, {onDelete: 'CASCADE',foreignKey: 'idLine'});

      Line.hasMany(models.Trip, {foreignKey: 'idLine'});
  }
  return Line;
};