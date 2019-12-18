export default function createNextDay(day){
    const dayForecast = document.createElement('div');
    dayForecast.className = `maindata__future-forecast-block__day${day}`;

    const dayForecastDay = document.createElement('div');
    dayForecastDay.className = `maindata__future-forecast-block__day${day}-name`;
    const dayForecastTemperature = document.createElement('div');
    dayForecastTemperature.className = `maindata__future-forecast-block__day${day}-temperature`;
    const dayForecastWeatherIcon = document.createElement('div');
    dayForecastWeatherIcon.className = `maindata__future-forecast-block__day${day}-weather-icon`;

    dayForecast.appendChild(dayForecastDay);
    dayForecast.appendChild(dayForecastTemperature);
    dayForecast.appendChild(dayForecastWeatherIcon);

    return dayForecast;
}
