module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
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
    },
    group_id_prefix: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    user_form_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    user_form_color: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '#ffccff'
    }
  });

  List.associate = function(models) {
    models.List.hasMany(models.Group);
  };

  List.findByTag = async function(tag) {
    return await List.findOne({
      where: {
        tag: tag
      }
    });
  };

  return List;
};
