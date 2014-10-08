var allAttractionsForACity;

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
        url: "http://localhost:8080/api/distanceBetweenAllAttractions",
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

    // TODO : changing later when you delete/add the day itself.
        for (var day = 1 ; day <= numberOfDays ; ++day) {

            var headerElement = document.createElement("li");
            $(headerElement).attr("style","width:25%;display:inline-block");

            var divForDayNumber = document.createElement("div");
            $(divForDayNumber).addClass("col-lg-12");
            $(divForDayNumber).html("Day " + day.toString());
            $(divForDayNumber).attr("style", "font-size:25px;margin-left:35%");

            $(headerElement).append(divForDayNumber);
            $("#day-header").append(headerElement);
        }

        if(window.name === "empty") {
            $.ajax(
                {
                    url: "http://localhost:8080/api/allAttractionsForACity?city=" + cityName,
                    type: "GET",
                    success: function(allData)  {

                        allAttractionsForACity = JSON.parse(allData);

                        $.ajax(
                            {
                                url: "http://localhost:8080/api/attractionsForACity?city=" + cityName + "&days=" + numberOfDays,
                                type: "GET",
                                success: function (strData) {

                                    var attractionsForAllDays = jQuery.parseJSON(strData);
//                                    console.log(attractionsForAllDays);

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
                    url: "http://localhost:8080/api/allAttractionsForACity?city=" + cityName,
                    type: "GET",
                    success: function(allData)  {

                        allAttractionsForACity = JSON.parse(allData);
                        var attractionsForAllDays = JSON.parse(window.name);
                        clearAndSetCookiesForSchedules(attractionsForAllDays);
                        calculateDistanceAndPopulateAttractions(attractionsForAllDays);
                    }
                }
            );
        }
});

function populateEverything(allAttractions,distanceArray) {

    $("#container").empty();

    for(var oneDay in allAttractions) {

        var listElement = document.createElement("li");
        $(listElement).attr("style","width:25%;display:inline-block;height:100%;");

        var parentDivForThumbnail = document.createElement("div");
        $(parentDivForThumbnail).addClass("col-lg-12");

        var divForThumbnail = document.createElement("div");
        $(divForThumbnail).addClass("thumbnail col-lg-12");
        $(parentDivForThumbnail).append(divForThumbnail);

        var listForAttractions = document.createElement("ul");
        $(listForAttractions).addClass("connectedSortable col-lg-12");
        $(listForAttractions).attr("style","list-style-type: none; padding-bottom : 2%;white-space:normal");
        var idNum = parseInt(oneDay)+1;
        $(divForThumbnail).append(listForAttractions);

        var last = false;

        var transitInit = document.createElement("div");
        $(transitInit).addClass("myClass2");
        var addAttractionInit = document.createElement("i");
        $(addAttractionInit).addClass("fa fa-plus fa-2x");
        $(addAttractionInit).attr("style","float:right;margin-top:2%;cursor:pointer;margin-right:5%;color:#4A7023");
        $(addAttractionInit).attr("id",oneDay + ":" + 0 + ":addImage");
        $(addAttractionInit).attr("data-toggle","modal");
        $(addAttractionInit).attr("data-target","#notVisitedModal");

        $(addAttractionInit).click(function(){
            var myArray = $(this).attr("id").split(":");
            var day = parseInt(myArray[0]);
            var element = parseInt(myArray[1]);

            populateNotVisited(allAttractions,day,element);
        });

        $(transitInit).attr("style","display:inline-block;margin-left:47%;margin-top:5%");
        $(transitInit).append(addAttractionInit);
        $(listForAttractions).append(transitInit);

        for(var attraction in allAttractions[oneDay]) {

            var div = document.createElement("div");
            $(div).addClass("ui-state-default col-lg-12");

            $(div).attr("style","margin:2%; overflow-y: hidden");

            var transit = document.createElement("div");
            $(transit).addClass("myClass2");

            var addAttraction = document.createElement("i");
            $(addAttraction).addClass("fa fa-plus fa-2x");
            $(addAttraction).attr("style","float:right;margin-top:2%;cursor:pointer;margin-right:5%;color:#4A7023");
            $(addAttraction).attr("id",oneDay + ":" + parseInt(parseInt(attraction) + 1) + ":addImage");
            $(addAttraction).attr("data-toggle","modal");
            $(addAttraction).attr("data-target","#notVisitedModal");

            $(addAttraction).click(function(){
                var myArray = $(this).attr("id").split(":");
                var day = parseInt(myArray[0]);
                var element = parseInt(myArray[1]);

                populateNotVisited(allAttractions,day,element);
            });

            if(attraction < allAttractions[oneDay].length - 1) {

                $(transit).attr("style", "display:inline-block;margin-left:15%");

                var transitTime = document.createElement("span");
                $(transitTime).attr("id",oneDay + ":" + attraction + ":strip");
                $(transitTime).html(parseInt(parseInt(distanceArray[oneDay][attraction])/30000 * 60 + 5).toString() + " mins");

                var roadStrip = document.createElement("img");
                $(roadStrip).attr("src", "images/road.png");
                $(roadStrip).attr("style", "width:30%;height:40px;margin-left:10%");

                $(transit).append(transitTime);
                $(transit).append(roadStrip);
                $(transit).append(addAttraction);
            }   else {
                $(transit).attr("style","display:inline-block;margin-left:47%;margin-top:5%")
                $(transit).append(addAttraction);
                last = true;
            }

            var divForLi = document.createElement("div");
            $(divForLi).attr("style","height:45px");

            var aLink = document.createElement("a");
            $(aLink).attr("data-toggle","modal");
            $(aLink).attr("data-target","#descriptionModal");
            $(aLink).attr("style","cursor: pointer;color: #1CC458");
            $(aLink).attr("id",oneDay + ":" + attraction + ":link");
            $(aLink).click(function(e){
                e.preventDefault();
                var myArray = $(this).attr("id").split(":");
                var day = myArray[0];
                var index = myArray[1];
                populateModal(allAttractions,day,index);
            });
            $(aLink).html(allAttractions[oneDay][attraction]["name"]);

            var li = document.createElement("li");
            $(li).attr("style","padding-left:2%;padding-top:2%;");
            $(li).append(aLink);

            var deleteImage = document.createElement("i");
            $(deleteImage).addClass("fa fa-times fa-2x");
            $(deleteImage).attr("style","float:right;margin-top:2%;cursor:pointer;color:#B22222");
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
            $(image).attr("src",allAttractions[oneDay][attraction]["imageURL"]);
            $(image).attr("style","padding-left:2%;padding-top:2%;padding-bottom:2%; height:110px");
            $(divForImage).append(image);

            var desc_content = allAttractions[oneDay][attraction]["category"];
            var description = document.createElement("div");
            $(description).html(desc_content.split(",")[0]);
            $(description).attr("style", "padding-top:5%");
            $(description).addClass("col-lg-6");
            $(image).addClass("col-lg-6");
            $(divForImage).append(description);

            var visitingTime = document.createElement("div");
            $(visitingTime).html("<br>" + allAttractions[oneDay][attraction]["visitTime"].toFixed(2) + " hrs");
            $(visitingTime).addClass("col-lg-6");
            $(divForImage).append(visitingTime);

            $(divForLi).append(li);

            $(div).append(deleteImage);
            $(div).append(divForLi);

            $(div).append(divForImage);

            $(listForAttractions).append(div);

            $(listForAttractions).append(transit);
        }

        $(listElement).append(parentDivForThumbnail);
        $("#container").append(listElement);

    }
    $(".connectedSortable").sortable({
        items: '> div:not(.myClass2)',
        connectWith: ".connectedSortable",
        stop: function(event,ui) {

            var dragArray = ui.item[0].childNodes[0].id.split(":");
            var draggingThumbnail = dragArray[0];
            var draggingPosition = dragArray[1];

            var draggedElement = allAttractions[draggingThumbnail][draggingPosition];

            var dropArary = ui.item[0].parentNode.lastChild.firstChild.id.split(":");
            var droppingThumbnail = dropArary[0];
            var droppingPosition = dropArary[1];

            if(droppingThumbnail === draggingThumbnail) {

            }
            else {
                allAttractions[draggingThumbnail].splice(draggingPosition, 1);

                allAttractions[droppingThumbnail].splice(droppingPosition, 0, draggedElement);

                clearAndSetCookiesForSchedules(allAttractions);
                calculateDistanceAndPopulateAttractions(allAttractions);
            }
        }
    }).disableSelection();

    $(".outerlist").sortable({
        handles: 'w,e',
        connectWith: ".outerlist"
    }).disableSelection();
}