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
