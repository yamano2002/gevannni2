const fs = require('fs');

module.exports = async (request, reply) => {
  let readcsv = fs.readFileSync(
    './assets/group_register_csv_sample.csv',
    'utf-8'
  );
  reply.send(readcsv);
};
