const Sequelize = require('sequelize');
const env = process.env.NODE_ENV;
const config = require(__dirname + '/database/config/config.json')[env];

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
async function start() {
console.log(`dbsync.js: Syncing Database Models...`);
sequelize.sync();
};
