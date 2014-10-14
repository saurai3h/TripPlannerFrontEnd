
/**
 * Created by kartik.k on 9/26/2014.
 */

var eventBeingDragged;
function showCalendarInDiv(calendarDiv) {
    $(calendarDiv).fullCalendar({
        droppable: true,
        defaultView: 'agendaWeek',
        header:false,
//        hiddenDays: [0,3,4,5,6],
        editable: true,
        events: [
            {
                title: 'event1',
                id: "eventOne"+calendarDiv.id,
                start: '2014-09-29 11:00',
                end: '2014-09-29 13:00',
                allDay: false
            },
            {
                title: 'event2',
                start: '2014-09-29 14:00',
                end: '2014-09-29 14:30',
                allDay: false
            },
            {
                title: 'event3',
                start: '2014-09-29 17:00',
                end: '2014-09-29 21:00',
                allDay: false
            }
        ],
        eventDrop: function (event, delta, revertFunc) {
            if (isOverlapping(event,calendarDiv)) {
                revertFunc();
            }
        },
        eventResize: function (event, delta, revertFunc) {
            if (isOverlapping(event,calendarDiv)) {
                revertFunc();
            }
        },
        eventRender: function(event, element) {
            var image = document.createElement("img");
            $(image).attr("src","img/Paris.jpg");
            element.append(image);
        },


        drop: function(date) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        }
    });
}
function isOverlapping(event, $calendar) {
    var array = $calendar.fullCalendar('clientEvents');
    for(i in array){
        if(array[i]._id != event._id){
            if(!(array[i].start.format() >= event.end.format() || array[i].end.format() <= event.start.format())){
                return true;
            }
        }
    }
    return false;
}
$(document).ready(function() {
    showCalendarInDiv($('#calendar1'));
//    showCalendarInDiv($('#calendar2'));
});