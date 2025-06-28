module.exports = (sequelize, DataTypes) => {
  const SentMail = sequelize.define(
    'SentMail',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      from_address: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      reply_to: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue() {
          // current time
          return new Date();
        }
      }
    },
    {
      scopes: {
        search(searchQuery) {
          const SentMailContent = sequelize.import('./SentMailContent');
          const obj = {
            model: SentMailContent,
            attributes: ['subject', 'to']
          };
          if (searchQuery) {
            obj.where = sequelize.literal(
              `MATCH (\`to\`, \`subject\`, \`body\`) AGAINST ("*D+ ${searchQuery}" IN BOOLEAN MODE)`
            );
          }

          return { include: [obj] };
        }
      }
    }
  );

  SentMail.associate = function(models) {
    models.SentMail.hasOne(models.SentMailContent);
    models.SentMail.belongsToMany(models.Group, {
      through: 'SentMailGroups'
    });
  };

  SentMail.getListWithPaginate = async function(params) {
    const total = await SentMail.scope({
      method: ['search', params.search]
    }).count();

    const paginOpt = {
      attributes: ['id', 'sentAt']
    };

    if (params.sortBy) {
      paginOpt.order = [[params.sortBy, params.descending ? 'DESC' : 'ASC']];
    }

    if (params.rowsPerPage > -1) {
      const perPage = params.rowsPerPage;
      const page = params.page || 1;
      paginOpt.offset = (page - 1) * perPage;
      paginOpt.limit = perPage;
    }

    const items = await SentMail.scope({
      method: ['search', params.search]
    }).findAll(paginOpt);

    return { total, items };
  };

  return SentMail;
};
