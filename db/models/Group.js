const Op = require('sequelize').Op;
const cryptSrv = require('../../services/cryptService');
const appConfig = require('../../config/app').default;
const zeroPadding = require('../../utilities/zeroPadding');
const REGISTER_GROUP_ERROR = require('../../enums/errors/registerGroup')
  .default;

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      list_tag: {
        type: DataTypes.VIRTUAL
      },
      ListId: {
        type: DataTypes.INTEGER.UNSIGNED
      },
      id_pub: {
        type: DataTypes.INTEGER.UNSIGNED
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      name_kana: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      BuildingId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      charge_person_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      tel: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      mail_crypt: {
        type: DataTypes.STRING(1024),
        allowNull: false
      },
      mail: {
        type: DataTypes.VIRTUAL,
        get() {
          return cryptSrv.decrypt(this.mail_crypt);
        },
        set(value) {
          this.mail_crypt = cryptSrv.encrypt(value);
        }
      },
      firstRegisteredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue() {
          // current time
          return new Date();
        }
      }
    },
    {
      paranoid: true, // enable soft delete
      getterMethods: {
        fullIdPub() {
          if (!this.List) {
            return '';
          }
          const idPubZeroFilled = zeroPadding(
            this.id_pub,
            appConfig.GROUP_ID_PUB_DIGIT_NUM
          );
          return `${this.List.group_id_prefix}-${idPubZeroFilled}`;
        }
      }
    }
  );

  Group.associate = function(models) {
    models.Group.belongsTo(models.List);
    models.Group.belongsTo(models.Building);
  };

  Group.beforeCreate(async (group, options) => {
    await group.setListIdFromTag();

    if (!group.id_pub) {
      await group.assignNewIdPub(options);
    }

    if (await group.isNameDuplicated(options)) {
      throw new Error(REGISTER_GROUP_ERROR.GROUP_NAME_DUPLICATED);
    }
    if (await group.isMailDuplicated(options)) {
      throw new Error(REGISTER_GROUP_ERROR.MAIL_DUPLICATED);
    }

    if (!group.BuildingId) {
      group.BuildingId = null;
    }
  });

  /**
   * @param listTag
   * @param idPub
   * @returns {Promise<Group>}
   */
  Group.findByListTagAndIdPub = async function(listTag, idPub) {
    const List = sequelize.import('./List');
    return await Group.findOne({
      where: {
        id_pub: idPub
      },
      include: [{ model: List, where: { tag: listTag } }]
    });
  };

  /**
   * Modify information of the group specified with ListId and id_pub.
   * Execute soft-delete of old row first,
   *   and then insert row with new group information.
   *
   * @param groupAttrs
   * @returns {Promise<Group>}
   */
  Group.modify = async function(groupAttrs) {
    const group = Group.build(groupAttrs);
    await group.setListIdFromTag();

    const condition = {
      ListId: group.ListId,
      id_pub: group.id_pub
    };

    // check the existence
    const prevGroup = await Group.findOne({
      where: condition,
      order: [['createdAt', 'DESC']]
    });
    if (prevGroup === null) {
      throw new Error('Specified group does not exist.');
    }
    const firstRegisteredAt = prevGroup.firstRegisteredAt;

    // Soft delete is canceled when insert is failed due to duplication check.
    let newGroup = null;
    await sequelize.transaction(async function(t) {
      // soft delete
      await Group.destroy({
        where: condition,
        transaction: t
      });

      // insert
      groupAttrs.firstRegisteredAt = firstRegisteredAt;
      newGroup = await Group.create(groupAttrs, { transaction: t });
    });

    return newGroup;
  };

  /**
   * @param options
   * @returns {Promise<boolean>}
   */
  Group.prototype.isNameDuplicated = async function(options) {
    const condition = {
      ListId: this.ListId,
      [Op.or]: [{ id_pub: this.id_pub }, { name: this.name }]
    };
    const count = await Group.count({
      where: condition,
      transaction: options.transaction
    });
    return count > 0;
  };

  /**
   * @param options
   * @returns {Promise<boolean>}
   */
  Group.prototype.isMailDuplicated = async function(options) {
    const condition = {
      ListId: this.ListId,
      [Op.or]: [{ id_pub: this.id_pub }, { mail_crypt: this.mail_crypt }]
    };

    const count = await Group.count({
      where: condition,
      transaction: options.transaction
    });
    return count > 0;
  };

  /**
   * @returns {Promise<void>}
   */
  Group.prototype.setListIdFromTag = async function() {
    if (!this.ListId && this.list_tag) {
      const List = sequelize.import('./List');
      const targetList = await List.findByTag(this.list_tag);
      if (targetList === null) {
        throw new Error('Invalid List tag.');
      }
      this.ListId = targetList.id;
    }
  };

  /**
   * @returns {Promise<void>}
   */
  Group.prototype.assignNewIdPub = async function(options) {
    const lastGroup = await Group.findOne({
      where: {
        ListId: this.ListId
      },
      order: [['id_pub', 'DESC']],
      attributes: ['id_pub'],
      paranoid: false, // include deleted rows
      transaction: options.transaction
    });

    if (lastGroup === null) {
      this.id_pub = 1;
      return;
    }
    this.id_pub = lastGroup.id_pub + 1;
  };

  /**
   * Set `this.List`
   *
   * @returns {Promise<void>}
   */
  Group.prototype.loadList = async function() {
    if (!this.List) {
      await this.reload({
        include: ['List']
      });
    }
  };

  /**
   * Return instance of previous info (deleted)
   *
   * @returns {Promise<Group>}
   */
  Group.prototype.getPrevInfo = async function() {
    return await Group.findOne({
      where: {
        ListId: this.ListId,
        id_pub: this.id_pub,
        createdAt: {
          [Op.lt]: this.createdAt
        }
      },
      order: [['createdAt', 'DESC']],
      paranoid: false
    });
  };

  return Group;
};
