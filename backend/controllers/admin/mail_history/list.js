const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  let { total, items } = await models.SentMail.getListWithPaginate(
    request.query
  );

  items = items.map(mail => {
    mail = mail.toJSON();
    mail.to = mail.SentMailContent.to;
    mail.subject = mail.SentMailContent.subject;
    delete mail.SentMailContent;
    return mail;
  });

  reply.send({ total, items });
};
