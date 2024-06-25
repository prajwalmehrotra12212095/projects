const API_KEY = "0396a4365c63ee268aebb06d2653666e";

const getCurrentWeatherData = async () => {
    const city = "varanasi";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.json();
}
const getHourlyForecast = async ({ name: city }) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data.list.map(forecast=>{
        const{main:{temp, temp_max,temp_min}, dt, dt_txt, weather: [{description,icon}]} = forecast;
        return {temp, temp_max , temp_min, dt , dt_txt, description, icon }
    })
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
    const currentForecastElement = document.querySelector("#current-forecast"); // Use correct selector here
    currentForecastElement.querySelector(".city").textContent = name;
    currentForecastElement.querySelector(".temp").textContent = formatTemperature(temp);
    currentForecastElement.querySelector(".description").textContent = description;
    currentForecastElement.querySelector(".min-max-temp").textContent = `H: ${formatTemperature(temp_max)} L: ${formatTemperature(temp_min)}`;
     // <h1>City name</h1>
    //         <p class="temp">Temp</p>
    //         <p class="description">description</p>
    //         <p class="min-max-temp">High Low</p>
}

const loadHourlyForecast = (hourlyForecast) => {
    console.log(hourlyForecast);
    let dataFor12Hours = hourlyForecast.slice(1, 13);
    const hourlyContainer = document.querySelector(".hourly-container");
    let innerHtml = ``;

    for(let {temp,icon,dt_txt} of datafor12Hours){

    }
}

document.addEventListener("DOMContentLoaded", async () => {
        const currentWeather = await getCurrentWeatherData();
        loadCurrentForecast(currentWeather);
        const getHourlyForecast = await getHourlyForecast(currentWeather);

});
