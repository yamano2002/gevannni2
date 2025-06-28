const fs = require('fs');
const getStream = require('get-stream');
const parse = require('csv-parse');

module.exports = async (filePath, options = {}) => {
  const parseStream = parse(options);
  return await getStream.array(fs.createReadStream(filePath).pipe(parseStream));
};
