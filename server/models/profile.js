'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    displayName: DataTypes.STRING,
    age: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    personality: DataTypes.STRING,
    hobbies: DataTypes.STRING,
    interests: DataTypes.STRING,
    favMusic: DataTypes.STRING,
    favGenreMusic: DataTypes.STRING,
    activityLevel: DataTypes.STRING,
    status: DataTypes.STRING,
    field: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};