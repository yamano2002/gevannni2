module.exports = (num, length) => {
  return ('0000000000' + num).slice(-length);
};
