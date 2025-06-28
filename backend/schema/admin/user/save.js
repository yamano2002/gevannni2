module.exports = {
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        default: null
      },
      name: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['name', 'password'],
    additionalProperties: false
  }
};
