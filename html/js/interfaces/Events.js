$(function () {
    $("#connect_login").on('click', function () {
        $("#menu_popup").css("display", "block");
        $("#menu_popup").addClass("fadeInDown animated");
        
        $("#login_popup").addClass("fadeOut animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).css("display", "none");
            //$("#login_popup").css("display","none");
        });
    });
})
