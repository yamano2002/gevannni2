module.exports = {
  body: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        name_kana: {
          type: 'string'
        },
        BuildingId: {
          type: 'integer'
        },
        charge_person_name: {
          type: 'string'
        },
        tel: {
          type: 'string'
        },
        mail: {
          type: 'string'
        }
      },
      required: ['name', 'charge_person_name', 'tel', 'mail'],
      additionalProperties: false
    }
  }
};
