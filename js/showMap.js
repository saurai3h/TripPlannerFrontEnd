var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var url = $(location).attr("href");
var keyValueData = url.split("?")[1].split("&");

var cityName = keyValueData[0].split("=")[1];
var noOfDays = keyValueData[1].split("=")[1];

$(document).ready(function() {
    for (i = 1; i <= noOfDays; i++) {
        var option = document.createElement("option");
        $(option).attr("value",i.toString());
        $(option).html(i.toString());
        $("#dayNoSelector").append(option);
    }


});

$("#goButton").click(function() {
    console.log("clicked");
    var dayNo = ($("#dayNoSelector").val());
    alert(dayNo);
        generateMap(cityName, dayNo,noOfDays);
});


function generateMap(cityName, dayNo,numberOfDays) {
    if(numberOfDays<dayNo){
        alert("trip too short for this map to be displayed");
        return;
    }
    alert(numberOfDays);

    $.ajax(
        {
            url: "http://localhost:8080/api/attractionsForACity?city=" + cityName + "&days=" + numberOfDays,
            type: "GET",
            success: function (strData) {
                var attractionsForAllDays = jQuery.parseJSON(strData);
                if(attractionsForAllDays.length<dayNo){
                    alert("invalid day!");
                    return;
                }
                    calcRoute(attractionsForAllDays[dayNo-1]);
                }

        });
}

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var centerOfTheWorld = new google.maps.LatLng(0,0);
    var mapOptions = {
        zoom:2,
        center: centerOfTheWorld
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

function getLatLngOfAttraction(attraction){
    return new google.maps.LatLng(attraction["longitude"], attraction["latitude"]);
}

function calcRoute(attractionArray) {
    var start = getLatLngOfAttraction(attractionArray.shift());
    var end = getLatLngOfAttraction(attractionArray.pop());
    alert(start + " to " + end);
    wayPointArray = [];
    for(attraction in attractionArray){
        wayPointArray.push({
            location:getLatLngOfAttraction(attractionArray[attraction])
        });
    }
    var request = {
        origin: start,
        destination: end,
        waypoints: wayPointArray,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
        else{
            alert("error staus: "+status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
