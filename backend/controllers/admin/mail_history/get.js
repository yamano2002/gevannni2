const httpError = require('http-errors');
const pick = require('lodash/pick');
const SCOPE = require('../../../../enums/adminScopes').default;
const models = require('../../../../db/models');

module.exports = async (request, reply) => {
  const sentMailId = request.params.sentMailId;

  let SentMail = await models.SentMail.findByPk(sentMailId, {
    attributes: ['from_address', 'reply_to', 'sentAt'],
    include: [
      {
        model: models.SentMailContent,
        attributes: ['subject', 'body']
      },
      {
        model: models.Group,
        attributes: [
          'ListId',
          'name',
          'charge_person_name',
          'mail_crypt',
          'deletedAt'
        ],
        paranoid: false // include deleted rows
      }
    ]
  });

  if (SentMail === null) {
    throw new httpError.BadRequest('Mail does not exist.');
  }

  // process data
  SentMail = SentMail.toJSON();
  SentMail.subject = SentMail.SentMailContent.subject;
  SentMail.body = SentMail.SentMailContent.body;
  delete SentMail.SentMailContent;

  let pickGrpAttrs = ['ListId', 'name'];
  if (request.checkScope(request, SCOPE.SENT_MAIL_HISTORY)) {
    // include private info
    pickGrpAttrs = pickGrpAttrs.concat([
      'charge_person_name',
      'mail',
      'deletedAt'
    ]);
  }

  SentMail.Groups = SentMail.Groups.map(group => {
    return pick(group, pickGrpAttrs);
  });

  reply.send(SentMail);
};
