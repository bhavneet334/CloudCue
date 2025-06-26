const apiKey = config.apiKey;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&q="

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");

async function checkWeather(cityName){
    const response = await fetch(apiUrl + cityName + `&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);

    if(!response.ok || data.cod == 404){
        errorDiv.style.display = "block";
        weatherDiv.style.display = "none";
    }else{

        errorDiv.style.display = "none";
        
        const city = document.querySelector(".city");
        const temp = document.querySelector(".temp");
        const humidity = document.querySelector(".humidity");
        const wind = document.querySelector(".wind");

        city.innerHTML = data.name;
        temp.innerHTML = Math.round(data.main.temp) + "°F";
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + " mph";

        if(data.weather[0].main === "Clouds"){
            weatherIcon.src = "images/clouds.png";
        }
        else if(data.weather[0].main === "Rain"){
            weatherIcon.src = "images/rain.png";
        }
        else if(data.weather[0].main === "Clear"){
            weatherIcon.src = "images/clear.png";
        }
        else if(data.weather[0].main === "Mist"){
            weatherIcon.src = "images/mist.png";
        }
        else if(data.weather[0].main === "Drizzle"){
            weatherIcon.src = "images/drizzle.png";
        }
        weatherDiv.style.display = "block";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});