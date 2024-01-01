const defaultWeatherObject = {
  latitude: 41.89,
  longitude: 12.51,
  generationtime_ms: 0.2580881118774414,
  utc_offset_seconds: 3600,
  timezone: 'Europe/Rome',
  timezone_abbreviation: 'CET',
  elevation: 54.0,
  current_units: {
    time: 'iso8601',
    interval: 'seconds',
    temperature_2m: '°C',
    relative_humidity_2m: '%',
    apparent_temperature: '°C',
    precipitation: 'mm',
    weather_code: 'wmo code',
    wind_speed_10m: 'km/h',
    wind_gusts_10m: 'km/h',
  },
  current: {
    time: '2023-12-30T23:30',
    interval: 900,
    temperature_2m: 11.9,
    relative_humidity_2m: 85,
    apparent_temperature: 11.0,
    precipitation: 0.0,
    weather_code: 3,
    wind_speed_10m: 4.6,
    wind_gusts_10m: 7.2,
  },
  daily_units: {
    time: 'iso8601',
    weather_code: 'wmo code',
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    precipitation_sum: 'mm',
    precipitation_probability_max: '%',
    wind_speed_10m_max: 'km/h',
    wind_gusts_10m_max: 'km/h',
  },
  daily: {
    time: [
      '2023-12-30',
      '2023-12-31',
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
      '2024-01-05',
    ],
    weather_code: [63, 53, 51, 51, 51, 3, 95],
    temperature_2m_max: [15.9, 15.2, 15.5, 13.2, 14.9, 15.3, 14.5],
    temperature_2m_min: [11.3, 10.9, 8.3, 4.9, 10.6, 4.7, 10.7],
    precipitation_sum: [4.4, 2.6, 0.3, 0.4, 0.8, 0.0, 16.2],
    precipitation_probability_max: [6, 35, 81, 20, 26, 10, 65],
    wind_speed_10m_max: [8.6, 15.3, 15.5, 12.3, 19.1, 15.2, 21.0],
    wind_gusts_10m_max: [18.7, 31.0, 31.0, 21.6, 32.8, 36.4, 43.2],
  },
};

const defaultCoordinatesArray = [
  {
    city: 'Rome',
    latitude: '41.89193',
    longitude: '12.51133',
    country: 'Italy',
    state: 'Latium',
  },
];

let weather = defaultWeatherObject;
let coordinates = defaultCoordinatesArray;

function updateWeather(newWeather) {
  if (newWeather === 'API-error') {
    return;
  }
  weather = newWeather;
}

function updateCoordinates(newCoordinates) {
  if (newCoordinates === 'API-error') {
    return;
  }
  coordinates = [newCoordinates];
}

function retrieveWeather() {
  return weather;
}

function retrieveCoordinates() {
  return coordinates;
}

export {
  updateWeather,
  updateCoordinates,
  defaultWeatherObject,
  defaultCoordinatesArray,
  retrieveWeather,
  retrieveCoordinates,
};
