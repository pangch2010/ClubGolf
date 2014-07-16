var Timevalue;
var course;
var date;
var time;
var hole;
var ClientcourseID;
var membershipNo;
var niteNineHole;
var clubMemberID;


function GenerateDateDropDownList() {
    var weekday = new Array(7);
    weekday[0] = "SUN";
    weekday[1] = "MON";
    weekday[2] = "TUE";
    weekday[3] = "WED";
    weekday[4] = "THU";
    weekday[5] = "FRI";
    weekday[6] = "SAT";

    var nowDate;
    var month = new Array(14);



    $("#dropDate").html("<option Date='0'>Date</option>");
    if (defaultDate_Test != "") {
        nowDate = new Date(defaultDate_Test);
    }
    else {
        nowDate = new Date();
    }

    for (var i = 1; i <= 14; i++) {
        var addDate = new Date(nowDate);
        addDate.setDate(nowDate.getDate() + i);
        var displayDate = new Date(addDate);

        var day = weekday[displayDate.getDay()];

        var date = displayDate.getFullYear() + "-" + (displayDate.getMonth() + 1) + "-" + displayDate.getDate();
        var DropdownlistDate = displayDate.getDate() + "/" + (displayDate.getMonth() + 1) + "/" + displayDate.getFullYear() + " " + weekday[displayDate.getDay()];
        var DropdownlistDate = displayDate.getDate() + "/" + (displayDate.getMonth() + 1) + "/" + displayDate.getFullYear() + "(" + weekday[displayDate.getDay()] + ")";
        $("#dropDate").append("<option Date=" + date + " DisplayDate=" + DropdownlistDate + ">" + DropdownlistDate + "</option>");
    }
    $('#dropDate').selectmenu('refresh', true);

}
function resetAvailabletime() {
    $("#listFlight").html("");
}
function GenerateCourseDropdownList() {
    $("#dropCourse").html("<option value='0' ClientID='0'>Course</option>");

    $.ajax({
        type: "GET",
        url: SERVER_END_POINT_API + "/api/TimeSlot/Course",
        success: function (result) {
            $.each(result, function (index, element) {
                $("#dropCourse").append("<option value=" + element.CourseID + " ClientID=" + element.ClientCourseID + ">" + element.CourseName + "</option>");
            });
            $('#dropCourse').selectmenu('refresh', true);
        },
        fail: function (jqXHR, exception) {

            alert(exception);
        }

    });
}
$(document).on('pagebeforeshow', '#golf', function () {
    GenerateDateDropDownList();
    GenerateCourseDropdownList();
    resetAvailabletime();
});

$(document).one('pagecreate', '#golf', function () {
    $(".btnBack").click(function () {
        $.mobile.navigate("menu.html", { transition: "slide", info: "info about the #bar hash" });
    });

    $(document).off('click', '#closeErrMsg').on('click', '#closeErrMsg', function (e) {
        $("#popup_ErrMsg").popup("close");
    });
    $(document).off('change', '#dropDate').on('change', '#dropDate', function (e) {
        resetAvailabletime();
    });
    $(document).off('change', '#dropCourse').on('change', '#dropCourse', function (e) {
        resetAvailabletime();
    });
    $(document).off('change', '#DropAMPM').on('change', '#DropAMPM', function (e) {
        resetAvailabletime();
    });
    $(document).off('click', '#CloseSuccessBooking').on('click', '#CloseSuccessBooking', function (e) {
        $.mobile.changePage("#myBooking", {
            transition: "flip",
            reverse: false,
            changeHash: true
        });
    });
    $(document).off('click', '#btnSearch').on('click', '#btnSearch', function (e) {
        resetAvailabletime();
        date = $('#dropDate :selected').attr("date");
        course = $('#dropCourse :selected').attr("value");
        ClientcourseID = $('#dropCourse :selected').attr("ClientID");
        time = $('#DropAMPM :selected').attr("value");
        if (date == 0) {
            $("#popup_ErrMsg").popup("open");
            $("#ErroMessage").html("Please Select A Date");
        }
        else if (course == 0) {
            $("#popup_ErrMsg").popup("open");
            $("#ErroMessage").html("Please Select A Course");
        }
        else {
            $.ajax({
                type: "GET",
                url: SERVER_END_POINT_API + "/api/TimeSlot/Settings",
                dataType: 'json',
                data: {
                    Date: date,
                    CourseCode: ClientcourseID,
                    Type: time,
                },
                success: function (result) {
                    $("#listFlight").html("");
                    niteNineHole = result.NineHole;
                    $.each(result.AvailableTime, function (index, element) {
                        var time = element;
                        var res = time.split(" ");
                        $("#listFlight").append("<a style='width:70px; height:' class=" + 'btnFlight' + " data-role=" + 'button' + " data-theme=" + 'c' + " data-mini='true' data-corners=" + 'false' + " data-mini=" + 'true' + " data-inline=" + 'true' + " value =" + res + " time =" + res + ">" + time + "</a>").trigger("create");
                    });
                    $("#listFlight").append("<br/><br/>").children().last().trigger("create");

                },
                error: function () {
                    $("#popup_ErrMsg").popup("open");
                    $("#ErroMessage").html("Error On get Data From Server");
                }
            });
        }
    });
    $(document).off('click', '.btnFlight').on('click', '.btnFlight', function (e) {
        
        Timevalue = $(this).attr("time");
        
        var Check9Hole = $(this).text();
       
        course = $('#dropCourse :selected').text();
        date = $('#dropDate :selected').attr("date");
        var DisplayDay = $('#dropDate :selected').attr("DisplayDate");

        var datedisplayed = $('#dropDate :selected').text();
        time = $('#DropAMPM :selected').attr("value");
        hole = $('#DropHoles :selected').attr("value");
        if (hole == 18) {
            for (var i = 0; i <= niteNineHole.length; i++) {
                if (Check9Hole == niteNineHole[i]) {
                    $("#popup_ErrMsg").popup("open");
                    $("#ErroMessage").html("Only 9 Hole Available for the time: " + Check9Hole);
                    hole = 9;
                }
            }
        }
        var timeDisplay = Timevalue.split(",");        
        $("#Confirm_Inside-Course").html(course);
        //$("#Inside-DateTime").html(DisplayDay.getDate() + "/" + (DisplayDay.getMonth() + 1) + "/" + DisplayDay.getFullYear() + " (" + weekday[DisplayDay.getDay()]+")");
        $("#Confirm_Inside-DateTime").html(DisplayDay);
        $("#Confirm_Inside-Time").html(timeDisplay[0] + " " + time);
        $("#Confirm_Inside-Hole").html(hole + " " + "Holes");
        $("#popup_Booking").popup("open");

    });
    $(document).off('click', '#cancelComfirm').on('click', '#cancelComfirm', function (e) {
        $("#popup_Booking").popup("close");
    });
    $(document).off('click', '#SubmitBooking').on('click', '#SubmitBooking', function (e) {
        course = $('#dropCourse :selected').val();

        if (localStorage.getItem("ClubMemberID") != null) {
            clubMemberID = localStorage.getItem("ClubMemberID");
        }
        if (localStorage.getItem("MembershipNo") != null) {
            membershipNo = localStorage.getItem("MembershipNo");
        }
        $.ajax({
            type: "GET",
            url: SERVER_END_POINT_API + "api/Booking/Book",
            dataType: 'json',
            data: {
                Date: date + " " + Timevalue,
                CourseCode: course,
                ClientCourseCode: ClientcourseID,
                MembershipNo: membershipNo,
                HoleType: hole,
                ClubmemberID: clubMemberID,
            },
            success: function (result) {
                if (result === parseInt(result)) {
                    $("#popup_Booking").popup("close");
                    setTimeout(function () { $("#popup_sucessfullyBooking").popup("open"); }, 1000);
                }
                else {
                    $("#popup_Booking").popup("close");
                    setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000);
                    $("#ErroMessage").html("Flight Time is not available, Please Select Another Date and Time");
                    resetAvailabletime();
                }
            },
            fail: function (jqXHR, exception) {
                $("#popup_Booking").popup("close");
                setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000);
                $("#ErroMessage").html(exception);
                resetAvailabletime();
            }
        });
    });

});
