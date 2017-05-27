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

	var p1WinsSpan = $("#player1 > .wins");
	var p2WinsSpan = $("#player2 > .wins");
	var tiesSpan = $("#ties");

	var database = firebase.database();

	// FUNCTIONS

	function updateScores() {
		p1WinsSpan.text(p1Wins);
		p2WinsSpan.text(p2Wins);
		tiesSpan.text(ties);
	}

	function loadGame() {

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

		updateScores();
	}

	// EVENT LISTENERS

	$("button").on("click", function() {

	});

	database.ref().on('value', function(snapshot) {
		console.log(snapshot.val());
	});
});

