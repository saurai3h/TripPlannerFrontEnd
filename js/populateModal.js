/**
 * Created by saurabh on 1/10/14.
 */
function populateModal(attractions,day,index) {

    $("#descriptionModalLabel").html(attractions[day][index]["name"]);

    var stars = attractions[day][index]["noOfStars"];
    var visitTime = attractions[day][index]["visitTime"];
    var fee = attractions[day][index]["fee"];
    var desc = attractions[day][index]["description"];
    var additionalInfo = attractions[day][index]["additionalInformation"];
    var acts = attractions[day][index]["activities"];

    var image = document.getElementById("attractionImage");
    $(image).attr("src",attractions[day][index]["imageURL"]);

    var description = document.getElementById("attractionDescription");
    if(!nullCheck(desc)) {
        $(description).show();
        $(description).html("<b>Details :</b>" + desc + "<br>");
    }
    var additionalInformation = document.getElementById("additionalInformation");
    if(!nullCheck(additionalInfo)) {
        $(additionalInformation).show();
        $(additionalInformation).html("<b>Additional :</b>" + additionalInfo + "<br>");
    }
    var activities = document.getElementById("activities");
    if(!nullCheck(acts)) {
        $(activities).show();
        $(activities).html("<b>Activities :</b>" + acts);
    }

    if(!nullCheck(stars) || !nullCheck(visitTime) || !nullCheck(fee) )   {
        $("#attractionDetails").show();
        if(!nullCheck(stars)) {
            $("#stars td").remove();
            $("#stars").show();

            var starValue = document.createElement("td");
            $(starValue).html(stars);
            $("#stars").append(starValue);
        }
        if(!nullCheck(visitTime)) {
            $("#visitTime td").remove();
            $("#visitTime").show();
            var timeValue = document.createElement("td");
            $(timeValue).html(parseFloat(visitTime).toFixed(2) + " hours");
            $("#visitTime").append(timeValue);
        }
        if(!nullCheck(fee)) {
            $("#fee td").remove();
            $("#fee").show();
            var feeValue = document.createElement("td");
            if(fee)
                $(feeValue).html("Yes");
            else
                $(feeValue).html("No");

            $("#fee").append(feeValue);
        }
    }
    $("#descriptionModalInfo").on("click",function(){
        window.open(attractions[day][index]["reviewURL"],'_blank');
    });

}

function nullCheck(value)   {
    if(value !== null && value !== undefined)   {
        return false;
    }
    else
        return true;
}
