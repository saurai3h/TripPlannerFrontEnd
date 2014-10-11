/**
 * Created by saurabh on 24/9/14.
 */
var cityArray = ["Bangkok", "Seoul", "London", "Milan", "Paris", "Rome", "Singapore", "Shanghai" , "New York", "Amsterdam", "Istanbul", "Tokyo", "Dubai", "Vienna", "Kuala Lumpur", "Taipei", "Hong Kong", "Riyadh", "Barcelona", "Los Angeles"];

$("#cityName").autocomplete({

    source: function(request, response) {
        var results = $.ui.autocomplete.filter(cityArray, request.term);
        response(results.slice(0, 5));
    },
    select : function (event, ui) {
        var value = ui.item.value;
        changeBackground(value);
    }
});

var changeBackground = function(cityName)   {
        $("#top").attr("style","background : url(img/" + cityName.replace(" ","") + ".jpg) no-repeat center center scroll; background-size : 100% auto");
}