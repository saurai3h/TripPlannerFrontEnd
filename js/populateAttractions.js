/**
 * Created by saurabh on 25/9/14.
 */

populateAttractions =$(function()    {
    var url = $(location).attr("href");
    var keyValueData = url.split("?")[1].split("&");

    var cityName = keyValueData[0].split("=")[1];
    var numberOfDays = keyValueData[1].split("=")[1];

    $.ajax(
        {
            url: "http://localhost:8080/api/attractionsForACity?city=" + cityName + "&days=" + numberOfDays,
            type: "GET",
            success: function (strData) {
                var attractionsforAllDays = jQuery.parseJSON(strData);

                for(var oneDay in attractionsforAllDays) {

                    var parentDivForThumbnail = document.createElement("div");
                    $(parentDivForThumbnail).addClass("col-sm-6 col-md-3");

                    var divForThumbnail = document.createElement("div");
                    $(divForThumbnail).addClass("thumbnail");
                    $(parentDivForThumbnail).append(divForThumbnail);

                    var listForAttractions = document.createElement("ul");
                    $(listForAttractions).addClass("connectedSortable");
                    $(listForAttractions).attr("id","sortable"+oneDay.toString());
                    $(divForThumbnail).append(listForAttractions);

                    for(var attraction in attractionsforAllDays[oneDay]) {
                        var li = document.createElement("li");
                        $(li).addClass("ui-state-default");
                        $(li).html(attractionsforAllDays[oneDay][attraction]["name"]);
                        $(listForAttractions).append(li);
                    }

                    $(".row").append(parentDivForThumbnail);
                }

                $( ".connectedSortable" ).sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
            }
        }
    );
});