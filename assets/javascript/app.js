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

	function rps(selection1, selection2) {

		// check which player wins
		if(selection1 === selection2) {
			ties++;
			$("#status").text("It's a tie!");
		} else if(selection1 === "r") {
			if(selection2 === "p") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
			}
			else if(selection2 === "s") {
				p1Wins++;
				$("#status").text("Player 1 wins!");
			}
		} else if(selection1 === "p") {
			if(selection2 === "r") {
				p1Wins++;
				$("#status").text("Player 1 wins!");
			}
			else if(selection2 === "s") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
			}
		} else if(selection1 === "s") {
			if(selection2 === "r") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
			}
			else if(selection2 === "p") {
				p1Wins++;
				$("#status").text("Player 1 wins!");
			}
		}

		database.ref().update({
			p1Wins: p1Wins,
			p2Wins: p2Wins,
			ties: ties
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
					ties:0
				});

				$("#player1 .player-select").show();
				$("#player1 .score").show();
				$("#player2 selection").addClass("disabled");
			} else if (player === "2" && !p2Online) {
				thisPlayer = player;

				database.ref().set({
					p2Online: true,
					p2Wins:0
				});

				$("#player2 .player-select").show();
				$("#player2 .score").show();
				$("#player1 selection").addClass("disabled");
			}

			$(this).hide();
			$(".join").addClass("disabled");
		}	
	});

	$(".leave").on("click", function() {
		// clears all game data when either player leaves the game
		database.ref().remove();

		p1Selection = "";
		p1Wins = 0;

		p2Selection = "";
		p2Wins = 0;

		ties = 0;

		thisPlayer = "";

		p1Online = false;
		p2Online = false;

		$("#status").text("Game over! Click join to start a new game!");
		$(".join").show().removeClass("disabled");
		$(".selection").removeClass("disabled");
		$(".player-select").hide();
	});

	database.ref().on('value', function(snapshot) {
		console.log(snapshot.val());

		var data = snapshot.val();

		if(data !== null) {
			p1Online = data.p1Online;
			p1Wins = data.p1Wins;
			p2Online = data.p2Online;
			p2Wins = data.p2Wins;
			ties = data.ties;
		}

		if(p1Online && thisPlayer === "1") {
			$("#player1 .join").hide();
			$(".join").addClass("disabled");
			$("#player1 .player-select").show();
			$("#player1 .score").show();
		}

		if(p2Online && thisPlayer === "2") {
			$("#player2 .join").hide();
			$(".join").addClass("disabled");
			$("#player2 .player-select").show();
			$("#player2 .score").show();
		}

		updateScores();

		if(p1Online && p2Online) {
			$(".score").show();
		}
	});

	loadGame();
});

