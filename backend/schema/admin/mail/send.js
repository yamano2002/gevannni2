module.exports = {
  body: {
    type: 'object',
    properties: {
      from_address_local_part: {
        type: 'string'
      },
      from_address_name: {
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
      },
      destinations: {
        type: 'array',
        items: [
          {
            type: 'object',
            properties: {
              ListId: {
                type: 'integer'
              },
              groupIdPub: {
                type: 'array',
                items: [
                  {
                    type: 'integer'
                  }
                ]
              }
            },
            required: ['ListId', 'groupIdPub']
          }
        ]
      }
    },
    required: ['subject', 'body', 'destinations'],
    additionalProperties: false
  }
};
