var MouseManager = {
    'down': {
        'mouse0': function (elm) {

        },
        'mouse1': function (elm, mouseX, mouseY) {
            var pos = Map.polygonToPosition($(elm).data());
            console.log(pos.cellId);
            //$("#newspaper_popup").hide();

        },
        'mouse3': function (elm) {
            //newspaper_popup
           // $("#newspaper_popup").show();
        }
    },
    'enter': {
        'mouse0': function (elm) {
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