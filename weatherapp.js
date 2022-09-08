let root = "https://api.openweathermap.org";
let apiKey = "ac14ff88274dacebdaa2ce9f3d2d4b19";

let date = document.querySelector("#weather-date");
let days = document.querySelectorAll(".day__block");
let description = document.querySelector("#weather-description");
let icon = document.querySelector(".weather__icon--today");
let place = document.querySelector("#weather-location");
let temperature = document.querySelector(".weather-temp--today");
let humidity = document.querySelector("#humidity-quality");
let wind = document.querySelector("#wind-speed");
let refreshBtn = document.querySelector("#weather-refresh");
let form = document.querySelector("#weather__form");
let formLocation = form.querySelector("#weather__form-location");

function currentDay(dayNumber) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNumber];
}

function currentMinutes(minutesNumber) {
  if (minutesNumber < 10) {
    return "0" + minutesNumber;
  } else {
    return minutesNumber;
  }
}

function currentDate(date) {
  let day = currentDay(date.getDay());
  let hours = date.getHours();
  let minutes = currentMinutes(date.getMinutes());

  return day + " " + hours + ":" + minutes;
}

function refreshWeather(queryParameters) {
  let apiParameters = "appid=" + apiKey + "&units=metric";
  axios
    .get(root + "/data/2.5/weather?" + apiParameters + "&" + queryParameters)
    .then(function (response) {
      date.innerHTML = currentDate(new Date());
      place.innerHTML = response.data.name;
      description.innerHTML = response.data.weather[0].main;
      temperature.innerHTML = Math.round(response.data.main.temp);
      wind.innerHTML = Math.round(response.data.wind.speed) + "km/h";
      humidity.innerHTML = Math.round(response.data.main.humidity) + "%";
    });

  axios
    .get(root + "/data/2.5/forecast?" + apiParameters + "&" + queryParameters)
    .then(function (response) {
      document
        .querySelectorAll(".day__block")
        .forEach(function (element, index) {
          let day = new Date(response.data.list[index].dt_txt);
          element.querySelector(".day__block-date").innerHTML =
            currentDate(day);
          element.querySelector(".day__block-temp").innerHTML = Math.round(
            response.data.list[index].main.temp
          );
        });
    });
}

form.addEventListener("submit", function (event) {
  refreshWeather("q=" + form.querySelector("#weather__form-location").value);
  event.preventDefault();
});

refreshBtn.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(function (position) {
    refreshWeather(
      "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude
    );
  });
});

refreshWeather("q=Kyiv");
