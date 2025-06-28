module.exports = {
  body: {
    type: 'object',
    properties: {
      list_tag: {
        type: 'string',
        maxLength: 50
      },
      id_pub: {
        type: 'integer'
      },
      mail: {
        type: 'string',
        format: 'email',
        maxLength: 200
      }
    },
    required: ['list_tag', 'id_pub', 'mail'],
    additionalProperties: false
  }
};
