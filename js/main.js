//var SERVER_END_POINT_API = "http://localhost:3998/";
//var URL_API = "http://localhost:3998";
var URL_API = "http://175.139.183.94:76/ClubServerAPI";
var SERVER_END_POINT_API = "http://175.139.183.94:76/ClubServerAPI/";


var defaultDate_Test = "";
var db = null;

function activate() { }
function Common() { }

Common.prototype.DisableScrollAfterPopup = function (pageID) {
    $(pageID).popup({
        afteropen: function (event, ui) {
            $('body').on('touchmove', false);
        },
        afterclose: function (event, ui) {
            $('body').off('touchmove');
        }
    });
}

Common.prototype.navigateTo = function (pageID, changehash) {
    $.mobile.changePage(pageID, {
        transition: "slide",
        reverse: false,
        changeHash: changehash
    });
}

Common.prototype.isLogin = function () {
    if (localStorage.getItem("UserName") != undefined && localStorage.getItem("Token") != undefined) {
        $.ajaxSetup({
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("Token")
            }
        });

        return true;
    }
    else {
        return false;
    }
}

Common.prototype.Loading = function (action, displayText) {
    $.mobile.loading(action, {
        text: displayText,
        textVisible: true,
        textonly: false,
    });
}


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

//******************Splash Page Start*******************************//
$(document).on('pagecreate', '#splashscreen', function () {
    var common = new Common();
    if (common.isLogin() == true) {
        setTimeout(function () { common.navigateTo("#homepage", "false"); }, 1500);
    }
    else {
        setTimeout(function () { common.navigateTo("#register", "false"); }, 1500);
    }

});

//*******************Splash Page End********************************//

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

    var common = new Common();

    common.DisableScrollAfterPopup("#popupDialog");

    $(document).off('click', '.cancelBookingButton').on('click', '.cancelBookingButton', function (e) {
        confirmationID = $(this).attr("confirmid");

        $("#Inside-Course").html($(this).attr("courseName"));
        $("#Inside-DateTime").html($(this).attr("displayDateOnly") + "(" + $(this).attr("weekDay") + ")");
        $("#Inside-Time").html($(this).attr("flightTime"));
        $("#Inside-Hole").html($(this).attr("noofholes") + " " + "Holes");
        $("#popupDialog").popup("open");
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

//******************Activation Page Start*************************//
$(document).one('pagecreate', '#activationPage', function () {
    var common = new Common();
    $("#btnActivate").click(function () {

        var aToken = localStorage.getItem("aToken");
        var regid = localStorage.getItem("regid");
        var verifykey = localStorage.getItem("verifykey");
        var code = $("#activationCode").val();

        if (code.length != 0 && code.length > 3) {

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: URL_API + "/api/User/MembershipsActivation?atoken=" + aToken + "&regid=" + regid + "&verifykey=" + verifykey + "&code=" + code,


            })
           .done(function (data) {
               var data = data.split("|");
               localStorage.setItem("username", data[0]);
               localStorage.setItem("password", data[1]);


               var username = localStorage.getItem("username");
               var password = localStorage.getItem("password");

               var logon = new activate();
               logon.login(username, password);

           }).fail(function (jqXHR, exception) {

               $("#errorPopup").popup("open");
           });
        }
        else {
            $("#errorPopup").popup("open");

        }
    });

    db = window.openDatabase("ClubDB", "1.0", "Club Membership Database", 1000000);
    $.ajaxSetup({
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 401) {
                alert('401 Unauthorized');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert(jqXHR.responseText);

            }
        }
    });

    if (localStorage.getItem("UserName") != undefined && localStorage.getItem("Token") != undefined) {

        $.ajaxSetup({
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("Token")
            }
        });
        common.navigateTo("#homepage", "true");

    }
});

activate.prototype.login = function (username, password) {
    var common = new Common();
    var success = false;
    db.transaction(
            function (tx) {
                ensureTableExists(tx);
                tx.executeSql('SELECT * FROM ClubDetail where UserName="' + username + '"', [], function (tx, result) {
                    for (var index = 0; index < result.rows.length; index++) {
                        var item = result.rows.item(index);
                        localStorage.setItem("Token", item.AuthToken);
                        localStorage.setItem("UserName", item.UserName);
                        localStorage.setItem("ICNo", item.ICNo);
                        localStorage.setItem("Email", item.Email);
                        localStorage.setItem("UserID", item.UserID);
                        localStorage.setItem("ClubMemberID", item.ClubMemberID);
                        localStorage.setItem("MembershipNo", item.MembershipNo);
                        localStorage.setItem("UserID", item.UserID);
                        localStorage.setItem("TokenExpiryDate", item.TokenExpiryDate);
                        localStorage.setItem("DeviceID", item.DeviceID);
                        localStorage.setItem("DeviceKey", item.DeviceKey);
                        success = true;
                        var sql2 = 'update ClubDetail set RecordStatus="Active" where UserName="' + username + '" ';
                        tx.executeSql(sql2);
                    }
                }
                , function (err) {

                });
            },
            function (err) {

            },
            function (err) {
                if (success == true) {
                    common.navigateTo("#homepage", "true");
                }
                else {
                    var authenLogin = new activate();
                    authenLogin.authenticateLogin(username, password);
                }
            }
            );
}

function getDeviceID() {

    if (localStorage.getItem("DeviceKey") != null) {
        return localStorage.getItem("DeviceKey");
    } else {
        return "no-device-id";
    }

}

function ensureTableExists(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ClubDetail' +
            '(id INTEGER PRIMARY KEY, UserID,TokenExpiryDate,AuthToken,UserName,Email,ICNo,DeviceID,DeviceKey,RecordStatus,ClubMemberID,MembershipNo)');
}

activate.prototype.authenticateLogin = function (username, password) {
    $.ajaxSetup({
        async: false
    });

    $.ajax({
        type: "POST",
        url: SERVER_END_POINT_API + "/token",
        async: false,
        contentType: "application/x-www-form-urlencoded",
        data: "grant_type=password&username=" + username + "&password=" + password
    })
     .done(function (data) {
         //var isLogin = new authenticate(data);
         //var isLogin = authenticate(data);
         var isLogin = new activate();
         isLogin.authenticate(data);
     }).fail(function () {
         alert("Invalid login");

     });
}

activate.prototype.authenticate = function (msg) {

    var IsAuthenticated = false;
    var common = new Common();
    var membershipNO = localStorage.getItem("MembershipNO");
    var token = {
        DeviceKey: getDeviceID(),
        Token: msg.access_token,
        TokenExpiryDate: msg.expires_in,
        UserName: msg.userName,
        MembershipNo: membershipNO
    };

    $.ajax({
        type: "POST",
        url: SERVER_END_POINT_API + "/api/User/Authenticate",
        contentType: "application/json",
        async: true,
        data: JSON.stringify(token),
        headers: {
            "Authorization": "Bearer " + msg.access_token
        }
    }).done(function (data) {
        var msg = JSON.parse(data);

        localStorage.setItem("ICNo", msg.ICNo);
        localStorage.setItem("Email", msg.Email);
        localStorage.setItem("UserID", msg.UserID);
        localStorage.setItem("ClubMemberID", msg.ClubMemberID);
        localStorage.setItem("MembershipNo", msg.MembershipNo);
        localStorage.setItem("TokenExpiryDate", msg.TokenExpiryDate);
        localStorage.setItem("Token", msg.Token);
        localStorage.setItem("UserName", msg.UserName);
        IsAuthenticated = true;
        db.transaction(
                          function (tx) {
                              ensureTableExists(tx);
                              //var sql = 'select COUNT(*) as a  from Contacts where firstname="' + firstName + '"';
                              var sql = 'SELECT COUNT(*) as a  from ClubDetail where UserName="' + msg.UserName + '"';
                              tx.executeSql(sql, [],
                                      function (tx, results) {
                                          var item;
                                          item = results.rows.item(0);
                                          if (item.a == 0) {
                                              var sql1 = 'INSERT INTO ClubDetail(UserID,TokenExpiryDate,AuthToken,UserName,Email,ICNo,DeviceID,DeviceKey,RecordStatus,ClubMemberID,MembershipNo) VALUES("' + msg.UserID + '","' + msg.TokenExpiryDate + '","' + msg.Token + '","' + msg.UserName + '","' + msg.Email + '","' + msg.ICNo + '","' + msg.DeviceID + '","' + msg.DeviceKey + '","Active","' + msg.ClubMemberID + '","' + msg.MembershipNo + '")';
                                              tx.executeSql(sql1);
                                          }
                                          else {
                                              var sql2 = 'update ClubDetail set RecordStatus="Active", TokenExpiryDate="' + msg.TokenExpiryDate + '",AuthToken="' + msg.Token + '",Email="' + msg.Email + '",ICNo="' + msg.ICNo + '",DeviceID="' + msg.DeviceID + '",DeviceKey="' + msg.DeviceKey + '" where UserName="' + msg.UserName + '" ';
                                              tx.executeSql(sql2);
                                          }
                                          if (localStorage.getItem("Token") != "") {
                                              $.ajaxSetup({
                                                  headers: {
                                                      "Authorization": "Bearer " + localStorage.getItem("Token")
                                                  }
                                              });
                                          }
                                          common.navigateTo("#homepage", "true");
                                      }
                                      , function (err) {
                                          //alert("Unable to fetch result from golf Table");
                                      });
                          }, function (err) {
                              //alert("Test");
                          },
                          function (err) {
                          }
                          );

    }).fail(function (data) {
        IsAuthenticated = false;
        $.mobile.changePage("#registerPage", {
            transition: "flip",
            reverse: false,
            changeHash: false
        });

    });

    return IsAuthenticated;
}

//******************Activation Page END***************************//