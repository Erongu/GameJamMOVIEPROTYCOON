$(function () {
    $("#connect_login").on('click', function () {
        $("#menu_popup").css("display", "block");
        $("#menu_popup").addClass("fadeInDown animated");

        createjs.Sound.play("whoosh");
        $("#login_popup").addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).css("display", "none");
        });

        let localGameObject = Cookies.get("game");

        if(localGameObject == null || localGameObject.lose){
            $("#continue_game").prop("disabled", true);
        }
    });

    $("#start_new_game").on('click', function () {
        createjs.Sound.play("whoosh");
        $("#menu_popup").addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).css("display", "none");
        });

        $("#new_game_popup").css("display", "block");
        $("#new_game_popup").addClass("fadeInDown animated");
    });

    $("#create_new_game").on('click', function () {
        let playerName = $("#new_game_player_name").val();
        let companyName = $("#new_game_company_name").val();

        if(playerName == ""){
            playerName = "Jean-Marc";
        }

        if(companyName == ""){
            companyName = "Alpa Company";
        }

        GameObject.player_name = playerName;
        GameObject.company_name = companyName;
        GameObject.lose = false;
        GameObject.date = new Date(1891, 4, 11, 9, 30, 0, 0);

        Cookies.set("game", GameObject);

        LoadGame();
    });

    $("#continue_game").on('click', function () {
        LoadGame();
    });
})
