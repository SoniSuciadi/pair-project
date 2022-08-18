"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: "UserId",
      });
      User.belongsTo(models.ProgrammingLanguage, {
        foreignKey: "ProgrammingLanguageId",
      });
    }
    get formatDate() {
      return new Date(this.dateOfBirth).toISOString().split("T")[0];
    }
    get age() {
      return (
        new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear()
      );
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Nama Harus di Isi",
          },
          notEmpty: {
            msg: "Nama Harus di Isi",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username Harus di Isi",
          },
          notEmpty: {
            msg: "Username Harus di Isi",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "email Harus di Isi",
          },
          notEmpty: {
            msg: "email Harus di Isi",
          },
          isEmail: {
            msg: "Format email harus benar",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password Harus di Isi",
          },
          notEmpty: {
            msg: "password Harus di Isi",
          },
        },
      },
      about: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      address: DataTypes.STRING,
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tanggal Lahir Harus di Isi",
          },
          notEmpty: {
            msg: "Tanggal Lahir di Isi",
          },
          check(value) {
            let current = new Date();
            let input = new Date(value);
            if (current.getFullYear() - input.getFullYear() < 17) {
              throw new Error("Umur anda dibawah 17 tahun");
            }
          },
        },
      },
      ProgrammingLanguageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Bahasa Pemograman Harus Dipilih",
          },
          notEmpty: {
            msg: "Bahasa Pemograman Harus Dipilih",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    let encryp = bcrypt.hashSync(user.password, salt);
    user.password = encryp;
  });
  User.beforeUpdate((user) => {
    let encryp = bcrypt.hashSync(user.password, salt);
    user.password = encryp;
  });

  return User;
};
