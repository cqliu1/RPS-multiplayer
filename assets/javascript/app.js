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

	var thisPlayer = localStorage.getItem("player");

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
		localStorage.removeItem("player");

		p1Online = false;
		p2Online = false;

		$("#status").text("Click join to start a new game!");

		$(".join").show().removeClass("disabled");
		$(".selection").removeClass("disabled");
		$(".player-select").hide();
		$(".score").hide();

		$("#p1-selection").html("");
		$("#p2-selection").html("");	
	}

	function rps(selection1, selection2) {

		$("#p1-selection").html("<img class='selected' src='assets/images/"+selection1+"-left.png'>");
		$("#p2-selection").html("<img class='selected' src='assets/images/"+selection2+"-right.png'>");

		// check which player wins
		if(selection1 === selection2) {
			ties++;
			$("#status").text("It's a tie!");
		} else if(selection1 === "rock") {
			if(selection2 === "paper") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
			}
			else if(selection2 === "scissors") {
				p1Wins++;
				$("#status").text("Player 1 wins!");
			}
		} else if(selection1 === "paper") {
			if(selection2 === "rock") {
				p1Wins++;
				$("#status").text("Player 1 wins!");
			}
			else if(selection2 === "scissors") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
			}
		} else if(selection1 === "scissors") {
			if(selection2 === "rock") {
				p2Wins++;
				$("#status").text("Player 2 wins!");
			}
			else if(selection2 === "paper") {
				p1Wins++;
				$("#status").text("Player 1 wins!");
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

			var selection = $(this).attr("data-selection");
			console.log("Player chose ",selection);

			if(thisPlayer === "1") {
				$("#p1-selection").html("<img class='selected' src='assets/images/question.png'>");

				database.ref().update({
					p1Selection: selection,
					p1NewSelection: true
				});

				
			} else if(thisPlayer === "2") {
				$("#p2-selection").html("<img class='selected' src='assets/images/question.png'>");

				database.ref().update({
					p2Selection: selection,
					p2NewSelection: true
				});
			}
		}
	});

	$(".join").on("click",function() {
		if(!$(this).hasClass("disabled")) {
			var player = $(this).attr("data-player");
			console.log(player);

			if(player === "1" && !p1Online) {
				thisPlayer = player;

				database.ref().update({
					p1Online: true,
					p1Wins:0,
					p1Selection:"",
					ties:0
				});

				localStorage.setItem("player","1");

				$("#player1 .player-select").show();
				$("#player1 .score").show();
				$("#player2 .selection").addClass("disabled");
			} else if (player === "2" && !p2Online) {
				thisPlayer = player;

				database.ref().update({
					p2Online: true,
					p2Wins:0,
					p1Selection:""
				});

				$("#player2 .player-select").show();
				$("#player2 .score").show();
				$("#player1 .selection").addClass("disabled");

				localStorage.setItem("player","1");
			}

			$(this).hide();
			$(".join").addClass("disabled");
		}	
	});

	// when player leaves the page
	$(window).on("unload", function() {
		// clears all game data when either player leaves the game
		database.ref().remove();
	});

	database.ref().on('value', function(snapshot) {
		console.log(snapshot.val());

		var data = snapshot.val();

		if(data !== null) {
			p1Online = data.p1Online;
			p1Wins = parseInt(data.p1Wins);
			p2Online = data.p2Online;
			p2Wins = parseInt(data.p2Wins);
			ties = parseInt(data.ties);
			p1Selection = data.p1Selection;
			p2Selection = data.p2Selection;
		} 
		else {
			resetGame();
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

		if(p1Online && p2Online) {
			$(".score").show();
		}
	});

	loadGame();
});

