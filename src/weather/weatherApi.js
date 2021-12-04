const axios = require("axios").default;

const options = {
  method: 'GET',
  url: 'https://community-open-weather-map.p.rapidapi.com/forecast',
  params: {q: '',units:'metric'},
  headers: {
    'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
    'x-rapidapi-key': `${process.env.ACCESS_KEY}`
  }
};

const checkWheater = (city, date) => { 
    options.params.q = city;
    let result;
    result = axios.request(options).then((response) => {
        var time = date.getTime();
        var weather;
        response.data.list.forEach(weatherData => {
            var weatherDate = new Date(weatherData.dt_txt);
            timeDifference = Math.abs(time - weatherDate.getTime());
            let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
            if(differentDays === 1) {
                weather = JSON.stringify(weatherData.main);
            }
        });
        return weather;
    }).catch((error => {
        return "Weather NOT Found";
    }));
    return result;
};
module.exports = checkWheater;




