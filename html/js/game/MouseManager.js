var MouseManager = {
    'down': {
        'mouse0': function (elm) {

        },
        'mouse1': function (elm, mouseX, mouseY) {
            var pos = $(elm).attr("id");
            console.log(pos.split('_')[1]);
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