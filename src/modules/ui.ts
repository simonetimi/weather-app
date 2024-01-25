import { parseISO, format } from 'date-fns';

import getCoordinates from './geocoding';
import getWeather from './weather';
import {
  Coordinates,
  defaultWeatherObject,
  updateWeather,
  updateCoordinates,
  retrieveWeather,
  retrieveCoordinates,
} from './data';

// get time
function getTime() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const correctCurrentMinute =
    currentMinute < 10 ? `0${currentMinute}` : currentMinute;
  return `${currentHour}:${correctCurrentMinute}`;
}

// write time every 30 seconds
const showedTime =
  document.querySelector<HTMLHeadingElement>('div.welcome > h3');
function renderTime() {
  if (showedTime === null) return;
  const time = getTime();
  showedTime.textContent = time;
}

// write welcome message
const welcomeMessage =
  document.querySelector<HTMLHeadingElement>('div.welcome > h2');
function setWelcome() {
  if (welcomeMessage === null) return;
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

// function for setting the right weather icon
function selectWeatherDecoder(weatherCode: number) {
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

// UI render
function renderMain(
  weatherObject: typeof defaultWeatherObject,
  coordinatesArray: Coordinates[],
) {
  // display city
  const selectedLocation = document.querySelector('main > h2')!;
  selectedLocation.textContent = `${coordinatesArray[0].city}, ${coordinatesArray[0].country}`;
  const mainTemperature = document.getElementById('main-temperature')!;
  mainTemperature.textContent = `${parseInt(
    weatherObject.daily.temperature_2m_max[selectedDay].toString(),
    10,
  )}${weatherObject.daily_units.temperature_2m_max}`;
  const dayWeatherCode = Number(weatherObject.daily.weather_code[selectedDay]);
  const [dayWeatherArrayIcon, dayWeatherArrayText] =
    selectWeatherDecoder(dayWeatherCode);
  const mainWeatherCode = document.getElementById('main-weather-code');
  const paraTextWeather =
    mainWeatherCode?.querySelector<HTMLParagraphElement>(':first-child');
  if (paraTextWeather === null || paraTextWeather === undefined) return;
  paraTextWeather.textContent = dayWeatherArrayText;
  const oldParaIconWeather = mainWeatherCode?.querySelector(':nth-child(2)');
  if (oldParaIconWeather) {
    oldParaIconWeather.remove();
  }
  const paraIconWeather = document.createElement('p');
  paraIconWeather.classList.add('weather-code-icon');
  paraIconWeather.classList.add('wi');
  paraIconWeather.classList.add(dayWeatherArrayIcon);
  mainWeatherCode?.appendChild(paraIconWeather);
  // labels
  const labelTemp = document.getElementById('label-temp');
  const minTemp = labelTemp?.querySelector<HTMLParagraphElement>(
    '#label-temp > div > p:nth-child(1)',
  );
  if (minTemp)
    minTemp.textContent = `Min: ${parseInt(
      weatherObject.daily.temperature_2m_min[selectedDay].toString(),
      10,
    )}${weatherObject.daily_units.temperature_2m_min}`;
  const maxTemp = labelTemp?.querySelector(
    '#label-temp > div > p:nth-child(2)',
  );
  if (maxTemp)
    maxTemp.textContent = `Max: ${parseInt(
      weatherObject.daily.temperature_2m_max[selectedDay].toString(),
      10,
    )}${weatherObject.daily_units.temperature_2m_max}`;
  const labelPrec = document.getElementById('label-prec');
  const precProb = labelPrec?.querySelector(
    '#label-prec > div > p:nth-child(1)',
  );
  if (precProb)
    precProb.textContent = `Prob.: ${weatherObject.daily.precipitation_probability_max[selectedDay]}%`;
  const precTotal = labelPrec?.querySelector(
    '#label-prec > div > p:nth-child(2)',
  );
  if (precTotal)
    precTotal.textContent = `Total: ${weatherObject.daily.precipitation_sum[selectedDay]} mm`;
  const labelWind = document.getElementById('label-wind');
  const windSpeed = labelWind?.querySelector(
    '#label-wind > div > p:nth-child(1)',
  );
  if (windSpeed)
    windSpeed.textContent = `Speed: ${parseInt(
      weatherObject.daily.wind_speed_10m_max[selectedDay].toString(),
      10,
    )} km/h`;
  const gustsSpeed = labelWind?.querySelector(
    '#label-wind > div > p:nth-child(2)',
  );
  if (gustsSpeed)
    gustsSpeed.textContent = `Gusts: ${parseInt(
      weatherObject.daily.wind_gusts_10m_max[selectedDay].toString(),
      10,
    )} km/h`;
}

function renderCards(weatherObject: typeof defaultWeatherObject) {
  const dayCards = document.querySelectorAll<HTMLDivElement>('.day-card');
  dayCards.forEach((card, index) => {
    if (index > 0) {
      const date = parseISO(weatherObject.daily.time[index]);
      const dayOfTheWeek = format(date, 'eee');
      const paraDay = card.querySelector<HTMLParagraphElement>(':first-child');
      if (paraDay === null) return;
      paraDay.textContent = dayOfTheWeek;
    }
    const dayTemp = weatherObject.daily.temperature_2m_max[index].toString();
    const tempUnit = weatherObject.daily_units.temperature_2m_max;
    const paraDayTemp = card.querySelector<HTMLDivElement>(':nth-child(2)');
    if (paraDayTemp === null) return;
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
  function dayCardsSelector(event: Event) {
    const target = event.target as HTMLElement;
    const card = target.closest('.day-card');
    if (card) {
      const index = card.getAttribute('data-index');
      selectedDay = Number(index);
      renderMain(retrieveWeather(), retrieveCoordinates());
    }
  }
  dayCardsContainer?.removeEventListener('click', dayCardsSelector);
  dayCardsContainer?.addEventListener('click', dayCardsSelector);
}

function renderSidebar(weatherObject: typeof defaultWeatherObject) {
  const weatherContainer = document.getElementById('aside-weather');
  if (weatherContainer === null) return;
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
  if (paraTemp === null) return;
  paraTemp.textContent = `${parseInt(
    weatherObject.current.temperature_2m.toString(),
    10,
  )}°`;
  const paraAppTemp = weatherContainer.querySelector('p:nth-child(3)');
  if (paraAppTemp === null) return;
  paraAppTemp.textContent = `Feels like ${parseInt(
    weatherObject.current.apparent_temperature.toString(),
    10,
  )}°`;
  const humidity = document.querySelector('.current-humidity > p:nth-child(2)');
  if (humidity === null) return;
  humidity.textContent = `${weatherObject.current.relative_humidity_2m}%`;
  const wind = document.querySelector('.current-wind > p:nth-child(2)');
  if (wind === null) return;
  wind.textContent = `${parseInt(
    weatherObject.current.wind_speed_10m.toString(),
    10,
  )} km/h`;
  const precipitation = document.querySelector(
    '.current-precipitation > p:nth-child(2)',
  );
  if (precipitation === null) return;
  precipitation.textContent = `${weatherObject.current.precipitation} mm`;
}

// menu city selection
const userInput = document.querySelector<HTMLInputElement>('#user-city');
const dropdownMenu = document.querySelector('.dropdown-menu')!;
function clearMenu() {
  dropdownMenu.innerHTML = '';
}

function hideMenu() {
  dropdownMenu.classList.add('hide');
  if (userInput === null) return;
  userInput.value = '';
  clearMenu();
}

function renderUi(
  weatherObject: typeof defaultWeatherObject,
  coordinatesArray: Coordinates[],
) {
  renderMain(weatherObject, coordinatesArray);
  renderCards(weatherObject);
  renderSidebar(weatherObject);
  hideMenu();
}

document.addEventListener('click', (event) => {
  const isClickInsideDropdown = dropdownMenu.contains(event.target as Node);
  if (!isClickInsideDropdown) {
    hideMenu();
  }
});

// get user unit selection
let unit = 'celsius';
const unitButton = document.getElementById('unit-button');
unitButton?.addEventListener('click', async () => {
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
function debounce(
  func: (...args: unknown[]) => void,
  delay: number,
): (...args: unknown[]) => void {
  let debounceTimer: ReturnType<typeof setTimeout>;

  return function (...args: unknown[]): void {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}

const debouncedInputHandler = debounce(async () => {
  const firstLocation = document.createElement('p');
  firstLocation.setAttribute('id', 'first-location');
  const secondLocation = document.createElement('p');
  secondLocation.setAttribute('id', 'second-location');
  const thirdLocation = document.createElement('p');
  thirdLocation.setAttribute('id', 'third-location');
  if (userInput?.value === '') {
    dropdownMenu.classList.add('hide');
  }
  if (userInput === null) return;
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
      firstLocation.textContent = `${locationCoordinates[0].city}, ${locationCoordinates[0].state}, ${locationCoordinates[0].country}`;
      secondLocation.textContent = `${locationCoordinates[1].city}, ${locationCoordinates[1].state}, ${locationCoordinates[1].country}`;
      thirdLocation.textContent = `${locationCoordinates[2].city}, ${locationCoordinates[2].state}, ${locationCoordinates[2].country}`;
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

userInput?.addEventListener('input', debouncedInputHandler);

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
