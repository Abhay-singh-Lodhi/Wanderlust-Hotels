async function airbnbHotelList() {

const url = 'https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId?placeId=ChIJ7cv00DwsDogRAMDACa2m4K8&adults=1&guestFavorite=false&ib=false&currency=USD';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'a0eb25e4e3mshaf5ff0b27e66575p199a60jsnfce9a7836460',
    'x-rapidapi-host': 'airbnb19.p.rapidapi.com'
  }
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	return result;
} catch (error) {
	console.error(error);
}
}

module.exports =  airbnbHotelList ;