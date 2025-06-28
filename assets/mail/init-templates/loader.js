const fs = require('fs');

module.exports = function(mailTmpTag) {
  const filePath = `${__dirname}/${mailTmpTag}.txt`;
  return fs.readFileSync(filePath, 'utf-8');
};
