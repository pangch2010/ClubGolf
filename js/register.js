$(document).one('pagecreate', '#register', function () {

    $("#btnRegister").click(function () {

        if ($("#membershipNo").val().length > 0) {
            $.mobile.changePage("#activationPage", {
                transition: "flip",
                reverse: false,
                changeHash: false
            });
        }
        else {
            alert("Error: Please enter the memberhip no...");
        }

    });

    function navigateToMenu() {
        $.mobile.changePage("#homepage", {
            transition: "flip",
            reverse: false,
            changeHash: true
        });
    }

   

    if (localStorage.getItem("UserName") != undefined && localStorage.getItem("Token") != undefined) {

        $.ajaxSetup({
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("Token")
            }
        });
        navigateToMenu();

    }
    //else {

    //    if (localStorage.getItem("MembershipNO") != undefined) {
    //        $.mobile.changePage("#activationPage", {
    //            transition: "flip",
    //            reverse: false,
    //            changeHash: true
    //        });
    //    }
    //}

    $("#btnRegister").click(function () {


        var member = $("#membershipNo").val();

        if (member.length != 0) {
            var regMember = {

                ClubID: 1,
                Username: "KLGCC_" + member,
                MembershipNo: member,
                Password: "123456$$"
            }

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: URL_API + "/api/User/RegisterGolfClubMember",
                data: JSON.stringify(regMember)
            })
           .done(function (data) {
               var ActivationData = data.split("|");

               localStorage.setItem("MembershipNO", member);
               localStorage.setItem("aToken", ActivationData[0]);

               if (ActivationData[1] != "") {
                   localStorage.setItem("regid", ActivationData[1]);
                   localStorage.setItem("verifykey", ActivationData[2]);
               }
               //alert(member + ":" + ActivationData[0] + ":" + ":" + ActivationData[1] + ":" + ActivationData[2]);
               $.mobile.changePage("#activationPage", {
                   transition: "flip",
                   reverse: false,
                   changeHash: false
               });

           }).fail(function (jqXHR, exception) {
               //if (jqXHR.status === 0) {
               //    alert('Not connect.\n Verify Network.');
               //} else if (jqXHR.status == 404) {
               //    alert('Requested page not found. [404]');

               //} else if (jqXHR.status == 500) {
               //    alert('Internal Server Error [500].');
               //} else if (exception === 'parsererror') {
               //    alert('Requested JSON parse failed.');
               //} else if (exception === 'timeout') {
               //    alert('Time out error.');
               //} else if (exception === 'abort') {
               //    alert('Ajax request aborted.');
               //} else {
               //    alert('Uncaught Error.\n' + jqXHR.responseText);
               //}
               $("#errorPopup_register").popup("open");
           }

           );
        }
        else {
            $("#errorPopup_register").popup("open");

        }
    });

});