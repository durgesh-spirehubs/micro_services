import Sequelize from 'sequelize';
import configData from '../config/database.js';
import initUser from './user.js';

const env = process.env.NODE_ENV || 'development';
const config = configData[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const db = {
  sequelize,
  Sequelize,
};

// Initialize models
db.User = initUser(sequelize, Sequelize.DataTypes);

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
