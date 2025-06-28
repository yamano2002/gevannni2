module.exports = (text, replaces = {}) => {
  Object.keys(replaces).forEach(key => {
    const search = `#{${key}}`;
    const regExp = new RegExp(search, 'g');
    text = text.replace(regExp, replaces[key]);
  });

  return text;
};
