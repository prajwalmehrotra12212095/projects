const API_KEY = "0396a4365c63ee268aebb06d2653666e";
const DAYS_OF_THE_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const getCurrentWeatherData = async () => {
    const city = "sandila";
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
const createIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

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
    let innerHtmlString = ``;

    for(let {temp,icon,dt_txt} of datafor12Hours){
innerHtml += `<article>
                <h3 class="time">${dt_txt.split(" ")[1]}</h3>
                <img class="icon" src = "${createIconUrl(icon)}" />
                <p class="hourly-temp">${formatTemperature(temp)}</p>
            </article>`
    }
            hourlyContainer.innerHTML = innerHtmlString;
}
const calculateDayWiseForecast = (hourlyForecast)=>{
    let dayWiseForecast = new Map();
    for (let forecast of hourlyForecast){
const [date] = forecast.dt_txt.split(" ");
const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date().getDay()]
console.log(dayOfTheWeek);
if(dayWiseForecast.has(dayOfTheWeek)){
let forecastForTheDay = dayWiseForecast.get(dayOfTheWeek);
forecastForTheDay.push(forecast);
dayWiseForecast.set(dayOfTheWeek, [forecast]);

}else{
    dayWiseForecast.set(dayOfTheWeek, [foecast]);
}
    }
    console.log(dayWiseForecast);
    // for(let [key, value] )
}
const loadFiveDayForecast = (hourlyForecast)=>{
    console.log(hourlyForecast)
    const dayWiseForecast = calculateFayWiseForecast(hourlyForecast);
}

const loadFeelsLike = ({main: { feels_like }})=>{
   let container =  document.querySelector("#feels-like");
   container.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
}
const loadHumidity = ({main: { humidity }})=>{
    let container =  document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = `${humidity} %`;
 }
document.addEventListener("DOMContentLoaded", async () => {
        const currentWeather = await getCurrentWeatherData();
        loadCurrentForecast(currentWeather);
        const getHourlyForecast = await getHourlyForecast(currentWeather);
        loadHourlyForecast(hourlyForecast)
        loadFeelsLike(currentWeather);
        loadHumidity(currentWeather);

});
