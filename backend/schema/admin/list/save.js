module.exports = {
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'integer'
      },
      name: {
        type: 'string'
      },
      tag: {
        type: 'string'
      },
      group_id_prefix: {
        type: 'string'
      },
      user_form_enabled: {
        type: 'boolean'
      },
      user_form_color: {
        type: 'string'
      }
    },
    required: ['name', 'tag', 'group_id_prefix'],
    additionalProperties: false
  }
};
