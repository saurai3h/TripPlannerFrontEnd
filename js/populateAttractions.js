/**
 * Created by saurabh on 25/9/14.
 */

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

    $.ajax(
        {
            url: "http://localhost:8080/api/attractionsForACity?city=" + cityName + "&days=" + numberOfDays,
            type: "GET",
            success: function (strData) {

                var attractionsforAllDays = jQuery.parseJSON(strData);

                var attractionIDs = [];
                for(var outer in attractionsforAllDays) {
                    var attractionIDsOneDay = [];
                    for (var inner in attractionsforAllDays[outer]) {
                        attractionIDsOneDay.push(attractionsforAllDays[outer][inner]["attractionID"]);
                    }
                    attractionIDs.push(attractionIDsOneDay);
                }

                var distanceBetweenAttractions = [];

                    $.ajax({
                        url: "http://localhost:8080/api/distanceBetweenAllAttractions",
                        type: "POST",
                        data: {attractionIDs : JSON.stringify(attractionIDs)},
                        success: function (dataALL) {
                            var distanceBetweenAttractions = jQuery.parseJSON(dataALL);
                            console.log(distanceBetweenAttractions);
                            populateEverything(attractionsforAllDays,distanceBetweenAttractions);

                        }
                    });
            }
        }
    );

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
        for(var attraction in allAttractions[oneDay]) {

            var div = document.createElement("div");
            $(div).addClass("ui-state-default col-lg-12 resize");

            $(div).attr("style","margin:2%; overflow-y: hidden");

            var transit;

            if(attraction < allAttractions[oneDay].length - 1) {

                transit = document.createElement("div");
                $(transit).attr("style", "display:inline-block;margin-left:15%");

                var transitTime = document.createElement("span");
                $(transitTime).attr("id",oneDay + ":" + attraction + ":strip");
                $(transitTime).html(distanceArray[oneDay][attraction]);

                var roadStrip = document.createElement("img");
                $(roadStrip).attr("src", "images/road.png");
                $(roadStrip).attr("style", "width:30%;height:40px;margin-left:10%");
//                        TODO : make this height according to distance.

                $(transit).append(transitTime);
                $(transit).append(roadStrip);
            }   else {
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

            var deleteImage = document.createElement("img");
            $(deleteImage).attr("src","images/delete.png");
            $(deleteImage).attr("style","position:relative;width:10%;float:right;margin-top:2%;cursor:pointer;");
            $(deleteImage).attr("id",oneDay + ":" + attraction + ":deleteImage");

            $(deleteImage).click(function () {
                var myArray = $(this).attr("id").split(":");
                var day = parseInt(myArray[0]);
                var element = parseInt(myArray[1]);
                allAttractions[day].splice(element,1);
                populateEverything(allAttractions,distanceArray);
            });

            var divForImage = document.createElement("div");
            $(divForImage).addClass("col-lg-12");

            var image = document.createElement("img");
            $(image).attr("src",allAttractions[oneDay][attraction]["imageURL"]);
            $(image).attr("style","padding-left:2%;padding-top:2%;padding-bottom:2%; height:110px");
            $(divForImage).append(image);

            //                        TODO : make this category instead of type.

            var desc_content = allAttractions[oneDay][attraction]["type"];
            if(desc_content != null) {
                var description = document.createElement("div");
                $(description).html(desc_content.split(",")[0]);
                $(description).attr("style", "padding-top:5%");
                $(description).addClass("col-lg-6");
                $(image).addClass("col-lg-6");
                $(divForImage).append(description);
            }
            else    {
                $(image).addClass("col-lg-12");
            }

            $(divForLi).append(li);

            $(div).append(deleteImage);
            $(div).append(divForLi);

            $(div).append(divForImage);

            $(listForAttractions).append(div);

            if(last !== true)$(listForAttractions).append(transit);
        }

        $(listElement).append(parentDivForThumbnail);
        $("#container").append(listElement);

    }
    $(".connectedSortable").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();

    $(".outerlist").sortable({
        handles: 'w,e',
        connectWith: ".outerlist"
    }).disableSelection();

    $('.resize').resizable({
        handles: 's',
        stop: function(event, ui) {
            $(this).css("width", '');
        }
    });


}