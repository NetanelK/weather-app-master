var requestOptions = {
    method: "GET",
    redirect: "follow",
};

function getLocalWeather() {
    var latlong = navigator.geolocation.getCurrentPosition(
        (pos) => {
            fetch(
                `https://www.metaweather.com/api/location/search/?lattlong=${pos.coords.latitude},${pos.coords.longitude}`
            )
                .then((response) => response.text())
                .then((result) => {
                    getWeather(JSON.parse(result)[0].woeid);
                });
        },
        (err) => {
            console.log(err);
            switch (err.code) {
                case 1:
                    alert("Please enable your location settings");
                    break;
                case 2:
                    alert(
                        "Your location isn't available right now,\n please try again later"
                    );
                    break;
                case 3:
                    alert("Your connection has timed out");
            }
            // navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
            //     if (result.state == 'granted') {
            //         report(result.state);
            //         geoBtn.style.display = 'none';
            //     } else if (result.state == 'prompt') {
            //         report(result.state);
            //         geoBtn.style.display = 'none';
            //         navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
            //     } else if (result.state == 'denied') {
            //         report(result.state);
            //         geoBtn.style.display = 'inline';
            //     }
            //     result.onchange = function () {
            //         report(result.state);
            //     }
            // });
            // console.log(err)
        }
    );
}

function getWeather(woeid) {
    var search = document.querySelector("#ch");
    var loader = document.querySelector(".mask");
    document.querySelector(".search-results").innerHTML = "";
    loader.style.display = "block";

    fetch(`https://www.metaweather.com/api/location/${woeid}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            var loader = document.querySelector(".mask");
            loader.style.display = "none";
            search.checked = false;
            let today = document.querySelector(".today");
            let highlightsCards = document.querySelectorAll(
                ".today-details .card"
            );
            let cards = document.querySelectorAll(".card");
            let data = JSON.parse(result);

            for (let i = 0; i < 6; i++) {
                var short = data.consolidated_weather[i];
                if (i === 0) {
                    today.children[0].children[0].src = `.\\assets\\${short.weather_state_name
                        .split(" ")
                        .join("")}.png`;
                    today.children[1].children[0].innerHTML = Math.round(
                        short.the_temp
                    );
                    today.children[2].innerHTML = short.weather_state_name;
                    let date = new Date(short.applicable_date);
                    date = formatDate(
                        date.getDay(),
                        date.getDate(),
                        date.getMonth()
                    );
                    today.children[5].innerHTML = date;
                    today.children[6].innerHTML =
                        '<i class="material-icons">location_on</i> ' +
                        data.title;
                } else {
                    cards[
                        i
                    ].children[1].src = `.\\assets\\${short.weather_state_name
                        .split(" ")
                        .join("")}.png`;
                    cards[i].children[2].innerHTML = `${Math.round(
                        short.max_temp
                    )}°C`;
                    cards[i].children[3].innerHTML = `${Math.round(
                        short.min_temp
                    )}°C`;
                    if (i != 1) {
                        let date = new Date(short.applicable_date);
                        date = formatDate(
                            date.getDay(),
                            date.getDate(),
                            date.getMonth()
                        );
                        cards[i].children[0].innerHTML = date;
                    }
                }
            }

            highlightsCards[0].children[1].children[0].innerHTML = Math.round(
                data.consolidated_weather[0].wind_speed
            );
            highlightsCards[0].children[2].innerHTML =
                '<i class="material-icons">navigation</i> ' +
                data.consolidated_weather[0].wind_direction_compass;
            highlightsCards[0].children[2].children[0].style.transform = `rotate(${data.consolidated_weather[0].wind_direction}deg)`;

            highlightsCards[1].children[1].children[0].innerHTML = Math.round(
                data.consolidated_weather[0].humidity
            );
            highlightsCards[1].children[2].children[1].children[1].style.width = `${Math.round(
                data.consolidated_weather[0].humidity
            )}%`;

            highlightsCards[2].children[1].children[0].innerHTML =
                Math.round(data.consolidated_weather[0].visibility * 10) / 10;

            highlightsCards[3].children[1].children[0].innerHTML = Math.round(
                data.consolidated_weather[0].air_pressure
            );

            console.log(data, highlightsCards[1]);
        })
        .catch((error) => console.log("error", error));
}

function formatDate(day, date, month) {
    let formatDate = "";
    switch (day) {
        case 0:
            formatDate += "Sun, ";
            break;
        case 1:
            formatDate += "Mon, ";
            break;
        case 2:
            formatDate += "Tue, ";
            break;
        case 3:
            formatDate += "Wed, ";
            break;
        case 4:
            formatDate += "Thu , ";
            break;
        case 5:
            formatDate += "Fri, ";
            break;
        case 6:
            formatDate += "Sat , ";
            break;
    }

    formatDate += date;

    switch (month) {
        case 0:
            formatDate += " Jan";
            break;
        case 1:
            formatDate += " Feb";
            break;
        case 2:
            formatDate += " Mar";
            break;
        case 3:
            formatDate += " Apr";
            break;
        case 4:
            formatDate += " May";
            break;
        case 5:
            formatDate += " June";
            break;
        case 6:
            formatDate += " July";
            break;
        case 7:
            formatDate += " Aug";
            break;
        case 8:
            formatDate += " Sept";
            break;
        case 9:
            formatDate += " Oct";
            break;
        case 10:
            formatDate += " Nov";
            break;
        case 11:
            formatDate += " Dec";
            break;
    }

    return formatDate;
}

function search() {
    var searchText = document.getElementById("text");
    var searchResults = document.querySelector(".search-results");

    searchResults.innerHTML = "";
    fetch(
        `https://www.metaweather.com/api/location/search/?query=${searchText.value}`
    )
        .then((response) => response.text())
        .then((result) => {
            let locations = JSON.parse(result);
            let i = 0;

            locations.forEach((element) => {
                var li = document.createElement("li");
                li.classList.add("search-item");
                li.innerHTML = `${element.title}<span class="material-icons">
                                        navigate_next
                                    </span>`;
                li.addEventListener("click", () => getWeather(element.woeid));
                console.log(li);
                searchResults.append(li);
                i++;
            });

            searchResults.style.height = `${i * 64}px`;
        });
}

function convert(bool) {
    var list = document.querySelectorAll(".celsius");

    switch (bool) {
        case 0:
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                let far = element.innerHTML.match(/\d+/);
                if (index === 0)
                    element.innerHTML = `<strong>${Math.round(
                        ((far - 32) / 9) * 5
                    )}</strong>°C`;
                else
                    element.innerHTML = `${Math.round(((far - 32) / 9) * 5)}°C`;
            }
            break;

        case 1:
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                let far = element.innerHTML.match(/\d+/);
                if (index === 0)
                    element.innerHTML = `<strong>${Math.round(
                        (far * 9) / 5 + 32
                    )}</strong>°F`;
                else element.innerHTML = `${Math.round((far * 9) / 5 + 32)}°F`;
            }
            break;
    }
}
