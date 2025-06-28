module.exports = {
  querystring: {
    sortBy: { type: 'string', default: 'sentAt' },
    descending: { type: 'boolean', default: true },
    page: { type: 'integer', default: 1 },
    rowsPerPage: { type: 'integer', default: 25 },
    search: { type: 'string', default: '' }
  }
};
