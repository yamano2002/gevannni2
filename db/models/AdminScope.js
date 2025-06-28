module.exports = (sequelize, DataTypes) => {
  const AdminScope = sequelize.define('AdminScope', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  });

  return AdminScope;
};
