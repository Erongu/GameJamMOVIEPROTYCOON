var loginSocket;
var gameSocket;

$(function () {
	$('#connect_login').click(function (){
		let username = $("#user").val();
		let password = $("#password").val();
		loginSocket.send("LOGIN|" + username + "," + password);
	});
	
	setInterval(Update, 1000);
});

function Update(){
	/*$("#serverName").html('<a></i><strong>Serveur</strong>: ' + PlayedCharacterManager.serveur + '</a>');
	$("#characterName").html('<a></i><strong>Personnage</strong>: ' + PlayedCharacterManager.name + '</a>');
	$("#characterKamas").html('<a></i><strong>Kamas</strong>: ' + PlayedCharacterManager.kamas + '</a>');
	$("#characterLevel").html('<a></i><strong>Level</strong>: ' + PlayedCharacterManager.level + '</a>');
	$("#characterMap").html('<a></i><strong>Map</strong>: ' + PlayedCharacterManager.map + '</a>');
	$("#botStatut").html('<a></i><strong>Statut</strong>: ' + PlayedCharacterManager.statut + '</a>');*/
}

function Connect(){
	loginSocket = new WebSocket("ws://localhost:666/Login");

	loginSocket.onopen = function () {
		ChangeSocketStatut(true);
		loginSocket.send("CONNECTED");
	};

	loginSocket.onmessage = function (evt) {
		var received_msg = evt.data;
		
		console.log("received: " + received_msg);

		switch(received_msg.substring(0, 10)){
			case "READY_CONN":
				$("#login_popup").css("display", "block");
				$('#login_popup').addClass('fadeInDown animated');
				break;
			case "SERV_AVBLE":
				CloseAllTabs();
				
				$("#servers_popup").css("display", "block");
				let data = received_msg.split('|')[1];
				let servers = data.split(';');
								
				let newHtml = "<ul>";
				
				for(let i = 0; i < servers.length; i++){
					let serverId = servers[i].split(',')[0];
					let character = servers[i].split(',')[1];
					let name = servers[i].split(',')[2];

					let imageId = serverId > 50 ? 50 : serverId;
					newHtml += '<li><a onclick="SelectServer(' + serverId + ');" ><div class="server" style="background-image: url(images/gfx/illu_servers/server_IlluNormal_' + imageId + '.png);"><strong class="server_name">' + name + '</strong><div class="population">' + character +' / 5</div></div></a></li>';
				}
				
				newHtml += "</ul>";
				let width = (217.5 * servers.length) + "px";
								
				$("#servers_popup").css({"min-width": width});
				$("#servers_popup").css({"width": width});
				
				$("#servers_available").html(newHtml);
				break;
		}
	};

	loginSocket.onclose = function () {
		ChangeBotStatut("Non connecté");
		ChangeSocketStatut(false);
		
		CloseAllTabs();

		setTimeout(function(){Connect()}, 1000);

	};

}

function LogManager(){
	var logManager = new WebSocket("ws://localhost:666/Logs");

	logManager.onopen = function () {
		$("#logs").html("");
		$("#logs").append("<p class='green'>Connected to WebSocket.</p>");
	};

	logManager.onmessage = function (evt) {

		var received_msg = evt.data;
				
		console.log("received: " + received_msg);

		var classes = "";
		
		if (received_msg.substring(0, 8) == "Message>") {
			classes += "pink ";
		}
		
		if (received_msg.substring(0, 3) == "RCV") {
			classes += "aqua ";
			
			let message = received_msg.substring(6);
			Dispatch(message);
			
		}
		if (received_msg.substring(0, 3) == "SND") {
			classes += "yellow ";
			
			let message = received_msg.substring(6);
			Dispatch(message);
		}

		received_msg = received_msg.replace("(","<strong>(");
		received_msg = received_msg.replace(")",")</strong>");
		
		$("#logs").append("<br><p class='"+classes+"'>"+received_msg+"</p>");
	};

	logManager.onclose = function () {
	//	$("#socketStatut").html('<a><i class="fa fa-wifi socket-status-offline"> </i><strong>Socket Statut</strong> <span> = Disconnected</span></a>');
		setTimeout(function(){LogManager()}, 1000);
	};
}

function GameConnection(){
	gameSocket = new WebSocket("ws://localhost:4096/Game");

	gameSocket.onopen = function () {
		ChangeSocketStatut(true);
	};

	gameSocket.onmessage = function (evt) {
		var received_msg = evt.data;
		
		console.log("received: " + received_msg);

		switch(received_msg.substring(0, 5)){

		}
	};

	gameSocket.onclose = function () {
		ChangeBotStatut("Non connecté");
		ChangeSocketStatut(false);
		
		CloseAllTabs();
		
		setTimeout(function(){GameConnection()}, 1000);

	};
	
}

function CloseAllTabs(){
	//$("#login_popup").css("display", "none");
	//$("#servers_popup").css("display", "none");
	//$("#characters_popup").css("display", "none");
}


function ChangeBotStatut(statut){
	CurrentUser.statut = statut;
}

function ChangeSocketStatut(online){
	if(online){
		$("#socketStatut").html('<a><i class="fa fa-wifi socket-status-online"> </i><strong>Socket Statut</strong> <span> = Connected</span></a>');
	}else{
		$("#socketStatut").html('<a><i class="fa fa-wifi socket-status-offline"> </i><strong>Socket Statut</strong> <span> = Disconnected</span></a>');
	}
}

function SelectServer(serverId){
	loginSocket.send("SLECT|" + serverId);
}

function SelectCharacter(characterId){
	loginSocket.send("CSLCT|" + characterId);
}

Connect();
GameConnection();
LogManager();