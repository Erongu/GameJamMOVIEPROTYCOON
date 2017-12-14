var MouseManager = {
    'down': {
        'mouse0': function (elm) {

        },
        'mouse1': function (elm, mouseX, mouseY) {
            var pos = Map.polygonToPosition($(elm).data());
            console.log(pos.cellId);
            //$("#newspaper_popup").hide();

        },
        'tile_mouse1': function (elm, mouseX, mouseY) {
            //$(elm).hide();
            //$("#newspaper_popup").hide();

        },
        'mouse3': function (elm) {
            //newspaper_popup
           // $("#newspaper_popup").show();
        }
    },
    'enter': {
        'tile_mouse0': function (elm) {
            console.log("entered");
            $(elm).css({"border-color": "#C1E0FF",
                "border-width":"1px",
                "border-style":"solid"});
        },
        'mouse1': function (elm) {
        },
        'mouse2': function (elm) {
        },
        'mouse3': function (elm) {
        }
    },
    'up': {
        'mouse1': function (elm) {
        },
        'mouse2': function (elm) {
        },
        'mouse3': function (elm) {
        }
    }
};