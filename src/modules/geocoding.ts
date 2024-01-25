type FetchedCoordinates = {
  name: string;
  latitude: string;
  longitude: string;
  country: string;
  admin1: string;
};

export default async function getCoordinates(location: string) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=3&language=en&format=json`,
      { mode: 'cors', cache: 'no-cache' },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const coordinates = await response.json();
    const coordinatesArray = coordinates.results.map(
      (result: FetchedCoordinates) => ({
        city: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        state: result.admin1,
      }),
    );
    return coordinatesArray;
  } catch (err) {
    return [];
  }
}
