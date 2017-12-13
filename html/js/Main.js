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

    loadSound();

    setInterval(function(){
        if(IsGameStarted) {
            SaveGame();
        }
    }, 10000);
});

function LoadGame() {
    GameObject = JSON.parse(Cookies.get("game"));
    GameObject.date = new Date(GameObject.date);

    $('.interface').each(function () {
        if(!$(this).hasClass("music")) {
            $(this).addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).remove();
            });
        }
    });

    $("#footer-navigation").css("display", "block");
    $("#footer-navigation").addClass("fadeInUp animated");

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
}

function SaveGame() {
    Cookies.set("game", GameObject);
}

function adjust() {
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
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound("music/main_theme.mp3", "main_theme");
    createjs.Sound.on("fileload", this.playSound, this);

}

function playSound(event) {
    main_theme = createjs.Sound.play("main_theme");
    main_theme.volume = 0.5;
}

function volumeChange() {
    let volume = $("#music_volume").val();
    main_theme.volume = volume;
    console.log("Change volume to " + volume);
}