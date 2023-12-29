export default async function getWeather(coordinates, index, unit) {
  // unit must be celsius or fahrenheit
  // index must be selected by user when showed the options
  try {
    const { latitude, longitude } = coordinates[index];
    if (coordinates === undefined || index === undefined) {
      throw new Error(`Can't fetch coordinates!`);
    }
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&temperature_unit=${unit}`,
      { mode: 'cors', cache: 'no-cache' },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherResults = await response.json();
    return weatherResults;
  } catch (err) {
    return {
      // default sunny array to make the website work with all the needed parameters for Rome
    };
  }
}
