// Declaring Variables from HTML document.
const Apikey = `ee46f080eb4a7f83bf9d0ecbd17c9951`;  // Enter your API key from openweather.
const city = document.getElementById('js-input')
const searchButton = document.getElementById('js-search-btn');
const icon = document.getElementById('js-icon');
const city_location = document.getElementById('location');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const FeelsLike = document.getElementById('FeelsLike');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
let weather = document.querySelector('.js-weather');
let response;
let error_message_timer;

// Adding keyboard Event to Function Call.
document.body.addEventListener('keydown', (event) => {
    clearInterval(error_message_timer);
    if (event.key == 'Enter') {
        weathercall();
    }
})

// Function call through Search Button.
searchButton.addEventListener('click', weathercall)

// Function that calls Weather Updates.
function weathercall() {

    if (city.value !== ``) {
        weather.classList.remove('js-weather');
        const location = city.value;
        getWeatherData(location);
    }
}

// Function to display errors.
function ErrorDisplay(error_content) {
    icon.innerHTML = ``;
    temperature.innerText = ``;
    description.innerHTML = `${error_content}`;
    city_location.innerHTML = ``;

    FeelsLike.innerHTML = ``;
    humidity.innerHTML = ``;
    wind_speed.innerHTML = ``;
    error_message_timer = setTimeout(() => {
        description.innerHTML = ``;
        weather.classList.add('js-weather');
    }, 6000);
}

// Asynchronous Function to fetch data from Openweather with error Handling.
async function getWeatherData(location) {
    try {
        response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Apikey}&units=metric`);

        const data = await response.json();

        const temp = Math.round(data.main.temp);
        const feels_like = data.main.feels_like;
        const weather_icon = data.weather[0].icon;

        icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather_icon}.png" id='icon' alt="Weather_Icon" />`;
        temperature.innerText = `${temp}°C`;
        description.innerText = `${data.weather[0].description}`;
        city_location.innerHTML = `<ion-icon name="location" id="location-icon"></ion-icon>${data.name}`;

        FeelsLike.innerHTML = `<div class="cols">
        <p id="FeelsLike">${feels_like}°C</p>
        <ion-icon name="cloud-circle" id="updates-icon"></ion-icon>
        <p>Feels Like</p>
        </div>`;
        humidity.innerHTML = `<div class="cols">
        <p id="humidity">${data.main.humidity}%</p>
        <ion-icon name="water" id="updates-icon"></ion-icon>
        <p>Humidity</p>
        </div>`;
        wind_speed.innerHTML = ` <div class="cols">
        <p id="wind-speed">${data.wind.speed}m/s</p>
        <ion-icon name="speedometer" id="updates-icon"></ion-icon>
        <p>Wind-Speed</p>
        </div>`;

        city.value = '';
    } catch (error) {
        if (!response) {
            let error_content1 = `<p id="js-error">Check Your Internet Connection!</p>`
            ErrorDisplay(error_content1);
            city.value = '';
        } else if (response.status == 401) {
            let error_content2 = `<div id="js-server-error"><p id="error-message">Server couldn't be reached!</p></div>`;
            ErrorDisplay(error_content2);
            city.value = '';
        } else if (response.status == 404) {
            let error_content3 = `<div id="js-server-error"><p id="js-error">Please Check the Spell and Try Again!</p>
            </div>`
            ErrorDisplay(error_content3);
            city.value = '';
        }
    }
};
