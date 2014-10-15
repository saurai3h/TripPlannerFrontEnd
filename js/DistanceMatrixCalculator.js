/**
 * Created by kartik.k on 9/30/2014.
 */
var origin1 = new google.maps.LatLng(55.930385, -3.118425);
var origin2 = "Greenwich, England";
var destinationA = "Stockholm, Sweden";
var destinationB = new google.maps.LatLng(50.087692, 14.421150);
const server = "http://172.16.152.143:8080/";


function getListOfAttractions(cityName) {
    $.ajax(
        {
            url: server + "api/getAllAttractions?city=" + cityName,
            type: "GET",
            success: function (strData) {
                var listOfAllAttractions = jQuery.parseJSON(strData);
                alert(listOfAllAttractions.length);
            }

        });
}


var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
    {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: UnitSystem,
        durationInTraffic: Boolean,
        avoidHighways: false,
        avoidTolls: false
    }, callback);

function callback(response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
}
