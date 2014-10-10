/**
 * Created by saurabh on 30/9/14.
 */
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var orderArray = [];
var alphabetsCapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var alphabetsSmall = "abcdefghijklmnopqrstuvwxyz";

var url = $(location).attr("href");
var keyValueData = url.split("?")[1].split("&");

var cityName = keyValueData[0].split("=")[1];
var noOfDays = keyValueData[1].split("=")[1][0];

$(document).ready(function() {

    var defaultOption = document.createElement("option");
    $(defaultOption).attr("value","All");
    $(defaultOption).html("All");
    $("#dayNoSelector").append(defaultOption);

    for (i = 1; i <= noOfDays; i++) {
        var option = document.createElement("option");
        $(option).attr("value",i.toString());
        $(option).html(i.toString());
        $("#dayNoSelector").append(option);
    }


});

$("#goButton").click(function() {
    var dayNo = ($("#dayNoSelector").val());
    if(dayNo === "All") { generateMap(cityName,"All",noOfDays); }
    else
        generateMap(cityName, dayNo,noOfDays);
});


function generateMap(cityName, dayNo,numberOfDays) {

    if(dayNo !== "All" && numberOfDays<dayNo){
        alert("trip too short for this map to be displayed");
        return;
    }

    var attractionsForAllDays = JSON.parse(window.name);
    var attractionsForThatDay = [];


    if(dayNo === "All") {

        var lengthOfEachDay = [];
        for(var i = 0 ; i < numberOfDays ; ++i) {
            lengthOfEachDay.push(attractionsForAllDays[i].length);
            for(var j = 0 ; j < lengthOfEachDay[i] ; ++j)  {
                attractionsForThatDay.push(attractionsForAllDays[i][j]);
            }
        }
        showMarkers(attractionsForThatDay, lengthOfEachDay);
    }
    else    {
        attractionsForThatDay = attractionsForAllDays[dayNo-1];
        calcRoute(attractionsForThatDay,dayNo);
    }
}

populatePanelForAll = function(allAttractions,lengthOfEachDay)  {
    var days = lengthOfEachDay.length;

    $("#details").hide();
    $("#accordion").empty();
    $("#accordion").show();

    for(var i = 0 ; i < days ; ++i) {

        var group = document.createElement("div");
        $(group).addClass("accordion-group");
        $("#accordion").append(group);

        var heading = document.createElement("div");
        $(heading).addClass("accordion-heading");
        $(group).append(heading);

        var headLink = document.createElement("a");
        $(headLink).addClass("accordion-toggle");
        $(headLink).attr("data-toggle","collapse");
        $(headLink).attr("data-parent","#accordion");
        $(headLink).attr("href","#collapse" + parseInt(i+1).toString());
        $(headLink).html("Day " + parseInt(i+1).toString());
        $(heading).append(headLink);

        var body = document.createElement("div");
        $(body).addClass("accordion-body collapse in");
        $(body).attr("id","collapse" + parseInt(i+1).toString());
        $(group).append(body);

        var bodyInner = document.createElement("div");
        $(bodyInner).addClass("accordion-inner");
        $(body).append(bodyInner);
    }

    var dayNo = 1;
    for(var attraction in allAttractions) {

        if(attraction >= lengthOfEachDay[dayNo-1])++dayNo;

        var imageColor;
        switch (parseInt(dayNo))  {
            case 1:
                imageColor = "red";
                break;
            case 2:
                imageColor = "darkblue";
                break;
            case 3:
                imageColor = "green";
                break;
            case 4:
                imageColor = "yellow";
                break;
            case 5:
                imageColor = "pink";
                break;
            case 6:
                imageColor = "orange";
                break;
            case 7:
                imageColor = "lightblue";
                break;
            default:
                imageColor = "black";
        }

        var attractionName = allAttractions[attraction]["name"];

        var  myNo;
        if(dayNo > 1)myNo = attraction - lengthOfEachDay[dayNo-2];
        else myNo = attraction;

        var image = document.createElement("img");
        $(image).attr("src","images/" + imageColor + "/letter_" + alphabetsSmall[myNo] +".png");
        $(image).attr("style","width:18px;float:left");

        var name = document.createElement("span");
        $(name).html("&nbsp;&nbsp;&nbsp;&nbsp;" + attractionName);

        $("#collapse" + parseInt(dayNo).toString() + "> div").append(image);
        $("#collapse" + parseInt(dayNo).toString() + "> div").append(name);
        $("#collapse" + parseInt(dayNo).toString() + "> div").append("<br><br>")
    }
}
populatePanel = function(attractionsData,dayNo)   {

    var imageColor;
    switch (parseInt(dayNo))  {
        case 1:
            imageColor = "red";
            break;
        case 2:
            imageColor = "darkblue";
            break;
        case 3:
            imageColor = "green";
            break;
        case 4:
            imageColor = "yellow";
            break;
        case 5:
            imageColor = "pink";
            break;
        case 6:
            imageColor = "orange";
            break;
        case 7:
            imageColor = "lightblue";
            break;
        default:
            imageColor = "black";
    }

    $("#accordion").hide();
    $("#details").show();
    $(".panel-body").empty();

    var resultAttractionsData = [];
    resultAttractionsData.push(attractionsData[0]);

    for(var i = 1 ; i < attractionsData.length - 1; ++i)    {
        resultAttractionsData.push(attractionsData[orderArray[i-1] + 1]);
    }
    resultAttractionsData.push(attractionsData[attractionsData.length - 1]);

    attractionsData = resultAttractionsData;

    for(var attraction in attractionsData) {
        var attractionName = attractionsData[attraction]["name"];

        var image = document.createElement("img");
        $(image).attr("src","images/" + imageColor + "/letter_" + alphabetsSmall[attraction] +".png");
        $(image).attr("style","width:18px;float:left");

        var name = document.createElement("span");
        $(name).html("&nbsp;&nbsp;&nbsp;&nbsp;" + attractionName);

        $(".panel-body").append(image);
        $(".panel-body").append(name);
        $(".panel-body").append("<br><br>");
    }
};
function initialize() {

    var centerOfTheWorld = new google.maps.LatLng(0,0);
    var mapOptions = {
        zoom: 2,
        center: centerOfTheWorld
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function getLatLngOfAttraction(attraction){
    return new google.maps.LatLng(attraction["latitude"], attraction["longitude"]);
}

function calcRoute(attractionArray,dayNo) {

    var centerOfTheWorld = new google.maps.LatLng(0,0);
    var mapOptions = {
        zoom: 2,
        center: centerOfTheWorld
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

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
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            orderArray = response.routes[0].waypoint_order;
            tempArray.unshift(source);
            tempArray.push(destination);
            populatePanel(tempArray,dayNo);
        }
        else{
            alert("error staus: "+status);
        }
    });
}

function showMarkers(attractionArray,lengthArray)  {

    var days = lengthArray.length;
    for(var i = 1 ; i < days ; ++i) {
        lengthArray[i] += lengthArray[i-1];
    }

    var mapOptions = {
        zoom: 12,
        center: getLatLngOfAttraction(attractionArray[0])
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var dayNo = 1;
    for(var attraction in attractionArray)  {

        if(attraction >= lengthArray[dayNo-1])++dayNo;

        var imageColor;
        switch (dayNo)  {
            case 1:
                imageColor = "red";
                break;
            case 2:
                imageColor = "darkblue";
                break;
            case 3:
                imageColor = "green";
                break;
            case 4:
                imageColor = "yellow";
                break;
            case 5:
                imageColor = "pink";
                break;
            case 6:
                imageColor = "orange";
                break;
            case 7:
                imageColor = "lightblue";
                break;
            default:
                imageColor = "black";
        }

        var  myNo;
        if(dayNo > 1)myNo = attraction - lengthArray[dayNo-2];
        else myNo = attraction;

        var marker = new google.maps.Marker({
            position: getLatLngOfAttraction(attractionArray[attraction]),
            map: map,
            title: attractionArray[attraction]["name"],
            icon: 'images/' + imageColor + '/letter_' + alphabetsSmall[myNo] + '.png'
        });
    }

//    for(var i = days-1 ; i > 0 ; --i) {
//        lengthArray[i] -= lengthArray[i-1];
//    }

    populatePanelForAll(attractionArray, lengthArray);
}

google.maps.event.addDomListener(window, 'load', initialize);