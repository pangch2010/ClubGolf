var clubMemberID;
var membershipNo;
var confirmationID;
var courseID;
var flightDateTime;
var noOfHoles;
var courseName;
var flightDate;
var displayDate;
var flightTime;
var displayDateOnly;
var displayWeekday
var weekday = new Array(7);
weekday[0] = "SUN";
weekday[1] = "MON";
weekday[2] = "TUE";
weekday[3] = "WED";
weekday[4] = "THU";
weekday[5] = "FRI";
weekday[6] = "SAT";

function loadBooking(membershipNo) {
    var htmlString = "";

    $.ajax({
        url: SERVER_END_POINT_API + '/api/Booking/GetByMemberID?',
        type: 'GET',
        dataType: 'json',
        data: {
            MembershipNo: membershipNo
        },
        beforeSend: function () {
            $.mobile.loading("show", {
                text: "Loading",
                textVisible: true,
                textonly: false,
            });
        },
        success: function (result) {
            $.mobile.loading("hide");
            if (result != null && result != "") {
                $.each(result, function (index, element) {
                    flightDate = new Date(convertJsonDateTime(element.FlightDateTime));
                    displayDate = flightDate.getDate() + "/" + (flightDate.getMonth() + 1) + "/" + flightDate.getFullYear() + "<br/>(" + weekday[flightDate.getDay()] + ")";
                    displayDateOnly = flightDate.getDate() + "/" + (flightDate.getMonth() + 1) + "/" + flightDate.getFullYear();

                    htmlString = htmlString + "<li><h5>" + element.CourseName + "</h5> " +
                    "<p>"
                    + displayDate + ", " + element.FlightTime + ", " + element.NoOfHoles + " Holes<br>" +
                    "Booking No :" + element.ConfirmationID + "<button class=\"cancelBookingButton\" data-role=\"none\" data-icon=\"delete\" confirmid=\"" + element.ConfirmationID + "\" courseid=\"" + element.CourseID + "\" flightdatetime=\"" + element.FlightDateTime + "\" noofholes=\"" + element.NoOfHoles + "\" courseName=\"" + element.CourseName + "\" flightDate=\"" + displayDate + "\" flightTime=\"" + element.FlightTime + "\" displayDateOnly=\"" + displayDateOnly + "\" weekDay=\"" + weekday[flightDate.getDay()] + "\" >Cancel</button></li>"
                });
                $("#wrapper").html("");
                $("#wrapper").append(htmlString).trigger("create");
            } else {
                $.mobile.loading("hide");
                htmlString = htmlString + "<div class=\"no-booking\"> You have no upcoming booking.</div>"
                $("#wrapper").html("");                
                $("#wrapper").append(htmlString);
            }

        },
        error: function () {
            $.mobile.loading("hide");
            alert("error");
        },
    });
}
$(document).one("pagebeforeshow", "#myBooking", function () {
    if (localStorage.getItem("ClubMemberID") != null) {
        clubMemberID = localStorage.getItem("ClubMemberID");
    }
    if (localStorage.getItem("MembershipNo") != null) {
        membershipNo = localStorage.getItem("MembershipNo");
    }
    loadBooking(membershipNo);

    $(document).off('click', '.cancelBookingButton').on('click', '.cancelBookingButton', function (e) {
        confirmationID = $(this).attr("confirmid");
        courseID = $(this).attr("courseid");
        flightDateTime = $(this).attr("flightdatetime");
        noOfHoles = $(this).attr("noofholes");
        courseName = $(this).attr("courseName");
        flightDate = $(this).attr("flightDate");
        flightTime = $(this).attr("flightTime");
        displayDateOnly = $(this).attr("displayDateOnly");
        displayWeekday = $(this).attr("weekDay");

        $("#Inside-Course").html(courseName);
        $("#Inside-DateTime").html(displayDateOnly + "(" + displayWeekday + ")");
        $("#Inside-Time").html(flightTime);
        $("#Inside-Hole").html(noOfHoles + " " + "Holes");
        $("#popupDialog").popup("open");
    });

    $("#popupDialog").popup({
        afteropen: function (event, ui) {
            $('body').css({
                overflow: 'hidden'                
            });
            $('#page1').css({
                overflow: 'hidden'
            });
            $('body').on('touchmove', false);
        },
        afterclose: function (event, ui) {
            $('body').css({
                overflow: 'auto'
            });
            $('#page1').css({
                overflow: 'auto'
            });            

            $('body').off('touchmove');
        }
    });

    $(document).off('click', '#cancelBooking').on('click', '#cancelBooking', function (e) {
        submitCancel(membershipNo, confirmationID, clubMemberID, courseID, flightDateTime, noOfHoles);
    });
});
function submitCancel(membershipno, confirmationid, clubMemberID, courseID, flightDateTime, noOfHoles) {
    $.ajax({
        url: SERVER_END_POINT_API + '/api/Booking/CancelBooking',
        type: 'GET',
        dataType: 'json',
        data: {
            MembershipNo: membershipno,
            ConfirmationID: confirmationid,
            ClubMemberID: clubMemberID,
            CourseID: courseID,
            FlightDateTime: flightDateTime,
            NoOfHoles: noOfHoles,
        },
        success: function (result) {
            if (result != null) {
                if (result == "ok") {
                    //alert("Cancel Success");
                    $("#CancelSuccess").popup("open");
                    $(document).off('click', '#cancelOK').on('click', '#cancelOK', function (e) {
                        loadBooking(membershipNo);
                    });

                } else {
                    alert("fail to cancel");
                }
            } else {
                alert("fail to cancel");
            }
        },
        error: function () {
            alert("error");
        },
    });
}
