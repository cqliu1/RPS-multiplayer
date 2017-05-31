// Initialize Firebase
var config = {
	apiKey: "AIzaSyBDOEAjrjfqTFbXKtSQKY5YEZRBYpiXJtI",
	authDomain: "rps-multiplayer-8a132.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-8a132.firebaseio.com",
	projectId: "rps-multiplayer-8a132",
	storageBucket: "rps-multiplayer-8a132.appspot.com",
	messagingSenderId: "200982420553"
};
firebase.initializeApp(config);

$(document).ready(function(){
	// VARIABLES
	var p1Selection = "";
	var p1Wins = 0;

	var p2Selection = "";
	var p2Wins = 0;

	var ties = 0;

	var thisPlayer = "";

	var status = "";

	var p1WinsSpan = $("#player1 .wins");
	var p2WinsSpan = $("#player2 .wins");
	var tiesSpan = $("#ties");

	var database = firebase.database();

	var p1Online = false;
	var p2Online = false;

	// FUNCTIONS

	function updateScores() {
		p1WinsSpan.text(p1Wins);
		p2WinsSpan.text(p2Wins);
		tiesSpan.text(ties);
	}

	function loadGame() {

		// hide at start of game
		$(".player-select").hide();
		$(".score").hide();
		updateScores();
	}

	function resetGame() {
		p1Selection = "";
		p1Wins = 0;

		p2Selection = "";
		p2Wins = 0;

		ties = 0;

		thisPlayer = "";

		p1Online = false;
		p2Online = false;

		database.ref().update({
			status: "Click join to start a new game!"
		});
		$(".join").show().removeClass("disabled");
		$(".selection").removeClass("disabled");
		$(".player-select").hide();
	}

	function rps(selection1, selection2) {

		// check which player wins
		if(selection1 === selection2) {
			ties++;
			$("#status").text("It's a tie!");
		} else if(selection1 === "r") {
			if(selection2 === "p") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
				database.ref().update({
					p2Wins: p2Wins,
					status: "Player 2 wins!"
				});
			}
			else if(selection2 === "s") {
				p1Wins++;
				database.ref().update({
					p1Wins: p1Wins,
					status: "Player 1 wins!"
				});
			}
		} else if(selection1 === "p") {
			if(selection2 === "r") {
				p1Wins++;
				database.ref().update({
					p1Wins: p1Wins,
					status: "Player 1 wins!"
				});
			}
			else if(selection2 === "s") {
				p2Wins++;
				database.ref().update({
					p2Wins: p2Wins,
					status: "Player 2 wins!"
				});
			}
		} else if(selection1 === "s") {
			if(selection2 === "r") {
				p2Wins++;
				database.ref().update({
					p2Wins: p2Wins,
					status: "Player 2 wins!"
				});
			}
			else if(selection2 === "p") {
				p1Wins++;
				database.ref().update({
					p1Wins: p1Wins,
					status: "Player 1 wins!"
				});
			}
		}

		database.ref().update({
			p1Wins: p1Wins,
			p2Wins: p2Wins,
			ties: ties,
			p1Selection: "",
			p2Selection: ""
		});
	}

	// EVENT LISTENERS

	$(".selection").on("click", function() {
		if(!$(this).hasClass("disabled")) {

		}
	});

	$(".join").on("click",function() {
		if(!$(this).hasClass("disabled")) {
			var player = $(this).attr("data-player");
			console.log(player);

			if(player === "1" && !p1Online) {
				thisPlayer = player;

				database.ref().set({
					p1Online: true,
					p1Wins:0,
					p1Selection:"",
					ties:0
				});

				$("#player1 .player-select").show();
				$("#player1 .score").show();
				$("#player2 selection").addClass("disabled");
			} else if (player === "2" && !p2Online) {
				thisPlayer = player;

				database.ref().set({
					p2Online: true,
					p2Wins:0,
					p1Selection:""
				});

				$("#player2 .player-select").show();
				$("#player2 .score").show();
				$("#player1 selection").addClass("disabled");
			}

			$(this).hide();
			$(".join").addClass("disabled");
		}	
	});

	// // when player leaves the page
	// $(window).on("unload", function() {
	// 	// clears all game data when either player leaves the game
	// 	database.ref().remove();

	// 	resetGame();
	// });

	database.ref().on('value', function(snapshot) {
		console.log(snapshot.val());

		var data = snapshot.val();

		if(data !== null) {
			p1Online = data.p1Online;
			p1Wins = data.p1Wins;
			p2Online = data.p2Online;
			p2Wins = data.p2Wins;
			ties = data.ties;
			status = data.status;
			p1Selection = data.p1Selection;
			p2Selection = data.p2Selection;
		}

		console.log("selections:",p1Selection,p2Selection);

		if(p1Selection !== undefined && p2Selection !== undefined && p1Selection !== "" && p2Selection !== "") {
			rps(p1Selection,p2Selection);
		}

		if(p1Online) {
			console.log("player 1 exists");
			$("#player1 .join").hide();
			$("#player1 .player-select").show();
			$("#player1 .score").show();

			if(thisPlayer === "1"){
				$(".join").addClass("disabled");
			} else {
				$("#player1 .selection").addClass("disabled");
			}
		}

		if(p2Online) {
			console.log("player 2 exists");
			$("#player2 .join").hide();
			$("#player2 .player-select").show();
			$("#player2 .score").show();

			if(thisPlayer === "2"){
				$(".join").addClass("disabled");
			} else {
				$("#player2 .selection").addClass("disabled");
			}
		}

		updateScores();
		$("#status").text(status);

		if(p1Online && p2Online) {
			$(".score").show();
		} else {
			resetGame();
		}
	});

	loadGame();
});

