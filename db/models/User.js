const pswdSrvc = require('../../services/passwordService');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    password_hashed: {
      type: DataTypes.STRING(100)
    },
    password: {
      type: DataTypes.VIRTUAL
    }
  });

  const hashPasswordHook = async function(user, options) {
    if (!user.changed('password')) {
      return;
    }
    user.setDataValue('password_hashed', await pswdSrvc.genHash(user.password));
  };
  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);
  User.beforeSave(hashPasswordHook);

  User.prototype.verifyPassword = async function(passwordPlain) {
    return await pswdSrvc.verify(passwordPlain, this.password_hashed);
  };

  return User;
};
