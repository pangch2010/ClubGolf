$(document).one('pagecreate', function () {
    //$("a[data-role=tab]").each(function () {
    //    var anchor = $(this);
    //    anchor.bind("click", function () {
    //        $.mobile.changePage(anchor.attr("href"), {
    //            transition: "flip"
    //        });
    //        return false;
    //    });
    //});

    //$("div[data-role=page]").bind("pagebeforeshow", function () {
    //    $.mobile.silentScroll(0);
    //});

    $('#oneTab').addClass('ui-btn-active');

    //$("#btnBack_PromotionPage").click(function () {
    //    $('#oneTab').addClass('ui-btn-active');
    //});

    //$("#btnBack_GolfPage").click(function () {
    //    $('#twoTab').addClass('ui-btn-active');
    //});

    //$("#btnBack_FacilityPage").click(function () {
    //    $('#twoTab').addClass('ui-btn-active');
    //});

});

$(document).one("pagebeforeshow", function () {

    $("#btnGolf").click(function () {

        $.mobile.changePage("#golf", {
            transition: "flip",
            reverse: false,
            changeHash: false
        });
    });

    $("#btnFacility").click(function () {

        $.mobile.changePage("#facility", {
            transition: "flip",
            reverse: false,
            changeHash: false
        });
    });

    $(document).off('.btnFlight').on('click', '.btnFlight', function (e) {
        confirmationID = "32129";
        noOfHoles = "18";
        courseName = "West Course 1";
        flightTime = "7:10AM";
        displayDateOnly = "17/7/2014";
        displayWeekday = "Sat";

        $("#Confirm_Inside-Course").html(courseName);
        $("#Confirm_Inside-DateTime").html(displayDateOnly + "(" + displayWeekday + ")");
        $("#Confirm_Inside-Time").html(flightTime);
        $("#Confirm_Inside-Hole").html(noOfHoles + " " + "Holes");
        $("#popupConfirmBooking").popup("open");
    });

    $(document).off('.btnFlightFacility').on('click', '.btnFlightFacility', function (e) {
        confirmationID = "32129";
        noOfHoles = "18";
        courseName = "West Course 1";
        flightTime = "7:10AM";
        displayDateOnly = "17/7/2014";
        displayWeekday = "Sat";

        $("#Confirm_F_Inside-Course").html(courseName);
        $("#Confirm_F_Inside-DateTime").html(displayDateOnly + "(" + displayWeekday + ")");
        $("#Confirm_F_Inside-Time").html(flightTime);
        $("#Confirm_F_Inside-Hole").html(noOfHoles + " " + "Holes");
        $("#popupFacilityConfirmBooking").popup("open");
    });

    $(document).off('click', '.cancelBookingButton').on('click', '.cancelBookingButton', function (e) {
        confirmationID = "32129";
        noOfHoles = "18";
        courseName = "West Course 1";
        flightTime = "7:10AM";
        displayDateOnly = "17/7/2014";
        displayWeekday = "Sat";

        $("#Inside-Course").html(courseName);
        $("#Inside-DateTime").html(displayDateOnly + "(" + displayWeekday + ")");
        $("#Inside-Time").html(flightTime);
        $("#Inside-Hole").html(noOfHoles + " " + "Holes");
        $("#popupDialog").popup("open");
    });

    $("#popupDialog").popup({
        afteropen: function (event, ui) {
            $('body').css({
                overflow: 'hidden',
                width: '100%'
            });
            $('#page1').css({
                overflow: 'hidden'
            });
        },
        afterclose: function (event, ui) {
            $('body').css({
                overflow: 'auto'
            });
            $('#page1').css({
                overflow: 'auto'
            });
        }
    });

    $(document).off('click', '#cancelBooking').on('click', '#cancelBooking', function (e) {
        $("#popupDialog").popup("close");
        $("#CancelSuccess").popup("open");
    });

});
