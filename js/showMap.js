/**
 * Created by saurabh on 30/9/14.
 */

$(window).load(function() {
    $(".loader").fadeOut("slow");
});

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var orderArray = [];
var markerArray = [];

var alphabetsCapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var alphabetsSmall = "abcdefghijklmnopqrstuvwxyz";

var url = $(location).attr("href");
var keyValueData = url.split("?")[1].split("&");

var cityName = keyValueData[0].split("=")[1];
var noOfDays = keyValueData[1].split("=")[1][0];

$(document).ready(function() {

//    var FF = !(window.mozInnerScreenX == null);
//    var width = $(window).width();
//    if (FF){
//        $('body').css('-moz-transform','scale(' + width/1366 +')');
//    } else {
//        $('body').css('zoom', width/1366);
//    }

    $('#toSave').on("click",function () {

        var allAttractions = JSON.parse(window.name);
        var days = allAttractions.length;

        var doc = new jsPDF();
        var pos = 35;
        for(var i = 1 ; i <= days ; ++i) {
            doc.setFontSize(30);
            doc.text(pos, pos, 'Day ' + i + " : " + timesForAllDays[i-1].toFixed(2) + " hours");
            doc.setFontSize(15);
            doc.text(pos,pos + 10,"");
            for(var j = 1 ; j <= allAttractions[i-1].length ; ++j)   {
                var offset = (j-1)*30;
                doc.text(pos,pos + 20 + offset,"NAME : " + allAttractions[i-1][j-1]["name"]);
                doc.text(pos,pos + 30 + offset,"VISIT-TIME : " + allAttractions[i-1][j-1]["visitTime"].toFixed(2) + " hours");
            }
            if(i<days)doc.addPage();
        }
        doc.save("MyTripPlan.pdf");
    });

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

        var linkColor;
        switch (i + 1)  {
            case 1:
                linkColor = "#ff0022";
                break;
            case 2:
                linkColor = "#1000f5";
                break;
            case 3:
                linkColor = "#2afa31";
                break;
            case 4:
                linkColor = "#e2fa28";
                break;
            case 5:
                linkColor = "#da47ff";
                break;
            case 6:
                linkColor = "#fa7c28";
                break;
            case 7:
                linkColor = "#28f3fa";
                break;
            default:
                linkColor = "#4e5952";
        }

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
        $(headLink).attr("id",parseInt(i+1).toString() + ":Link");
        $(headLink).html("Day " + parseInt(i+1).toString());
        $(headLink).attr("style","text-decoration:none;border-bottom: 2px solid;border-bottom-color:" + linkColor + ";font-size:135%");
        $(headLink).on("click",function(){
            var findingDay = parseInt($(this).attr("id").split(":")[0]);
            var initialMarker;
            var finalMarker;
            if(findingDay === 1) {
                initialMarker = 0;
                finalMarker = lengthOfEachDay[0] - 1;
            }
            else    {
                initialMarker = lengthOfEachDay[findingDay-2];
                finalMarker = lengthOfEachDay[findingDay-1] - 1;
            }

            for(var i = initialMarker ; i <= finalMarker ; ++i) {
                google.maps.event.trigger(markerArray[i],"click");
            }

        });
        $(heading).append(headLink);

        var body = document.createElement("div");
        $(body).addClass("accordion-body collapse");
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
        $(name).attr("style","color:white");

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

    if(attractionsData.length > 1) {
        var resultAttractionsData = [];
        resultAttractionsData.push(attractionsData[0]);

        for (var i = 1; i < attractionsData.length - 1; ++i) {
            resultAttractionsData.push(attractionsData[orderArray[i - 1] + 1]);
        }
        resultAttractionsData.push(attractionsData[attractionsData.length - 1]);
        attractionsData = resultAttractionsData;
    }

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

    if(attractionArray.length == 1) {

        var centerOfTheWorld = new google.maps.LatLng(attractionArray[0]["latitude"], attractionArray[0]["longitude"]);
        var mapOptions = {
            zoom: 14,
            center: centerOfTheWorld
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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

        var marker = new google.maps.Marker({
            position: getLatLngOfAttraction(attractionArray[0]),
            map: map,
            title: attractionArray[0]["name"],
            icon: 'images/' + imageColor + '/letter_' + alphabetsSmall[0] + '.png'
        });

        populatePanel(attractionArray, dayNo);
    }
    else {

        var centerOfTheWorld = new google.maps.LatLng(0, 0);

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
        for (attraction in attractionArray) {
            wayPointArray.push({
                location: getLatLngOfAttraction(attractionArray[attraction])
            });
        }
        var request = {
            origin: start,
            destination: end,
            waypoints: wayPointArray,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                orderArray = response.routes[0].waypoint_order;
                tempArray.unshift(source);
                tempArray.push(destination);
                populatePanel(tempArray, dayNo);
            }
            else {
                alert("error staus: " + status);
            }
        });
    }
}

function showMarkers(attractionArray,lengthArray)  {

    var centerMeanLatitude = 0.0;
    var centerMeanLongitude = 0.0;

    for(var i = 0 ; i < attractionArray.length ; ++i)   {
        centerMeanLatitude += attractionArray[i]["latitude"];
        centerMeanLongitude += attractionArray[i]["longitude"];
    }
    centerMeanLatitude /= attractionArray.length;
    centerMeanLongitude /= attractionArray.length;

    markerArray=[];
    var days = lengthArray.length;
    for(var i = 1 ; i < days ; ++i) {
        lengthArray[i] += lengthArray[i-1];
    }

    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(centerMeanLatitude, centerMeanLongitude)
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
            animation: google.maps.Animation.DROP,
            icon: 'images/' + imageColor + '/letter_' + alphabetsSmall[myNo] + '.png'
        });

        markerArray.push(marker);
        google.maps.event.addListener(marker, 'click', toggleBounce);

    }



    populatePanelForAll(attractionArray, lengthArray);
}

function toggleBounce() {
    if (this.getAnimation() != null) {
        this.setAnimation(null);
    } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
    }
}

google.maps.event.addDomListener(window, 'load', initialize);