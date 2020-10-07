//define details and key
var city = $(".city");
var wind = $(".wind");
var humidity = $(".humidity");
var temp = $(".temp");

var searchArr = [];
var APIKey = "&appid=7495abdd9e6d97f32ed9e0e5df5030a9";

$(document).ready(function () {
    renderSearchList();
    //create click funtion for search
    $("#searchBtn").click(function (event) {
        event.preventDefault();

        var searchTerm = $("#search").val().trim();
        btnSearch(searchTerm);
    })

    function btnSearch(citySearch) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial" + APIKey;

        //add cities searched to list
        $("<button>").text(citySearch).prepend(".list-group-item");
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            
            var previousCity = JSON.parse(localStorage.getItem("cities"));

            if (previousCity) {
                previousCity.push(response.name);
                localStorage.setItem("cities", JSON.stringify(previousCity));
            } else {
                searchArr.push(response.name)
                localStorage.setItem("cities", JSON.stringify(searchArr));
            }
            //City with icon and date
            var cityName = $(".jumbotron").addClass("city-weather").text(citySearch);
            var currentDate = moment().format(" MM-DD-YYYY");
            var iconcode = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            var weatherImg = $("<img>").attr("src", iconurl);

            var windData = $("<p>").text("Wind Speed: " + response.wind.speed + "MPH").addClass("detail");
            var humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("detail");

            $("#forecast").empty();

            var tempData = $("<p>").text("Temp: " + response.main.temp + "°F").addClass("detail");

            //append all
            cityName.append(weatherImg);
            cityName.append(currentDate);
            cityName.append(windData);
            cityName.append(humidityData);
            cityName.append(tempData);
            $("container").append(cityName);



        })

    }
    $(document).on("click", ".city-btn", function () {
        JSON.parse(localStorage.getItem("cities"));
        var citySearch = $(this).text();
        btnSearch(citySearch);
    });

})