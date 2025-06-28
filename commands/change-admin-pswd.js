require('@babel/register');
const models = require('../db/models');

async function Adminpasschange() {
  if (process.argv.length != 4) {
    console.log(
      `usage: ${process.argv[0]} ${process.argv[1]} username new_password`
    );
    process.exit(1);
  }
  const username = process.argv[2];
  const newPasswordPlain = process.argv[3];

  const adminUser = await models.AdminUser.findOne({
    where: { name: username }
  });

  if (adminUser === null) {
    console.log('User not found.');
    process.exit(2);
  }

  await adminUser.changePassword(newPasswordPlain);
  console.log('Safely changed.');
  process.exit();
}

Adminpasschange();
