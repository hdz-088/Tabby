let searchContainer = document.querySelector(".search-container");
let searchInput = document.getElementById("searchInput");

document.addEventListener("keydown", function (event) {
  if (event.key === "/") {
    event.preventDefault();
    showSearch();
  } else if (event.key === "Escape") {
    hideSearch();
  } else if (event.key === "Enter") {
    searchGoogle();
  }
});

function showSearch() {
  searchContainer.style.top = "60px"; // Slide down from the top
  searchInput.focus();
}

function hideSearch() {
  searchContainer.style.top = "-60px"; // Slide back up
}

function searchGoogle() {
  let query = searchInput.value;
  if (query) {
    window.open(
      "https://search.brave.com/search?q=" + encodeURIComponent(query),
      "_blank"
    );
  }
}

// UNSPLASH API CALL ------------------------------

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const changeImage = async () => {
  const url = `https://api.unsplash.com/photos/random?query=wallpaper&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;

  try {
    const response = await axios.get(url);
    const unsplashImage = response.data.urls.full; // Get the full-size image URL

    // Change the body's background image
    document.body.style.backgroundImage = `url(${unsplashImage})`;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
  }
};

// Attach event listener to the button
document.querySelector(".reset").addEventListener("click", () => {
  changeImage();
});

// AQI DATA --------------------------------------

const API_KEY = process.env.AQI_KEY;
const weatherLat = 23.0401;
const weatherLon = 72.529;

const fetchAQIData = async () => {
  const WEATHER_API_URL =
    "http://api.openweathermap.org/data/2.5/air_pollution";

  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: weatherLat,
        lon: weatherLon,
        appid: API_KEY, // API key
        units: "metric", // Units for temperature (metric = Celsius, imperial = Fahrenheit)
      },
    });

    // Send the weather data as the response
    const aqiData = response.data.list[0].main.aqi;
    document.querySelector(".aqi").textContent = `${aqiData}`;
    // res.json(response.data);
  } catch (error) {
    console.error("Error fetching AQI Data:", error);
  }
};

fetchAQIData();

// WEATHER DATA  -------------------------------------------

// // AQI DATA --------------------------------------

const fetchWeatherData = async () => {
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

  try {
    const responseWeather = await axios.get(WEATHER_API_URL, {
      params: {
        lat: weatherLat,
        lon: weatherLon,
        appid: API_KEY, // API key
        units: "metric", // Units for temperature (metric = Celsius, imperial = Fahrenheit)
      },
    });

    // Send the weather data as the response
    const weatherData = responseWeather.data;
    // res.json(response.data);
    // console.log(weatherData);
    const tempW = Math.round(weatherData.main.temp);
    document.querySelector(".temp").textContent = `${tempW} °C`;

    const textW = weatherData.weather[0].main;
    document.querySelector(".condition-txt").textContent = `${textW}`;

    const textD = weatherData.weather[0].description;
    document.querySelector(".summary").textContent = `${textD}`;

    const icon = weatherData.weather[0].icon;
    const imgElement = document.querySelector(".weather-summary-img");
    imgElement.src = `assets/${icon}.svg` || "assets/default.svg";

    // const sunset = weatherData.sys.sunset;
    // document.querySelector(".sunset").textContent = `${sunset}`;

    // const sunrise = weatherData.sys.sunrise;
    // document.querySelector(".sunrise").textContent = `${sunrise}`;

    // const windSpeed = weatherData.wind.speed;
    // document.querySelector(".windSpeed").textContent = `${windSpeed}`;

    // const windDeg = weatherData.wind.deg;
    // document.querySelector(".windDeg").textContent = `${windDeg}`;

    // const humidity = weatherData.main.humidity;
    // document.querySelector(".humidity").textContent = `${humidity}`;

    // Convert Unix timestamp to readable time
    const convertUnixTimestamp = (timestamp) => {
      const date = new Date(timestamp * 1000); // Convert to milliseconds
      const hours = date.getHours().toString().padStart(2, "0"); // Format hours
      const minutes = date.getMinutes().toString().padStart(2, "0"); // Format minutes
      return `${hours}:${minutes}`; // Return time in HH:MM format
    };

    // Get Sunset and Sunrise, convert to human-readable format
    const sunset = weatherData.sys.sunset;
    document.querySelector(".sunset").textContent = `${convertUnixTimestamp(
      sunset
    )}`;

    const sunrise = weatherData.sys.sunrise;
    document.querySelector(".sunrise").textContent = `${convertUnixTimestamp(
      sunrise
    )}`;

    // Get Wind Speed and display with units
    const windSpeed = weatherData.wind.speed;
    document.querySelector(".windSpeed").textContent = `${windSpeed} m/s`; // Or km/h depending on units

    // Get Wind Direction (in degrees) and convert to a cardinal direction
    const windDeg = weatherData.wind.deg;
    const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const windDirection = windDirections[Math.round(windDeg / 45) % 8]; // Map degrees to a cardinal direction
    document.querySelector(".windDeg").textContent = `${windDirection}`;

    // Get Humidity and display with percentage
    const humidity = weatherData.main.humidity;
    console.log(humidity);
    document.querySelector(".humidity").textContent = `${humidity}%`;
  } catch (error) {
    console.error("Error fetching Weather Data:", error);
  }
};

fetchWeatherData();

// DATE AND TIME ------------------------------

// Function to get the current date and time
const updateDateTime = () => {
  const now = new Date();

  // Get current time
  const hours = now.getHours().toString().padStart(2, "0"); // Ensure two digits
  const minutes = now.getMinutes().toString().padStart(2, "0"); // Ensure two digits

  // Update the time in the DOM
  document.querySelector(".hrs").textContent = hours;
  document.querySelector(".min").textContent = minutes;

  // Get current day of the week (e.g., SUN, MON, etc.)
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = daysOfWeek[now.getDay()];

  // Get the current date (day and month)
  const dayOfMonth = now.getDate();
  const month = now.toLocaleString("default", { month: "long" }); // Get full month name
  const year = now.getFullYear();

  // Update the date in the DOM
  document.querySelector(".day").textContent = dayOfWeek;
  document.querySelector(".dd").innerHTML = `${dayOfMonth}<sup>th</sup>`;
  document.querySelector(".mm").textContent = month;
  document.querySelector(".yy").textContent = year;

  // Calculate the current week number
  const startOfYear = new Date(year, 0, 1);
  const diffInMillis = now - startOfYear;
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diffInMillis / msPerWeek) + 1;

  // Update the week number in the DOM
  document.querySelector(".week").textContent = `Week ${weekNumber}`;
};

// Call the function to update date, time, and week number
updateDateTime();

// Optionally, update every second
setInterval(updateDateTime, 1000);
