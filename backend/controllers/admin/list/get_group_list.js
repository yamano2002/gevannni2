const omit = require('lodash/omit');
const SCOPE = require('../../../../enums/adminScopes').default;
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const Groups = await models.Group.findAll({
    attributes: {
      exclude: ['createdAt', 'deletedAt']
    },
    include: [
      'List',
      {
        model: models.Building,
        attributes: ['name']
      }
    ],
    where: {
      ListId: request.params.listid
    }
  });

  const GroupsArr = Groups.map(group => {
    let groupArr = group.toJSON();
    groupArr = omit(groupArr, ['mail_crypt', 'List']);

    if (!request.checkScope(request, SCOPE.GROUP)) {
      // omit private info
      groupArr = omit(groupArr, ['charge_person_name', 'tel', 'mail']);
    }

    return groupArr;
  });
  reply.send(GroupsArr);
};
