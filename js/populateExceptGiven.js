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

        var listElement = document.createElement("li");

        var attractionImage = document.createElement("img");
        $(attractionImage).attr("src",attractionsNotVisited[attraction]["imageURL"]);
        $(attractionImage).attr("style","width:20%;border:5px solid rgb(208,208,208)");

        var attractionText = document.createElement("a");
        $(attractionText).html(attractionsNotVisited[attraction]["name"]);
        $(attractionText).attr("id",day + ":::" + elem + ":::" + JSON.stringify(attractionsNotVisited[attraction]));
        $(attractionText).addClass("myClass");

        $(listElement).append("&nbsp;&nbsp;");
        $(listElement).append(attractionImage);
        $(listElement).append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        $(listElement).append(attractionText);

        $("#attractionToAdd").append(listElement);
        $("#attractionToAdd").append("<br>");
    }

    $(".myClass").one("click",function(e){

        e.preventDefault();
        var myArray = $(this).attr("id").split(":::");
        var myDay = myArray[0];
        var myElem = myArray[1];
        var attractionToVisit = JSON.parse(myArray[2]);

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