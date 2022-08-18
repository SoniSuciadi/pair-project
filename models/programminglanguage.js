"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgrammingLanguage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProgrammingLanguage.hasOne(models.User, {
        foreignKey: "ProgrammingLanguageId",
      });
      // define association here
    }
  }
  ProgrammingLanguage.init(
    {
      name: DataTypes.STRING,
      urlLogo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProgrammingLanguage",
    }
  );
  return ProgrammingLanguage;
};
