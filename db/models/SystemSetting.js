module.exports = (sequelize, DataTypes) => {
  const SystemSetting = sequelize.define('SystemSetting', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        const valueRaw = this.getDataValue('value');
        return valueRaw && JSON.parse(valueRaw.toString());
      },
      set(newValue) {
        this.setDataValue('value', JSON.stringify(newValue));
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  SystemSetting.get = async function(key) {
    const record = await SystemSetting.findOne({
      where: {
        key: key
      }
    });
    return record ? record.value : null;
  };

  SystemSetting.set = async function(key, value) {
    await SystemSetting.findOrBuild({
      where: { key }
    }).spread(async (instance, built) => {
      await instance.set('value', value).save();
    });
  };

  SystemSetting.deleteKey = function(key) {
    return SystemSetting.set(key, null);
  };

  return SystemSetting;
};
