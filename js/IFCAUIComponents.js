function Listview(id) {
    this.id = id;
    var arraylist = [];
    this.items = arraylist;
}

Listview.prototype.addItem = function (item) {
    this.items.push(item);
}

Listview.prototype.onClickItem = function (callback) {
    $(document).on("click", "#" + this.id + " li", callback);
}

Listview.prototype.generateListview = function (event) {
    var listString = "<ul data-role='listview' data-inset='true' class='transactionListView' id='" + this.id + "'>";
    listString += "<li data-role='list-divider'><div class='ui-grid-b'><div class='ui-block-a' style='width: 30%'><div class='ui-bar ui-bar-a listHeader'>Date</div></div><div class='ui-block-b' style='width: 40%'><div class='ui-bar ui-bar-a listHeader'>Transaction</div></div><div class='ui-block-c' style='width: 30%'><div class='ui-bar ui-bar-a listHeader'>RM</div></div></div></li>";
    $.each(this.items, function (index, value) {
        listString += event.displayItemFormat(value);
    });

    listString += "</ul>";

    return listString;
}

Listview.prototype.displayItemFormat = function (value) {
    var decider = "";
    if (value > 0) {
        decider = "credit";
    }
    else {
        decider = "debit";
    }
    return "<li class='transcationData'><div class='ui-grid-b'><div class='ui-block-a' style='width: 30%'><div class='ui-bar ui-bar-a'>" + value.DocDate + "</div></div><div class='ui-block-b' style='width: 40%'><div class='ui-bar ui-bar-a'>" + value.Description + "</div></div><div class='ui-block-c' style='width: 30%'><div class='ui-bar ui-bar-a" + decider + "'>" + value.Amount + "</div></div></div></li>";
}

IFCAListview.prototype = Object.create(Listview.prototype);

IFCAListview.prototype.constructor = IFCAListview;

function IFCAListview(id) {
    Listview.call(this, id);
}
