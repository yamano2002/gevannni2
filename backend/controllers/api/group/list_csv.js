/**
 *  旧 gevanni. のようなフォーマットで登録団体一覧の csv を返す
 */

const moment = require('moment');
moment.tz.setDefault('Asia/Tokyo');

const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const groups = await models.Group.findAll({
    include: [
      { model: models.List, where: { tag: request.params.listTag } },
      { model: models.Building }
    ]
  });

  let csvText = '';
  groups.forEach(group => {
    const groupId = group.fullIdPub;
    const groupName = group.name;
    const chargeName = group.charge_person_name;
    const building = group.Building ? group.Building.name : 'なし';
    const mail = group.mail;
    const tel = group.tel;
    const updatedAt = moment(group.updatedAt).toString();
    csvText += `${groupId},${groupName},${chargeName},${building},${mail},${tel},${updatedAt}\n`;
  });

  reply.type('text/csv');
  reply.send(csvText);
};
