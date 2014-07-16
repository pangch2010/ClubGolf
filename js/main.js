//var SERVER_END_POINT_API = "http://localhost:3998/";
//var URL_API = "http://localhost:3998";
var URL_API = "http://175.139.183.94:76/ClubServerAPI";
var SERVER_END_POINT_API = "http://175.139.183.94:76/ClubServerAPI/";


var defaultDate_Test = "";

function showLoading() {
    $.mobile.loading("show", {
        text: "Loading",
        textVisible: true,
        textonly: false,
    });
}

function HideLoading() {
    $.mobile.loading("hide");
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function convertJsonDateTime(data) {
    var dateString = data;
    var reggie = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    var dateArray = reggie.exec(dateString);
    var dateObject = new Date(
        (+dateArray[1]),
        (+dateArray[2]) - 1, // Careful, month starts at 0!
        (+dateArray[3]),
        (+dateArray[4]),
        (+dateArray[5]),
        (+dateArray[6])
    );
    return dateObject;
}

$(document).on({
    ajaxStart: function () {
        showLoading();
    },
    ajaxStop: function () {
        HideLoading();
    }
});

if (localStorage.getItem("Token") != "") {
    $.ajaxSetup({
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("Token")
        }
    });
}



$(document).one('pagecreate', function () {

    $("#btnBack").click(function () {
        //alert("back to previous page");
        //navigator.app.backHistory();
    });
    $("#btnPower").click(function () {

        //if (confirm('Are you sure you want to exit the app?')) {
        //    alert("Off the app");
        //    navigator.app.exitApp();
        //} else {
        //    // Do nothing!
        //}

       
    });




    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {

            //alert("back button");

            if ($.mobile.activePage.is('#homepage')) {
                e.preventDefault();

                if (confirm('Are you sure you want to exit the app?')) {
                    navigator.app.exitApp();
                } else {
                    // Do nothing!
                }
                
            }
            else {
                //alert("back to history");
                navigator.app.backHistory();
            }
        }, false);
    }
});

//******************Cancel Booking start****************************//
function CancelBooking() { }

$(document).on("pagebeforeshow", "#myBooking", function () {
    var membershipNo;
    var confirmationID;

    if (localStorage.getItem("MembershipNo") != null) {
        membershipNo = localStorage.getItem("MembershipNo");
    }

    var booking = new CancelBooking();

    booking.loadBooking(membershipNo);

    $(document).off('click', '.cancelBookingButton').on('click', '.cancelBookingButton', function (e) {
        confirmationID = $(this).attr("confirmid");

        $("#Inside-Course").html($(this).attr("courseName"));
        $("#Inside-DateTime").html($(this).attr("displayDateOnly") + "(" + $(this).attr("weekDay") + ")");
        $("#Inside-Time").html($(this).attr("flightTime"));
        $("#Inside-Hole").html($(this).attr("noofholes") + " " + "Holes");
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
        $.ajax({
            url: SERVER_END_POINT_API + '/api/Booking/CancelBooking',
            type: 'GET',
            dataType: 'json',
            data: {
                MembershipNo: membershipNo,
                ConfirmationID: confirmationID,
            },
            success: function (result) {
                if (result != null) {
                    if (result == "ok") {
                        $.mobile.loading("hide");
                        $("#popupDialog").popup("close");
                        setTimeout(function () { $("#CancelSuccess").popup("open"); }, 1000);
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
    });

    $(document).off('click', '#cancelOK').on('click', '#cancelOK', function (e) {
        booking.loadBooking(membershipNo);
    });
});


CancelBooking.prototype.loadBooking = function (membershipNo) {
    var htmlString = "";
    var flightDate;
    var displayDate;
    var displayDateOnly;
    var weekday = new Array(7);
    weekday[0] = "SUN";
    weekday[1] = "MON";
    weekday[2] = "TUE";
    weekday[3] = "WED";
    weekday[4] = "THU";
    weekday[5] = "FRI";
    weekday[6] = "SAT";

    $.ajax({
        url: SERVER_END_POINT_API + '/api/Booking/GetByMemberID?',
        type: 'GET',
        dataType: 'json',
        data: {
            MembershipNo: membershipNo
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
                    "Booking No :" + element.ConfirmationID + "<button class=\"cancelBookingButton\" data-role=\"none\" data-icon=\"delete\" confirmid=\"" + element.ConfirmationID + "\" noofholes=\"" + element.NoOfHoles + "\" courseName=\"" + element.CourseName + "\" flightTime=\"" + element.FlightTime + "\" displayDateOnly=\"" + displayDateOnly + "\" weekDay=\"" + weekday[flightDate.getDay()] + "\" >Cancel</button></li>"
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
        fail: function (jqXHR, exception) {
            alert(exception);
        },
    });
}
//******************Cancel Booking END****************************//