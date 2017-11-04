'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    password : {
        type: DataTypes.VIRTUAL,
        set: function (val) {
            this.setDataValue('password', val);
            this.setDataValue('password_hash', bcrypt.hashSync(val, saltRounds));
        }
    },
    email: DataTypes.STRING

  });
  User.associate = function(models){
      User.belongsTo(models.Role, {onDelete: 'CASCADE', foreignKey: 'idRole'});
      User.belongsTo(models.Zone, {onDelete: 'CASCADE', foreignKey: 'idZone'});
  }
  return User;
};