var z_index = 1001;

var resizeTimer;

var lastWindowWidth = 0,
    lastWindowHeight = 0;

var IsGameStarted = false;

var main_theme;

var DEBUG = false ;

function Load() {
    adjust();
  //  playSound("main_theme");
}

$(function () {
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjust, 100);
    });


    $("#selectableQualities").selectable({
        selected: function(event, ui) {
            $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");
        }
    });

    loadActors();
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
    GameObject.currentFilm = {};

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

            if(filmInProgress()) {
                $(".lastGame_stats").show();
            }else{
                $(".lastGame_stats").hide();
            }

            GameObject.date = GameObject.date.addDays(1); // Time...

            $("#info_date").text(formatDate(GameObject.date));

            if(filmInProgress()) {
                $("#currentMovie_enddate").text(30 - GameObject.publishedMovie.dayPassed);

                $(".lastGame_stats").show();

                var random = getRandomInt(1.15, 1.35);

                GameObject.publishedMovie.entries += GameObject.publishedMovie.today_entries_average;
                GameObject.publishedMovie.today_entries_average = parseInt(GameObject.publishedMovie.today_entries_average / random);
                GameObject.publishedMovie.profit_day = parseInt(GameObject.publishedMovie.profit_day / 1.25);
                GameObject.publishedMovie.dayPassed++;

                GameObject.money += GameObject.publishedMovie.profit_day;

                $("#currentMovie_todayEntries").text(GameObject.publishedMovie.today_entries_average);
                $("#currentMovie_entries").text(GameObject.publishedMovie.entries);
                $("#currentMovie_profit_per_day").text(GameObject.publishedMovie.profit_day + "$");

                if(GameObject.publishedMovie.profit_day < 1){
                    GameObject.publishedMovie = {};
                    $(".lastGame_stats").hide();
                    openDialog_data(Dialogs[3]);
                }

                if(GameObject.publishedMovie.dayPassed > 20){
                    GameObject.publishedMovie = {};
                    $(".lastGame_stats").hide();
                    openDialog_data(Dialogs[3]);
                }
            }

            if(GameObject.money == NaN){
                GameObject.money = 0;
            }

            console.log(GameObject.money);
            $("#info_money").text(GameObject.money +"$");

        }
    }, 3000);

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
    createjs.Sound.registerSound("music/dialogs/super.mp3", "super");
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

function getActorPath(gfx_id) {
    return 'assets/actors/' + gfx_id + '.png';
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
    let title = dialog.title.replace("{PLAYER_NAME}", "<strong>" + GameObject.player_name + "</strong>");
    title = title.replace("{COMPANY_NAME}", "<strong>" + GameObject.company_name + "</strong>");

    let body = dialog.body.replace("{PLAYER_NAME}", "<strong>" + GameObject.player_name + "</strong>");
    body = body.replace("{COMPANY_NAME}", "<strong>" + GameObject.company_name + "</strong>");
    body = body.replace("{FILM_NAME}", "<strong>" + GameObject.currentFilm.name + "</strong>");

    $("#dialog_title").html(title);
    $("#dialog_text").html(body);
    $("#dialog_popup").show();

    playDialog("dialog");
}

function openMenuMakeFilm() {

}


function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function isNullOrEmpty(e) {
    if(e == null) {
        return true;
    }
    if(e == "") {
        return true;
    }
    return false;
}

function loadActors() {
    //Load Actors

    $("#selectableActors").html("");

    Actors.forEach(function (actor) {
        let speciality = getTopic(actor.speciality);
        let nameTemp = "Airplane";

        $("#selectableActors").append("<li class=\"ui-widget-content actors fadeIn animated \" value=\"" + actor.uid + "\">" +
            "<img class='actorImg' src='"+ getActorPath(actor.gfx_id) +"' width='22' height='28'>" +
            "<div class='actor'>" + actor.name + "</div>" +
            "<small class='age'>Age: " + actor.age + "</small>" +
            "<small class='specialities'>Speciality: " + nameTemp + "</small>" +
            "<small class='price'>Price: " + actor.price + "$</small>"
            + "</li>");
    })

    $("#selectableActors").selectable({filter: "li"});
}



function getQuality(id) {
    let result = -1;

    Qualities.forEach(function (elem) {
        if(elem.id == id){
            result = elem;
            return;
        }
    });
    return result;
}


function getTopic(id) {
    let result = -1;

    Topics.forEach(function (elem) {
        if(elem.uid == id){
            result = elem;
            return;
        }
    });
    return result;
}

function getActor(id) {
    let result = -1;

    Actors.forEach(function (elem) {
        if(elem.uid == id){
            result = elem;
            return;
        }
    });
    return result;
}

function getTopicByName(name) {
    let result = -1;

    Topics.forEach(function (elem) {
        if(elem.name == name){
            result = elem;
            return;
        }
    });
    return result;
}

function getGenreByName(name) {
    let result = -1;

    Genre.forEach(function (elem) {
        if(elem.name == name){
            result = elem;
            return;
        }
    });
    return result;
}

function getScoreSymbioseByGenre(topic, id) {
    let result = -1;

    topic.symbiose.forEach(function (elem) {
        if(elem.type_id == id){
            result = elem;
            return;
        }
    });
    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePrice() {
    $(".film_cost").text("Cost: " + numberWithSpaces(filmPrice()) + "$");
}

function filmInProgress() {
    return GameObject.publishedMovie != null && GameObject.publishedMovie != {} && GameObject.publishedMovie.published == true;
}