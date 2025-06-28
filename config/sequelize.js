module.exports = {
  development: {
    username: 'root',
    password: '<YourStrong!Passw0rd>',
    database: 'gevanni2_development',
    host: 'mariadb',
    dialect: 'mysql',
    seederStorage: 'sequelize'
  },
  test: {
    username: 'root',
    password: '<YourStrong!Passw0rd>',
    database: 'gevanni2_test',
    host: 'mariadb',
    dialect: 'mysql'
  },
  staging: {
    username: process.env.GVN_DB_USERNAME,
    password: process.env.GVN_DB_PASSWORD,
    database: process.env.GVN_DB_DATABASE,
    host: process.env.GVN_DB_HOST,
    port: process.env.GVN_DB_PORT,
    dialect: 'mysql',
    seederStorage: 'sequelize'
  },
  production: {
    username: process.env.GVN_DB_USERNAME,
    password: process.env.GVN_DB_PASSWORD,
    database: process.env.GVN_DB_DATABASE,
    host: process.env.GVN_DB_HOST,
    port: process.env.GVN_DB_PORT,
    dialect: 'mysql',
    seederStorage: 'sequelize'
  }
};
