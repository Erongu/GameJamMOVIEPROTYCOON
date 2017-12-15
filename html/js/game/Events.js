$(function () {
    $("#connect_login").on('click', function () {
        $("#menu_popup").show();
        $("#menu_popup").addClass("fadeInDown animated");

        playCustomSound("whoosh");
        $("#login_popup").addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).hide();
        });

        let localGameObject = Cookies.get("game");

        if(localGameObject == null || localGameObject.lose){
            $("#continue_game").prop("disabled", true);
        }
    });

    $("#start_new_game").on('click', function () {
        playCustomSound("whoosh");
        $("#menu_popup").addClass("fadeOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).hide();
        });

        $("#new_game_popup").show();
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

    $("#grid").on('mousedown', 'polygon', function (event) {
        let mouse = 'mouse' + event.which;
        MouseManager['down'][mouse](this, event.clientX, event.clientY, event);
    });

    $("#skip_dialog").on('click', function () {
        playCustomSound("whoosh");
        playDialog("super");

        $("#dialog_popup").addClass("bounceOutDown animated").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass("bounceOutDown");
            $(this).hide();
        });
    });

    $(".topic").on('click', function () {
        GameObject.currentFilm.topic = $(this).text();
        $("#pick_topic").html(GameObject.currentFilm.topic);

        playCustomSound("whoosh");

        $("#makefilm_topic_popup").hide();
    });

    $(".genre").on('click', function () {
        GameObject.currentFilm.genre = $(this).text();
        $("#pick_genre").html(GameObject.currentFilm.genre);

        playCustomSound("whoosh");

        $("#makefilm_genre_popup").hide();
    });

    $(".pegi").on('click', function () {
        GameObject.currentFilm.pegi = $(this).val();
        $("#pick_pegi").html($(this).html());

        playCustomSound("whoosh");

        $("#makefilm_pegi_popup").hide();
    });

    $("#pick_topic").on('click', function () {
        $("#makefilm_topic_popup").show();
        $("#makefilm_topic_popup").css("z-index", "16777271");
    });

    $("#pick_genre").on('click', function () {
        $("#makefilm_genre_popup").show();
        $("#makefilm_genre_popup").css("z-index", "16777271");
    });

    $("#pick_pegi").on('click', function () {
        $("#makefilm_pegi_popup").show();
        $("#makefilm_pegi_popup").css("z-index", "16777271");
    });

    $("#pick_next").on("click", function () {
        let name = $("#pick_name").val();
        GameObject.currentFilm.name = name;

        if(!isNullOrEmpty(GameObject.currentFilm.name) && !isNullOrEmpty(GameObject.currentFilm.topic) && !isNullOrEmpty(GameObject.currentFilm.genre) && !isNullOrEmpty(GameObject.currentFilm.pegi)){
            $("#makefilm_popup").hide();
            $("#makefilm_step2_popup").show();
            //next
        }
    });

    $(".quality").on('click', function () {
        let quality = $(this).val();
        let qObj = getQuality(quality);

        if(qObj == null){
            return;
        }

        GameObject.currentFilm.quality = qObj;
        $("#film_cost").text("Cost: " + numberWithSpaces(filmPrice()) + "$");
    });
    
    $("#pick_step2_back").on('click', function () {
        $("#makefilm_popup").show();
        $("#makefilm_step2_popup").hide();
    });

    $("#pick_step2_next").on('click', function () {
        $("#makefilm_step2_popup").hide();
    });

    $("#pick_step3_back").on('click', function () {
        $("#makefilm_step2_popup").show();
        $("#makefilm_step3_popup").hide();

    });
})
