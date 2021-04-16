// var WEATHER_SEARCH_URL = "https://api.openweathermap.org/data/2.5/weather?id=524901&APPID=d86b9843fdc4941e520f985922146256";
let map;
// var instance = M.Modal.getInstance(elem);

function activatePlacesSearch() {
    let options = {
        types: ['(regions)']
    };
    let input = document.getElementById('search-term');
    let autocomplete = new google.maps.places.Autocomplete(input, options);
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
  });


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
            scrollPageTo('#weather-display', 15);           
        }
    });
}

function scrollPageTo(){
    document.getElementById('map').scrollIntoView(true);
}


// function pageRefresh(){
    
// }

function funCarousel(){
$(document).ready(function(){
$('.carousel').carousel();
 });}


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
    getWeatherData();
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
            zoom: 12,
            center: { lat: lat, lng: lng},
        });
        const marker = new google.maps.Marker({
            position: { lat: lat, lng: lng},
            map: map,
        });
        getCovidData(results[0].formatted_address)
    })
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.initi(elems, options);
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