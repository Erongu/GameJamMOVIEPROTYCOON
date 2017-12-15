var z_index = 1001;

var resizeTimer;

var lastWindowWidth = 0,
    lastWindowHeight = 0;

var IsGameStarted = false;

var main_theme;

function Load() {
    adjust();
  //  playSound("main_theme");
}

$(function () {
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjust, 100);
    });

    $( "#selectable" ).selectable({
        selected: function(event, ui) {
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
        }
    });

    loadSound();

    setInterval(function(){
        if(IsGameStarted) {
            SaveGame();
        }
    }, 10000);

    $("#hover").hide();
    $("#grid").hide();

    Map.createGrid();
    Map.initCellPos();
});

function LoadGame() {
    GameObject = JSON.parse(Cookies.get("game"));

    GameObject.date = new Date(GameObject.date);
    GameObject.isNewGame = GameObject.money == 0;

    $('.interface').each(function () {
        if(!$(this).hasClass("noClose")) {
            $(this).addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).remove();
            });
        }
    });

    playCustomSound("whoosh");

    $("#newspaper_popup").show();
    $("#newspaper_popup").addClass("fadeInDown animated");

    $("#footer-navigation").show();
    $("#footer-navigation").addClass("fadeInDown animated");

    $("#info_playerName").text(GameObject.player_name);
    $("#info_companyName").text(GameObject.company_name);
    $("#info_money").text(GameObject.money + "$");
    $("#info_date").text(formatDate(GameObject.date));

    setInterval(function(){
        if(IsGameStarted) {
            GameObject.date = GameObject.date.addDays(1); // Time...
            $("#info_date").text(formatDate(GameObject.date));
        }
    }, 1000);

    IsGameStarted = true;

    $("body").css("background", "rgb(222, 208, 156)");

    Map.showGrid();
    Map.createMap();
    Map.loadMap();

    openDialog_data(Dialogs[0]);
}

function SaveGame() {
    Cookies.set("game", GameObject);
}

function adjust() {
    $('#map').add(Map.grid).attr({'width': $(window).width() * 1, 'height': $(window).height()  * 1});

    var coef = {x: ($(window).width() / lastWindowWidth), y: ($(window).height() / lastWindowHeight)};
    $('.needResize')
        .resizable("option", "maxWidth", $(window).width() * 0.9)
        .resizable("option", "maxHeight", $(window).height() * 0.9)
        .each(function (i, itf) {
            if ($(window).width() !== lastWindowWidth) {//client x modifié
                // $(itf).width(Math.max(coef.x*$(itf).width(), parseInt($(itf).css('min-width'))));
                $(itf).css('max-width', $(window).width() * 0.9 + 'px');
            }
            if ($(window).height() !== lastWindowHeight) {//client y modifié
                // $(itf).height(Math.max(coef.y*$(itf).height(), parseInt($(itf).css('min-height'))));
                $(itf).css('max-height', $(window).height() * 0.9 + 'px');
            }
        });
    $('.interface').each(function (i, itf) {
        if ($(window).width() !== lastWindowWidth) {//client x modifié
            $(itf).css('left', Math.max(coef.x * $(itf).position().left, 0) + 'px');
        }
        if ($(window).height() !== lastWindowHeight) {//client y modifié
            $(itf).css('top', Math.max(coef.y * $(itf).position().top, 0) + 'px');
        }
    });
    lastWindowWidth = $(window).width();
    lastWindowHeight = $(window).height();
}


function showMessagePopup(title, content) {
    $('#message_popup .popup_title').html(title);
    $('#message_popup .popup_content').html(content);
    $('#message_popup').show().css('z-index', ++z_index);
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function loadSound () {
    let volume = Cookies.get("music_volume");

    if(volume == null) {
        volume = 0.5;
        Cookies.set("music_volume", volume);
    }

    let effectsVol = Cookies.get("effects_volume");

    if(effectsVol == null){
        effectsVol = 0.5;
        Cookies.set("effects_volume", effectsVol);
    }

    let dialogVol = Cookies.get("dialogs_volume");

    if(dialogVol == null){
        dialogVol = 0.5;
        Cookies.set("dialog_volume", dialogVol);
    }

    $("#music_volume").val(volume);
    $("#sound_effects_volume").val(effectsVol);
    $("#dialog_volume").val(dialogVol);

    createjs.Sound.alternateExtensions = ["mp3", "wav"];
    createjs.Sound.registerSound("music/main_theme.mp3", "main_theme");
    createjs.Sound.on("fileload", this.playSound, this);

    createjs.Sound.registerSound("music/effects/whoosh.mp3", "whoosh");
    createjs.Sound.registerSound("music/dialogs/dialog.mp3", "dialog");

}

function playSound(event) {
    main_theme = createjs.Sound.play("main_theme", {loop:-1, volume: Cookies.get("music_volume")});
}

function playCustomSound(music) {
    createjs.Sound.play(music, {volume: Cookies.get("effects_volume")});
}

function playDialog(music) {
    createjs.Sound.play(music, {volume: Cookies.get("dialog_volume")});
}

function volumeChange() {
    let volume = $("#music_volume").val();
    main_theme.volume = volume;

    Cookies.set("music_volume", main_theme.volume);
}

function volumeEffectsChange() {
    let volume = $("#sound_effects_volume").val();
    Cookies.set("effects_volume", volume);
}

function volumeDialog() {
    let volume = $("#dialog_volume").val();
    Cookies.set("dialog_volume", volume);
}


function getBackgroundPath(mapId) {
    return 'assets/maps/' + mapId + '/background.png';
}

function getTilePath(gfx_id) {
    return 'assets/tiles/' + gfx_id + '.png';
}

function getPlayerPath() {
    return 'assets/player/idle_static.png';
}

function isCanvasBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;

    return canvas.toDataURL() == blank.toDataURL();
}

function openDialog(title, text) {
    $("#dialog_title").html(title);
    $("#dialog_text").html(text);
    $("#dialog_popup").show();
}

function openDialog_data(dialog) {
    $("#dialog_title").html(dialog.title);
    $("#dialog_text").html(dialog.body);
    $("#dialog_popup").show();

    playDialog("dialog");
}

function openMenuMakeFilm() {
    
}

function getQuality() {
    
}