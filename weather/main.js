const API_KEY = "0396a4365c63ee268aebb06d2653666e";
const DAYS_OF_THE_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getCurrentWeatherData = async () => {
    const city = "Varanasi";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.json();
}

const getHourlyForecast = async ({ name: city }) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data.list.map(forecast => {
        const { main: { temp, temp_max, temp_min }, dt, dt_txt, weather: [{ description, icon }] } = forecast;
        return { temp, temp_max, temp_min, dt, dt_txt, description, icon };
    });
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}°C`;
const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
    const currentForecastElement = document.querySelector("#current-forecast");
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = formatTemperature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".min-max-temp").textContent = `H: ${formatTemperature(temp_max)} L: ${formatTemperature(temp_min)}`;
}

const loadHourlyForecast = (hourlyForecast) => {
    const dataFor12Hours = hourlyForecast.slice(1, 13);
    const hourlyContainer = document.querySelector(".hourly-container");
    let innerHtmlString = ``;

    for (let { temp, icon, dt_txt } of dataFor12Hours) {
        innerHtmlString += `<article>
            <h3 class="time">${dt_txt.split(" ")[1]}</h3>
            <img class="icon" src="${createIconUrl(icon)}" />
            <p class="hourly-temp">${formatTemperature(temp)}</p>
        </article>`;
    }
    hourlyContainer.innerHTML = innerHtmlString;
}

const calculateDayWiseForecast = (hourlyForecast) => {
    let dayWiseForecast = new Map();
    for (let forecast of hourlyForecast) {
        const [date] = forecast.dt_txt.split(" ");
        const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()];

        if (dayWiseForecast.has(dayOfTheWeek)) {
            let forecastForTheDay = dayWiseForecast.get(dayOfTheWeek);
            forecastForTheDay.push(forecast);
            dayWiseForecast.set(dayOfTheWeek, forecastForTheDay);
        } else {
            dayWiseForecast.set(dayOfTheWeek, [forecast]);
        }
    }

    for (let [key, value] of dayWiseForecast) {
        let temp_min = Math.min(...value.map(val => val.temp_min));
        let temp_max = Math.max(...value.map(val => val.temp_max));
        let icon = value.find(v => v.icon).icon;

        dayWiseForecast.set(key, { temp_min, temp_max, icon });
    }
    return dayWiseForecast;
}

const loadFiveDayForecast = (hourlyForecast) => {
    const dayWiseForecast = calculateDayWiseForecast(hourlyForecast);
    const container = document.querySelector(".five-day-forecast-container");
    let dayWiseInfo = "";

    Array.from(dayWiseForecast).map(([key, { temp_max, temp_min, icon }], index) => {
        if (index < 5) {
            dayWiseInfo += `<article class="day-wise-forecast">
                <h3>${index === 0 ? "Today" : key}</h3>
                <img class="icon" src="${createIconUrl(icon)}" alt="icon for the forecast">
                <p class="min-temp">${formatTemperature(temp_min)}</p>
                <p class="max-temp">${formatTemperature(temp_max)}</p>
            </article>`;
        }
    });

    container.innerHTML = dayWiseInfo;
}

const loadFeelsLike = ({ main: { feels_like } }) => {
    let container = document.querySelector("#feels-like");
    container.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
}

const loadHumidity = ({ main: { humidity } }) => {
    let container = document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = `${humidity}%`;
}

document.addEventListener("DOMContentLoaded", async () => {
    const currentWeather = await getCurrentWeatherData();
    loadCurrentForecast(currentWeather);
    const hourlyForecast = await getHourlyForecast(currentWeather);
    loadHourlyForecast(hourlyForecast);
    loadFiveDayForecast(hourlyForecast);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
});
