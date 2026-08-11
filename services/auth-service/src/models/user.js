import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    role: DataTypes.ENUM('admin', 'user', 'guest'),
    avatar: DataTypes.STRING,
    phone: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};