'use strict';
module.exports = (sequelize, DataTypes) => {
  var Booking = sequelize.define('Booking', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    group: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    remark: DataTypes.STRING,
    date: DataTypes.STRING,
    nbBikes : DataTypes.INTEGER,
    token : DataTypes.TEXT,
    validated : { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  Booking.associate = function(models){

      Booking.belongsTo(models.Station, {foreignKey: 'idStartStation', as: 'departureStationBooking'});
      Booking.belongsTo(models.Station, {foreignKey: 'idEndStation', as: 'terminalStationBooking'});

      Booking.hasMany(models.Trip, {onDelete: 'CASCADE',foreignKey: 'idBooking'});
  }
  return Booking;
};