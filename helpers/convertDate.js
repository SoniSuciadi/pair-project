let convert = (date) => {
  let newDate = new Date(date);
  return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()} ${konversi(
    newDate.getHours()
  )}:${konversi(newDate.getMinutes())}`;
};
let konversi = (number) => {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
};
module.exports = convert;

const { response } = require("express");


