'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trip = sequelize.define('Trip', {
    startHour: DataTypes.DATE
  });
  return Trip;
};