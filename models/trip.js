'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trip = sequelize.define('Trip', {
    startHour: DataTypes.STRING
  });
  Trip.associate = function(models)
  {

      Trip.belongsTo(models.Line, {onDelete: 'CASCADE',foreignKey: 'idLine'});

      Trip.belongsTo(models.Booking, {onDelete: 'CASCADE',foreignKey: 'idBooking'});

      Trip.belongsTo(models.Station, {foreignKey: 'idStartStation',as: 'departureStationTrip'});
      Trip.belongsTo(models.Station, {foreignKey: 'idEndStation',as: 'terminalStationTrip'});
  }
  return Trip;
};