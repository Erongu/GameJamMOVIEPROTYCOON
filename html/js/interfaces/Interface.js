var uiResizeCorrection = {};

function Load() {
    $('#menu .button').click(function () {
        $(this).parent().toggleClass('open');
    });

    $('.interface').mousedown(function () {
        if ($(this).css('z-index') != z_index)
            $(this).css('z-index', ++z_index);
    }).on('click', '.itf-close', function () {
        $(this).parent().parent().hide();
    }).on('click', '.itf-reduce', function () {
        $(this).parent().parent().toggleClass('minus');
    }).on('move', function () {
        $(this).css('margin', 0);
    }).each(function () {

        if (!$(this).hasClass("ignore")) {
            $(this).css({
                'top': ($(window).height() - $(this).outerHeight()) / 2,
                'left': ($(window).width() - $(this).outerWidth() - 50),
                'margin-top': '0px',
                'margin-left': '0px'
            });
        }else{
            let top = $(this).css("top");
            let left = $(this).css("left");

            $(this).css({
                'top': top,
                'left': left,
                'margin-top': '0px',
                'margin-left': '0px'
            });
        }

        if ($(this).hasClass("middle")) {
            $(this).css({
                'top': ($(window).height() - $(this).outerHeight()) / 2,
                'left': ($(window).width() - $(this).outerWidth()) / 2,
                'margin-top': '0px',
                'margin-left': '0px'
            });
        }
        if ($(this).hasClass("left")) {
            $(this).css({'left': '10px', 'margin-top': '0px', 'margin-left': '0px'});
        }
        if ($(this).hasClass("bottom")) {
            $(this).css({'top': $(window).height() - $(this).outerHeight(), 'margin-top': '0px', 'margin-left': '0px'});
        }

        $(this).toggleClass('minus');
    }).draggable({containment: 'html', handle: '.itf-head', cancel: '.itf-btn'});

    $('.interface > .itf-head').mousedown(function () {
        $(this).addClass('active')
    }).mouseup(function () {
        $(this).removeClass('active')
    })


    uiResizeCorrection = {};
    $('.needResize').resizable({
        handles: 'se',
        minWidth: 200,
        minHeight: 100,
        start: function (event, ui) {
            uiResizeCorrection[this] = {
                x: $(this).outerWidth() - $(this).width(),
                y: $(this).outerHeight() - $(this).height()
            };
        },
        resize: function (event, ui) {
            ui.size.width += uiResizeCorrection[this].x;
            ui.size.height += uiResizeCorrection[this].y;
            if (ui.size.width + ui.position.left > $(window).width())
                ui.size.width = $(window).width() - ui.position.left;
            if (ui.size.height + ui.position.top > $(window).height())
                ui.size.height = $(window).height() - ui.position.top;
        },
        stop: function (event, ui) {
            uiResizeCorrection[this] = {x: 0, y: 0};
        }
    });

    $('.needScroll').slimScroll({height: '100%', size: '10px', color: 'white', disableFadeOut: true});

}