const omit = require('lodash/omit');
const sendMail = require('../../../../mail/generalMail');
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const reqBody = request.body;

  const { _, mailData, targetGroups } = await sendMail(
    omit(reqBody, 'destinations'),
    reqBody.destinations
  );

  const joinedTargetGrpName = targetGroups
    .reduce((accum, curGrp) => accum + curGrp.name + ', ', '')
    .slice(0, -2);

  const sentMail = await models.SentMail.create(
    {
      from_address: mailData.from,
      reply_to: mailData.replyTo,
      SentMailContent: {
        to: joinedTargetGrpName,
        subject: reqBody.subject,
        body: reqBody.body
      }
    },
    {
      include: [models.SentMailContent]
    }
  );

  sentMail.setGroups(targetGroups);

  reply.send({});
};
