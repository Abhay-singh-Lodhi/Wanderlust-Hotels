// api.js


async function fetchHotelList() {

  const url = 'https://travel-advisor.p.rapidapi.com/hotels/list?location_id=293919&adults=1&rooms=1&nights=2&offset=0&currency=USD&order=asc&limit=30&sort=recommended&lang=en_US';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '9d0009f10cmsh1b1fd57acfabe62p13864ajsn821d40f0c823',
    'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
  }
};

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hotel list:', error);
    return null;
  }
}

module.exports =  fetchHotelList ;


