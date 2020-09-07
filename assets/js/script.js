// Creating intial dom objects needed for reference
var searchBtnEl = document.querySelector("#city-search-btn");
var searchHistoryContainerEl = document.querySelector("#search-history");
var currentDayCardBodyEl = document.querySelector("#current-day-card-body");
var fiveDayContainerEl = document.querySelector("#five-day-forcast-container");
var openWeatherIconUrl = "http://openweathermap.org/img/wn/";
var apiKey = "e832f3a4b25bedfd65d18bf1a2009124";

// Load search history items from localStorage and parse back to object
var searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

// Add city to search history in local storage
var addCitySearchHistory = function(city) {
    // add city to current array
    searchHistory.unshift({"cityName":city});
    // reset localStorage with new adjusted array
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
    // reload history on window
    loadSearchHistory();
}


// Load search history items from local storage
var loadSearchHistory = function() {
    searchHistoryContainerEl.innerHTML = "<h5>Last 10 searches</h5>";

    var historyListEl = document.createElement("ul");
    historyListEl.className = "list-group";

    // Loop through search history array and display results
    for(var i = 0; i < searchHistory.length; i++) {
        var searchHistoryItemEl = document.createElement("li");
        searchHistoryItemEl.classList = "list-group-item search-history-items";
        searchHistoryItemEl.textContent = searchHistory[i].cityName;
        searchHistoryItemEl.setAttribute("data-city", searchHistory[i].cityName);

        historyListEl.appendChild(searchHistoryItemEl);
    }

    searchHistoryContainerEl.appendChild(historyListEl);
}




// Call OpenWeather API 
var callWeatherAPI = function(city) {
    adjustedCity = city.split(' ').join('+');
    var currentDate = new Date().getTime() - 1;
    var cityName, country = "";
    
    // Compile URL
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + adjustedCity + 
    "&appid=e832f3a4b25bedfd65d18bf1a2009124";
    
    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            console.log("error");
        }
    })
    .then(function(response) {
        console.log(response);
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        cityName = response.name;
        country = response.sys.country;
        
        var newUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
        + lat + "&lon=" 
        + lon + "&exclude=minutely,hourly&appid=e832f3a4b25bedfd65d18bf1a2009124";
                
         var newUrl = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=e832f3a4b25bedfd65d18bf1a2009124"
        // return the new api call with corresponding lat and long for searched city
        return fetch(newUrl);
    })
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            console.log("error");
        }
    })
    .then(function(response) {
        console.log(response);
        // Grab and display current date
        var uvi = response.current.uvi;

        currentDayCardBodyEl.innerHTML = "<h2>" + cityName + ", " + country + " (" + moment.unix(response.current.dt).format("MM/DD/YYYY") + ")" 
                                        + "<img class='current-day-icon' src='" + openWeatherIconUrl + response.current.weather[0].icon + "@2x.png' /></h2>"
                                        + "<p>Temperature: " + response.current.temp + " " + String.fromCharCode(176) +"F</p>"
                                        + "<p>Humidity: " + response.current.humidity + "%</p>"
                                        + "<p>Wind Speed: " + response.current.wind_speed + " MPH</p>"
                                        + "<p>UV Index: <span>" + uvi + "</span></p>";

        // Display 5 day Forcast
        fiveDayContainerEl.innerHTML = "<h4>5-Day Forecast:</h4>";
        var fiveDayCardGroupEl = document.createElement("div");
        fiveDayCardGroupEl.classList = "card-deck d-flex justify-content-around";

        for (var i = 1; i <= 5; i++) {
            var dayCardEl = document.createElement("div");
            dayCardEl.classList = "card weather-card";
            var dayCardBodyEl = document.createElement("div");
            dayCardBodyEl.className = "card-body";
            dayCardBodyEl.innerHTML = "<p><span class='daily-date'>" + moment.unix(response.daily[i].dt).format("MM/DD/YYYY") + "</span></h4>"
                                    + "<p><img class='daily-icon' src='" + openWeatherIconUrl + response.daily[i].weather[0].icon + ".png' /></p>"
                                    + "<p>Temp: " + response.daily[i].temp.day + " " + String.fromCharCode(176) + "F</p>"
                                    + "<p>Humidity: " + response.daily[i].humidity + "%</p>";
            
            dayCardEl.appendChild(dayCardBodyEl);
            fiveDayCardGroupEl.appendChild(dayCardEl);
        }
        fiveDayContainerEl.appendChild(fiveDayCardGroupEl);
    }) 
    .catch(function(error) {

    });
    
    // Update search history with new city
    addCitySearchHistory(city);
}

// Search City Event Handler
var searchCityEvent = function(event) {
    event.preventDefault();

    var itemClicked = event.target;

    if(itemClicked.id === "city-search-btn") {
        // grab the value from the search field
        var cityName = document.getElementById("city-search-field").value;
        document.getElementById("city-search-field").value = "";
        
        if (cityName) {
            // cityName provided. Call search against weather API
            callWeatherAPI(cityName);
        } else {
            // No city entered
            alert("You must enter a city name.");
        }
    } else if (itemClicked.className.includes("search-history-items")) {
        // Find weather for selected city
        callWeatherAPI(itemClicked.getAttribute("data-city"));
    }
}


// Load search history on refresh
loadSearchHistory();
searchHistoryContainerEl.addEventListener("click", searchCityEvent);
searchBtnEl.addEventListener("click", searchCityEvent);
