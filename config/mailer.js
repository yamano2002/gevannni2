module.exports = {
  development: {
    host: 'maildev',
    port: 25,
    ignoreTLS: true
  },
  test: {
    host: 'localhost',
    port: 1025,
    ignoreTLS: true
  },
  staging: {
    mailgun: true,
    auth: {
      api_key: process.env.GVN_MAILGUN_API_KEY,
      domain: process.env.GVN_MAILGUN_DOMAIN
    }
  },
  production: {
    mailgun: true,
    auth: {
      api_key: process.env.GVN_MAILGUN_API_KEY,
      domain: process.env.GVN_MAILGUN_DOMAIN
    }
  }
};
