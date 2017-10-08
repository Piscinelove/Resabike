'use strict';
module.exports = (sequelize, DataTypes) => {
    var LineStation = sequelize.define('LineStation', {
        order: DataTypes.INTEGER
    });
    LineStation.associate = function(models){

        LineStation.belongsTo(models.Line, {foreignKey: 'idLine'});
        LineStation.belongsTo(models.Station, {foreignKey: 'idStation'});
    }
    return LineStation;
};