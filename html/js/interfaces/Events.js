$(function () {
    $("#connect_login").on('click', function () {
        $("#menu_popup").css("display", "block");
        $("#menu_popup").addClass("fadeInDown animated");

        $("#login_popup").addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).css("display", "none");
        });
    });

    $("#start_new_game").on('click', function () {
        $("#menu_popup").addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).css("display", "none");
        });

        $("#new_game_popup").css("display", "block");
        $("#new_game_popup").addClass("fadeInDown animated");

    });
})
