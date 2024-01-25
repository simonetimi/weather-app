import type { Coordinates } from './data';

export default async function getWeather(
  coordinates: Coordinates[],
  index: number,
  unit: string,
) {
  // unit must be celsius or fahrenheit
  try {
    const { latitude, longitude } = coordinates[index];
    if (coordinates === undefined || index === undefined) {
      throw new Error(`Can't fetch coordinates!`);
    }
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&temperature_unit=${unit}&timezone=auto`,
      { mode: 'cors', cache: 'no-cache' },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherResults = await response.json();
    return weatherResults;
  } catch (err) {
    return 'API-error';
  }
}
