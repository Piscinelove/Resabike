'use strict';
module.exports = (sequelize, DataTypes) => {
  var Station = sequelize.define('Station', {
    name: DataTypes.STRING
  });
  Station.associate = function(models){
      Station.hasMany(models.Line, {foreignKey: 'departureStation'});
      Station.hasMany(models.Line, {foreignKey: 'arrivalStation'});
      Station.hasMany(models.Booking, {foreignKey: 'departureStation'});
      Station.hasMany(models.Booking, {foreignKey: 'arrivalStation'});
      Station.belongsToMany(models.Line, {through: 'lineHasStation',foreignKey: 'station'});
  }
  return Station;
};