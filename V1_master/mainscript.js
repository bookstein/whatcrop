//SEMANTICS
//threshold: defines which random numbers indicate rain and which indicate dry.
//climateChange: makes changes to the threshold at each turn.
//payout: these variables show payout for crop choices.
//crop: all references to actual choices A and B (not seed, not plant)
//




$(document).ready(function(){


//>>>>>>>>>>>> GLOBAL VARIABLES - change game parameters here <<<<<<<<<<<<<<<

	cropchoice = "";
	gameWeather = [];

	// Set number of turns per game
    maxturn = 50;
    endOfGame = false;

	// Set crop payouts using equation Payout = beta(w-w*) + P*
	betaA = -.002;
	betaB = -.001;
	maxApayout = 200; //P*(A)
	maxBpayout = 120; //P*(B)
	maxAweather = 800; //w*(A)
	maxBweather = 400; //w*(B)

	// Manually set climate change by turn, up to maxturn
	climateArray = [
		{mean: 800, std_dev: 75}, //0 -- initial climate
		{mean: 800, std_dev: 75}, //1
		{mean: 800, std_dev: 75}, //2
		{mean: 800, std_dev: 75}, //3
		{mean: 800, std_dev: 75}, //4
		{mean: 800, std_dev: 75}, //5
		{mean: 800, std_dev: 75}, //6
		{mean: 800, std_dev: 75}, //7
		{mean: 800, std_dev: 75}, //8
		{mean: 800, std_dev: 75}, //9
		{mean: 800, std_dev: 75}, //10
		{mean: 700, std_dev: 75}, //11
		{mean: 700, std_dev: 75}, //12
		{mean: 700, std_dev: 75}, //13
		{mean: 700, std_dev: 75}, //14
		{mean: 700, std_dev: 75}, //15
		{mean: 700, std_dev: 75}, //16
		{mean: 700, std_dev: 75}, //17
		{mean: 700, std_dev: 75}, //18
		{mean: 700, std_dev: 75}, //19
		{mean: 700, std_dev: 75}, //20
		{mean: 600, std_dev: 75}, //21
		{mean: 600, std_dev: 75}, //22
		{mean: 600, std_dev: 75}, //23
		{mean: 600, std_dev: 75}, //24
		{mean: 600, std_dev: 75}, //25
		{mean: 600, std_dev: 75}, //26
		{mean: 600, std_dev: 75}, //27
		{mean: 600, std_dev: 75}, //28
		{mean: 600, std_dev: 75}, //29
		{mean: 600, std_dev: 75}, //30
		{mean: 600, std_dev: 75}, //31
		{mean: 600, std_dev: 75}, //32
		{mean: 600, std_dev: 75}, //33
		{mean: 600, std_dev: 75}, //34
		{mean: 600, std_dev: 75}, //35
		{mean: 600, std_dev: 75}, //36
		{mean: 600, std_dev: 75}, //37
		{mean: 600, std_dev: 75}, //38
		{mean: 600, std_dev: 75}, //39
		{mean: 600, std_dev: 75}, //40
		{mean: 600, std_dev: 75}, //41
		{mean: 600, std_dev: 75}, //42
		{mean: 600, std_dev: 75}, //43
		{mean: 600, std_dev: 75}, //44
		{mean: 600, std_dev: 75}, //45
		{mean: 500, std_dev: 75}, //46
		{mean: 400, std_dev: 75}, //47
		{mean: 350, std_dev: 75}, //48
		{mean: 350, std_dev: 75}, //49
		{mean: 300, std_dev: 75}  //50
	];


	// Set bonus payments
	bonusOneDollars = 1.25;
	bonusTwoDollars = 0.75;
	totalRandomPoints = 0;
	totalOptimalPoints = 0;


	//Turn Counter
	turn = 0;
	$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
	GameOver = false;

	//Points Counter

	score = 0; //starting score is 0
	$("#point_count").html("<h5>"+score+"</h5>"); //writes initial score to points counter

	// Real Dollars Earned

	realDollars = 0; //real earnings in dollars start at 0
	$("#dollars_counter").html("$"+realDollars); //writes initial realDollars to dollars counter


// >>>>>>>>>>>>>>>>> GAME SET-UP <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$(function initializeGame () {


	/*function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
		$("table").find("td#payoutAwet").text(payoutAwet + " points");
		$("table").find("td#payoutAdry").text(payoutAdry + " points");
		$("table").find("td#payoutBwet").text(payoutBwet + " points");
		$("table").find("td#payoutBdry").text(payoutBdry + " points");
	};

	writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry);*/



	//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	function makeGameWeather () {
		//Create an array of pairs of random numbers
		var randomPairs = {
			x: undefined,
			y: undefined
		};

		var randomPairArray = [];
		var normalizedArray = [];

		for (var i = 0; i < maxturn; i++) {
			randomPairs = {
				x: Math.random(),
				y: Math.random()
			}
			randomPairArray[i] = randomPairs;
		}

		// Create array of Z0s
		function boxMullerTransformation () {
			for (var i = 0; i < maxturn; i++) {
				normalizedArray[i] = Math.sqrt(-2 * Math.log(randomPairArray[i].x))*Math.cos(2*Math.PI*randomPairArray[i].y);

			//designate cutoffs for high and low values of Z0
				if (normalizedArray[i] >= 5) {
					normalizedArray[i] = 5;
				}

				else if (normalizedArray[i] <= -5) {
					normalizedArray[i] = -5;
				}
			}
		}; //end of boxMullerTransformation

		boxMullerTransformation();

		//Apply climateChange to normalizedArray as mean + Z0 * std_dev

		function applyClimateChange () {
			for (var i = 0; i < maxturn; i++) {
				gameWeather[i] = climateArray[i].mean + (normalizedArray[i]*climateArray[i].std_dev);
			}
		}; //end of applyClimateChange

		applyClimateChange();

		return gameWeather;

	}; // end function makeGameWeather

	makeGameWeather();


	//Populate spans in opening and ending dialogs
/*
	$(".turncount_instructions").text(maxturn + " turns");
	$("#weather_instructions").text((1000-threshold)/1000*100 + "%");
	$("#bonus_one_instructions").text(totalRandomPoints);
	$("#bonus_two_instructions").text(totalOptimalPoints); */

}); //end of initialization function

// >>>>>>>>>>>>>>>>>>>> 2. Game is introduced in a series of dialog boxes. User clicks through. >>>>>>>>>>>>>>>>>>>>

// Open first dialog; keep other dialogs hidden

$(function introDialogs () {

	$( "#first-message" ).dialog({
		autoOpen: true,
		modal: true,
		closeOnEscape: false,
        resizable: false,
        position: 'center',
        stack: true,
        height: 'auto',
        width: '400',
        dialogClass: "no-close",
		buttons: [ { text: "Next",
			click: function() {
				$( this ).dialog( "close" );
				$( "#second-message" ).dialog( "open" );
				$("#givens").addClass("glow");
				$(".ui-widget-overlay").addClass("active-left");
			}
		} ]
	});

	$("#second-message").dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: false,
        resizable: false,
        position: 'center',
        stack: true,
        height: 'auto',
        width: '400',
        dialogClass: "no-close",
		buttons: [ { text: "Next",
			click: function() {
				$( this ).dialog( "close" );
				//$(".ui-widget-overlay").addClass("active-left");
				$( "#third-message" ).dialog( "open" );
				$("#givens").removeClass("glow");
				//$("table").addClass("glow");

			}
		} ]
	});

	$("#third-message").dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: false,
        resizable: false,
        position: 'center',
        stack: true,
        height: 'auto',
        width: '400',
        dialogClass: "no-close",
		buttons: [ { text: "Next",
			click: function() {
				$( this ).dialog( "close" );
				$( "#fourth-message" ).dialog( "open" );
				$("table").removeClass("glow");
				$("#points_bar, #points_flag").toggleClass("glow");
				$(".ui-widget-overlay").removeClass("active-left");
				$(".ui-widget-overlay").addClass("active-right");
			}
		} ]
	});

	$( "#fourth-message" ).dialog({
		autoOpen: false,
		modal: true,
		closeOnEscape: false,
        resizable: false,
        position: 'center',
        stack: true,
        height: 'auto',
        width: '400',
        dialogClass: "no-close",
		buttons: [ { text: "Start Game",
			click: function() {
				$( this ).dialog( "close" );
				$("#points_bar, #points_flag").toggleClass("glow");
				$(".ui-widget-overlay").removeClass("active-right");
			}
		} ]
	});

});


/*function dialogIntroduction () {
	$("#second-message")
		.on("dialogopen", function () {
			$("#givens").toggleClass("glow")});
		})
		.on("dialogclose", function {
			$("#givens table").toggleClass("glow");
	});

	$("#fourth-message").
		.on("dialogopen", function {
			$("#points_bar, #points_flag").toggleClass("glow");
			$(this).on("dialogclose", function {
			$("#points_bar, #points_flag").toggleClass("glow");
			});
	};
};*/

// >>>>>>>>>>>>>>>>>> 3. User chooses crop. Grow button is highlighted. >>>>>>>>>>>>>>



function enableGrowButton () {
	$("#grow")
		.addClass("highlight")
		.removeClass("disabled")
		.val("Grow this crop");
};

function disableGrowButton () {
	$("#grow")
		.removeClass("highlight")
		.addClass("disabled")
		.val("Choose a crop");
};

function userClickedA () {
	$("#cropA").addClass("select");
	cropchoice = "cropA";
	$("#sproutA").removeClass("hidden");
	$("#sproutB").addClass("hidden");
	$("#cropB").removeClass("select");
	//$("#grow").toggleClass("highlight");
	enableGrowButton();
};

function userClickedB () {
	$("#cropB").addClass("select");
	cropchoice = "cropB";
	$("#sproutB").removeClass("hidden");
	$("#sproutA").addClass("hidden");
	$("#cropA").removeClass("select");
	//$("#grow").toggleClass("highlight");
	enableGrowButton();
};


$("#cropA").on("click", userClickedA);

$("#cropB").on("click", userClickedB);


//>>>>>>>>>>>>>>>>>> 4. User clicks "grow" button. Results appear. >>>>>>>>>>>>>>>>>>>>>>>>


function weatherResults () { //triggered by #grow click, runs updateGame with correct arguments

	//Identify weather display labels

	var historicMean = climateArray[0]["mean"]; //uses initial (historic) mean to divide weather into qualitative "Wet" and "Dry"
	var historicStd_Dev = climateArray[0]["std_dev"]; //uses initial (historic) standard deviation to label extremes "Very Wet" and "Very Dry"
	var weatherReport = "";
	var inchesRain = 0;

	disableGrowButton();

	$(".plant, .plant_img, #grow").addClass("hidden").css("opacity", 0);

	function displaySun () { // fadeIn causes the HTML to change to style="display:inline; opacity: 1"
		$("#sun").addClass("displayWeather").removeClass("hidden");
		//alert("This is sun and game weather is "+ gameWeather[turn]);
	};

	function displayRain () {
		$("#rain").addClass("displayWeather").removeClass("hidden");
		//alert("This is rain and game weather is " + gameWeather[turn]);
	};

	// Crop A outcomes
	if (cropchoice === "cropA") {
		updateGame(betaA, maxApayout, maxAweather);

		// if gameWeather is below historic mean, weather is wet
		if (gameWeather[turn] <= historicMean) {

			displayRain();

			if (gameWeather[turn] >= (historicMean - historicStd_Dev)) {
				weatherReport = "wet";
				//display healthy crop A (range of normal)
			}

			else if (gameWeather[turn] < (historicMean - historicStd_Dev)) {
				weatherReport = "very wet";
				//display too-wet crop A ("Very Wet")
			}
		}

		// if gameWeather is above historic mean, weather is dry
		else if (gameWeather[turn] > historicMean) {

			displaySun();

			if (gameWeather[turn] <= (historicMean + historicStd_Dev)) {
				weatherReport = "dry";
				//display healthy crop A (range of normal)
			}

			else if (gameWeather[turn] > (historicMean + historicStd_Dev)) {
				weatherReport = "very dry";
				//display too-dry crop A
			}
		}
	}

	// Crop B outcomes
	else if (cropchoice === "cropB") {
		updateGame(betaB, maxBpayout, maxBweather);

		// if gameWeather is below historic mean, weather is wet
		if (gameWeather[turn] <= historicMean) {

			displayRain();

			if (gameWeather[turn] >= (historicMean - historicStd_Dev)) {
				weatherReport = "wet";
				//display healthy crop B (range of normal)
			}

			else if (gameWeather[turn] < (historicMean - historicStd_Dev)) {
				weatherReport = "very wet";
				//display too-wet crop B ("Very Wet")
			}
		}

		// if gameWeather is above historic mean, weather is dry
		else if (gameWeather[turn] > historicMean) {

			displaySun();

			if (gameWeather[turn] <= (historicMean + historicStd_Dev)) {
				weatherReport = "dry";
				//display healthy crop B (range of normal)
			}

			else if (gameWeather[turn] > (historicMean + historicStd_Dev)) {
				weatherReport = "very dry";
				//display too-dry crop B
			}
		}
	}

}; // end of weatherResults

// >>>>>>>>>>> 5. Game updates and loops back to the beginning of the code >>>>>>>>>>>>>>>>>>>

function updateGame (beta, maxpayout, maxweather) { //this function is called and given arguments inside weatherResults function above

	cropchoice = "";

	function newScore () {
		var payout = 0;

		function animatePoints () {
			//$("#points_bar").toggleClass("glow");

			$("#points_bar").animate({ boxShadow : "0 0 15px 10px #ffcc33" });
			setTimeout(function () {$("#points_bar").animate({boxShadow : "0 0 0 0 #fff" })}, 3500);
			//$(".glow").css({ "-webkit-box-shadow, -moz-box-shadow, box-shadow" }).animate()
  		};

  		function calculatePayout () { //Calculate yield and points based on gameWeather and cropchoice
			payout = beta * Math.pow((gameWeather[turn] - maxweather), 2) + maxpayout;

			if (payout <= 0) {
				payout = 0;
			}

			else {
				payout = parseInt(payout);
			}

			return payout;
		};
//Restore this function once maxScore has been calculated for BoxMuller version

		/*
		function movePointsFlag () { //increase height of #points_flag using absolute positioning
			//Height of #points_bar as an integer, as defined by its CSS rule (in pixels)
			var pixelHeight = parseInt($("#points_bar").css("height"));

			//Ratio of points per pixel
			var pointsPerPixelRatio = maxScore/pixelHeight; //use maxScore for now

			//Points_counter moves upward this number of pixels per turn
			var perTurnHeight = payout/pointsPerPixelRatio;

			//Current CSS position for #points_flag "bottom" as an integer
			var flagHeight = parseInt($("#points_flag").css("bottom"));

			//Current CSS height of #points_fill with "height" as an integer
			var fillHeight = parseInt($("#points_fill").css("height"));

			flagHeight+=perTurnHeight;
			fillHeight+=perTurnHeight;

			$("#points_flag").css("bottom", flagHeight); // Sets value of style rule "bottom" to flagHeight
			//return flagHeight;

			//increase height of yellow #points_fill
			$("#points_fill").css("height", fillHeight); // Sets value of style rule "bottom" to flagHeight
			//return fillHeight;


			//carve up post-second-bonus pixels into fixed amount between this turn and last turn
		}; */

		/*
		animatePoints();
		movePointsFlag();*/



	/*	// WARNING: .css modifies the element's <style> property, not the CSS sheet!

	//updates dollars counter if bonus is reached. These functions are called from displayResultsDialog above
	function addBonus1 () {
		realDollars = bonusOneDollars; //change value of realDollars to bonusOne
		$("#dollars_counter").html("$"+realDollars);
	};

	function addBonus2 () {
		realDollars = bonusOneDollars + bonusTwoDollars;
		$("#dollars_counter").html("$"+realDollars); //change value of realDollars to combined value of bonuses
	};

	*/

		calculatePayout();
		animatePoints();

		score += payout;
		$("#point_count").html("<h5>" + score + "</h5>");
		return score; //this updates the value of the global variable "score"

	}; //end of function newScore

	newScore();

	function displayResultsDialog () {

		$(".results").dialog({
			autoOpen: false,
			modal: false,
			closeOnEscape: false,
			dialogClass: "no-close",
	        resizable: false,
	        draggable: false,
	        position: 'center',
	        stack: false,
	        height: 'auto',
	        width: 'auto'
	    });

//restore this code when bonuses are calculated

/*
		//populate spans inside all results dialogs
	    $(".results").find("#weather_outcome").text(gameWeather[turn]);
	    $(".results").find("#new_score").text(payout);

		// bonus dialogs
		if (oldscore < totalRandomPoints && newscore >= totalRandomPoints) { //this only works now because I made totalRandomPoints global
			$("#bonus_results").dialog("open");
			$("#bonus_count").text("$" + bonusOneDollars);
			addBonus1();
		}

		else if (oldscore < totalOptimalPoints && newscore >= totalOptimalPoints) {
			$("#bonus_results").dialog("open");
			$("#bonus_count").text("$" + bonusTwoDollars);
			addBonus2();
		}

		//end game dialog
		else if (turn === maxturn) {
			$("#end_results").dialog("open");
			$("#total_score").text($("#point_count > h5").text()); //gets text of #point_count h5
			$("#total_dollars").text($("#dollars_counter").text()); //gets text of #dollars_counter
			// $("#playerID") //need Tony's work on this
		}

		//normal results dialogs
		else {
			$("#normal_results").dialog("open");
		}

		setTimeout(function() {$( ".results" ).dialog( "close" )}, 3000); */

	};

	displayResultsDialog();

	function fadeWeather () {
		//setTimeout calls function after a certain time; currently 3000 ms
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden");
	   	$(".croprows").addClass("hidden");
	   	$(".plant").removeClass("select");
	   	$(".plant, .plant_img, #grow").removeClass("hidden").animate({opacity: 1}, 1000);
	   	cropchoice = ""; // resets value of cropchoice to ""
	};

	function addTurn () {
		turn = turn + 1;
		$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
		//setTimeout(assignTurnWeather, 100); //runs function assignTurnWeather with new turn value
		//alert("gameWeather is now " + gameWeather[turn] + " because it is turn #" + turn);
	};


		setTimeout(fadeWeather, 4000);
		setTimeout(addTurn, 4000);

		//Moved these variables inside newScore function because they only matter for bonus thresholds being crossed
	//var oldscore = score;
	//var newscore = oldscore + payout;

}; // End of updateGame function

function endGame () { //call end-of-game dialog box
	endOfGame = true;
	return endOfGame;
	$("button #grow").addClass("hidden");
	//inclusive of last turn (50)
};

//>>>>>>>>>>>>>>>>>>>>> Clicking #grow button triggers updateGame <<<<<<<<<<<<<

$("#grow").on("click", function () {
	if (($(this).hasClass("highlight"))&& turn<maxturn) {
		// hide crop sprout graphics
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		//call displayWeather function
		//displayWeather();
		//callsback updateGame function 200ms after displayWeather
		setTimeout(weatherResults, 400);
	}

		else if (($(this).hasClass("highlight")) && turns === maxturn) {

		//summon end-of-game dialog instead of update
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		//call displayWeather function
		//displayWeather();
		//callsback updateGame function 200ms after displayWeather
		setTimeout(weatherResults, 400);
		setTimeout(endGame, 1000);
	}

});

//For Fran: test functionality of game in advance

function test (testValue) {
	if (testValue == null) {
		console.log("Enter climateArray or indifferencePoint to see the value of the variable");
	}

	else if (testValue == climateArray) {
		climateChange();
		return climateArray;
	}

	else if (testValue == indifferencePoint) {
		calculateIndifferencePoint();
		return indifferencePoint;
	}
};

}); //End of .ready ()


