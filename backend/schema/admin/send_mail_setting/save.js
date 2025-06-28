module.exports = {
  body: {
    type: 'object',
    properties: {
      tag: {
        type: 'string'
      },
      value: {
        type: 'string'
      }
    },
    required: ['tag', 'value'],
    additionalProperties: false
  }
};
