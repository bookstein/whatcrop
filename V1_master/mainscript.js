//SEMANTICS
//threshold: defines which random numbers indicate rain and which indicate dry.
//climateChange: makes changes to the threshold at each turn.
//payout: these variables show payout for crop choices.
//crop: all references to actual choices A and B (not seed, not plant)
//




$(document).ready(function(){


//>>>>>>>>>>>> GLOBAL VARIABLES - change game parameters here <<<<<<<<<<<<<<<

	cropchoice = "";

	// Set number of turns per game
    maxturn = 50;
    endOfGame = false;

	// Set crop payouts
	payoutAwet = 70;
	payoutAdry = 80;
	payoutBwet = 100;
	payoutBdry = 50;

	// Set rain threshold
	threshold = 600; //formerly named "rainchance" -- threshold probability for rain.

	// Set bonus payments
	bonusOneDollars = 1.25;
	bonusTwoDollars = 075;


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
	// Crop Information table

	function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
		$("table").find("td#payoutAwet").text(payoutAwet + " points");
		$("table").find("td#payoutAdry").text(payoutAdry + " points");
		$("table").find("td#payoutBwet").text(payoutBwet + " points");
		$("table").find("td#payoutBdry").text(payoutBdry + " points");
	};

	writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry);



	//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	// Set climate change, either using "for loop" or manually; choose using autoFillClimateChange variable

	function climateChange () {

		var autoFillClimateChange = true; //If true, the "for loop" below will autofill the value of climateChange inside climateArray.
										//If false, then manually enter the climate change values you wish to use below under "else".
		climateArray = [];
		manualClimateArray = [];

		if (autoFillClimateChange == true) {


			for (var i =0; i < maxturn; i++) {

			climateArray[i]=10; //<<<<<<<<<<<<<<<<<<< change this value to alter climate change.
			}

			return climateArray; //assigns value of climateArray to function climateChange
		}

		else {
			manualClimateArray[0] = 5;
			manualClimateArray[1] = 5;
			manualClimateArray[2] = 5;
			manualClimateArray[3] = 5;
			manualClimateArray[4] = 5;
			manualClimateArray[5] = 5;
			manualClimateArray[6] = 5;
			manualClimateArray[7] = 5;
			manualClimateArray[8] = 5;
			manualClimateArray[9] = 5;
			manualClimateArray[10] = 5;
			manualClimateArray[11] = 5;
			manualClimateArray[12] = 7;
			manualClimateArray[13] = 7;
			manualClimateArray[14] = 7;
			manualClimateArray[15] = 7;
			manualClimateArray[16] = 7;
			manualClimateArray[17] = 10;
			manualClimateArray[18] = 10;
			manualClimateArray[19] = 10;
			manualClimateArray[20] = 10;
			manualClimateArray[21] = 10;
			manualClimateArray[22] = 10;
			manualClimateArray[23] = 10;
			manualClimateArray[24] = 5;
			manualClimateArray[25] = 5;
			manualClimateArray[26] = 5;
			manualClimateArray[27] = 5;
			manualClimateArray[28] = 5;
			manualClimateArray[29] = 5;
			manualClimateArray[30] = 5;
			manualClimateArray[31] = 5;
			manualClimateArray[32] = 5;
			manualClimateArray[33] = 5;
			manualClimateArray[34] = 5;
			manualClimateArray[35] = 5;
			manualClimateArray[36] = 5;
			manualClimateArray[37] = 5;
			manualClimateArray[38] = 5;
			manualClimateArray[39] = 5;
			manualClimateArray[40] = 5;
			manualClimateArray[41] = 5;
			manualClimateArray[42] = 5;
			manualClimateArray[43] = 5;
			manualClimateArray[44] = 5;
			manualClimateArray[45] = 5;
			manualClimateArray[46] = 5;
			manualClimateArray[47] = 5;
			manualClimateArray[48] = 5;
			manualClimateArray[49] = 5;
			manualClimateArray[50] = 5;

			climateArray = manualClimateArray; //assigns value of manualClimateArray to climateArray.
			return climateArray;
			}
	};

	climateChange(); // Sets climateArray to new value

	// Create list of random numbers that will become weather-------

	weatherArray = [];

	function makeWeatherArray() {
		for (var i = 0; i < maxturn; i++) {
			weather = Math.floor((Math.random()*1000)+1);
			weatherArray[i] = weather;
		}
		return weatherArray;
	};

	makeWeatherArray(); //sets weatherArray to new value

	// Set rain thresholds as modified by climate change over course of game -------

	thresholdArray = [];

	function makeThresholdArray () {

		thresholdArray[0] = threshold; //sets first value equal to threshold

		for (var i = 1; i < maxturn; i++)
		{
			thresholdArray[i] = thresholdArray[i-1] - (climateArray[i]);
		}

		return thresholdArray;
	};

	makeThresholdArray(); //sets thresholdArray to new value based on climate change


	// Set game weather -------

	gameWeather = [];

	function makeGameWeather() { //makeGameWeather takes local empty variable "perTurnWeather" and gives it value depending on parameter x

	for (var i = 0; i < maxturn; i++) {
		if (weatherArray[i] < thresholdArray[i])
			{
				var perTurnWeather = "Wet";
				gameWeather[i] = perTurnWeather;
			}

		if (weatherArray[i] > thresholdArray[i])
			{
				var perTurnWeather = "Dry";
				gameWeather[i] = perTurnWeather;
			}

			} //end of for loop

		return gameWeather;
	};

	makeGameWeather(); //sets value of gameWeather (array containing weather for length of game)


	//Calculate Max Score --------------------------------------

	optimalCrops = []; //array of scores per turn if you knew the weather (post-hoc optimal) and chose the correct crop for each turn

	function calculateOptimalCrop () {

		for (var i = 0; i < maxturn; i++) {


			if (gameWeather[i] === "Wet" && payoutAwet > payoutBwet)
			{
				optimalCrops[i] = payoutAwet;
			}
			else if (gameWeather[i] === "Dry" && payoutAdry > payoutBdry)
			{
				optimalCrops[i] = payoutAdry;
			}
			else if (gameWeather[i] === "Wet" && payoutBwet > payoutAwet)
			{
				optimalCrops[i] = payoutBwet;
			}
			else if (gameWeather[i] === "Dry" && payoutBdry > payoutAdry)
			{
				optimalCrops[i] = payoutBdry;
			}
		} //end of for loop

		return optimalCrops;
	};

	calculateOptimalCrop(); //sets value of optimalCrops array

	maxScore = 0;

	function calculateMaxScore () {
			for (var i=0; i < maxturn; i++)

			{
			maxScore += optimalCrops[i]
			} //maxScore = maxScore + optimalTurnCrop[i]
		return maxScore;
	};

	calculateMaxScore();
	console.log("The maximum possible score is " + maxScore + " points")

	// Calculate Random Play bonus threshold ---------------------------------

			// A. Calculate indifference point

	indifferencePoint = (payoutBwet - payoutAwet)/(payoutAdry - payoutAwet + payoutBwet - payoutBdry);
	pWet = [];

	function checkIndifferencePoint () {
		if (indifferencePoint >=1 || indifferencePoint <=0) {
			alert("The indifference point between A and B is " + indifferencePoint + "!");
		}

		console.log(indifferencePoint);
	};

			// B. on which turn does the probability of dry weather = indifference point?

	function findTurnAtIndifferencePoint () { //calculates the turn at which the probability of wet weather equals the indiff point

		for (var i = 0; i < maxturn ; i++) {
				pWet[i] = thresholdArray[i]/1000;
		}

			console.log(pWet);

		for (var i = 0; i < maxturn; i++) {
			if ((pWet[i] == indifferencePoint) || (pWet[i+1] > indifferencePoint && pWet[i-1] < indifferencePoint)) {
				indifferentTurn = i;
				return indifferentTurn;
				break;
			}
		}

		alert("There is no turn at which the probability of dry weather equals the indifference point!");
	};

			// C. Calculate probability of dry weather for all turns.
			//How many points would you make playing by random chance as of the indifferentTurn?

	pDry=[];

	function calculateProbabilityDry () { // Creates an array, pDry, that lists the probability of dry weather for all turns.
		for (var i = 0; i < maxturn; i++) {
			pDry[i] = (1-pWet[i]);
		}

		return pDry;
	};

	var totalRandomPoints = 0;

	//Run all previous functions
	checkIndifferencePoint();
	findTurnAtIndifferencePoint();
	calculateProbabilityDry();

	function calculateRandomPlayPoints () { //expected points earned by picking A or B randomly

		randomPoints = [];
		for (var i = 0; i < maxturn; i++) {
			randomPoints[i] = .5*pDry[i]*payoutAdry + .5*pWet[i]*payoutAwet +
			 .5*pDry[i]*payoutBdry + .5*pWet[i]*payoutBwet;
		}

		for (var i = 0; i < maxturn; i++) {
			totalRandomPoints += randomPoints[i];
		}

		return totalRandomPoints;
	};

	calculateRandomPlayPoints();
	console.log("The first bonus will trigger at " + totalRandomPoints + " points");

	// Calculate Ante-Hoc Optimal Play bonus threshold ---------------------------------


	optimalChoice1 = [];
	optimalChoice2 = [];

	for (var i = 0; i <= maxturn; ++i) {
		optimalChoice1[i] = 0;
		optimalChoice2[i] = 0;
	};

	function optimalChoice (min, max, probDry, probWet, payoutDry, payoutWet) {
				var result = [];

				for (var i = 0; i < min; i++) {
					result[i]=0;
				};

				for (var i = min; i <= max; i++) {
					result[i] = probDry[i] * payoutDry + probWet[i] * payoutWet;
				};

				return result; //exit point
	};


	function optimalScenario () {

		// A is first optimal choice, starting condition is pWet > pDry
		if (payoutAwet > payoutBwet) {
			optimalChoice1 = optimalChoice(0, indifferentTurn, pDry, pWet, payoutAdry, payoutAwet);
			optimalChoice2 = optimalChoice(indifferentTurn, maxturn, pDry, pWet, payoutBdry, payoutBwet);
		}

		// B is first optimal choice, starting condition is pWet > pDry
		else if (payoutBwet > payoutAwet) {
			optimalChoice1 = optimalChoice(0, indifferentTurn, pDry, pWet, payoutBdry, payoutBwet);
			optimalChoice2 = optimalChoice(indifferentTurn, maxturn, pDry, pWet, payoutAdry, payoutAwet);
		}

	};


	function calculateOptimalPlayPoints () {

		optimalScenario();

		var totalOptimalChoice1 = 0;
		var totalOptimalChoice2 = 0;


		function sumtotal1 () {
			for (var i = 0; i <= indifferentTurn; i++) {
				totalOptimalChoice1 += optimalChoice1[i];
			}
			return totalOptimalChoice1;
		};

		var total1 = sumtotal1();

		function sumtotal2 () {
			for (var i = 0; i > indifferentTurn, i < maxturn; i++) {
				totalOptimalChoice2 += optimalChoice2[i];
			}

			return totalOptimalChoice2;
		};

		var total2 = sumtotal2();

		//totalOptimalPoints is the sum of total optimal choice 1 + total optimal choice 2

		var totalOptimalPoints = total1 + total2;
		//alert("total optimal points: " + totalOptimalPoints);

		console.log("The second bonus will trigger at " + totalOptimalPoints + " points");
		return totalOptimalPoints;
	};

	calculateOptimalPlayPoints();



	/* Contact the server and tell it what's up */
	function tellServerWhatsUp() {
		$.ajax({
				url: 'http://someserver.com/game',
				type: 'POST',
				async: false,
				data: {
					probablityOfRain: 0.7
				}
			}).done(function() {
				// continue processing, set up game world
			}).failure(function() {
				// alert the user, bail out
			});
	};


	//Populate spans in opening and ending dialogs

	$(".turncount_instructions").text(maxturn + " turns");
	$("#weather_instructions").text((1000-threshold)/1000*100 + "%");
	$("#bonus_one_instructions").text(totalRandomPoints);
	$("#bonus_two_instructions").text("totalOptimalPoints");

}); //end of initialization function

// >>>>>>>>>>>>>>>>>>>> 2. Game is introduced in a series of dialog boxes. User clicks through. >>>>>>>>>>>>>>>>>>>>

// Open first dialog; keep other dialogs hidden

$(function dialogIntro () {

	$( "#first-message" ).dialog({
		autoOpen: true,
		modal: true,
		closeOnEscape: false,
        resizable: false,
        position: 'center',
        stack: true,
        height: 'auto',
        width: 'auto',
        dialogClass: "no-close",
		buttons: [ { text: "Next",
			click: function() {
				$( this ).dialog( "close" );
				$( "#second-message" ).dialog( "open" );
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
        width: 'auto',
        dialogClass: "no-close",
		buttons: [ { text: "Next",
			click: function() {
				$( this ).dialog( "close" );
				$( "#third-message" ).dialog( "open" );
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
        width: 'auto',
        dialogClass: "no-close",
		buttons: [ { text: "Next",
			click: function() {
				$( this ).dialog( "close" );
				$( "#fourth-message" ).dialog( "open" );
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
        width: 'auto',
        dialogClass: "no-close",
		buttons: [ { text: "Start Game",
			click: function() { $( this ).dialog( "close" );}
		} ]
	});

});

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

	var args = {}; //creates empty object for arguments

	disableGrowButton();

	$(".plant, .plant_img, #grow").addClass("hidden");

	function displaySun () { // fadeIn causes the HTML to change to style="display:inline; opacity: 1"
		$("#sun").addClass("displayWeather").removeClass("hidden");
		//alert("This is sun and game weather is "+ gameWeather[turn]);
	};

	function displayRain () {
		$("#rain").addClass("displayWeather").removeClass("hidden");
		//alert("This is rain and game weather is " + gameWeather[turn]);
	};

	if (cropchoice == "cropA" && gameWeather[turn] == "Dry") {
		args.crop = "A";
		args.state = "dead";
		args.weather = "sunny";
		displaySun();
		$("#deadA").removeClass("hidden");
		updateGame(payoutAdry);
		//setTimeout(function () { $("#deadA").addClass("hidden"); }, 3500);
	}

	else if (cropchoice == "cropA" && gameWeather[turn] == "Wet") {
		args.crop = "A";
		args.state = "healthy";
		args.weather =  "rainy";
		displayRain();
		$("#rowsCropA").removeClass("hidden");
		updateGame(payoutAwet);
		//setTimeout(function () {$("#rowsCropA").addClass("hidden");}, 3500);
	}

	else if (cropchoice == "cropB" && gameWeather[turn] == "Dry") {
		args.crop = "B";
		args.state = "dead";
		args.weather = "sunny";
		displaySun();
		$("#deadB").removeClass("hidden");
		updateGame(payoutBdry);
		//setTimeout(function () {$("#deadB").addClass("hidden");}, 3500);
	}

	else if (cropchoice == "cropB" && gameWeather[turn] == "Wet"){
		args.crop = "B";
		args.state = "healthy";
		args.weather = "rainy";
		displayRain();
		$("#rowsCropB").removeClass("hidden");
		updateGame(payoutBwet);
		//setTimeout(function () {$("#rowsCropB").addClass("hidden");}, 3500);
	}

	else {
		alert("Error: did you choose a crop? Please choose Crop A or Crop B and try again!");
	}

	function displayResultsDialog () {

		$(".results").dialog({
			autoOpen: true,
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

		if (score === "totalRandomPoints" || score === "totalOptimalPoints") { //this doesn't work yet
			$("#bonus_results").dialog("open");
		}

		else if (turn == maxturn) {
			$("#end_results").dialog("open");
		}

		else {
			$("#normal_results").dialog("open");
		}

		setTimeout(function() {$( ".results" ).dialog( "close" )}, 2500);

	};

	displayResultsDialog();
	return args;
};

// >>>>>>>>>>> 5. Game updates and loops back to the beginning of the code >>>>>>>>>>>>>>>>>>>

function updateGame(payout) { //this function is called inside weatherResults function

	//alert("Running updateGame now using arguments " + arguments)
	cropchoice = ""; // resets value of cropchoice to ""
	var oldscore = score;
	var newscore = oldscore + payout;

	function fadeWeather () {
		//setTimeout calls function after a certain time; currently 3000 ms
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden");
	   	$(".croprows").addClass("hidden");
	   	$(".plant").removeClass("select");
	   	$(".plant, .plant_img, #grow").removeClass("hidden");
	};

	function addTurn () {
		turn = turn + 1;
		$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
		//setTimeout(assignTurnWeather, 100); //runs function assignTurnWeather with new turn value
		//alert("gameWeather is now " + gameWeather[turn] + " because it is turn #" + turn);
	};

	function newScore () {
		$("#point_count").html("<h5>" + newscore + "</h5>");
	};

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
	};

		// WARNING: .css modifies the element's <style> property, not the CSS sheet!

	/*function addDollars(oldscore, newscore) {
		if (oldscore < randomTotalPoints && newscore >= randomTotalPoints) {
			//add bonusOne, give special message
		}

		else if (oldscore < totalOptimalPoints && newscore >= totalOptimalPoints) {
			//add bonusTwo, give special message
		}

		else {
			//no bonus added - run default results message

		}
	};*/

	setTimeout(fadeWeather, 4000);
	newScore();
	movePointsFlag();
	//addDollars();
	setTimeout(addTurn, 4000);


	score += payout;
	return score; //this updates the value of the global variable "score"
};


function endGame () {
	//call end-of-game dialog box
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

		else if (($(this).hasClass("highlight")) && turns == maxturn) {

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


