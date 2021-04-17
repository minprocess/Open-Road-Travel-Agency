// var WEATHER_SEARCH_URL = "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID=d86b9843fdc4941e520f985922146256";
var map;

function activatePlacesSearch() {
    const options = {
        types: ['(cities)']
    };
    var input = document.getElementById('search-term');
    let autocomplete = new google.maps.places.Autocomplete(input, options);
}

//autocomplete location name in form
function getWeatherData() {
    let city = $('.search-query').val();
    console.log("city")
    console.log(city)
    $.ajax("https://api.openweathermap.org/data/2.5/weather?id=524901&APPID=d86b9843fdc4941e520f985922146256", {
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

function scrollPageTo(){
    document.getElementById('map').scrollIntoView(true);
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

function enterLocation() {
    
}

$('#city-search').click(function (event) {
    // $(".covid-container").removeClass("hide");
    console.log("search test")
    event.preventDefault();
    $('#weather-display').html("");
    let errMsgEl = document.getElementById("error-msg")
    errMsgEl.textContent = ""
    getLatLng()

    $('button').removeClass("selected");
    console.log("TEST")
    $('.category-button').click(function () {
        $('button').removeClass("selected");
        $(this).addClass("selected");
    });


});

function getLatLng() {
    let location = $('.search-query').val()
    console.log("location")
    console.log(location)
    var options = {
        types: ['(cities)'],
        componentRestrictions: {country: 'us'}
      };
    let geocoder = new google.maps.Geocoder()
    
    geocoder.geocode({ "address": location }, function (results, status) {
        console.log("GEOCODER RESULTS")
        console.log('status')
        console.log(status)
 
        console.log("results");
        console.log(results)
        //console.log(typeof results[0].geometry.location.lat())
        if (status != "ZERO_RESULTS")
        {
            getWeatherData();

            let lat = results[0].geometry.location.lat()
            let lng = results[0].geometry.location.lng()
    
            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 12,
                center: { lat: lat, lng: lng},
            });
            const marker = new google.maps.Marker({
                position: { lat: lat, lng: lng},
                map: map,
            });
            getCovidData(results[0].formatted_address) 
            getFourSquareData();
            scrollPageTo();   
        }
        else {
            // status == ZERO_RESULTS
            let errMsgEl = document.getElementById("error-msg")
            errMsgEl.textContent = "Can't find "+location
        }
    })
}

function getCovidData(formattedAddress) {
    let splitArray = formattedAddress.split(',')   // ['Harrisburg', ' PA', ' USA']
    let splitStateCode = splitArray[1].trim()
    console.log(`Getting Covid Data For : ${splitStateCode}`)
    $.ajax(`https://api.covidtracking.com/v1/states/${splitStateCode}/current.json`,
        {
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                $(".covid-container").removeClass("hide");
                console.log("covidSuccessful")
                console.log(data.positiveIncrease)
                $('#covid-data-message').text(`The COVID rating for ${splitArray[0]}, ${splitArray[1]}`)
                // $('#covid-message2').text('Green = <500 cases Yellow = <1000 cases Red = >100 cases')

                if (data.positiveIncrease < 500) {
                    $('#covid-rating-circle').addClass('crc-green')
                    $('#covid-message2').text('Green indicates that there are less than 500 positive cases for the searched location.')
                }
                else if (data.positiveIncrease < 1000) {

                    $('#covid-rating-circle').addClass('crc-yellow')
                    $('#covid-message2').text('Yellow indicates that there are less than 1,000 positive cases for the searched location.')
                }
                else {
                    $('#covid-rating-circle').addClass('crc-red')
                    $('#covid-message2').text('Red indicates that there are more than 1,000 positive cases for the searched location')
                }
            },
            error: function () {
                console.log("There was an error getting the covid data")
            }
        })

}

// retrieve data from FourSquare API
function getFourSquareData() {
    let location = $('.search-query').val()
    let geocoder = new google.maps.Geocoder()
    geocoder.geocode({ "address": location }, function (results, status) {
        let lat = results[0].geometry.location.lat()
        let lng = results[0].geometry.location.lng()
        console.log(lat)
        console.log("square fuction 1")
        let city = $('.search-query').val();
        let category = $(this).text();
        $.ajax(`https://api.foursquare.com/v2/venues/search?ll=${lat},${lng}&client_id=3HOWAEZDHCEUXJXWUAM5FWOZRF1QLJUFQOLPFXGD4YJMWTG0&client_secret=NJVMVP2OA1HFOJNDZWZBBR45CB0ZHVL2EK4ECHLLPVKBG4XN&query=pizza&section=food&limit=5&v=20210412`, {
            data: {
                near: city,
                // venuePhotos: 1,
                // limit: 9,
                // query: 'tacos',
                // section: category,
                // name: name,
            },
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                // console.log(data.response)
                $(".foursquare-container").removeClass("hide");
                // console.log(data.response.venues)
                for (i=0; i<data.response.venues.length; i++){
                    console.log(data.response.venues[i])
                }
                               
                for (i=0; i<data.response.venues.length; i++) {
                    var addr = "#address-" + i
                    var addrEl = document.querySelector(addr)
                    //console.log(data.response.venues[i])

                    console.log(addrEl)
                    console.log(addr)
                    var tmp = data.response.venues[i].name + "\n" + data.response.venues[i].address
                    console.log("tmp", tmp)
                    
                    addrEl.textContent = data.response.venues[i].name + "\n" + data.response.venues[i].location.address
                }
                /*
                //   document.getElementsByClassName("foursquare-results").innerHTML = topTen;            
                try {
                    let results = data.response.groups[0].items.map(function (item, index) {
                        return displayResults(item);
                    });
                    // $('#foursquare-results').html(results);
                    // scrollPageTo('#foursquare-results', 15);
                } 
                catch (e) {
                    $('#foursquare-results').html("<div class='result'><p>Sorry! No Results Found.</p></div>");
                }
                */
            },
            error: function () {
                console.log("error handler")
                $('#foursquare-results').html("<div class='result'><p>Sorry! No Results Found.</p></div>");
            }
        });
    })
}