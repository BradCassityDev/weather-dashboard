// Creating intial dom objects needed for reference
var searchBtnEl = document.querySelector("#city-search-btn");
var searchHistoryContainerEl = document.querySelector("#search-history");

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
