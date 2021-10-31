let requestOptions = {
    method: "GET",
    redirect: "follow",
};

function getLocalWeather() {
    navigator.geolocation.getCurrentPosition(
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

const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    } else {
        return (
            navigator.userLanguage ||
            navigator.language ||
            navigator.browserLanguage ||
            "en"
        );
    }
};

function getWeather(woeid) {
    let search = document.querySelector("#ch");
    let loader = document.querySelector(".mask");
    document.querySelector(".search-results").innerHTML = "";
    loader.style.display = "block";

    fetch(`https://www.metaweather.com/api/location/${woeid}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            loader = document.querySelector(".mask");
            loader.style.display = "none";
            search.checked = false;
            let today = document.querySelector(".today");
            let highlightsCards = document.querySelectorAll(
                ".today-details .card"
            );
            let cards = document.querySelectorAll(".card");
            let data = JSON.parse(result);
            let locales = getNavigatorLanguage();

            for (let i = 0; i < 6; i++) {
                let weather = data.consolidated_weather[i];
                console.log(locales);
                if (i === 0) {
                    today.children[0].children[0].src = `.\\assets\\${weather.weather_state_name
                        .split(" ")
                        .join("")}.png`;
                    today.children[1].children[0].innerHTML = Math.round(
                        weather.the_temp
                    );
                    today.children[2].innerHTML = weather.weather_state_name;
                    let date = new Date(weather.applicable_date).toLocaleString(
                        locales,
                        {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                        }
                    );
                    today.children[5].innerHTML = date;
                    today.children[6].innerHTML =
                        '<i class="material-icons">location_on</i> ' +
                        data.title;
                } else {
                    cards[
                        i
                    ].children[1].src = `.\\assets\\${weather.weather_state_name
                        .split(" ")
                        .join("")}.png`;
                    cards[i].children[2].innerHTML = `${Math.round(
                        weather.max_temp
                    )}°C`;
                    cards[i].children[3].innerHTML = `${Math.round(
                        weather.min_temp
                    )}°C`;
                    if (i != 1) {
                        let date = new Date(
                            weather.applicable_date
                        ).toLocaleString(locales, {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                        });
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

            // console.log(data, highlightsCards[1]);
        })
        .catch((error) => console.log("error", error));
}

function search() {
    let searchText = document.getElementById("text");
    let searchResults = document.querySelector(".search-results");

    searchResults.innerHTML = "";
    fetch(
        `https://www.metaweather.com/api/location/search/?query=${searchText.value}`
    )
        .then((response) => response.text())
        .then((result) => {
            let locations = JSON.parse(result);
            let i = 0;

            locations.forEach((element) => {
                let li = document.createElement("li");
                li.classList.add("search-item");
                li.innerHTML = `${element.title}<span class="material-icons">
                                        navigate_next
                                    </span>`;
                li.addEventListener("click", () => getWeather(element.woeid));
                // console.log(li);
                searchResults.append(li);
                i++;
            });

            searchResults.style.height = `${i * 64}px`;
        });
}

function convert(bool) {
    let list = document.querySelectorAll(".celsius");

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
