module.exports = (sequelize, DataTypes) => {
  const SentMailContent = sequelize.define('SentMailContent', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    SentMailId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    to: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return SentMailContent;
};
