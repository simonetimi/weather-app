export default async function getCoordinates(location) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=3&language=en&format=json`,
      { mode: 'cors', cache: 'no-cache' },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const coordinates = await response.json();
    const coordinatesArray = coordinates.results.map((result) => ({
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      state: result.admin1,
    }));
    return coordinatesArray;
  } catch (err) {
    console.log(`Couldn't retrieve coordinates correctly: ${err}`);
    console.log(`Setting default coordinates: Rome, Italy`);
    return [{ latitude: '41.89193', longitude: '12.51133', country: 'Italy', state: 'Latium' }];
  }
}
