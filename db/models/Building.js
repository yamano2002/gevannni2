module.exports = (sequelize, DataTypes) => {
  const Building = sequelize.define('Building', {
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
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  });
  return Building;
};
