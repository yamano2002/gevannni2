module.exports = {
  body: {
    type: 'object',
    properties: {
      tag: {
        type: 'string'
      },
      has_sign: {
        type: 'boolean'
      },
      from_address_name: {
        type: 'string'
      },
      from_address_local_part: {
        type: 'string'
      },
      reply_to: {
        type: 'string'
      },
      subject: {
        type: 'string'
      },
      body: {
        type: 'string'
      }
    },
    required: [
      'tag',
      'has_sign',
      'from_address_name',
      'from_address_local_part',
      'reply_to',
      'subject',
      'body'
    ],
    additionalProperties: false
  }
};
