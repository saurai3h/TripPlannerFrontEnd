/**
 * Created by saurabh on 7/10/14.
 */

function populateNotVisited(attractionsSeen,day,elem) {

    $("#attractionToAdd").empty();

    var attractionsVisited = [];
    for(var attractionsOfOneDay in attractionsSeen)  {
        for(var attraction in attractionsSeen[attractionsOfOneDay]){
            attractionsVisited.push(attractionsSeen[attractionsOfOneDay][attraction]);
        }
    }

    var attractionsNotVisited = myFilter(allAttractionsForACity,attractionsVisited);

    for(var attraction in attractionsNotVisited)    {
        var option = document.createElement("option");
        $(option).attr("value",JSON.stringify(attractionsNotVisited[attraction]));
        $(option).html(attractionsNotVisited[attraction]["name"]);

        $("#attractionToAdd").append(option);
    }



    $(".myClass").attr("id",day + ":" + elem + ":addingFinal");

    $(".myClass").one("click",function(e){

        e.preventDefault();

        var attractionToVisit = JSON.parse($("#attractionToAdd").val());

        var myArray = $(this).attr("id").split(":");
        var myDay = myArray[0];
        var myElem = myArray[1];

        attractionsSeen[myDay].splice(myElem,0,attractionToVisit);
        clearAndSetCookiesForSchedules(attractionsSeen);
        calculateDistanceAndPopulateAttractions(attractionsSeen);

        $(".close").trigger("click");
    });
}

function myFilter(all,some) {

    var someNames = [];
    for(var one in some)    {
        someNames.push(some[one]["name"]);
    }

    var toRet = [];
    for(var one in all) {
        if(someNames.indexOf(all[one]["name"]) < 0)  {
            toRet.push(all[one]);
        }
    }
    return toRet;
}