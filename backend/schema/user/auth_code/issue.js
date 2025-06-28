module.exports = {
  body: {
    type: 'object',
    properties: {
      list_tag: {
        type: 'string',
        maxLength: 50
      },
      mail: {
        type: 'string',
        format: 'email',
        maxLength: 200
      }
    },
    required: ['list_tag', 'mail'],
    additionalProperties: false
  }
};
