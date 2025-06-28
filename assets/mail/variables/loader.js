const fs = require('fs');

module.exports = function(version, mailTmpTag) {
  const versionStr = ('00' + version).slice(-3);
  const filePath = `${__dirname}/${versionStr}.js`;
  const variables = require(filePath);
  return JSON.stringify(variables[mailTmpTag]);
};
