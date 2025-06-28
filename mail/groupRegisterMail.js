const mailTemplateTag = require('../enums/mailTmpTag');
const mailFactory = require('./utilities/mailFactory');

const generateReplaces = async (Group, isAdd = true) => {
  await Group.loadList();

  let replaces = {
    form: Group.List.name,
    group: Group.name,
    id: Group.fullIdPub
  };

  if (isAdd) {
    replaces.mail = Group.mail;
    replaces.charge = Group.charge_person_name;
  } else {
    replaces.mail_latter = Group.mail;
    replaces.charge_latter = Group.charge_person_name;

    const prevGroup = await Group.getPrevInfo();
    replaces.mail_former = prevGroup.mail;
    replaces.charge_former = prevGroup.charge_person_name;
  }

  return replaces;
};

module.exports = async (Group, isAdd = true) => {
  const replaces = await generateReplaces(Group, isAdd);

  const mailTmpTag = isAdd
    ? mailTemplateTag.GROUP_REGISTER_ADD
    : mailTemplateTag.GROUP_REGISTER_MODIFY;
  const sender = new mailFactory({ templateTag: mailTmpTag });
  await sender.send(Group.mail, replaces);
  if (!isAdd) {
    await sender.send(replaces.mail_former, replaces);
  }
};
