const apiKey = config.apiKey;
let currentUnit = "imperial";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");
const loadingDiv = document.querySelector(".loading");
const unitToggle = document.querySelector(".unit-toggle");
const cityEl = document.querySelector(".city");
const tempEl = document.querySelector(".temp");
const humidityEl = document.querySelector(".humidity");
const windEl = document.querySelector(".wind");
const sunriseEl = document.querySelector(".sunrise");
const sunsetEl = document.querySelector(".sunset");

window.onload = () => {
  const last = localStorage.getItem("lastCity");
  if (last) {
    document.querySelector(".search input").value = last;
    checkWeather(last);
  }
};

unitToggle.value = currentUnit;

function getApiUrl(cityName) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${currentUnit}&appid=${apiKey}`;
}

async function checkWeather(cityName) {
  if (!cityName || cityName.trim() === "") return;

  weatherDiv.style.display = "none";
  errorDiv.style.display = "none";
  loadingDiv.style.display = "block";

  const startTime = Date.now();
  const minDisplayTime = 500;

  try {
    const response = await fetch(getApiUrl(cityName));
    const data = await response.json();

    console.log(data);

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    await new Promise((resolve) => setTimeout(resolve, remainingTime));

    if (!response.ok || data.cod == 404) {
      throw new Error("City not found");
    }

    loadingDiv.style.display = "none";
    weatherDiv.style.display = "block";
    errorDiv.style.display = "none";

    cityEl.textContent = data.name;

    const unitSymbol = currentUnit === "imperial" ? "°F" : "°C";
    tempEl.textContent = Math.round(data.main.temp) + unitSymbol;

    humidityEl.textContent = data.main.humidity + "%";

    const windUnit = currentUnit === "imperial" ? "mph" : "km/h";
    windEl.textContent = data.wind.speed + " " + windUnit;

    sunriseEl.textContent =
      "Sunrise : " + new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    sunsetEl.textContent =
      "Sunset : " + new Date(data.sys.sunset * 1000).toLocaleTimeString();

    const icons = {
      Clouds: "clouds.png",
      Rain: "rain.png",
      Clear: "clear.png",
      Mist: "mist.png",
      Drizzle: "drizzle.png",
      Snow: "snow.png",
      Fog: "fog.png",
      Thunderstorm: "thunderstorm.png",
      Haze: "haze.png",
    };

    const condition = data.weather[0].main;
    weatherIcon.src = `images/${icons[condition] || "clouds.png"}`;
  } catch (err) {
    loadingDiv.style.display = "none";
    weatherDiv.style.display = "none";
    errorDiv.style.display = "block";
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city !== "") {
    localStorage.setItem("lastCity", city);
    checkWeather(city);
  }
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value.trim());
  }
});

unitToggle.addEventListener("change", () => {
  currentUnit = unitToggle.value;

  const displayedCity = cityEl.textContent;

  if (weatherDiv.style.display !== "none" && displayedCity !== "--") {
    checkWeather(displayedCity);
  }
});
