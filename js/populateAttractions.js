var allAttractionsForACity;
var timesForAllDays = [];
const server = "http://172.16.152.143:8080/";

$(window).load(function() {
    $(".loader").fadeOut(3000);
});

function calculateDistanceAndPopulateAttractions(attractionsForAllDays) {

    var attractionIDs = [];
    for (var outer in attractionsForAllDays) {
        var attractionIDsOneDay = [];
        for (var inner in attractionsForAllDays[outer]) {
            attractionIDsOneDay.push(attractionsForAllDays[outer][inner]["attractionID"]);
        }
        attractionIDs.push(attractionIDsOneDay);
    }

    $.ajax({
        url: server + "api/distanceBetweenAllAttractions",
        type: "POST",
        data: {attractionIDs: JSON.stringify(attractionIDs)},
        success: function (dataALL) {
            var distanceBetweenAttractions = jQuery.parseJSON(dataALL);
            populateEverything(attractionsForAllDays, distanceBetweenAttractions);

        }
    });
}

function clearAndSetCookiesForSchedules(attractionsForAllDays) {
    window.name = JSON.stringify(attractionsForAllDays);
}

populateAttractions =

    $(function()    {

        var url = $(location).attr("href");
        var keyValueData = url.split("?")[1].split("&");

        var cityName = keyValueData[0].split("=")[1];
        var numberOfDays = keyValueData[1].split("=")[1][0];
        var hecticity = keyValueData[2].split("=")[1][0];

    // TODO : changing later when you delete/add the day itself.
        for (var day = 1 ; day <= numberOfDays ; ++day) {

            var headerElement = document.createElement("li");
            $(headerElement).attr("style","width:25%;display:inline-block;");

            var divForDayNumber = document.createElement("div");
            $(divForDayNumber).addClass("col-lg-8");
            $(divForDayNumber).html("Day " + day.toString());
            $(divForDayNumber).attr("style", "font-size:25px;margin-left:35%");

            $(headerElement).append(divForDayNumber);
            $("#day-header").append(headerElement);

            timesForAllDays.push(0);
            var timeElement = document.createElement("li");
            $(timeElement).attr("style","width:25%;display:inline-block;");

            var divForDayTime = document.createElement("div");
            $(divForDayTime).addClass("col-lg-12");
            $(divForDayTime).attr("id",day-1 + ":timeTaken");
            $(divForDayTime).attr("style", "font-size:25px;margin-left:30%");

            $(timeElement).append(divForDayTime);
            $("#day-time").append(timeElement);
        }

        if(window.name === "empty") {
            $.ajax(
                {
                    url: server + "api/getAllAttractions?city=" + cityName,
                    type: "GET",
                    success: function(allData)  {

                        allAttractionsForACity = JSON.parse(allData);

                        $.ajax(
                            {
                                url: server + "api/attractionsForACity?city=" + cityName + "&days=" + numberOfDays + "&mode=" + hecticity,
                                type: "GET",
                                success: function (strData) {

                                    var attractionsForAllDays = jQuery.parseJSON(strData);

                                    clearAndSetCookiesForSchedules(attractionsForAllDays);

                                    calculateDistanceAndPopulateAttractions(attractionsForAllDays);
                                }
                            }
                        );
                    }
                }
            );
        }
        else    {
            $.ajax(
                {
                    url: server + "api/getAllAttractions?city=" + cityName,
                    type: "GET",
                    success: function(allData)  {

                        allAttractionsForACity = JSON.parse(allData);
                        var attractionsForAllDays = JSON.parse(window.name);
                        calculateDistanceAndPopulateAttractions(attractionsForAllDays);
                    }
                }
            );
        }
});

//TODO : Scroll horizontally in planner proper and adding/deleting days.


function populateEverything(allAttractions,distanceArray) {

    $("#container").empty();

    for(var oneDay in allAttractions) {

//        Assuming one lunch and one tea break everyday.
        var lunchTaken = false;
        var teaTaken = false;
        var lunchbreak = document.createElement("img");
        $(lunchbreak).attr("src","images/lunch.png");
        $(lunchbreak).addClass("breaks");

        var teabreak = document.createElement("img");
        $(teabreak).attr("src","images/tea.png");
        $(teabreak).addClass("breaks");

        timesForAllDays[oneDay] = 0;
        var listElement = document.createElement("li");
        $(listElement).attr("style","width:25%;display:inline-block;height:100%;");
        $(listElement).attr("id",oneDay + "listElement");

        var parentDivForThumbnail = document.createElement("div");
        $(parentDivForThumbnail).addClass("col-lg-12");

        var divForThumbnail = document.createElement("div");
        $(divForThumbnail).addClass("thumbnail col-lg-12");
        $(parentDivForThumbnail).append(divForThumbnail);

        var listForAttractions = document.createElement("ul");
        $(listForAttractions).addClass("connectedSortable col-lg-12");
        $(listForAttractions).attr("style","list-style-type: none; padding-bottom : 2%;white-space:normal;background-color:rgb(228, 228, 226)");
        var idNum = parseInt(oneDay)+1;
        $(divForThumbnail).append(listForAttractions);

        var last = false;

        var transitInit = document.createElement("div");
        $(transitInit).addClass("myClass2");
        var addAttractionInit = document.createElement("i");
        $(addAttractionInit).addClass("fa fa-plus fa-2x");
        $(addAttractionInit).attr("style","float:right;margin-top:5%;font-size:130%;cursor:pointer;margin-right:38%;color:#4A7023");
        $(addAttractionInit).attr("id",oneDay + ":" + 0 + ":addImage");
        $(addAttractionInit).attr("data-toggle","modal");
        $(addAttractionInit).attr("data-target","#notVisitedModal");

        $(addAttractionInit).click(function(){
            var myArray = $(this).attr("id").split(":");
            var day = parseInt(myArray[0]);
            var element = parseInt(myArray[1]);

            populateNotVisited(allAttractions,day,element);
        });

        $(transitInit).attr("style","display:inline-block;margin-top:5%");
        $(transitInit).append(addAttractionInit);
        $(listForAttractions).append(transitInit);

        for(var attraction in allAttractions[oneDay]) {

            var div = document.createElement("div");
            $(div).addClass("ui-state-default col-lg-12");

            $(div).attr("style","margin:2%; overflow-y: hidden; padding-right:3%;padding-left:3%");

            var transit = document.createElement("div");
            $(transit).addClass("myClass2");

            var addAttraction = document.createElement("i");
            $(addAttraction).addClass("fa fa-plus fa-2x");
            $(addAttraction).attr("style","float:right;font-size:130%;margin-top:5%;cursor:pointer;margin-right:2%;color:#4A7023");
            $(addAttraction).attr("id",oneDay + ":" + parseInt(parseInt(attraction) + 1) + ":addImage");
            $(addAttraction).attr("data-toggle","modal");
            $(addAttraction).attr("data-target","#notVisitedModal");

            $(addAttraction).click(function(){
                var myArray = $(this).attr("id").split(":");
                var day = parseInt(myArray[0]);
                var element = parseInt(myArray[1]);

                populateNotVisited(allAttractions,day,element);
            });

            var toSubtract;

            var timeToVisitInHours = allAttractions[oneDay][attraction]["visitTime"];
            var minuteVisited = Math.floor((timeToVisitInHours%1)*60.0);
            var hourVisited = Math.floor(timeToVisitInHours);

            if(attraction < allAttractions[oneDay].length - 1) {

                $(transit).attr("style", "display:inline-block;margin-left:15%");

                var transitTime = document.createElement("span");
                $(transitTime).attr("id",oneDay + ":" + attraction + ":strip");

                var timeInMinutes = parseInt(parseInt(distanceArray[oneDay][attraction])/30000.0 * 60.0 + 5);
                toSubtract = timeInMinutes/60.0;
                timesForAllDays[oneDay] += toSubtract;

                $(transitTime).html(timeInMinutes.toString() + " mins");

                var roadStrip = document.createElement("img");
                $(roadStrip).attr("src", "images/road.png");
                $(roadStrip).attr("style", "width:30%;height:40px;margin-left:10%");

                $(transit).append(transitTime);
                $(transit).append(roadStrip);
                $(transit).append(addAttraction);
            }   else {
                toSubtract = 0;
                $(addAttraction).css("margin-right","38%");
                $(transit).attr("style","display:inline-block;margin-top:5%");
                $(transit).append(addAttraction);
                last = true;
            }

            var divForLi = document.createElement("div");
            $(divForLi).attr("style","height:45px");

            var aLink = document.createElement("a");
            $(aLink).attr("data-toggle","modal");
            $(aLink).attr("data-target","#descriptionModal");
            $(aLink).attr("style","cursor: pointer;color: #2297CA");
            $(aLink).attr("id",oneDay + ":" + attraction + ":link");
            $(aLink).click(function(e){
                e.preventDefault();
                var myArray = $(this).attr("id").split(":");
                var day = myArray[0];
                var index = myArray[1];
                populateModal(allAttractions,day,index);
            });
            $(aLink).html(allAttractions[oneDay][attraction]["name"]);

            var timeNow = parseFloat(parseFloat(timesForAllDays[oneDay]) - parseFloat(toSubtract) + 9.0);

            var timeNowMinutes = Math.floor((timeNow%1)*60.0);
            if(timeNowMinutes <= 9)timeNowMinutes = "0" + timeNowMinutes;

            var timeNowHours = Math.floor(timeNow);
            if(timeNowHours <= 9)timeNowHours = "0" + timeNowHours;

            if(attraction == 0) timeNowMinutes = "00";

            var timeSpent = document.createElement("span");
            $(timeSpent).html("&nbsp;&nbsp;" + timeNowHours + ":" + timeNowMinutes);
            $(timeSpent).addClass("myBlack");

            var li = document.createElement("li");
            $(li).attr("style","padding-left:2%;padding-top:2%;");
            $(li).append(aLink);
            $(li).append(timeSpent);

            var deleteImage = document.createElement("i");
            $(deleteImage).addClass("fa fa-times fa-2x");
            $(deleteImage).attr("style","float:right;font-size:130%;margin-top:2%;cursor:pointer;color:#B22222");
            $(deleteImage).attr("id",oneDay + ":" + attraction + ":deleteImage");

            $(deleteImage).click(function () {
                var myArray = $(this).attr("id").split(":");
                var day = parseInt(myArray[0]);
                var element = parseInt(myArray[1]);
                allAttractions[day].splice(element,1);

                clearAndSetCookiesForSchedules(allAttractions);
                calculateDistanceAndPopulateAttractions(allAttractions);
            });

            var divForImage = document.createElement("div");
            $(divForImage).addClass("col-lg-12");

            var image = document.createElement("img");
            $(image).addClass("col-lg-6");
            $(image).attr("src",allAttractions[oneDay][attraction]["imageURL"]);
            $(image).attr("style","padding-left:2%;padding-top:2%;padding-bottom:2%; height:110px;");

            $(divForImage).append(image);

            var desc_content = allAttractions[oneDay][attraction]["category"];
            var description = document.createElement("div");
            $(description).html(desc_content.split(",")[0]);
            $(description).attr("style", "padding-top:5%");
            $(description).addClass("col-lg-6 myBlack");
            $(divForImage).append(description);

            var visitingTime = document.createElement("div");

            var timeDiv = document.createElement("div");
            $(timeDiv).addClass("col-lg-12 ");
            $(timeDiv).attr("style","padding:0%");

            var inputHours = document.createElement("input");
            $(inputHours).addClass("form-control");
            $(inputHours).attr("style","width:45%;float:left;padding:0% 10%");
            $(inputHours).attr("placeholder",hourVisited);
            $(inputHours).attr("value",hourVisited);
            $(inputHours).attr("id",oneDay+":"+attraction+":"+hourVisited+":hourInput");
            $(inputHours).change(function(){
                var myNewArray = $(this).attr("id").split(":");
                var outer = myNewArray[0];
                var inner = myNewArray[1];
                var initial = myNewArray[2];
                allAttractions[outer][inner]["visitTime"] += (parseInt($(this).val())-parseInt(initial));

                clearAndSetCookiesForSchedules(allAttractions);
                populateEverything(allAttractions,distanceArray);
            });

            var inputMinutes = document.createElement("input");
            $(inputMinutes).addClass("form-control");
            $(inputMinutes).attr("style","width:45%;float:left;padding:0% 10%");
            $(inputMinutes).attr("placeholder",minuteVisited);
            $(inputMinutes).attr("value",minuteVisited);
            $(inputMinutes).attr("id",oneDay+":"+attraction+":"+minuteVisited + ":minuteInput");
            $(inputMinutes).change(function(){
                var myNewArray2 = $(this).attr("id").split(":");
                var outer2 = myNewArray2[0];
                var inner2 = myNewArray2[1];
                var initial2 = myNewArray2[2];
                allAttractions[outer2][inner2]["visitTime"] += (parseInt($(this).val())-parseInt(initial2))/60.0;

                clearAndSetCookiesForSchedules(allAttractions);
                populateEverything(allAttractions,distanceArray);
            });

            $(timeDiv).append(inputHours);
            $(timeDiv).append("<span>&nbsp;&nbsp;</span>");
            $(timeDiv).append(inputMinutes);
            $(timeDiv).append("<span style='margin-left:3%;margin-top:15%'>hrs</span>");
            $(timeDiv).append("<span style='margin-left:3%;margin-top:15%'>min</span>");
            $(timeDiv).addClass("myBlack");

            $(visitingTime).append(timeDiv);

            timesForAllDays[oneDay] += parseInt($(inputHours).attr("value")) + parseInt($(inputMinutes).attr("value"))/60.0;

            $(visitingTime).addClass("col-lg-6");
            $(divForImage).append(visitingTime);

            $(divForLi).append(li);

            $(div).append(deleteImage);
            $(div).append(divForLi);

            $(div).append(divForImage);

            $(listForAttractions).append(div);

//            Assuming time for lunch is 11:30 am to 12:15 pm.
            if(timesForAllDays[oneDay] >= 2.5 && lunchTaken === false)   {
                $(listForAttractions).append(lunchbreak);
                lunchTaken = true;
                timesForAllDays[oneDay] += 0.75;
            }

//            Assuming time for tea is 5 pm to 5:15 pm.
            if(timesForAllDays[oneDay] >= 8 && teaTaken === false)   {
                $(listForAttractions).append(teabreak);
                teaTaken = true;
                timesForAllDays[oneDay] += 0.25;
            }
            $(listForAttractions).append(transit);
        }

        $(listElement).append(parentDivForThumbnail);
        $("#container").append(listElement);
        var myVariable = document.getElementById(oneDay+":timeTaken");

        var minutesVisited = Math.floor((timesForAllDays[oneDay]%1)*60.0);
        var hoursVisited = Math.floor(timesForAllDays[oneDay]);

        $(myVariable).html(hoursVisited + " h " + minutesVisited + " m");
    }
    $(".connectedSortable").sortable({
        items: '> div:not(.myClass2)',
        connectWith: ".connectedSortable",
        stop: function(event,ui) {

            var dragArray = ui.item[0].childNodes[0].id.split(":");
            var draggingThumbnail = dragArray[0];
            var draggingPosition = dragArray[1];

            var draggedElement = allAttractions[draggingThumbnail][draggingPosition];

            var dropArary = ui.item[0].parentNode.firstChild.firstChild.id.split(":");
            var droppingThumbnail = dropArary[0];

            var droppingPosition = ui.item.index("#" + droppingThumbnail + "listElement ul > div.ui-state-default");

            allAttractions[draggingThumbnail].splice(draggingPosition, 1);

            allAttractions[droppingThumbnail].splice(droppingPosition, 0, draggedElement);

            clearAndSetCookiesForSchedules(allAttractions);
            calculateDistanceAndPopulateAttractions(allAttractions);

        }
    }).disableSelection();
    $(".outerlist").sortable({
        start: function(e, ui){
            ui.placeholder[0].attributes[1].value += "display:inline-block";
        },
        connectWith:".outerlist",
        stop: function(event,ui)    {
            var dragginFrom = ui.item[0].id[0];
            var draggingTo = ui.item.index();

            var temporary = allAttractions[dragginFrom];
            allAttractions[dragginFrom] = allAttractions[draggingTo];
            allAttractions[draggingTo] = temporary;

            clearAndSetCookiesForSchedules(allAttractions);
            calculateDistanceAndPopulateAttractions(allAttractions);
        }
    }).disableSelection();
}