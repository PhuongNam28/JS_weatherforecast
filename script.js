const timeEl = document.getElementById('time');
        const dateEl = document.getElementById('date');
        const currentweatheritemEl = document.getElementById('current-weather-item');
        const timezoneEl = document.getElementById('time-zone');
        const countryEl = document.getElementById('country');
        const weatherforecastEl = document.getElementById('weather-forecast');
        const currenttempEl = document.getElementById('current-temp');

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const API_KEY = '8f6452fa4aea027a27500e1a8dc1fcf1';
        const time = new Date();
        const day = time.getDay();
        const dayF = days[day];

        setInterval(() => {
            const time = new Date();
            const date = time.getDate();
            const month = time.getMonth();
            const day = time.getDay();
            const hour = time.getHours();
            const minutes = time.getMinutes();
            const ampm = hour >= 12 ? 'PM' : 'AM';
            
            const hourFormat = hour >= 13 ? hour % 12 : hour;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

            timeEl.innerHTML = hourFormat + ':' + formattedMinutes + ' ' + `<span id="am-pm">${ampm}</span>`;
            dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
        }, 1000);

        function getWeatherData(){
            navigator.geolocation.getCurrentPosition((success)=>{
                let {latitude, longitude} = success.coords;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    showWeatherData(data)
                })
            })
        }

        getWeatherData();

        function showWeatherData(data){
            let {humidity, pressure, temp_max, temp_min} = data.main;
            let windSpeed = data.wind.speed;
            let {sunrise, sunset} = data.sys;

            currentweatheritemEl.innerHTML = `
                <div class="weather-item">
                    <div>Humidity</div>
                    <div>${humidity}%</div>
                </div>
                <div class="weather-item">
                    <div>Pressure</div>
                    <div>${pressure}</div>
                </div>
                <div class="weather-item">
                    <div>Wind Speed</div>
                    <div>${windSpeed} m/s</div>
                </div>
                <div class="weather-item">
                    <div>Sunrise</div>
                    <div>${moment(sunrise * 1000).format('HH:mm a')}</div>
                </div>
                <div class="weather-item">
                    <div>Sunset</div>
                    <div>${moment(sunset * 1000).format('HH:mm a')}</div>
                </div>`;

            currenttempEl.innerHTML = `
                <div class="other">
                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-img">
                    <div class="day">${dayF}</div>
                    <div class="temp">Night - ${(temp_max / 10).toFixed(2)}&#176; C</div>
                    <div class="temp">Day - ${(temp_min / 10).toFixed(2)}&#176; C</div>
                </div>`;

            generateWeatherForecast();
        }

        function generateWeatherForecast() {
            const forecastDays = getNextDays(day, 7);
            let forecastHTML = '';

            forecastDays.forEach(forecastDay => {
                forecastHTML += `
                    <div class="weather-forecast-item">
                        <div class="day">${forecastDay}</div>
                        <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-img">
                        <div class="temp">Night - 25.6&#176; C</div>
                        <div class="temp">Day - 35.6&#176; C</div>
                    </div>`;
            });

            weatherforecastEl.innerHTML = forecastHTML;
        }

        function getNextDays(startDayIndex, numDays) {
            let result = [];
            for (let i = 1; i < numDays; i++) {
                result.push(days[(startDayIndex + i) % 7]);
            }
            return result;
        }