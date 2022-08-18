const { Category, Post, ProgrammingLanguage, User } = require("../models");
const indonesia = require("indonesia");
const bcrypt = require("bcrypt");
const convert = require("../helpers/convertDate");
const getWeather = require("../helpers/getWeather");
const { Op } = require("sequelize");
const salt = bcrypt.genSaltSync(10);

class Controller {
  static showFormRegistrasi(req, res) {
    let objerr = {};
    if (req.query.err) {
      objerr = JSON.parse(req.query.err);
    }
    ProgrammingLanguage.findAll()
      .then((pl) => {
        res.render("registrasi", { pl, objerr });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static submitRegister(req, res) {
    let {
      name,
      username,
      email,
      password,
      dateOfBirth,
      ProgrammingLanguageId,
    } = req.body;
    User.create({
      name,
      username,
      email,
      password,
      dateOfBirth,
      ProgrammingLanguageId: +ProgrammingLanguageId,
    })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        let objerr = {};
        err.errors.forEach((el) => {
          objerr[el.path] = el.message;
        });
        res.redirect(`/register?err=${JSON.stringify(objerr)}`);
      });
  }
  static showFormLogin(req, res) {
    let objerr = {};
    if (req.query.err) {
      objerr = JSON.parse(req.query.err);
    }
    res.render("login", { objerr });
  }
  static submitLogin(req, res) {
    let { username, password } = req.body;
    User.findOne({
      where: {
        [Op.and]: [{ username: username }],
      },
    })
      .then((user) => {
        if (
          Object.keys(user).length &&
          bcrypt.compareSync(password, user.password)
        ) {
          console.log("oke");
          req.session.loggedin = true;
          req.session.username = username;
          req.session.userId = user.id;
          res.redirect("/home");
        } else {
          let objerr = { err: "username atau password salah" };
          res.redirect(`/login?err=${JSON.stringify(objerr)}`);
        }
      })
      .catch((err) => {
        let objerr = { err: "username atau password salah" };
        res.redirect(`/login?err=${JSON.stringify(objerr)}`);
      });
  }
  static readAllPost(req, res) {
    if (!req.session.loggedin) {
      res.redirect("/login");
    }
    let prop = {
      include: [
        {
          model: User,
        },
        {
          model: Category,
        },
      ],
      order: [["id", "DESC"]],
    };
    let { search, filter } = req.query;
    if (search) {
      prop.where = { caption: { [Op.iLike]: `%${search}%` } };
    } else if (filter) {
      prop.where = { CategoryId: { [Op.eq]: filter } };
    }
    let post, categories;
    Post.findAll(prop)
      .then((postt) => {
        post = postt;
        return Category.findAll();
      })
      .then((categoriess) => {
        categories = categoriess;
        return User.findByPk(req.session.userId);
      })
      .then((user) => {
        res.render("home", { post, categories, convert, user });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static submitAddPosting(req, res) {
    let userId = req.session.userId;
    let { caption, imgUrl, CategoryId } = req.body;
    Post.create({ caption, imgUrl, CategoryId, UserId: userId })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static readUserData(req, res) {
    if (!req.session.loggedin) {
      res.redirect("/login");
    }

    let user, pl;
    let cuaca = {};
    indonesia.getProvinces((loc) => {
      User.findOne({
        include: [
          {
            model: ProgrammingLanguage,
          },
          {
            model: Post,
            include: {
              model: Category,
            },
          },
        ],
        where: { id: { [Op.eq]: +req.session.userId } },
      })
        .then(async (userr) => {
          user = userr;
          if (user.address) {
            cuaca = await getWeather(user.address);
          }
          console.log(cuaca, "===========");
          return ProgrammingLanguage.findAll();
        })
        .then((pll) => {
          pl = pll;
          res.render("profile", {
            user,
            convert,
            pl,
            loc,
            weather: cuaca,
          });
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    });
  }
  static deletePosting(req, res) {
    let { id } = req.params;
    Post.destroy({ where: { id: { [Op.eq]: +id } } })
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static submitEdited(req, res) {
    let {
      name,
      username,
      imgUrl,
      address,
      dateOfBirth,
      ProgrammingLanguageId,
      about,
    } = req.body;
    User.update(
      {
        name,
        username,
        address,
        dateOfBirth,
        imgUrl,
        ProgrammingLanguageId: +ProgrammingLanguageId,
        about,
      },
      {
        where: { id: { [Op.eq]: +req.session.userId } },
      }
    )
      .then(() => {
        res.redirect("/profile");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static logout(req, res) {
    delete req.session.loggedin;
    delete req.session.username;
    delete req.session.userId;
    res.redirect("/login");
  }
  static showGantiPassword(req, res) {
    let objerr = {};
    if (req.query.err) {
      objerr = JSON.parse(req.query.err);
    }
    res.render("gantiPassword", { objerr });
  }
  static submitGantiPassword(req, res) {
    let { password, newPassword, reapetPassword } = req.body;
    if (newPassword === reapetPassword) {
      newPassword = bcrypt.hashSync(newPassword, salt);
      User.findByPk(+req.session.userId)
        .then((user) => {
          if (bcrypt.compareSync(password, user.password)) {
            return User.update(
              { password: newPassword },
              { where: { id: +req.session.userId } }
            );
          }
        })
        .then((result) => {
          res.redirect("/home");
        })
        .catch((err) => {
          let objerr = { err: "gagal" };
          res.redirect(`/gantiPassword?err=${JSON.stringify(objerr)}`);
        });
    } else {
      let objerr = { newpassword: "password tidak sama" };
      res.redirect(`/gantiPassword?err=${JSON.stringify(objerr)}`);
    }
  }
  static showLandingPage(req, res) {
    res.render("landing");
  }
}

module.exports = Controller;
