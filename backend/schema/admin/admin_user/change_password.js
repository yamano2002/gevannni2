module.exports = {
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string'
      },
      new_password: {
        type: 'string'
      }
    },
    required: ['username', 'new_password']
  }
};
