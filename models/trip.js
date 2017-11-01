'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trip = sequelize.define('Trip', {
    startHour: DataTypes.STRING
  });
  Trip.associate = function(models)
  {

      Trip.belongsTo(models.Line, {foreignKey: 'idLine'});

      Trip.belongsTo(models.Booking, {foreignKey: 'idBooking'});

      Trip.belongsTo(models.Station, {foreignKey: 'idStartStation'});
      Trip.belongsTo(models.Station, {foreignKey: 'idEndStation'});
  }
  return Trip;
};