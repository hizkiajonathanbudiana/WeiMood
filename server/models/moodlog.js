'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoodLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MoodLog.init({
    happy: DataTypes.INTEGER,
    sad: DataTypes.INTEGER,
    overwhelmed: DataTypes.INTEGER,
    fear: DataTypes.INTEGER,
    calm: DataTypes.INTEGER,
    bored: DataTypes.INTEGER,
    excited: DataTypes.INTEGER,
    lonely: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MoodLog',
  });
  return MoodLog;
};