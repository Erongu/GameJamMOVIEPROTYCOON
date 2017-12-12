var z_index = 1001;

var resizeTimer;
var limitCanvas;

var DEBUG_MODE = true;
            
var lastWindowWidth = 0,
      lastWindowHeight = 0;
    
function Load(){
    adjust();
}

$(function () {
    $(window).on('resize', function () {
                clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(adjust, 100);
                });
});


function adjust(){  
    var coef = {x: ($(window).width() / lastWindowWidth), y: ($(window).height() / lastWindowHeight)};
    $('.needResize')
        .resizable("option", "maxWidth", $(window).width()*0.9)
        .resizable( "option", "maxHeight", $(window).height()*0.9)
        .each(function (i, itf) {
        if ($(window).width() !== lastWindowWidth) {//client x modifié
            // $(itf).width(Math.max(coef.x*$(itf).width(), parseInt($(itf).css('min-width'))));
            $(itf).css('max-width', $(window).width()*0.9 + 'px');
        }
        if ($(window).height() !== lastWindowHeight) {//client y modifié
            // $(itf).height(Math.max(coef.y*$(itf).height(), parseInt($(itf).css('min-height'))));
            $(itf).css('max-height', $(window).height()*0.9 + 'px');
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
