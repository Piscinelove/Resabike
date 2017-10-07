'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {
    number: DataTypes.INTEGER
  });
  Line.associate = function(models){

      Line.belongsTo(models.Zone, {foreignKey: 'idZone'});

      Line.belongsTo(models.Station, {foreignKey: 'idStartStation'});
      Line.belongsTo(models.Station, {foreignKey: 'idEndStation'});

      Line.hasMany(models.Booking, {foreignKey: 'idLine'});

      Line.belongsToMany(models.Station, {through: 'lineStation',foreignKey: 'idLine'});

      Line.hasMany(models.Trip, {foreignKey: 'idLine'});
  }
  return Line;
};