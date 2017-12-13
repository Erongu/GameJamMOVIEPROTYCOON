$(function () {
    $("#connect_login").on('click', function () {
        $("#login_popup").addClass("fadeOut animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).css("display","none");
        });
        //$("#login_popup").css("display","none");
    });
});
