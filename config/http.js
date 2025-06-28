module.exports = {
  development: {
    backend: {
      port: 3000,
      allowOrigin: [
        'localhost:' + process.env.FRONT_ADMIN_PORT,
        'localhost:' + process.env.FRONT_USER_PORT
      ]
    },
    frontend: {
      backendFqdn: 'localhost:' + process.env.BACKEND_PORT
    }
  },

  test: {
    backend: {
      port: 3000,
      allowOrigin: [
        'localhost:' + process.env.FRONT_ADMIN_PORT,
        'localhost:' + process.env.FRONT_USER_PORT
      ]
    },
    frontend: {
      backendFqdn: 'localhost:' + process.env.BACKEND_PORT
    }
  },

  staging: {
    backend: {
      port: process.env.GVN_BACKEND_PORT,
      allowOrigin: [
        process.env.GVN_FQDN_FRONT_USER,
        process.env.GVN_FQDN_FRONT_ADMIN
      ]
    },
    frontend: {
      backendFqdn: process.env.GVN_FQDN_BACKEND || process.env.FQDN_BACKEND
    }
  },

  production: {
    backend: {
      port: process.env.GVN_BACKEND_PORT,
      allowOrigin: [
        process.env.GVN_FQDN_FRONT_USER,
        process.env.GVN_FQDN_FRONT_ADMIN
      ]
    },
    frontend: {
      backendFqdn: process.env.GVN_FQDN_BACKEND || process.env.FQDN_BACKEND
    }
  }
};
