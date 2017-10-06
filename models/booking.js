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
    token : DataTypes.STRING
  });
  Booking.associate = function(models){
      Booking.belongsTo(models.Station, {foreignKey: 'departureStation'});
      Booking.belongsTo(models.Station, {foreignKey: 'arrivalStation'});
      Booking.belongsTo(models.Line, {foreignKey: 'line'});
  }
  return Booking;
};