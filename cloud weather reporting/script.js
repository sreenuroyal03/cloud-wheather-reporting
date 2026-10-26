const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    message.textContent = "Please enter a city name.";
    return;
  }

  searchBtn.disabled = true;
  message.textContent = "Loading weather data...";

  try {
    const geoURL =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) + "&count=1&language=en&format=json";

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
      throw new Error("Unable to search for the city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Try another name.");
    }

    const place = geoData.results[0];

    const weatherURL =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude +
      "&longitude=" +
      place.longitude +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m";

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error("Unable to retrieve weather.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    const conditions = {
      0: ["Clear sky", "☀️"],
      1: ["Mainly clear", "🌤️"],
      2: ["Partly cloudy", "⛅"],
      3: ["Overcast", "☁️"],
      45: ["Foggy", "🌫️"],
      48: ["Foggy", "🌫️"],
      51: ["Light drizzle", "🌦️"],
      53: ["Drizzle", "🌦️"],
      55: ["Heavy drizzle", "🌧️"],
      61: ["Light rain", "🌧️"],
      63: ["Rain", "🌧️"],
      65: ["Heavy rain", "🌧️"],
      71: ["Light snow", "🌨️"],
      73: ["Snow", "❄️"],
      75: ["Heavy snow", "❄️"],
      80: ["Rain showers", "🌦️"],
      81: ["Rain showers", "🌧️"],
      82: ["Heavy rain showers", "⛈️"],
      95: ["Thunderstorm", "⛈️"]
    };

    const result = conditions[current.weather_code] ||
      ["Variable conditions", "🌡️"];

    document.getElementById("cityName").textContent =
      place.name + (place.country ? ", " + place.country : "");

    document.getElementById("temperature").textContent =
      current.temperature_2m + " °C";

    document.getElementById("condition").textContent = result[0];
    document.getElementById("icon").textContent = result[1];

    document.getElementById("humidity").textContent =
      current.relative_humidity_2m + "%";

    document.getElementById("wind").textContent =
      current.wind_speed_10m + " km/h";

    message.textContent =
      "Feels like " + current.apparent_temperature +
      " °C · Updated " + current.time.replace("T", " ");

  } catch (error) {
    message.textContent = error.message ||
      "Something went wrong. Please try again.";
  } finally {
    searchBtn.disabled = false;
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", event => {
  if (event.key === "Enter") getWeather();
});