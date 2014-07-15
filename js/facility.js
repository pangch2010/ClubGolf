$(document).one('pagecreate', function () {

    $(".btnBack").click(function () {
        $.mobile.navigate("menu.html", { transition: "slide", info: "info about the #bar hash" });
    });

    $(document).off('click', '#btnSearchFacilities').on('click', '#btnSearchFacilities', function (e) {
        $("#listFacilitiesFlight").html("<div class=" + 'courtLabel' + ">Court 1</div>");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "09:00 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "09:15 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "09:30 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "09:45 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "10:00 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<br/><br/><div class=" + 'courtLabel' + ">Court 2</div>");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "10:15 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "10:30 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "10:45 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "11:00 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<button style='width:80px; height:' class=" + 'btnFlightFacility' + " data-role=" + 'button' + " data-theme=" + 'a' + " data-mini='true' data-corners=" + 'true' + " data-inline=true>" + "11:15 am" + "</button>").trigger("create");
        $("#listFacilitiesFlight").append("<br/><br/>").children().last().trigger("create");
    });

});