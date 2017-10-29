'use strict';
module.exports = (sequelize, DataTypes) => {
  var Booking = sequelize.define('Booking', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    group: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    remark: DataTypes.STRING,
    date: DataTypes.DATE,
    nbBikes : DataTypes.INTEGER,
    token : DataTypes.TEXT
  });
  Booking.associate = function(models){

      Booking.belongsTo(models.Station, {foreignKey: 'idStartStation'});
      Booking.belongsTo(models.Station, {foreignKey: 'idEndStation'});

      //Booking.belongsTo(models.Line, {foreignKey: 'idLine'});

      Booking.hasMany(models.Trip, {foreignKey: 'idBooking'});
  }
  return Booking;
};