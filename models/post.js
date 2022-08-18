"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Category, {
        foreignKey: "CategoryId",
      });
      Post.belongsTo(models.User, {
        foreignKey: "UserId",
      });
    }
  }
  Post.init(
    {
      caption: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "caption Harus di Isi",
          },
          notEmpty: {
            msg: "caption Harus di Isi",
          },
        },
      },
      imgUrl: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "CategoryId Harus di Isi",
          },
          notEmpty: {
            msg: "CategoryId Harus di Isi",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
