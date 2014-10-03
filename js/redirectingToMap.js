/**
 * Created by saurabh on 30/9/14.
 */
$("#toMap").on("click",function(){

    var url = $(location).attr("href");
    var keyValueData = url.split("?")[1].split("&");

    var cityName = keyValueData[0].split("=")[1];
    var numberOfDays = keyValueData[1].split("=")[1][0];

    $(location).attr("href","map.html?city="+cityName+"&days=" + numberOfDays);
});