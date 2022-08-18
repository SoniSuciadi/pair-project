function getWeather(city) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=73ff6ec9e308f079f30bdaf725190e8c`
  )
    .then((response) => response.json())
    .then((response) => response);
}

module.exports = getWeather;
