// require node_modules

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

var path = require('path');

// configure dotenv package
require('dotenv').config();

// setup openweathermap API_KEY

const apiKey = process.env.API_KEY;

// setup express app and body-parser configurations
// setup javascript template view engine

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

// setup default display on launch
app.get('/', function (req, res) {
    // It shall not fetch and display any data in the index page
    res.render('index', {
        weather: null,
        error: null
    });
});

// On a post request, the app shall retrieve data from OpenWeatherMap using given arguments
app.post('/', function (req, res) {
    // get city name passed in the form
    let city = req.body.city;

    // use city name to fetch data
    // use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    // request for data ungin URl
    request(url, function (err, response, body) {
        // On retrun, check the json data fetched
        if (err) {
            res.render('index', {
                weather: null,
                error: 'No results found'
            });
        } else {
            let weather = JSON.parse(body);
            console.log(weather);
            if (weather.main == undefined) {
                res.render('index', {
                    weather: null,
                    error: 'No results found'
                });
            } else {
                let place = `${weather.name}, ${weather.sys.country}`,
                    weatherTimezone = `${new Date(weather.dt * 1000 - (weather.timezone * 1000))}`;
                let weatherTemp = `${weather.main.temp}`,
                    weatherPressure = `${weather.main.pressure}`,
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,
                    visibility = `${weather.visibility}`,
                    main = `${weather.weather[0].main}`,
                    weatherFahrenheit;
                weatherFahrenheit = ((weatherTemp * 9 / 5) + 32);

                function roundToTwo(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);

                res.render('index', {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    pressure: weatherPressure,
                    icon: weatherIcon,
                    description: weatherDescription,
                    timezone: weatherTimezone,
                    humidity: humidity,
                    fahrenheit: weatherFahrenheit,
                    clouds: clouds,
                    visibility: visibility,
                    main: main,
                    error: null
                });
            }

        }

    });
});

// Set up port configurations
let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Weather app listening on port 3000!');
});