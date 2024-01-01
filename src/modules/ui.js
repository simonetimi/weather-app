import { parseISO, format } from 'date-fns';

import getCoordinates from './geocoding';
import getWeather from './weather';
import {
  updateWeather,
  updateCoordinates,
  defaultWeatherObject,
  defaultCoordinatesArray,
  retrieveWeather,
  retrieveCoordinates,
} from './data';

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

// selection of the day must be stored
const selectedDay = 'today';

// write UI
function renderUI(weatherObject, coordinatesArray) {
  // display city
  const selectedLocation = document.querySelector('main > h2');
  selectedLocation.textContent = `${coordinatesArray[0].city}, ${coordinatesArray[0].country}`;
  // day cards selection
  const dayCards = document.querySelectorAll('.day-card');
  dayCards.forEach((card, index) => {
    if (index > 0) {
      const date = parseISO(weatherObject.daily.time[index]);
      const dayOfTheWeek = format(date, 'eee');
      const paraDay = card.querySelector(':first-child');
      paraDay.textContent = dayOfTheWeek;
    }
  });
}

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
  renderUI(retrieveWeather(), retrieveCoordinates());
  console.log(retrieveWeather());
});

// data

userInput.addEventListener('input', () => {
  const firstLocation = document.createElement('p');
  firstLocation.setAttribute('id', 'first-location');
  const secondLocation = document.createElement('p');
  secondLocation.setAttribute('id', 'second-location');
  const thirdLocation = document.createElement('p');
  thirdLocation.setAttribute('id', 'third-location');
  if (userInput.value === '') {
    dropdownMenu.classList.add('hide');
  }
  setTimeout(async () => {
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
          renderUI(retrieveWeather(), retrieveCoordinates());
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
          renderUI(retrieveWeather(), retrieveCoordinates());
        });
        secondLocation.addEventListener('click', async () => {
          const newWeather = await getWeather(locationCoordinates, 1, unit);
          const newCoordinates = locationCoordinates[1];
          updateWeather(newWeather);
          updateCoordinates(newCoordinates);
          renderUI(retrieveWeather(), retrieveCoordinates());
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
          console.log(retrieveCoordinates());
          renderUI(retrieveWeather(), retrieveCoordinates());
        });
        secondLocation.addEventListener('click', async () => {
          const newWeather = await getWeather(locationCoordinates, 1, unit);
          const newCoordinates = locationCoordinates[1];
          updateWeather(newWeather);
          updateCoordinates(newCoordinates);
          console.log(retrieveCoordinates());
          renderUI(retrieveWeather(), retrieveCoordinates());
        });
        thirdLocation.addEventListener('click', async () => {
          const newWeather = await getWeather(locationCoordinates, 2, unit);
          const newCoordinates = locationCoordinates[2];
          updateWeather(newWeather);
          updateCoordinates(newCoordinates);
          console.log(retrieveCoordinates());
          renderUI(retrieveWeather(), retrieveCoordinates());
        });
        dropdownMenu.appendChild(firstLocation);
        dropdownMenu.appendChild(secondLocation);
        dropdownMenu.appendChild(thirdLocation);
        break;
      default:
        dropdownMenu.classList.add('hide');
        clearMenu();
    }
  }, 1500);
});

// remove menu after short delay to give the render function time to fetch weather data
userInput.addEventListener('blur', () => {
  function resetInput() {
    dropdownMenu.classList.add('hide');
    userInput.value = '';
    clearMenu();
  }
  setTimeout(resetInput, 200);
});

export default function init() {
  renderTime();
  setInterval(renderTime, 30000);
  setWelcome();
  setInterval(renderTime, 60000);
  renderUI(defaultWeatherObject, defaultCoordinatesArray);
}
