import './index.css';
import getCoordinates from './modules/geocoding';
import getWeather from './modules/weather';

const locationCoordinates = await getCoordinates('Milan');
console.log(locationCoordinates);

const weather = await getWeather(locationCoordinates, 0);

console.log(weather);
