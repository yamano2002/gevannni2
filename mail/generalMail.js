const forOwn = require('lodash/forOwn');
const models = require('../db/models');
const Op = models.Sequelize.Op;
const mailFactory = require('./utilities/mailFactory');

const mgVarHeaderKey = 'recipient-variables';

let sender = null;
let sendResult = null;

let targetGroups = [];

// mapper of Mailgun variable -> Group property
const MgVar2GrpPrp = {
  group: 'name',
  charge: 'charge_person_name',
  id: 'fullIdPub',
  mail: 'mail'
};

let commonReplaces = {};

const genReplaces = () => {
  let rtnData = {};

  forOwn(MgVar2GrpPrp, (GrpPrp, MgVar) => {
    rtnData[MgVar] = `%recipient.${MgVar}%`;
  });

  return rtnData;
};

const extractMailAddrs = groups => {
  return groups.map(group => group.mail);
};

const constructMailgunVars = groups => {
  let rtnData = {};

  groups.forEach(group => {
    const mail = group.mail;
    rtnData[mail] = {};
    forOwn(MgVar2GrpPrp, (GrpPrp, MgVar) => {
      rtnData[mail][MgVar] = group[GrpPrp];
    });
  });

  return rtnData;
};

const prcEachList = async ({ ListId, groupIdPub }) => {
  const List = await models.List.findByPk(ListId);
  const Groups = await List.getGroups({
    where: {
      id_pub: {
        [Op.in]: groupIdPub
      }
    },
    include: [{ model: models.List }]
  });
  targetGroups = targetGroups.concat(Groups);

  const mailArr = extractMailAddrs(Groups);
  const to = mailArr.join(', ');

  const mgVars = constructMailgunVars(Groups);
  const customHeader = {
    [mgVarHeaderKey]: JSON.stringify(mgVars)
  };

  const replaces = { ...commonReplaces, form: List.name };

  sendResult = await sender.send(to, replaces, customHeader);
};

module.exports = async (mailAttr, destinations) => {
  targetGroups = [];

  commonReplaces = genReplaces();
  sender = new mailFactory({ mailAttr });

  for (const list of destinations) {
    await prcEachList(list);
  }

  return { ...sendResult, targetGroups };
};
