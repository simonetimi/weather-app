import { parseISO, format } from 'date-fns';

import getCoordinates from './geocoding';
import getWeather from './weather';
import { updateWeather, updateCoordinates, retrieveWeather, retrieveCoordinates } from './data';

// get time
function getTime() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const correctCurrentMinute = currentMinute < 10 ? `0${currentMinute}` : currentMinute;
  return `${currentHour}:${correctCurrentMinute}`;
}

// write time every 30 seconds
const showedTime = document.querySelector('div.welcome > h3');
function renderTime() {
  const time = getTime();
  showedTime.textContent = time;
}

// write welcome message
const welcomeMessage = document.querySelector('div.welcome > h2');
function setWelcome() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  if (currentHour <= 12 && currentHour > 4) {
    welcomeMessage.textContent = 'Good Morning';
  } else if (currentHour > 12 && currentHour < 18) {
    welcomeMessage.textContent = 'Good Afternoon';
  } else if (currentHour >= 18 && currentHour <= 23) {
    welcomeMessage.textContent = 'Good Evening';
  } else {
    welcomeMessage.textContent = 'Good Night';
  }
}

// get user city selection
const userInput = document.getElementById('user-city');
const dropdownMenu = document.querySelector('.dropdown-menu');
function clearMenu() {
  dropdownMenu.innerHTML = '';
}

// function for setting the right weather icon
function selectWeatherDecoder(weatherCode) {
  switch (weatherCode) {
    case 0:
      return ['wi-day-sunny', 'Sunny'];
    case 1:
    case 2:
      return ['wi-day-cloudy', 'Partly cloudy'];
    case 3:
      return ['wi-cloud', 'Overcast'];
    case 45:
    case 48:
      return ['wi-fog', 'Fog'];
    case 51:
    case 53:
    case 55:
      return ['wi-showers', 'Drizzle'];
    case 56:
    case 57:
    case 66:
    case 67:
      return ['wi-sleet', 'Freezing drizzle'];
    case 61:
    case 63:
    case 65:
      return ['wi-rain', 'Rain'];
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return ['wi-snow', 'Snow'];
    case 80:
    case 81:
    case 82:
      return ['wi-sprinkle', 'Rain showers'];
    case 95:
      return ['wi-thunderstorm', 'Thunderstorm'];
    case 96:
    case 99:
      return ['wi-storm-showers', 'Thunderstorm with hail'];
    default:
      return '';
  }
}

// selection of the day must be stored
let selectedDay = 0;

// UI functions

function renderMain(weatherObject, coordinatesArray) {
  // display city
  const selectedLocation = document.querySelector('main > h2');
  selectedLocation.textContent = `${coordinatesArray[0].city}, ${coordinatesArray[0].country}`;
  const mainTemperature = document.getElementById('main-temperature');
  mainTemperature.textContent = `${parseInt(
    weatherObject.daily.temperature_2m_max[selectedDay],
    10,
  )}${weatherObject.daily_units.temperature_2m_max}`;
  const dayWeatherCode = Number(weatherObject.daily.weather_code[selectedDay]);
  const [dayWeatherArrayIcon, dayWeatherArrayText] = selectWeatherDecoder(dayWeatherCode);
  const mainWeatherCode = document.getElementById('main-weather-code');
  const paraTextWeather = mainWeatherCode.querySelector(':first-child');
  paraTextWeather.textContent = dayWeatherArrayText;
  const oldParaIconWeather = mainWeatherCode.querySelector(':nth-child(2)');
  if (oldParaIconWeather) {
    oldParaIconWeather.remove();
  }
  const paraIconWeather = document.createElement('p');
  paraIconWeather.classList.add('weather-code-icon');
  paraIconWeather.classList.add('wi');
  paraIconWeather.classList.add(dayWeatherArrayIcon);
  mainWeatherCode.appendChild(paraIconWeather);
  // labels
  const labelTemp = document.getElementById('label-temp');
  const minTemp = labelTemp.querySelector('#label-temp > div > p:nth-child(1)');
  minTemp.textContent = `Min: ${parseInt(weatherObject.daily.temperature_2m_min[selectedDay], 10)}${
    weatherObject.daily_units.temperature_2m_min
  }`;
  const maxTemp = labelTemp.querySelector('#label-temp > div > p:nth-child(2)');
  maxTemp.textContent = `Max: ${parseInt(weatherObject.daily.temperature_2m_max[selectedDay], 10)}${
    weatherObject.daily_units.temperature_2m_max
  }`;
  const labelPrec = document.getElementById('label-prec');
  const precProb = labelPrec.querySelector('#label-prec > div > p:nth-child(1)');
  precProb.textContent = `Prob.: ${weatherObject.daily.precipitation_probability_max[selectedDay]}%`;
  const precTotal = labelPrec.querySelector('#label-prec > div > p:nth-child(2)');
  precTotal.textContent = `Total: ${weatherObject.daily.precipitation_sum[selectedDay]} mm`;
  const labelWind = document.getElementById('label-wind');
  const windSpeed = labelWind.querySelector('#label-wind > div > p:nth-child(1)');
  windSpeed.textContent = `Speed: ${parseInt(
    weatherObject.daily.wind_speed_10m_max[selectedDay],
    10,
  )} km/h`;
  const gustsSpeed = labelWind.querySelector('#label-wind > div > p:nth-child(2)');
  gustsSpeed.textContent = `Gusts: ${parseInt(
    weatherObject.daily.wind_gusts_10m_max[selectedDay],
    10,
  )} km/h`;
}

function renderCards(weatherObject) {
  const dayCards = document.querySelectorAll('.day-card');
  dayCards.forEach((card, index) => {
    if (index > 0) {
      const date = parseISO(weatherObject.daily.time[index]);
      const dayOfTheWeek = format(date, 'eee');
      const paraDay = card.querySelector(':first-child');
      paraDay.textContent = dayOfTheWeek;
    }
    const dayTemp = Number(weatherObject.daily.temperature_2m_max[index]);
    const tempUnit = weatherObject.daily_units.temperature_2m_max;
    const paraDayTemp = card.querySelector(':nth-child(2)');
    paraDayTemp.textContent = `${parseInt(dayTemp, 10)}${tempUnit}`;
    const dayWeatherCode = Number(weatherObject.daily.weather_code[index]);
    const dayWeatherIcon = selectWeatherDecoder(dayWeatherCode);
    const oldParaDay = card.querySelector(':nth-child(3)');
    if (oldParaDay) {
      oldParaDay.remove();
    }
    const paraDayCode = document.createElement('p');
    paraDayCode.classList.add('day-card-code');
    paraDayCode.classList.add('wi');
    paraDayCode.classList.add(`${dayWeatherIcon[0]}`);
    card.appendChild(paraDayCode);
  });
  // event listener to the parent
  const dayCardsContainer = document.querySelector('.days-container');
  function dayCardsSelector(event) {
    const card = event.target.closest('.day-card');
    if (card) {
      const index = card.getAttribute('data-index');
      selectedDay = Number(index);
      renderMain(retrieveWeather(), retrieveCoordinates());
    }
  }
  dayCardsContainer.removeEventListener('click', dayCardsSelector);
  dayCardsContainer.addEventListener('click', dayCardsSelector);
}

function renderSidebar(weatherObject) {
  const weatherContainer = document.getElementById('aside-weather');
  const weatherCode = Number(weatherObject.current.weather_code);
  const weatherCodeIcon = selectWeatherDecoder(weatherCode);
  const oldParaWeatherIcon = weatherContainer.querySelector('p:first-child');
  if (oldParaWeatherIcon) {
    oldParaWeatherIcon.remove();
  }
  const paraWeatherIcon = document.createElement('p');
  paraWeatherIcon.classList.add('current-weather-code');
  paraWeatherIcon.classList.add('weather-code-icon');
  paraWeatherIcon.classList.add('wi');
  paraWeatherIcon.classList.add(`${weatherCodeIcon[0]}`);
  weatherContainer.prepend(paraWeatherIcon);
  const paraTemp = weatherContainer.querySelector('p:nth-child(2)');
  paraTemp.textContent = `${parseInt(weatherObject.current.temperature_2m, 10)}°`;
  const paraAppTemp = weatherContainer.querySelector('p:nth-child(3)');
  paraAppTemp.textContent = `Feels like ${parseInt(
    weatherObject.current.apparent_temperature,
    10,
  )}°`;
  const humidity = document.querySelector('.current-humidity > p:nth-child(2)');
  humidity.textContent = `${weatherObject.current.relative_humidity_2m}%`;
  const wind = document.querySelector('.current-wind > p:nth-child(2)');
  wind.textContent = `${parseInt(weatherObject.current.wind_speed_10m, 10)} km/h`;
  const precipitation = document.querySelector('.current-precipitation > p:nth-child(2)');
  precipitation.textContent = `${weatherObject.current.precipitation} mm`;
}

function hideMenu() {
  dropdownMenu.classList.add('hide');
  userInput.value = '';
  clearMenu();
}

function renderUi(weatherObject, coordinatesArray) {
  renderMain(weatherObject, coordinatesArray);
  renderCards(weatherObject);
  renderSidebar(weatherObject, coordinatesArray);
  hideMenu();
}

document.addEventListener('click', (event) => {
  const isClickInsideDropdown = dropdownMenu.contains(event.target);
  if (!isClickInsideDropdown) {
    hideMenu();
  }
});

// get user unit selection
let unit = 'celsius';
const unitButton = document.getElementById('unit-button');
unitButton.addEventListener('click', async () => {
  if (unit === 'celsius') {
    unit = 'fahrenheit';
    unitButton.classList.remove('wi-celsius');
    unitButton.classList.add('wi-fahrenheit');
  } else {
    unit = 'celsius';
    unitButton.classList.remove('wi-fahrenheit');
    unitButton.classList.add('wi-celsius');
  }
  const newWeather = await getWeather(retrieveCoordinates(), 0, unit);
  updateWeather(newWeather);
  renderUi(retrieveWeather(), retrieveCoordinates());
});

// search bar
// debounce function avoids too frequent API calls by setting a timer after an event has been called
function debounce(func, delay) {
  let debounceTimer;
  return function debounced(...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}
const debouncedInputHandler = debounce(async () => {
  const firstLocation = document.createElement('p');
  firstLocation.setAttribute('id', 'first-location');
  const secondLocation = document.createElement('p');
  secondLocation.setAttribute('id', 'second-location');
  const thirdLocation = document.createElement('p');
  thirdLocation.setAttribute('id', 'third-location');
  if (userInput.value === '') {
    dropdownMenu.classList.add('hide');
  }
  const locationCoordinates = await getCoordinates(userInput.value);
  const foundCities = locationCoordinates.length;
  switch (foundCities) {
    case 1:
      clearMenu();
      dropdownMenu.classList.remove('hide');
      firstLocation.textContent = `${locationCoordinates[0].city}, ${locationCoordinates[0].country}`;
      firstLocation.addEventListener('click', async () => {
        const newWeather = await getWeather(locationCoordinates, 0, unit);
        const newCoordinates = locationCoordinates[0];
        updateWeather(newWeather);
        updateCoordinates(newCoordinates);
        renderUi(retrieveWeather(), retrieveCoordinates());
      });
      dropdownMenu.appendChild(firstLocation);
      break;
    case 2:
      clearMenu();
      dropdownMenu.classList.remove('hide');
      firstLocation.textContent = `${locationCoordinates[0].city}, ${locationCoordinates[0].country}`;
      secondLocation.textContent = `${locationCoordinates[1].city}, ${locationCoordinates[1].country}`;
      firstLocation.addEventListener('click', async () => {
        const newWeather = await getWeather(locationCoordinates, 0, unit);
        const newCoordinates = locationCoordinates[0];
        updateWeather(newWeather);
        updateCoordinates(newCoordinates);
        renderUi(retrieveWeather(), retrieveCoordinates());
      });
      secondLocation.addEventListener('click', async () => {
        const newWeather = await getWeather(locationCoordinates, 1, unit);
        const newCoordinates = locationCoordinates[1];
        updateWeather(newWeather);
        updateCoordinates(newCoordinates);
        renderUi(retrieveWeather(), retrieveCoordinates());
      });
      dropdownMenu.appendChild(firstLocation);
      dropdownMenu.appendChild(secondLocation);
      break;
    case 3:
      clearMenu();
      dropdownMenu.classList.remove('hide');
      firstLocation.textContent = `${locationCoordinates[0].city}, ${locationCoordinates[0].country}`;
      secondLocation.textContent = `${locationCoordinates[1].city}, ${locationCoordinates[1].country}`;
      thirdLocation.textContent = `${locationCoordinates[2].city}, ${locationCoordinates[2].country}`;
      firstLocation.addEventListener('click', async () => {
        const newWeather = await getWeather(locationCoordinates, 0, unit);
        const newCoordinates = locationCoordinates[0];
        updateWeather(newWeather);
        updateCoordinates(newCoordinates);
        renderUi(retrieveWeather(), retrieveCoordinates());
      });
      secondLocation.addEventListener('click', async () => {
        const newWeather = await getWeather(locationCoordinates, 1, unit);
        const newCoordinates = locationCoordinates[1];
        updateWeather(newWeather);
        updateCoordinates(newCoordinates);
        renderUi(retrieveWeather(), retrieveCoordinates());
      });
      thirdLocation.addEventListener('click', async () => {
        const newWeather = await getWeather(locationCoordinates, 2, unit);
        const newCoordinates = locationCoordinates[2];
        updateWeather(newWeather);
        updateCoordinates(newCoordinates);
        renderUi(retrieveWeather(), retrieveCoordinates());
      });
      dropdownMenu.appendChild(firstLocation);
      dropdownMenu.appendChild(secondLocation);
      dropdownMenu.appendChild(thirdLocation);
      break;
    default:
      dropdownMenu.classList.add('hide');
      clearMenu();
  }
}, 500);
userInput.addEventListener('input', debouncedInputHandler);

export default async function init() {
  renderTime();
  setInterval(renderTime, 30000);
  setWelcome();
  setInterval(renderTime, 60000);
  const coordinates = retrieveCoordinates();
  const weather = await getWeather(coordinates, 0, unit);
  updateWeather(weather);
  renderUi(retrieveWeather(), coordinates);
}
