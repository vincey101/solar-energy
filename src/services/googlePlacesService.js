const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const searchSolarCompanies = async (latitude, longitude) => {
  try {
    // Search for solar companies within 50km radius
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&keyword=solar+company&type=business&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      // Get detailed information for each company
      const detailedCompanies = await Promise.all(
        data.results.map(async (place) => {
          const detailsResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,formatted_address,formatted_phone_number,website,photos,reviews,opening_hours&key=${GOOGLE_API_KEY}`
          );
          const detailsData = await detailsResponse.json();
          const details = detailsData.result;

          return {
            id: place.place_id,
            name: place.name,
            location: place.vicinity,
            rating: place.rating,
            totalRatings: place.user_ratings_total,
            address: details.formatted_address,
            phone: details.formatted_phone_number,
            website: details.website,
            openNow: details.opening_hours?.open_now,
            photos: details.photos?.map(photo => 
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
            ),
            reviews: details.reviews,
            packages: [
              {
                name: "Standard Solar Package",
                capacity: `${Math.round(Math.random() * 5 + 5)}kW`, // Example capacity
                price: `$${Math.round(Math.random() * 7000 + 8000)}`, // Example price
                features: [
                  "Solar Panels",
                  "Inverter",
                  "Installation",
                  "5 Year Warranty"
                ]
              },
              {
                name: "Premium Solar Package",
                capacity: `${Math.round(Math.random() * 5 + 10)}kW`,
                price: `$${Math.round(Math.random() * 10000 + 15000)}`,
                features: [
                  "High-Efficiency Panels",
                  "Advanced Inverter",
                  "Professional Installation",
                  "10 Year Warranty",
                  "Monitoring System"
                ]
              }
            ]
          };
        })
      );

      return detailedCompanies;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch solar companies:', error);
    return [];
  }
};

export const googlePlacesService = {
  searchSolarCompanies
}; 