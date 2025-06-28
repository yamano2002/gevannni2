const httpError = require('http-errors');
const models = require('../../../../db/models');
const modifyTokenSrv = require('../../../../services/user/groupModifyTokenService');

module.exports = async (request, reply) => {
  const listTag = request.body.list_tag;
  const groupIdPub = request.body.id_pub;
  const mail = request.body.mail;

  const Group = await models.Group.findByListTagAndIdPub(listTag, groupIdPub);
  if (Group === null || Group.mail !== mail) {
    reply.send(new httpError.BadRequest('Authentication failed.'));
    return;
  }

  const modifyToken = await modifyTokenSrv.issue(listTag, groupIdPub);

  reply.send({
    modify_token: modifyToken,
    group_info: {
      name: Group.name,
      name_kana: Group.name_kana,
      BuildingId: Group.BuildingId
    }
  });
};
