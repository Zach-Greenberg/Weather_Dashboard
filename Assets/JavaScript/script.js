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

            //ajax call for UV Index
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
            
            $.ajax({
                url: uvIndexURL,
                method: "GET",
            }).then(function (UVinfo) {
                var currentUV = $("<div>").addClass('detail uv-index').text("UV Index: ");
                var uvValue = $("#current-uv-level").text(UVinfo.value);
                currentUV.append(uvValue);
                if (UVinfo.value < 3) {
                    $(uvValue).addClass("uv-low");
                } else if (UVinfo.value < 6) {
                    $(uvValue).addClass("uv-mild");
                } else if (UVinfo.value < 8) {
                    $(uvValue).addClass("uv-warning");
                } else if (UVinfo.value < 11) {
                    $(uvValue).addClass("uv-high");
                } else if (UVinfo.value >= 11) {
                    $(uvValue).addClass("uv-extreme");
                }
                cityName.append(currentUV);
                renderSearchList();
            })

            //start 5 day forecast ajax
            var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + APIKey;

            for (var i = 1; i < 6; i++) {
                $.ajax({
                    url: forecastURL,
                    method: "GET",
                }).then(function (response5Day) {
                    var cardbodyElem = $("<div>").addClass("card-body");

                    var fiveDayCard = $("<div>").addClass(".cardbody");
                    var fiveDate = $("<h5>").text(moment.unix(response5Day.daily[i].dt).format("MM/DD/YYYY"));
                    fiveDayCard.addClass("headline");

                    var fiveDayTemp = $("<p>").text("Temp: " + response5Day.daily[i].temp.max + "°");
                    fiveDayTemp.attr("id", "#fiveDayTemp[i]");

                    var fiveHumidity = $("<p>").attr("id", "humDay").text("Humidity: " + JSON.stringify(response5Day.daily[i].humidity) + "%");
                    fiveHumidity.attr("id", "#fiveHumidity[i]");

                    var iconCode = response5Day.daily[i].weather[0].icon;
                    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    var weatherImgDay = $("<img>").attr("src", iconURL);
                    $("#testImage").attr("src", iconURL);

                    cardbodyElem.append(fiveDate);
                    cardbodyElem.append(weatherImgDay);
                    cardbodyElem.append(fiveDayTemp);
                    cardbodyElem.append(fiveHumidity);
                    fiveDayCard.append(cardbodyElem);
                    $("#forecast").append(fiveDayCard);
                    $("#fiveDayTemp[i]").empty();
                    $(".jumbotron").append(cardbodyElem);
                })
            }
            $("#search").val("");

        })

    }
    $(document).on("click", ".city-btn", function () {
        JSON.parse(localStorage.getItem("cities"));
        var citySearch = $(this).text();
        btnSearch(citySearch);
    });

    function renderSearchList() {
        var searchList = JSON.parse(localStorage.getItem("cities"));
        $("#search-list").empty();
        if (searchList) {
            for (i = 0; i < searchList.length; i++) {
                var listBtn = $("<button>").addClass("btn btn-secondary city-btn").attr('id', 'cityname_' + (i + 1)).text(searchList[i]);
                var listElem = $("<li>").attr('class', 'list-group-item');
                listElem.append(listBtn);
                $("#search-list").append(listElem);
            }

        }

    }

})