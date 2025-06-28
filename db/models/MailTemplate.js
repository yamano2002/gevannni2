module.exports = (sequelize, DataTypes) => {
  const MailTemplate = sequelize.define('MailTemplate', {
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
    has_sign: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    from_address_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    from_address_local_part: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    reply_to: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING(70),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    variables: {
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        return JSON.parse(this.getDataValue('variables').toString());
      }
    }
  });

  MailTemplate.findByTag = async function(tag) {
    return await MailTemplate.findOne({
      where: {
        tag: tag
      }
    });
  };

  return MailTemplate;
};
