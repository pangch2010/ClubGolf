$(document).one('pagecreate', function () {


    $("#index").click(function () {
        $.mobile.navigate("index.html", { transition: "slide", info: "info about the #bar hash" });
        // navigator.app.exitApp();
    });

    $("#menu").click(function () {
        $.mobile.navigate("menu.html", { transition: "slide", info: "info about the #bar hash" });
        // navigator.app.exitApp();
    });



});


