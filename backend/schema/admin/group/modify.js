module.exports = {
  body: {
    type: 'object',
    properties: {
      ListId: {
        type: 'integer'
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
      }
    },
    required: [
      'ListId',
      'id_pub',
      'name',
      'name_kana',
      'charge_person_name',
      'tel',
      'mail'
    ],
    additionalProperties: false
  }
};
