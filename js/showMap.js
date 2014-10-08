/**
 * Created by saurabh on 30/9/14.
 */
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var orderArray = [];
var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var url = $(location).attr("href");
var keyValueData = url.split("?")[1].split("&");

var cityName = keyValueData[0].split("=")[1];
var noOfDays = keyValueData[1].split("=")[1][0];

$(document).ready(function() {
    for (i = 1; i <= noOfDays; i++) {
        var option = document.createElement("option");
        $(option).attr("value",i.toString());
        $(option).html(i.toString());
        $("#dayNoSelector").append(option);
    }


});

$("#goButton").click(function() {
    var dayNo = ($("#dayNoSelector").val());
    generateMap(cityName, dayNo,noOfDays);
});


function generateMap(cityName, dayNo,numberOfDays) {

    if(numberOfDays<dayNo){
        alert("trip too short for this map to be displayed");
        return;
    }

    var attractionsForAllDays = JSON.parse(window.name);
    var attractionsForThatDay = attractionsForAllDays[dayNo-1];

    calcRoute(attractionsForThatDay);

}
populatePanel = function(attractionsData)   {

    $("#details").show();
    $(".panel-body").empty();

//    console.log(attractionsData);
//    console.log(orderArray);

    var resultAttractionsData = [];
    resultAttractionsData.push(attractionsData[0]);

    for(var i = 1 ; i < attractionsData.length - 1; ++i)    {
        resultAttractionsData.push(attractionsData[orderArray[i-1] + 1]);
    }
    resultAttractionsData.push(attractionsData[attractionsData.length - 1]);

//    console.log(resultAttractionsData);

    attractionsData = resultAttractionsData;

    for(var attraction in attractionsData) {
        var attractionName = attractionsData[attraction]["name"];

        var image = document.createElement("img");
        $(image).attr("src","images/marker_green" + alphabets[attraction] +".png");
        $(image).attr("style","width:18px;float:left");

        var name = document.createElement("span");
        $(name).html("&nbsp;&nbsp;&nbsp;&nbsp;" + attractionName);

        $(".panel-body").append(image);
        $(".panel-body").append(name);
        $(".panel-body").append("<br><br>");
    }
};
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
    return new google.maps.LatLng(attraction["latitude"], attraction["longitude"]);
}

function calcRoute(attractionArray) {

//    console.log(attractionArray);

    var tempArray = attractionArray;
    var source = attractionArray[0];
    var destination = attractionArray[attractionArray.length - 1];

    var start = getLatLngOfAttraction(attractionArray.shift());
    var end = getLatLngOfAttraction(attractionArray.pop());
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
            orderArray = response.routes[0].waypoint_order;
            tempArray.unshift(source);
            tempArray.push(destination);
            populatePanel(tempArray);
        }
        else{
            alert("error staus: "+status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);