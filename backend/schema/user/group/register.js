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
      name: {
        type: 'string',
        maxLength: 100
      },
      name_kana: {
        type: 'string',
        maxLength: 255
      },
      BuildingId: {
        type: 'integer',
        default: null
      },
      charge_person_name: {
        type: 'string',
        maxLength: 100
      },
      tel: {
        type: 'string',
        maxLength: 20,
        pattern: '^[0-9]+$'
      },
      mail: {
        type: 'string',
        format: 'email',
        maxLength: 200
      },
      mail_auth_code: {
        type: 'string'
      },
      modify_token: {
        type: 'string',
        default: 'modify_token'
      }
    },
    required: [
      'list_tag',
      'name',
      'name_kana',
      'charge_person_name',
      'tel',
      'mail',
      'mail_auth_code'
    ],
    additionalProperties: false
  }
};
