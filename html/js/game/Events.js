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
        GameObject.money = 0;

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

        $("#dialog_popup").hide();

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
        let topic = $("#pick_topic").text();
        let genre = $("#pick_genre").text();
        let pegi = $("#pick_pegi").text();

        if(name.indexOf("Pick") == -1) {
            GameObject.currentFilm.name = name;
        }
        if(topic.indexOf("Pick") == -1) {
            GameObject.currentFilm.topic = topic;
        }
        if(genre.indexOf("Pick") == -1) {
            GameObject.currentFilm.genre = genre;
        }
        if(pegi.indexOf("Pick") == -1) {
            GameObject.currentFilm.pegi = pegi;
        }

        if(!isNullOrEmpty(GameObject.currentFilm.name) && !isNullOrEmpty(GameObject.currentFilm.topic) && !isNullOrEmpty(GameObject.currentFilm.genre) && !isNullOrEmpty(GameObject.currentFilm.pegi)){
            $("#makefilm_popup").hide();
            $("#makefilm_step2_popup").show();
            //next
        }
        updatePrice();
    });

    $(".quality").on('click', function () {
        let quality = $(this).val();
        let qObj = getQuality(quality);

        if(qObj == null){
            return;
        }

        GameObject.currentFilm.quality = qObj;

        updatePrice();
    });
    
    $("#pick_step2_back").on('click', function () {
        $("#makefilm_popup").show();
        $("#makefilm_step2_popup").hide();

        updatePrice();
    });

    $("#pick_step2_next").on('click', function () {
        if($("#selectableQualities > .ui-selected").length > 0) {
            let quality = $("#selectableQualities > .ui-selected").val();
            let qObj = getQuality(quality);

            if (qObj == null) {
                return;
            }

            GameObject.currentFilm.quality = qObj;

            $("#makefilm_step2_popup").hide();
            $("#makefilm_step3_popup").show();

            updatePrice();
        }
    });

    $("#pick_step3_back").on('click', function () {
        $("#makefilm_step2_popup").show();
        $("#makefilm_step3_popup").hide();

        updatePrice();
    });

    $(".actors").on('click', function () {
        console.log("test");

        GameObject.currentFilm.actors = [];

        $("#selectableActors > .ui-selected").each(function( index ) {
            let actorId = $(this).val();
            let aObj = getActor(actorId);

            if(aObj == null || aObj == -1){
                return;
            }

            GameObject.currentFilm.actors.push(aObj);
        });

        updatePrice();
    });

    $("#pick_step3_next").on('click', function () {
        $("#makefilm_step3_popup").hide();
        $("#makefilm_step4_popup").show();

        updatePrice();
    });
    
    $("#pick_step4_back").on('click', function () {
        $("#makefilm_step3_popup").show();
        $("#makefilm_step4_popup").hide();

        updatePrice();
    });

    $("#special_effects_slider").on('input', function () {
       $("#special_effects_value").text($(this).val());
    });

    $("#dialog_slider").on('input', function () {
        $("#dialog_value").text($(this).val());
    });

    $("#dubbing_slider").on('input', function () {
        $("#dubbing_value").text($(this).val());
    });

    $("#pick_step4_next").on('click', function () {
        $("#makefilm_step4_popup").hide();
        $("#makefilm_step5_popup").show();

        GameObject.currentFilm.stats = {};

        GameObject.currentFilm.stats.special_effect = $("#special_effects_slider").val();
        GameObject.currentFilm.stats.dialog = $("#dialog_slider").val();
        GameObject.currentFilm.stats.dubbing = $("#dubbing_slider").val();

        updatePrice();
    });

    $("#pick_step5_back").on('click', function () {
        $("#makefilm_step5_popup").hide();
        $("#makefilm_step4_popup").show();

        updatePrice();
    });

    $("#pick_step5_next").on('click', function () {
        GameObject.currentFilm.stats.image = $("#image_slider").val();
        GameObject.currentFilm.stats.script = $("#script_slider").val();
        GameObject.currentFilm.stats.sound = $("#sound_slider").val();

        if(filmPrice() <= GameObject.money){
            GameObject.money -= filmPrice();
            updatePrice();
            $("#makefilm_step5_popup").hide();
            openDialog_data(Dialogs[1]);
            Publish_Movie();
        }
    });

    $("#image_slider").on('input', function () {
        $("#image_value").text($(this).val());
    });

    $("#sound_slider").on('input', function () {
        $("#sound_value").text($(this).val());
    });

    $("#script_slider").on('input', function () {
        $("#script_value").text($(this).val());
    });
})
