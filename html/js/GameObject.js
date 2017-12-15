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
		published: false,
		quality:{},
		actors:[],
		stats:{
            special_effect: 0,
            dialog: 0,
            dubbling: 0,
            image: 0,
            sound: 0,
            script: 0
		}
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