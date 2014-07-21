$(document).on("pagebeforeshow", "#statement", function () {
    var membershipNo;

    if (localStorage.getItem("MembershipNo") != null) {
        membershipNo = localStorage.getItem("MembershipNo");
    }
    LoadAccountINFO(membershipNo);
    LoadAccountDetail(membershipNo);
});


function LoadAccountINFO(MemberShipNo) {
    $.ajax({
        url: SERVER_END_POINT_API + '/api/Statement/AccountInfo',
        type: 'GET',
        dataType: 'json',
        data: {
            MemberNo: membershipNo,
        },
        success: function (result) {
            if (result != null && result != "") {
                $("#outstandingAmt").html(result.TotalOutstandingAmt);
                $("#dueDate").html(result.DueDate);
            } else {
                alert("fail to  retrieve statement info");
            }
        },
        error: function () {
            alert("error");
        },
    });

}
function LoadAccountDetail(MemberShipNo) {
    var startDate = "2008-01-01";
    var EndDate = "2008-02-01";
    $.ajax({
        url: SERVER_END_POINT_API + '/api/Statement/AccountDetail',
        type: 'GET',
        dataType: 'json',
        data: {
            MemberNo: membershipNo,
            StartDate: startDate,
            EndDate: EndDate,
        },
        success: function (result) {
            if (result != null && result != "") {
                var ListStatementTransaction = new IFCAListview("ListStatementTransaction");
                listviewgolf.addItem(result);
                $("#listviewDisplay").html(listviewgolf.generateListview(listviewgolf));
            } else {
                alert("fail to  retrieve statement info");
            }
        },
        error: function () {
            alert("error");
        },
    });
}
