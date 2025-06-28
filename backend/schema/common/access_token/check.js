module.exports = {
  body: {
    type: 'object',
    properties: {
      access_token: {
        type: 'string'
      }
    },
    required: ['access_token']
  }
};
