import '../css/style.css';
import '../css/style.scss';
import initMap from './map';
import loadFromAPITo from "./loadFromAPIto";
import latLongBlock from "./latlongblock";
import createNextDay from "./createNextDay";

const LOCATION_API_TOKEN = '0daccabef2e602';
const IMAGE_API_TOKEN = 'c1d70423c8f76226165703b5e9cdbd963576d94ef0a3daf418c82525a825d0a9';
const GEOCODER_API_TOKEN = '45ff5ef879df40658353348141c4323b';
const CONST_WEATHER_API = 'af2c1b095733fad9840f13652a304182';
const globalTimerObj = {
    timer: null
};

function loadDataFromAPIToElements(resourse, lang = 'en', city = 'Minsk'){
    const URLs = {
        ipinfo: `https://ipinfo.io/json?token=${LOCATION_API_TOKEN}`,
        openweathermap: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=metric&APPID=${CONST_WEATHER_API}`,
        unsplash: `https://api.unsplash.com/photos/random?query=town,${city}&client_id=${IMAGE_API_TOKEN}&fit=max`,
        opencage: `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${GEOCODER_API_TOKEN}&pretty=1&no_annotations=1&language=${lang}`
    };

    const icons = {
            sun : '../assets/sunny.svg',
            rain : '../assets/rain.svg',
            clear : '../assets/sunny.svg',
            clouds : '../assets/cloudy.svg',
            windy : '../assets/windy.svg',
        };
    const responseObj = {
        response: null
    };

    function loadDate(TZMilliseconds){
        const weekDays = lang === 'ru' ? ['Воскресенье','Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'] : ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = lang === 'en' ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] : ['Январь', 'Февраль', 'Март°', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октбярь', 'Ноябрь', 'Декабрь'];

        if(globalTimerObj.timer){
            clearTimeout(globalTimerObj.timer);
            globalTimerObj.timer = null;
        }

        const showCurrentTimeId = setInterval(() => {
            const currentTimeElement = document.querySelector('.maindata__date-block');
            const currentDate = new Date();
            let GreenwichDateString = currentDate.toLocaleString('en-ZA', {timeZone: 'UTC'});
            GreenwichDateString = GreenwichDateString.replace(',', '').replace('/', ' ').replace('/', ' ').replace(':', ' ').replace(':', ' ');

            const GreenwichDateArray = GreenwichDateString.split(' ').map(x => +x);
            if(GreenwichDateArray[1]){
                GreenwichDateArray[1] -= 1;
            }
            else{
                GreenwichDateArray[1] = 11;
                GreenwichDateArray[0] -= 1;
            }
            const GreenwichDate = new Date(...GreenwichDateArray);
            const userTZDate = new Date(GreenwichDate.getTime() + TZMilliseconds);

            const hours = userTZDate.getHours() < 10 ? `0${userTZDate.getHours()}` : `${userTZDate.getHours()}`;
            const minutes = userTZDate.getMinutes() < 10 ? `0${userTZDate.getMinutes()}` : `${userTZDate.getMinutes()}`;
            const dateString = `${weekDays[(userTZDate.getDay())]} ${userTZDate.getDate()} ${months[userTZDate.getMonth()]}  ${hours}:${minutes}`;
            currentTimeElement.textContent = dateString;
        }, 1000);

        globalTimerObj.timer = showCurrentTimeId;

        const loadingTimer = setInterval(() => {
            const currentTimeElement = document.querySelector('.maindata__date-block');
            if(!currentTimeElement.textContent || currentTimeElement.textContent === 'loading /' || currentTimeElement.textContent === 'loading \\'){
                if(currentTimeElement.textContent === 'loading \\'){
                    currentTimeElement.textContent = 'loading /';
                }
                else if(currentTimeElement.textContent === 'loading /'){
                        currentTimeElement.textContent = 'loading \\';
                    }
                    else{
                        currentTimeElement.textContent = 'loading /';
                    }
            }
            else{
                clearTimeout(loadingTimer);
            }
        }, 10);
    }

    loadFromAPITo(responseObj, URLs[resourse]);

    const waitTimerId = setInterval(() => {
        if( !Object.values(responseObj).includes(null) ){
            switch(resourse){
                case 'ipinfo':
                    break;
                case 'openweathermap': {
                    const currentForecast = responseObj.response.list[0];

                    document.querySelector('.maindata__weather-block__t-value-block').textContent = `${Math.round(currentForecast.main.temp)}С°`;
                    document.querySelector('.maindata__weather-block__weather-icon').style.backgroundImage = ` url('${icons[currentForecast.weather[0].main.toLowerCase()]}')`;
                    document.querySelector('.maindata__weather-block__forecast-weather').textContent = currentForecast.weather[0].description;
                    document.querySelector('.maindata__weather-block__forecast-temperature').textContent = lang === 'ru' ? `Ощущается как: ${Math.round(currentForecast.main.feels_like)}С°` : `feels like: ${Math.round(currentForecast.main.feels_like)}С°`;
                    document.querySelector('.maindata__weather-block__forecast-wind').textContent = currentForecast.wind.speed.toFixed(1) + (lang === 'ru' ? 'м/с' : 'm/s');
                    document.querySelector('.maindata__weather-block__forecast-humidity').textContent = `${(lang === 'ru' ? 'Влажность: ' : 'humidity: ') + currentForecast.main.humidity}%`;

                    const weekDays = lang === 'ru' ? ['Понедельник', 'Вторник', 'Средв', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const currentDate = new Date(currentForecast.dt_txt);
                    const currentDay = currentDate.getDay();
                    let nextDate;
                    let nextDateIndex = 0;
                    for (const weatherItem of responseObj.response.list) {
                        nextDate = new Date(weatherItem.dt_txt);
                        if (nextDate.getDay() % 7 === (currentDay + 1) % 7 && nextDate.getHours() === 12) {
                            break;
                        }
                        nextDateIndex += 1;
                    }
                    document.querySelector('.maindata__future-forecast-block__day1-name').textContent = weekDays[nextDate.getDay() - 1];
                    document.querySelector('.maindata__future-forecast-block__day2-name').textContent = weekDays[(nextDate.getDay()) % 7];
                    document.querySelector('.maindata__future-forecast-block__day3-name').textContent = weekDays[(nextDate.getDay() + 1) % 7];

                    document.querySelector('.maindata__future-forecast-block__day1-temperature').textContent = `${Math.round(responseObj.response.list[nextDateIndex].main.temp)}C°`;
                    document.querySelector('.maindata__future-forecast-block__day2-temperature').textContent = `${Math.round(responseObj.response.list[nextDateIndex + 8].main.temp)}C°`;
                    document.querySelector('.maindata__future-forecast-block__day3-temperature').textContent = `${Math.round(responseObj.response.list[nextDateIndex + 16].main.temp)}C°`;

                    document.querySelector('.maindata__future-forecast-block__day1-weather-icon').style.backgroundImage = `url(${icons[responseObj.response.list[nextDateIndex].weather[0].main.toLowerCase()]})`;
                    document.querySelector('.maindata__future-forecast-block__day2-weather-icon').style.backgroundImage = `url(${icons[responseObj.response.list[nextDateIndex + 8].weather[0].main.toLowerCase()]})`;
                    document.querySelector('.maindata__future-forecast-block__day3-weather-icon').style.backgroundImage = `url(${icons[responseObj.response.list[nextDateIndex + 16].weather[0].main.toLowerCase()]})`;

                    loadDate(responseObj.response.city.timezone * 1000);

                    // reset micro icon
                    const toFBtn = document.querySelector('.header__settings-block__to-f-btn');
                    const toCBtn = document.querySelector('.header__settings-block__to-c-btn');

                    toFBtn.onclick = () => {
                        const currentC = currentForecast.main.temp;

                        const C1 = responseObj.response.list[nextDateIndex].main.temp;
                        const C2 = responseObj.response.list[nextDateIndex + 8].main.temp;
                        const C3 = responseObj.response.list[nextDateIndex + 16].main.temp;
                        const C4 = responseObj.response.list[0].main.feels_like;
                        document.querySelector('.maindata__weather-block__t-value-block').textContent = `${Math.round(1.8 * currentC + 32)}F°`;
                        document.querySelector('.maindata__weather-block__forecast-temperature').textContent = `${Math.round(1.8 * C4 + 32)}F°`;
                        document.querySelector('.maindata__future-forecast-block__day1-temperature').textContent = `${Math.round(1.8 * C1 + 32)}F°`;
                        document.querySelector('.maindata__future-forecast-block__day2-temperature').textContent = `${Math.round(1.8 * C2 + 32)}F°`;
                        document.querySelector('.maindata__future-forecast-block__day3-temperature').textContent = `${Math.round(1.8 * C3 + 32)}F°`;

                        toFBtn.style.backgroundColor = 'rgb(100, 100, 100)';
                        toFBtn.style.color = 'rgb(255, 255, 255)';
                        toCBtn.style.backgroundColor = 'rgb(255, 255, 255)';
                        toCBtn.style.color = 'rgb(100, 100, 100)';
                    };

                    toCBtn.onclick = () => {
                        document.querySelector('.maindata__weather-block__t-value-block').textContent = `${Math.round(currentForecast.main.temp)}C°`;
                        document.querySelector('.maindata__future-forecast-block__day1-temperature').textContent = `${Math.round(responseObj.response.list[nextDateIndex].main.temp)}C°`;
                        document.querySelector('.maindata__future-forecast-block__day2-temperature').textContent = `${Math.round(responseObj.response.list[nextDateIndex + 8].main.temp)}C°`;
                        document.querySelector('.maindata__future-forecast-block__day3-temperature').textContent = `${Math.round(responseObj.response.list[nextDateIndex + 16].main.temp)}C°`;

                        toFBtn.style.backgroundColor = 'rgb(255, 255, 255)';
                        toFBtn.style.color = 'rgb(100, 100, 100)';
                        toCBtn.style.backgroundColor = 'rgb(100, 100, 100)';
                        toCBtn.style.color = 'rgb(255, 255, 255)';
                    };

                    break;
                }
                case 'unsplash':
                    document.body.style.background = `url(${responseObj.response.urls.small}) no-repeat`;
                    document.body.style.backgroundSize = '100%';
                    break;
                case 'opencage': {
                    const userLocation = responseObj.response.results[0];
                    document.querySelector('.maindata__city-block').textContent = userLocation.formatted;
                    const longitude = userLocation.geometry.lng;
                    const latitude = userLocation.geometry.lat;
                    initMap(longitude, latitude);
                    document.querySelector('.lat-long-block__lat').textContent = `${lang === 'ru' ? 'Широта' : 'Latitude'}: ${latitude.toFixed(2).replace('.', '°')}'`;
                    document.querySelector('.lat-long-block__long').textContent = `${lang === 'ru' ? 'Долгота' : 'Longitude'}: ${longitude.toFixed(2).replace('.', '°')}'`;
                    break;
                }
                default:
                    console.log('not defined');
            }
            clearTimeout(waitTimerId);
        }
    }, 50);
}

function init(){
    const main = document.querySelector('main');
    function Header(){
        const header = document.createElement('header');

        const headerSettingsBlock = document.createElement('div');
        headerSettingsBlock.className = 'header__settings-block';

        const changeBackgroundButton = document.createElement('button');
        changeBackgroundButton.className = 'header__settings-block__change-back-btn';
        const changeLangButton = document.createElement('button');
        changeLangButton.className = 'header__settings-block__change-lang-btn';
        changeLangButton.textContent = 'en';
        changeLangButton.onclick = () => {
            const cityAndCountry = document.querySelector('.maindata__city-block').textContent;
            const city = cityAndCountry.slice(0, cityAndCountry.indexOf(','));

            if(changeLangButton.textContent === 'en'){
                loadDataFromAPIToElements('openweathermap', 'ru', city);
                loadDataFromAPIToElements('opencage', 'ru', city);
                changeLangButton.textContent = 'ru';
            }
            else{
                loadDataFromAPIToElements('openweathermap', 'en', city);
                loadDataFromAPIToElements('opencage', 'en', city);
                changeLangButton.textContent = 'en';
            }
        };
        const temperatureBlock = document.createElement('div');
        temperatureBlock.className = 'header__settings-block__change-t-block';

        const toFahrenheitButton = document.createElement('button');
        toFahrenheitButton.className = 'header__settings-block__to-f-btn';
        toFahrenheitButton.textContent = 'F';
        toFahrenheitButton.style.color = 'rgb(100, 100, 100)';
        toFahrenheitButton.style.backgroundColor = 'rgb(255, 255, 255)';

        const toCelsiusButton = document.createElement('button');
        toCelsiusButton.className = 'header__settings-block__to-c-btn';
        toCelsiusButton.textContent = 'C°';
        toCelsiusButton.style.backgroundColor = 'rgb(100, 100, 100)';

        temperatureBlock.appendChild(toFahrenheitButton);
        temperatureBlock.appendChild(toCelsiusButton);

        changeBackgroundButton.onclick = function() {
            loadDataFromAPIToElements('unsplash');
        };

        headerSettingsBlock.appendChild(changeBackgroundButton);
        headerSettingsBlock.appendChild(changeLangButton);
        headerSettingsBlock.appendChild(temperatureBlock);


        const headerSearchBlock = document.createElement('div');
        headerSearchBlock.className = 'header__search-block';

        const audioSearch = document.createElement('button');
        audioSearch.className = 'header__search-block__audio-search';



        function activateMicro(language){
            audioSearch.style.backgroundImage = 'url("../assets/micro-icons/micro.png")';

            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.interimResults = true;
            recognition.lang = language;

            let city = 'Minsk';

            recognition.addEventListener('result', e => {
                const transcript = Array.from(e.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                city = transcript;
            });

            recognition.addEventListener('audioend', e => {
                loadDataFromAPIToElements('openweathermap', language, city);
                loadDataFromAPIToElements('unsplash', language, city);
                loadDataFromAPIToElements('opencage', language, city);
            });

            recognition.start();
        }



        audioSearch.onclick = () => {
            activateMicro(document.querySelector('.header__settings-block__change-lang-btn').textContent);
        };

        const searchBar = document.createElement('input');
        searchBar.className = 'header__search-block__search-bar';
        const searchButton = document.createElement('button');
        searchButton.className = 'header__search-block__search-btn';
        searchButton.onclick = () => {
            const city = document.querySelector('.header__search-block__search-bar').value;
            const language = document.querySelector('.header__settings-block__change-lang-btn').textContent;

            loadDataFromAPIToElements('openweathermap', language, city);
            loadDataFromAPIToElements('unsplash', language, city);
            loadDataFromAPIToElements('opencage', language, city);
        };

        headerSearchBlock.appendChild(audioSearch);
        headerSearchBlock.appendChild(searchBar);
        headerSearchBlock.appendChild(searchButton);




        header.appendChild(headerSettingsBlock);
        header.appendChild(headerSearchBlock);
        return header;
    }

    function MainDataBlock(){
        const mainDataBlock = document.createElement('div');
        mainDataBlock.className = 'maindata';

        const cityBlock = document.createElement('div');
        cityBlock.className = 'maindata__city-block';

        const dateBlock = document.createElement('div');
        dateBlock.className = 'maindata__date-block';

        mainDataBlock.appendChild(cityBlock);
        mainDataBlock.appendChild(dateBlock);

        const weatherBlock = document.createElement('div');
        weatherBlock.className = 'maindata__weather-block';

        const weatherIcon = document.createElement('div');
        weatherIcon.className = 'maindata__weather-block__weather-icon';

        const tValueBlock = document.createElement('div');
        tValueBlock.className = 'maindata__weather-block__t-value-block';

        const forecastBlock = document.createElement('div');
        forecastBlock.className = 'maindata__weather-block__forecast';

        const forecastWeather = document.createElement('div');
        forecastWeather.className = 'maindata__weather-block__forecast-weather';

        const forecastTemperature = document.createElement('div');
        forecastTemperature.className = 'maindata__weather-block__forecast-temperature';

        const forecastWind = document.createElement('div');
        forecastWind.className = 'maindata__weather-block__forecast-wind';

        const forecastHumidity = document.createElement('div');
        forecastHumidity.className = 'maindata__weather-block__forecast-humidity';

        forecastBlock.appendChild(forecastWeather);
        forecastBlock.appendChild(forecastTemperature);
        forecastBlock.appendChild(forecastWind);
        forecastBlock.appendChild(forecastHumidity);


        weatherBlock.appendChild(tValueBlock);
        weatherBlock.appendChild(weatherIcon);
        weatherBlock.appendChild(forecastBlock);

        mainDataBlock.appendChild(weatherBlock);

        const futureForecastBlock = document.createElement('div');
        futureForecastBlock.className = 'maindata__future-forecast-block';

        const day1 = createNextDay(1);
        const day2 = createNextDay(2);
        const day3 = createNextDay(3);
        futureForecastBlock.appendChild(day1);
        futureForecastBlock.appendChild(day2);
        futureForecastBlock.appendChild(day3);

        mainDataBlock.appendChild(futureForecastBlock);

        return mainDataBlock;
    }

    main.appendChild(Header());
    main.appendChild(MainDataBlock());
    main.appendChild(latLongBlock());

    document.body.style.background = 'blue';
    loadDataFromAPIToElements('openweathermap');
    loadDataFromAPIToElements('opencage');
}

init();
