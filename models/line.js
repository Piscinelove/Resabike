'use strict';
module.exports = (sequelize, DataTypes) => {
  var Line = sequelize.define('Line', {
    number: DataTypes.INTEGER
  });
  Line.associate = function(models){
      Line.belongsTo(models.Zone, {foreignKey: 'zone'});
      Line.belongsTo(models.Station, {foreignKey: 'departureStation'});
      Line.belongsTo(models.Station, {foreignKey: 'arrivalStation'});
      Line.hasMany(models.Booking, {foreignKey: 'line'});
      Line.belongsToMany(models.Station, {through: 'lineHasStation',foreignKey: 'line'});
  }
  return Line;
};