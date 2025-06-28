const pswdSrvc = require('../../services/passwordService');

module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
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
      type: DataTypes.STRING(100),
      allowNull: false
    }
  });

  AdminUser.prototype.verifyPassword = async function(passwordPlain) {
    return await pswdSrvc.verify(passwordPlain, this.password_hashed);
  };

  AdminUser.prototype.changePassword = async function(newPasswordPlain) {
    const newPasswordHashed = await pswdSrvc.genHash(newPasswordPlain);
    await this.update({ password_hashed: newPasswordHashed });
  };

  AdminUser.prototype.getScopeArray = async function() {
    const scopes = this.AdminScopes || (await this.getAdminScopes());
    return scopes.map(item => item.name);
  };

  AdminUser.associate = function(models) {
    models.AdminUser.belongsToMany(models.AdminScope, {
      through: 'AdminUserAdminScopes'
    });
  };

  return AdminUser;
};
