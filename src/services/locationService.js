const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error.message);
      }
    );
  });
};

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return {
      city: data.address.city || data.address.town,
      state: data.address.state,
      country: data.address.country
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};

export const locationService = {
  getLocation,
  reverseGeocode
}; 