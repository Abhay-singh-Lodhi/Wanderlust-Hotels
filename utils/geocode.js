// utils/geocode.js
const axios = require("axios");

module.exports = async function geocode(location) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        'User-Agent': 'WanderlustHotels/1.0 (abhaysha25@gmail.com)', // Replace with your actual email
      },
    });

    const data = response.data[0];
    if (!data) return null;

    return {
      type: "Point",
      coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
    };
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    return null;
  }
};
