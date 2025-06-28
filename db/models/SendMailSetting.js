const Op = require('sequelize').Op;

module.exports = (sequelize, DataTypes) => {
  const SendMailSetting = sequelize.define('SendMailSetting', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    form_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'text'
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
    }
  });

  SendMailSetting.findByTag = async function(tag) {
    return await SendMailSetting.findOne({
      where: {
        tag: tag
      }
    });
  };

  SendMailSetting.getValuesByTag = async function(tags = []) {
    let option = {
      attributes: ['tag', 'value']
    };
    if (tags.length > 0) {
      option.where = {
        tag: {
          [Op.in]: tags
        }
      };
    }

    const rows = await SendMailSetting.findAll(option);
    return rows.reduce((accum, setting) => {
      accum[setting.tag] = setting.value;
      return accum;
    }, {});
  };

  return SendMailSetting;
};
