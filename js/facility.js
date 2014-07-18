

function GenerateFacilityDateDropDownList() {
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

    $("#FacilityDate").html("<option Date='0'>Date</option>");
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
        $("#FacilityDate").append("<option Date=" + date + " DisplayDate=" + DropdownlistDate + ">" + DropdownlistDate + "</option>");
    }
    $('#FacilityDate').selectmenu('refresh', true);

}
function resetFacilityTimeSlot() {
    $("#listFacilitiesTimeSlot").html("");
}
function GenerateFacilityDropdownList() {
    $("#FacilityType").html("<option value='0' ClientID='0'>Facility</option>");

    $.ajax({
        type: "GET",
        url: SERVER_END_POINT_API + "/api/Facility/List",
        success: function (result) {
            $.each(result, function (index, element) {
                $("#FacilityType").append("<option value=" + element.FacilityCode + " ClientID=" + element.FacilityCode + ">" + element.FacilityName + "</option>");
            });
            $('#FacilityType').selectmenu('refresh', true);
        },
        fail: function (jqXHR, exception) {

            alert(exception);
        }

    });
}

$(document).on('pagecreate', '#facility', function () {
    resetFacilityTimeSlot();
    GenerateFacilityDropdownList();
    GenerateFacilityDateDropDownList();
});
$(document).one('pagecreate', '#facility', function () {

    $(".btnBack").click(function () {
        $.mobile.navigate("menu.html", { transition: "slide", info: "info about the #bar hash" });
    });

    $(document).off('click', '#btnSearchFacilities').on('click', '#btnSearchFacilities', function (e) {
        resetFacilityTimeSlot();
        date = $('#FacilityDate :selected').attr("date");
        course = $('#FacilityType :selected').attr("value");
        ClientcourseID = $('#FacilityType :selected').attr("ClientID");
        time = $('#FacilityAMPM :selected').attr("value");
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
                url: SERVER_END_POINT_API + "/api/Facility/TimeSlot",
                dataType: 'json',
                data: {
                    Date: date,
                    FacilityType: ClientcourseID,
                    Type: time,
                },
                success: function (result) {
                    $("#listFacilitiesTimeSlot").html("");
                    $.each(result, function (index, element) {
                        
                        $("#listFacilitiesTimeSlot").append("<div align='center'>" + element.CourtCode + "</div>")
                        $.each(result.time, function (i, timeslot) {
                            var time = timeslot;
                            var res = time.split(" ");
                            $("#listFacilitiesTimeSlot").append("<a style='width:70px; height:' class=" + 'btnTimeSlot' + " data-role=" + 'button' + " data-theme=" + 'c' + " data-mini='true' data-corners=" + 'false' + " data-mini=" + 'true' + " data-inline=" + 'true' + " value =" + res + " time =" + res + ">" + time + "</a>").trigger("create");
                        });
                    });
                    $("#listFacilitiesTimeSlot").append("<br/><br/>").children().last().trigger("create");

                },
                error: function () {
                    $("#popup_ErrMsg").popup("open");
                    $("#ErroMessage").html("Error On get Data From Server");
                }
            });
        }
    });

});