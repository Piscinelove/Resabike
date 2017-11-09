'use strict';
module.exports = (sequelize, DataTypes) => {
  var Station = sequelize.define('Station', {
    name: DataTypes.STRING
  });
  Station.associate = function(models){

      Station.hasOne(models.Line, {foreignKey: 'idStartStation', as: 'departureStationLine'});
      Station.hasOne(models.Line, {foreignKey: 'idEndStation',as: 'terminalStationLine'});

      Station.hasMany(models.Booking, {foreignKey: 'idStartStation', as: 'departureStationBooking'});
      Station.hasMany(models.Booking, {foreignKey: 'idEndStation', as: 'terminalStationBooking'});

      Station.hasMany(models.LineStation, {foreignKey: 'idStation'});

      Station.hasMany(models.Trip, {foreignKey: 'idStartStation', as: 'departureStationTrip'});
      Station.hasMany(models.Trip, {foreignKey: 'idEndStation',as: 'terminalStationTrip'});
  }
  return Station;
};