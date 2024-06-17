
const API_KEY = "4aa6575f87bcb2cc4390b7b1a72b5341";
const getCurrentWeatherData = async()=> {
    const city = "pune";
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric');
return response.json()

}

const loadCurrentForecast = () =>{

}
document.addEventListener("DOMContentLoaded", async () => {
 console.log(await getCurrentWeatherData());

})