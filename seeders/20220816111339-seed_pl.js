"use strict";
const fs = require("fs");
// const fs = require("../data/programming-languages.json");
module.exports = {
  up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let pl = JSON.parse(
      fs.readFileSync(
        "../Pair-Project/data/programming-languages.json",
        "utf-8"
      )
    );
    pl.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    return queryInterface.bulkInsert("ProgrammingLanguages", pl);
  },

  down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("ProgrammingLanguages", null, {});
  },
};
