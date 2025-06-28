function replace(string) {
  let escapes = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  };
  return string.replace(/[<>&"']/g, c => {
    return escapes[c];
  });
}

function escapeHSpChars(thing) {
  switch (typeof thing) {
    case 'boolean':
      return thing;
    case 'number':
      return thing;
    case 'string':
      return replace(thing);
    case 'object':
      if (Array.isArray(thing)) {
        return thing.map(content => escapeHSpChars(content));
      }
      let newObj = new Object();
      for (let key in thing) {
        let newkey = replace(key);
        newObj[newkey] = escapeHSpChars(thing[key]);
      }
      return newObj;
    default:
      return 'Unsupported type';
  }
}

module.exports = thing => {
  return escapeHSpChars(thing);
};
