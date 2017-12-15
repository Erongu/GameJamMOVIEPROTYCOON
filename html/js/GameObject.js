var GameObject = {
	player_name: "",
	company_name: "",
	lose: false,
	money: 0,
	date: new Date(),
	isNewGame: true,
	currentFilm:{
		name: "",
		topic: "",
		genre: "",
		public: "",
		quality:{},
		actors:[],
		stats:{
            special_effect: 0,
            dialog: 0,
            dubbing: 0,
            image: 0,
            sound: 0,
            script: 0
		}
	},
	publishedMovie:{
		name: "",
		topic: "",
		genre: "",
		release_date: {},
		entries: 0,
		today_entries_average: 0,
		profit_day: 0,
		average_mark: "",
		dayPassed: 0,
		published: false
	}
};

function filmPrice() {
	let priceActors = 0;

	if(GameObject.currentFilm.actors != null) {
        GameObject.currentFilm.actors.forEach(function (actor) {
            priceActors += actor.price;
        })
    }

	return GameObject.currentFilm.quality.price + priceActors;
}

function Publish_Movie() {
	console.log(GameObject.currentFilm);

    GameObject.publishedMovie = {};

	GameObject.publishedMovie.name = GameObject.currentFilm.name;
    GameObject.publishedMovie.topic = GameObject.currentFilm.topic;
    GameObject.publishedMovie.genre = GameObject.currentFilm.genre;
    GameObject.publishedMovie.release_date = GameObject.date;
    GameObject.publishedMovie.entries = 0;
    GameObject.publishedMovie.dayPassed = 0;
    GameObject.publishedMovie.average_mark = getMark();
	GameObject.publishedMovie.published = true;

    switch(GameObject.publishedMovie.average_mark){
		case 5:
            GameObject.publishedMovie.today_entries_average = 10000;
			break;
        case 4:
            GameObject.publishedMovie.today_entries_average = 5000;
            break;
        case 3:
            GameObject.publishedMovie.today_entries_average = 1000;
            break;
        case 2:
            GameObject.publishedMovie.today_entries_average = 500;
            break;
        case 1:
            GameObject.publishedMovie.today_entries_average = 100;
            break;
	}

    GameObject.publishedMovie.today_entries_average = parseInt(GameObject.publishedMovie.today_entries_average * 0.75);

    let max = parseInt(GameObject.publishedMovie.today_entries_average * 0.30);
    let min = parseInt(GameObject.publishedMovie.today_entries_average * 0.20);

    GameObject.publishedMovie.profit_day = getRandomInt(min, max);

	$(".lastGame_stats").show();

	$("#currentMovie_name").text(GameObject.publishedMovie.name);
    $("#currentMovie_genre").text(GameObject.publishedMovie.genre);
    $("#currentMovie_topic").text(GameObject.publishedMovie.topic);
    $("#currentMovie_date").text(formatDate(GameObject.publishedMovie.release_date));

    for(var i = 0; i < GameObject.publishedMovie.average_mark; i++){
    	$("#currentMovie_mark").append("<i class=\"fa fa-star\" aria-hidden=\"true\"></i>");
	}
}

function getMark() {
    var topic = getTopicByName(GameObject.publishedMovie.topic);
    var genre = getGenreByName(GameObject.publishedMovie.genre);
    var scoreSymbiose = getScoreSymbioseByGenre(topic, genre.uid).coef * 100 * 2;

    var quality = GameObject.currentFilm.quality;
	var mark = 1;

    var score = 0;

	score += quality.score;

    if(GameObject.currentFilm.actors != null) {
        GameObject.currentFilm.actors.forEach(function (actor) {
            var scoreActor = actor.score;
            if (genre.uid == actor.speciality) {
                scoreActor = scoreActor * 1.25;
            }
            score += scoreActor;
        });
    }

	score += scoreSymbiose;

	var totalStats = (GameObject.currentFilm.stats.special_effect + GameObject.currentFilm.stats.dialog + GameObject.currentFilm.stats.dubbing);

	var specialEffectScore = GameObject.currentFilm.stats.special_effect / totalStats * 100;
    var dialogScore = GameObject.currentFilm.stats.dialog / totalStats * 100;
    var dubbingScore = GameObject.currentFilm.stats.dubbing / totalStats * 100;

	score += specialEffectScore;
	score += dialogScore;
	score += dubbingScore;


    var totalStats2 = (GameObject.currentFilm.stats.image + GameObject.currentFilm.stats.script + GameObject.currentFilm.stats.sound);

    var imageScore = GameObject.currentFilm.stats.image / totalStats2 * 100;
    var scriptScore = GameObject.currentFilm.stats.script / totalStats2 * 100;
    var soundScore = GameObject.currentFilm.stats.sound / totalStats2 * 100;

    score += imageScore;
    score += scriptScore;
    score += soundScore;


    score = parseInt(score / 1.5);

    console.log(score);

    if(score > 150){
        mark = 5;
    }
    else if(score > 130 && score < 150){
    	mark = 4;
	}
    else if(score > 100 && score < 130){
        mark = 3;
	}
	else if(score > 80 && score < 100){
        mark = 2;
    }
    else if(score < 80){
        mark = 1;
    }

    return mark;
}