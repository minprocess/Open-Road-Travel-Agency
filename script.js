var WEATHER_SEARCH_URL = "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID=d86b9843fdc4941e520f985922146256";
let map;

//autocomplete location name in form
function getWeatherData() {
    let city = $('.search-query').val();
    $.ajax(WEATHER_SEARCH_URL, {
        data: {
            units: 'imperial',
            q: city
        },
        dataType: 'jsonp',
        type: 'GET',
        success: function (data) {
            let widget = displayWeather(data);
            $('#weather-display').html(widget);
            // scrollPageTo('#weather-display', 15);
        }
    });
}

function displayWeather(data) {
    return `
    <div class="weather-results">
    <h1><strong>Current Weather for ${data.name}</strong></h1>
    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
    <p style="font-size:30px; margin-top:10px;">${data.weather[0].main}</p>
    <p style="color:white;">Temperature:</p><p> ${data.main.temp} &#8457; / ${(((data.main.temp) - 32) * (5 / 9)).toFixed(2)} &#8451;</p>
    <p style="color:white;">Humidity:</p><p> ${data.main.humidity} &#37;</p>
    </div>
    `;
}

function displayResults(result) {
    return `
    <div class="result col-3">
    <div class="result-description">
    <h2 class="result-name"><a href="${result.venue.url}" target="_blank">${result.venue.name}</a></h2>
    <span class="icon">
    <img src="${result.venue.categories[0].icon.prefix}bg_32${result.venue.categories[0].icon.suffix}" alt="category-icon">
    </span>
    <span class="icon-text">
    ${result.venue.categories[0].name}
    </span>
    <p class="result-address">${result.venue.location.formattedAddress[0]}</p>
    <p class="result-address">${result.venue.location.formattedAddress[1]}</p>
    <p class="result-address">${result.venue.location.formattedAddress[2]}</p>
    </div>
    </div>
    `;
}

function enterLocation() {
}

//autocomplete location name in form
function activatePlacesSearch() {
    let options = {
        types: ['(regions)']
    };
    let input = document.getElementById('search-term');
    let autocomplete = new google.maps.places.Autocomplete(input, options);
}

$('#city-search').click(function (event) {
    console.log("search test")
    event.preventDefault();
    initMap();
    // $('.navigation').removeClass("hide");
    $('#weather-display').html("");
    // $('#foursquare-results').html("");
    getWeatherData();
    //getFourSquareData();
    $('button').removeClass("selected");

    console.log("TEST")
    $('.category-button').click(function () {
        $('button').removeClass("selected");
        $(this).addClass("selected");
    });

    getLatLng()
});

function getLatLng() {
    let location = $('.search-query').val()
    let geocoder = new google.maps.Geocoder()
    geocoder.geocode({ "address": location }, function (results, status) {
        console.log("GEOCODER RESULTS")
        console.log(status)
        console.log(results)
        console.log(typeof results[0].geometry.location.lat())
        let lat = results[0].geometry.location.lat()
        let lng = results[0].geometry.location.lng()
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 8,
            center: { lat: lat, lng: lng},
        });
        // map.setCenter({ lat: lat, lng: lng })
        // map.setZoom(15)
        getCovidData(results[0].formatted_address)
    })
}

// Initialize and add the map
// function initMap() {
//     // The location of Uluru
//     const uluru = { lat: -25.344, lng: 131.036 };
//     // The map, centered at Uluru
//     map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 4,
//         center: uluru,
//     });
//     console.log("initmap map");
//     console.log(map);
//     // The marker, positioned at Uluru
//     const marker = new google.maps.Marker({
//         position: uluru,
//         map: map,
//     });
// }   // end of function initMap

function getCovidData(formattedAddress) {
    let splitArray = formattedAddress.split(',')   // ['Harrisburg', ' PA', ' USA']
    let splitStateCode = splitArray[1].trim()
    console.log(`Getting Covid Data For : ${splitStateCode}`)
    $.ajax(`http://api.covidtracking.com/v1/states/${splitStateCode}/current.json`,
        {
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                console.log(data.positiveIncrease)
                $('#covid-data-message').text(`The COVID rating for ${splitArray[0]}, ${splitArray[1]}`)
                if (data.positiveIncrease < 500) {
                    $('#covid-rating-circle').addClass('crc-green')
                }
                else if (data.positiveIncrease < 1000) {
                    $('#covid-rating-circle').addClass('crc-yellow')
                }
                else {
                    $('#covid-rating-circle').addClass('crc-red')
                }
            },
            error: function () {
                console.log("There was an error getting the covid data")
            }
        })
}

// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
    });
    console.log("initmap map");
    console.log(map);
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
}   // end of function initMap

    // var FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v2/venues/explore?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=YYYYMMDD";
    // var CLIENT_ID = "3HOWAEZDHCEUXJXWUAM5FWOZRF1QLJUFQOLPFXGD4YJMWTG0";
    // var CLIENT_SECRET = "NJVMVP2OA1HFOJNDZWZBBR45CB0ZHVL2EK4ECHLLPVKBG4XN";

    //retrieve data from FourSquare API
// function getFourSquareData() {
    //     $('.category-button').click(function () {
        //         let city = $('.search-query').val();
        //         let category = $(this).text();
        //         $.ajax(FOURSQUARE_SEARCH_URL, {
            //             data: {
                //                 near: city,
                //                 venuePhotos: 1,
                //                 limit: 9,
                //                 query: 'recommended',
                //                 section: category,
                //             },
                //             dataType: 'json',
                //             type: 'GET',
                //             success: function (data) {
                    //                 try {
                        //                     let results = data.response.groups[0].items.map(function (item, index) {
                            //                         return displayResults(item);
                            //                     });
//                     $('#foursquare-results').html(results);
//                     scrollPageTo('#foursquare-results', 15);
//                 } catch (e) {
    //                     $('#foursquare-results').html("<div class='result'><p>Sorry! No Results Found.</p></div>");
    //                 }
    //             },
    //             error: function () {
        //                 $('#foursquare-results').html("<div class='result'><p>Sorry! No Results Found.</p></div>");
        //             }
        //         });
        //     });
        // }