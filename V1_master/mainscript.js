//SEMANTICS
//threshold: defines which random numbers indicate rain and which indicate dry.
//climateChange: makes changes to the threshold at each turn.
//payout: these variables show payout for crop choices.
//crop: all references to actual choices A and B (not seed, not plant)
//

///////////////////////////


$(document).ready(function(){


//>>>>>>>>>>>> GAME OBJECT - change game version and parameters here <<<<<<<<<<<<<<<

gameVersion = {
	discreteWeather: false
};

game = {

// Shared global variables:

	// Title of game
	gameLabel: 'control',

	cropchoice: "",
	gameWeather: [],
	weatherReport : "",
	histogram: [],
	meanHistoricWeather : 0,

	// Set number of turns per game
    maxturn : 50,
	//Turn Counter
	turn : 0,

	//Points Counter
	maxScore : 0,
	score : 0, //starting score is 0

	// Real Dollars Earned
	realDollars : 0, //real earnings in dollars start at 0

	// Signals end of game when true
	gameOver: false,

	// Data will be sent to this server address
	serverAddress: 'http://v2.whatcrop.org', // local server

	// Bonus payments, in dollars
	bonusOneDollars: 1.25,
	bonusTwoDollars: 0.75,

// Discrete game version
	discrete: {
		// Discrete weather crop payouts
	    payoutAwet: 70,
		payoutAdry: 80,
		payoutBwet: 100,
		payoutBdry: 50,
		// Set rain threshold
		threshold: 600,
		// Bonus thresholds, determined by code below
		bonusOneTotal : 0, //formerly totalRandomPoints
		bonusTwoTotal : 0, //formerly totalOptimalPoints
		// Indifference point (at which crops A and B are equally good choices)
		// and indifferentTurn (turn at which indiff point is reached)
		// Values calculated below
		indifferencePoint: 0,
		indifferentTurn: 0,
		// Climate change per turn
		climateArray: []
	},

// Continuous game version
	continuous: {
		// Bonuses are manually determined as a percentage of maxScore
		// Change the percentage of maxScore using firstBonusThreshold and secondBonusThreshold
		firstBonusThreshold: .75,
		secondBonusThreshold: .90,
		// actual bonus points -- bonusOneTotal, bonusTwoTotal -- are calculated below using the percentages above
		bonusOneTotal: 0,
		bonusTwoTotal: 0,
		// Continuous weather crop payouts -- enter here
		betaA : -.002,
		betaB : -.002,
		maxApayout : 200, //P*(A)
		maxAweather : 400, //w*(A)
		maxBpayout : 120, //P*(B)
		maxBweather : 200, //w*(B)
		// Roots of payout parabolas, calculated below
		gameRoots : {
			topRoot: 0,
			bottomRoot: 0
		},
		// Manually set climate change by turn, up to game.maxturn
		climateArray : []
	},

	//for testing purposes
	optionsObj: {},
	plotData: [],
	historyPlot: {},
	historicWeather : [] // Array values filled in using historicWeatherArray() below
	// array holding canvasOverlay data for drawing vertical lines
	lineArray: []

}; //end of game object


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GAME SET-UP <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$(function initializeGame (gameVersionObject) {

	// Separate Initialization Processes (Discrete Vs Continuous)
	if (gameVersion.discreteWeather === true) {
		//runs all functions relevant to discrete game
		gameVersionObject = game.discrete;
		initializeDiscrete();
	}

	else {
		//runs all functions relevant to continuous game
		gameVersionObject = game.continuous;
		initializeContinuous();
	}

//Shared Elements (Both Games)

	//Turn Counter
	$("#turns_counter").text(game.turn + "/" + game.maxturn);

	//Points Counter - writes initial score to points counter
	$("#point_count").html("<h5>"+game.score+"</h5>");

	// Real Dollars Earned - writes initial realDollars to dollars counter
	$("#dollars_counter").text("$"+game.realDollars);

	// Populate spans in opening and ending dialogs
	$(".turncount_instructions").text(game.maxturn + " turns");

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Initialize Discrete Game Version <<<<<<<<<<<<<<

	function initializeDiscrete () {

		// Unhide discrete version elements

		$("#crop_payouts_table").removeClass("hidden");
		$("#discrete_history").removeClass("hidden");
		$("#tablediv").removeClass("hidden");

		// Populate discrete.climateArray

		game.discrete.climateArray[0] = 5;
		game.discrete.climateArray[1] = 5;
		game.discrete.climateArray[2] = 5;
		game.discrete.climateArray[3] = 5;
		game.discrete.climateArray[4] = 5;
		game.discrete.climateArray[5] = 5;
		game.discrete.climateArray[6] = 5;
		game.discrete.climateArray[7] = 5;
		game.discrete.climateArray[8] = 5;
		game.discrete.climateArray[9] = 5;
		game.discrete.climateArray[10] = 5;
		game.discrete.climateArray[11] = 5;
		game.discrete.climateArray[12] = 7;
		game.discrete.climateArray[13] = 7;
		game.discrete.climateArray[14] = 7;
		game.discrete.climateArray[15] = 7;
		game.discrete.climateArray[16] = 7;
		game.discrete.climateArray[17] = 10;
		game.discrete.climateArray[18] = 10;
		game.discrete.climateArray[19] = 10;
		game.discrete.climateArray[20] = 10;
		game.discrete.climateArray[21] = 10;
		game.discrete.climateArray[22] = 10;
		game.discrete.climateArray[23] = 10;
		game.discrete.climateArray[24] = 5;
		game.discrete.climateArray[25] = 5;
		game.discrete.climateArray[26] = 5;
		game.discrete.climateArray[27] = 5;
		game.discrete.climateArray[28] = 5;
		game.discrete.climateArray[29] = 5;
		game.discrete.climateArray[30] = 5;
		game.discrete.climateArray[31] = 5;
		game.discrete.climateArray[32] = 5;
		game.discrete.climateArray[33] = 5;
		game.discrete.climateArray[34] = 5;
		game.discrete.climateArray[35] = 5;
		game.discrete.climateArray[36] = 5;
		game.discrete.climateArray[37] = 5;
		game.discrete.climateArray[38] = 5;
		game.discrete.climateArray[39] = 5;
		game.discrete.climateArray[40] = 5;
		game.discrete.climateArray[41] = 5;
		game.discrete.climateArray[42] = 5;
		game.discrete.climateArray[43] = 5;
		game.discrete.climateArray[44] = 5;
		game.discrete.climateArray[45] = 5;
		game.discrete.climateArray[46] = 5;
		game.discrete.climateArray[47] = 5;
		game.discrete.climateArray[48] = 5;
		game.discrete.climateArray[49] = 5;
		game.discrete.climateArray[50] = 5;


		// Create list of random numbers that will become weather-------

		weatherArray = [];

		function makeWeatherArray() {
			for (var i = 0; i < game.maxturn; i++) {
				var weather = Math.floor((Math.random()*1000)+1);
				weatherArray[i] = weather;
			}
			console.log("weatherArray is " + weatherArray);
			return weatherArray;
		};

		makeWeatherArray(); //sets weatherArray to new value

		// Set rain thresholds as modified by climate change over course of game -------


		thresholdArray = [];


		function makeThresholdArray () {

			thresholdArray[0] = game.discrete.threshold; //sets first value equal to threshold

			for (var i = 1; i < game.maxturn; i++) {
				thresholdArray[i] = thresholdArray[i-1] - (game.discrete.climateArray[i]);
			}

			console.log("thresholdArray is " + thresholdArray);
			return thresholdArray;
		};

		makeThresholdArray(); //sets thresholdArray to new value based on climate change


		// Set game weather -------

		function makeGameWeather() { //makeGameWeather takes local empty variable "perTurnWeather" and gives it value depending on parameter x

		for (var i = 0; i < game.maxturn; i++) {
			if (weatherArray[i] <= thresholdArray[i])
				{
					var perTurnWeather = "Wet";
					game.gameWeather[i] = perTurnWeather;
				}

			if (weatherArray[i] > thresholdArray[i])
				{
					var perTurnWeather = "Dry";
					game.gameWeather[i] = perTurnWeather;
				}

				} //end of for loop

			console.log("gameweather is "+ game.gameWeather);
			return game.gameWeather;
		};

		makeGameWeather(); //sets value of gameWeather (array containing weather for length of game)


		//Calculate Max Score --------------------------------------

		optimalCrops = []; //array of scores per turn if you knew the weather (post-hoc optimal) and chose the correct crop for each turn

		function calculateOptimalCrop () {

			for (var i = 0; i < game.maxturn; i++) {


				if (game.gameWeather[i] === "Wet" && game.discrete.payoutAwet > game.discrete.payoutBwet)
				{
					optimalCrops[i] = game.discrete.payoutAwet;
				}
				else if (game.gameWeather[i] === "Dry" && game.discrete.payoutAdry > game.discrete.payoutBdry)
				{
					optimalCrops[i] = game.discrete.payoutAdry;
				}
				else if (game.gameWeather[i] === "Wet" && game.discrete.payoutBwet > game.discrete.payoutAwet)
				{
					optimalCrops[i] = game.discrete.payoutBwet;
				}
				else if (game.gameWeather[i] === "Dry" && game.discrete.payoutBdry > game.discrete.payoutAdry)
				{
					optimalCrops[i] = game.discrete.payoutBdry;
				}
			} //end of for loop

			return optimalCrops;
		};

		calculateOptimalCrop(); //sets value of optimalCrops array



		function calculateMaxScore () {
				for (var i=0; i < game.maxturn; i++)

				{
				game.maxScore += optimalCrops[i]
				}
			return game.maxScore;
		};

		calculateMaxScore();
		console.log("The maximum possible score is " + game.maxScore + " points");

		// Calculate Random Play bonus threshold ---------------------------------

				// A. Check indifference point and calculate turn at which indifference point occurs

		pWet = [];

		function checkIndifferencePoint () {
			var indifference = (game.discrete.payoutBwet - game.discrete.payoutAwet)/(game.discrete.payoutAdry - game.discrete.payoutAwet + game.discrete.payoutBwet - game.discrete.payoutBdry);
			if (game.discrete.indifferencePoint >=1 || game.discrete.indifferencePoint <=0) {
				alert("The indifference point between A and B is " + game.discrete.indifferencePoint + "!");
			}

			console.log(game.discrete.indifferencePoint);

			// Assign the value of the indifference point to the game variable
			game.discrete.indifferencePoint = indifference;
			return game.discrete.indifferencePoint;
		};

				// B. on which turn does the probability of dry weather = indifference point?

		function findTurnAtIndifferencePoint () { //calculates the turn at which the probability of wet weather equals the indiff point

			for (var i = 0; i < game.maxturn ; i++) {
					pWet[i] = thresholdArray[i]/1000;
			}

				console.log(pWet);

			for (var i = 0; i < game.maxturn; i++) {
				if ((pWet[i] == game.discrete.indifferencePoint) || (pWet[i+1] > game.discrete.indifferencePoint && pWet[i-1] < game.discrete.indifferencePoint)) {
					game.discrete.indifferentTurn = i;
					return game.discrete.indifferentTurn;
				}
			}

			alert("There is no turn at which the probability of dry weather equals the indifference point!");
		};

				// C. Calculate probability of dry weather for all turns.
				//How many points would you make playing by random chance as of the indifferentTurn?

		pDry=[];

		function calculateProbabilityDry () { // Creates an array, pDry, that lists the probability of dry weather for all turns.
			for (var i = 0; i < game.maxturn; i++) {
				pDry[i] = (1-pWet[i]);
			}

			return pDry;
		};

		//Run all previous functions
		checkIndifferencePoint();
		findTurnAtIndifferencePoint();
		calculateProbabilityDry();

		// BonusOneTotal is total number of points expected with random play

		function calculateRandomPlayPoints () { //expected points earned by picking A or B randomly

			randomPoints = [];
			for (var i = 0; i < game.maxturn; i++) {
				randomPoints[i] = .5*pDry[i]*game.discrete.payoutAdry + .5*pWet[i]*game.discrete.payoutAwet +
				 .5*pDry[i]*game.discrete.payoutBdry + .5*pWet[i]*game.discrete.payoutBwet;
			}

			for (var i = 0; i < game.maxturn; i++) {
				game.discrete.bonusOneTotal += parseInt(randomPoints[i]);
			}

			return game.discrete.bonusOneTotal;
		};

		calculateRandomPlayPoints();
		console.log("The first bonus will trigger at " + game.discrete.bonusOneTotal + " points");

		// Calculate Ante-Hoc Optimal Play bonus threshold ---------------------------------


		optimalChoice1 = [];
		optimalChoice2 = [];

		// bonusTwoTotal is the number of points expected with optimal play

		for (var i = 0; i <= game.maxturn; ++i) {
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
			if (game.discrete.payoutAwet > game.discrete.payoutBwet) {
				optimalChoice1 = optimalChoice(0, game.discrete.indifferentTurn, pDry, pWet, game.discrete.payoutAdry, game.discrete.payoutAwet);
				optimalChoice2 = optimalChoice(game.discrete.indifferentTurn, game.maxturn, pDry, pWet, game.discrete.payoutBdry, game.discrete.payoutBwet);
			}

			// B is first optimal choice, starting condition is pWet > pDry
			else if (game.discrete.payoutBwet > game.discrete.payoutAwet) {
				optimalChoice1 = optimalChoice(0, game.discrete.indifferentTurn, pDry, pWet, game.discrete.payoutBdry, game.discrete.payoutBwet);
				optimalChoice2 = optimalChoice(game.discrete.indifferentTurn, game.maxturn, pDry, pWet, game.discrete.payoutAdry, game.discrete.payoutAwet);
			}

		};

		function calculateOptimalPlayPoints () {

			optimalScenario();

			var totalOptimalChoice1 = 0;
			var totalOptimalChoice2 = 0;


			function sumtotal1 () {
				for (var i = 0; i <= game.discrete.indifferentTurn; i++) {
					totalOptimalChoice1 += optimalChoice1[i];
				}
				return totalOptimalChoice1;
			};

			var total1 = sumtotal1();

			function sumtotal2 () {
				for (var i = 0; i > game.discrete.indifferentTurn, i < game.maxturn; i++) {
					totalOptimalChoice2 += optimalChoice2[i];
				}

				return totalOptimalChoice2;
			};

			var total2 = sumtotal2();

			//bonusTwoTotal is the sum of total optimal choice 1 + total optimal choice 2
			game.discrete.bonusTwoTotal = parseInt(total1 + total2);
			//alert("total optimal points: " + bonusTwoTotal);

			console.log("The second bonus will trigger at " + game.discrete.bonusTwoTotal + " points");
			return game.discrete.bonusTwoTotal;
		};

		calculateOptimalPlayPoints();

		// Set height of bonus markers
			function bonusHeight (bonus1, bonus2) {

				var pixelHeight = parseInt($("#points_bar").css("height")); //gets CSS height of points bar, in pixels
				var pointsPerPixelRatio = game.maxScore/pixelHeight; //this ratio applies to points bar up until bonus 2

				$("#bonus1marker, #bonusLabel1").css("bottom", (bonus1/pointsPerPixelRatio));
				$("#bonus2marker, #bonusLabel2").css("bottom", (bonus2/pointsPerPixelRatio));
				$("#bonus1value").text(game.discrete.bonusOneTotal);
				$("#bonus2value").text(game.discrete.bonusTwoTotal);
			};

			bonusHeight(game.discrete.bonusOneTotal, game.discrete.bonusTwoTotal);

	// Populate discrete opening dialogs

		function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
			$("table").find("td#payoutAwet").text(payoutAwet );
			$("table").find("td#payoutAdry").text(payoutAdry );
			$("table").find("td#payoutBwet").text(payoutBwet );
			$("table").find("td#payoutBdry").text(payoutBdry );
		};
		writeCropPayout (game.discrete.payoutAwet, game.discrete.payoutAdry, game.discrete.payoutBwet, game.discrete.payoutBdry);

		//reveals bar graph of historic weather
		//$("#discrete_history").removeClass("hidden");
		//fills in data for bar graph
		$("#weather_type").text(" weather ");
		$("#weather_modifier").text(" rainy");
		var dryPercent = ((1000-game.discrete.threshold)/1000)*100;
		var wetPercent = 100 - ((1000-game.discrete.threshold)/1000)*100;
		$(".dry_percent").text(dryPercent + "%");
		$(".wet_percent").text(wetPercent + "%");
		$("#sun_probability").css("height", dryPercent);
		$("#rain_probability").css("height", wetPercent);
		//fills in bonus information
		$("#bonus_one_instructions").text(game.discrete.bonusOneTotal);
		$("#bonus_two_instructions").text(game.discrete.bonusTwoTotal);
		//reveals crop payouts table in opening dialog and sidebar payout table
		//$("#crop_payouts_table, #tablediv").removeClass("hidden");

		// Call opening dialogs
		introDialogs();

	}; // >>>>>>>>>>>>>>>>>>>>>>>>> end of initializeDiscrete function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	function initializeContinuous () {

		// Unhide continuous version elements
		$("#crop_payouts_chart").removeClass("hidden");
		$("#continuous_history").removeClass("hidden");
		$("#chartdiv").removeClass("hidden");

		//Populate continuous.climateArray

		game.continuous.climateArray = [
			{mean: 400, std_dev: 75}, //0 -- initial climate
			{mean: 400, std_dev: 75}, //1
			{mean: 400, std_dev: 75}, //2
			{mean: 400, std_dev: 75}, //3
			{mean: 400, std_dev: 75}, //4
			{mean: 400, std_dev: 75}, //5
			{mean: 400, std_dev: 75}, //6
			{mean: 400, std_dev: 75}, //7
			{mean: 400, std_dev: 75}, //8
			{mean: 400, std_dev: 75}, //9
			{mean: 400, std_dev: 75}, //10
			{mean: 300, std_dev: 75}, //11
			{mean: 300, std_dev: 75}, //12
			{mean: 300, std_dev: 75}, //13
			{mean: 300, std_dev: 75}, //14
			{mean: 300, std_dev: 75}, //15
			{mean: 300, std_dev: 75}, //16
			{mean: 300, std_dev: 75}, //17
			{mean: 300, std_dev: 75}, //18
			{mean: 300, std_dev: 75}, //19
			{mean: 300, std_dev: 75}, //20
			{mean: 275, std_dev: 75}, //21
			{mean: 275, std_dev: 75}, //22
			{mean: 275, std_dev: 75}, //23
			{mean: 275, std_dev: 75}, //24
			{mean: 275, std_dev: 75}, //25
			{mean: 275, std_dev: 75}, //26
			{mean: 275, std_dev: 75}, //27
			{mean: 275, std_dev: 75}, //28
			{mean: 275, std_dev: 75}, //29
			{mean: 275, std_dev: 75}, //30
			{mean: 275, std_dev: 75}, //31
			{mean: 275, std_dev: 75}, //32
			{mean: 275, std_dev: 75}, //33
			{mean: 275, std_dev: 75}, //34
			{mean: 275, std_dev: 75}, //35
			{mean: 275, std_dev: 75}, //36
			{mean: 275, std_dev: 75}, //37
			{mean: 275, std_dev: 75}, //38
			{mean: 275, std_dev: 75}, //39
			{mean: 275, std_dev: 75}, //40
			{mean: 275, std_dev: 75}, //41
			{mean: 275, std_dev: 75}, //42
			{mean: 275, std_dev: 75}, //43
			{mean: 275, std_dev: 75}, //44
			{mean: 275, std_dev: 75}, //45
			{mean: 250, std_dev: 75}, //46
			{mean: 200, std_dev: 75}, //47
			{mean: 150, std_dev: 75}, //48
			{mean: 150, std_dev: 75}, //49
			{mean: 150, std_dev: 75}  //50
		];


		$.jqplot.config.enablePlugins = true;

		//Draws crop payout quadratics on canvas with jpPlot plugin
		function drawQuadratic () {

			function dataArrays (beta, maxweather, maxpayout, crop) {
				// for quadratic equation 0 = ax^2 + bx + c
				var a = beta;
				var b = -2 * maxweather * beta;
				var c = (beta * maxweather * maxweather) + maxpayout;
				var root_part = Math.sqrt((b*b) - 4*a*c);
				var denominator = 2*a;

				//calculate roots of payout parabola
				var root1 = (-b + root_part)/denominator;
				var root2 = (-b - root_part)/denominator;


				// Find points (x,y) with x = weather, y= payout which delineate "normal" range -- additional point beyond vertex and roots
				var upper = [];
				var lower = [];
				var upperNormalTheshold = newPoint(upper, "+");
				var lowerNormalThreshold = newPoint(lower, "-");

				function newPoint (threshold, sign) {

					if (sign === "+") {
						threshold[0] = maxweather + .33*Math.sqrt(maxpayout/(-beta));
					}

					else {
						threshold[0] = maxweather - .33*Math.sqrt(maxpayout/(-beta));
						threshold[2] = crop;
					}

					threshold[1] = Ycoordinate(threshold[0]);
					return threshold;
				};


				function Ycoordinate (bound) {
					var boundPayout = beta * Math.pow((bound - maxweather), 2) + maxpayout;
					return boundPayout;
				};


				//output array of (x,y) points for use in jqPlot chart: [root1, lower normal-weather bound, vertex, upper normal-weather bound, root2]
				parabolaArray = [[root1, 0, null], lower, [maxweather, maxpayout, null], upper, [root2, 0, null]];

				return parabolaArray;
			}; //end of dataArrays


			// Call dataArrays function and create parabolaArrays for A and B
			var plotA = dataArrays(game.continuous.betaA, game.continuous.maxAweather, game.continuous.maxApayout, "A");
			var plotB = dataArrays(game.continuous.betaB, game.continuous.maxBweather, game.continuous.maxBpayout, "B");


			// Set upper bounds on graph
			var upperBoundX = 1000; //default value for upper bound of graph x-axis
			var upperBoundY = 250; //default value for upper bound of graph y-axis

			function findUpperBoundX () {
			//modifies upper bound on x-axis based on largest parabola root (point at which crop value is (X,0) with largest possible value of X)
				var root1A = plotA[0][0];
				var root2A = plotA[4][0];
				var root1B = plotB[0][0];
				var root2B = plotB[4][0];

				var rootArray = [root1A, root2A, root1B, root2B];
				var maxRoot = Math.max.apply(Math, rootArray);
				var minRoot = Math.min.apply(Math, rootArray);

				upperBoundX = Math.ceil(maxRoot/100)*100;

				game.continuous.gameRoots.topRoot = maxRoot;
				game.continuous.gameRoots.bottomRoot = minRoot;

				return upperBoundX;
			};

			findUpperBoundX();

			function findUpperBoundY () {
				var vertexA = plotA[2][1];
				var vertexB = plotB[2][1];

				if (vertexA > vertexB) {
					upperBoundY = vertexA;
				}

				else {
					upperBoundY = vertexB;
				}

				return upperBoundY;
			};

			findUpperBoundY();

			// Set values for tick marks
			var maxX = [upperBoundX+100];
			var maxY = [upperBoundY+20];
			//var ticksX = [[0, "0"], [game.maxAweather, game.maxAweather], [game.maxBweather, game.maxBweather], [maxX, maxX]];
			var ticksY = [[0, ""], [game.continuous.maxApayout, game.continuous.maxApayout], [game.continuous.maxBpayout, game.continuous.maxBpayout], [upperBoundY, upperBoundY], [maxY, ""]];
			var ticksWeatherX = [[]];
			var ticksWeatherY = [];


			// Create graphable data array for historicWeather using freqency of values
			function historicWeatherHistogram () {

				var range = Math.max.apply(Math, game.historicWeather) - 0;
				var intervalNumber = 2*Math.ceil(Math.sqrt(game.historicWeather.length)); // total intervals is 8 and the interval numbers are 0,1,2,3,4,5,6,7 in the case of 50 turns
				var intervalWidth = range/intervalNumber;

				console.log("range: " + range + " number of intervals: " + intervalNumber + " interval width: " + intervalWidth);

				function countOccurrence(newinterval) { //this functions runs for each interval

					var intervalBottom = newinterval*intervalWidth;
					var intervalTop = ((newinterval+1)*intervalWidth);

					console.log(intervalBottom + " to " + intervalTop);

					var count = 0;
					var scaleCount = 0;

					function originalCount () {
						for (var i =0; i < game.historicWeather.length; i++) {

							if (game.historicWeather[i] >= intervalBottom && game.historicWeather[i] < intervalTop) {
								count += 1;
							}

							else if (newinterval === (intervalNumber-1) && game.historicWeather[i] >= intervalBottom) {
								count +=1;
							}

							else {
								count = count;
							}
						}

						return count;
					};

					originalCount();

					console.log("[" + parseInt(intervalBottom) + ", " + count + "]");

					function scaleToYaxis () {
						// Takes the average of maxA and maxB payout, multiples count by a percentage of the average,
						// to scale "count" up to the y-axis units of payout points.
						if (game.continuous.maxBpayout > game.continuous.maxApayout) {
							scaleCount = count*0.10*(game.continuous.maxApayout);
						}

						else {
							scaleCount = count*0.10*(game.continuous.maxBpayout);
						}

						count = scaleCount;
						//console.log("scaleCount is " + scaleCount);
					};

					scaleToYaxis();

					return [intervalBottom, count, null];

				}; // end countOccurrence();

				//creates empty array to fill with arrays ([interval number, count, null])
				var frequency = [];

				//populates each item j in frequency array using value of countOccurrence()
					// (countOccurence called j times, for each item in frequency array)
				for (var j = 0; j < intervalNumber; j++) {
					frequency[j] = countOccurrence(j);
				}

				function ticksWeather () {

					for (var j = 0; j <= intervalNumber; j++) {

						ticksWeatherX[j] = [parseInt(j*(maxX/intervalNumber))];

						if (j == 0 || j==intervalNumber*.25 || j==intervalNumber*.5 || j== intervalNumber*.75 || j == intervalNumber) {
							ticksWeatherX[j][1] = parseInt(j*(maxX/intervalNumber));
						}

						else {
							ticksWeatherX[j][1] = "";
						}
					}

					return ticksWeatherX;
				};

				ticksWeather();

				console.log("ticksWeatherX: " + ticksWeatherX);
				console.log("frequency array: " + frequency);

				return frequency;
			}; //end historicWeatherHistogram


			game.histogram = historicWeatherHistogram();
			console.log("Histogram data ([intervalBottom, count, null]): " + game.histogram);

			// Find largest number of occurences: sets game.meanHistoricWeather equal to most frequent weather interval

			function findMax () {
				var countArray = [];
				for (var i = 0; i < game.histogram.length; i++) {
					countArray[i] = game.histogram[i][1];
				}

				var mostFrequent = Math.max.apply(Math, countArray);

				for (var j = 0; j<game.histogram.length; j++) {
					if (mostFrequent == game.histogram[j][1]) {
						game.meanHistoricWeather = game.histogram[j][0];
					}
				}

				return game.meanHistoricWeather;
			};

			findMax();


			// variables containing all data to be plotted
			game.plotData = [game.histogram, plotA, plotB];

			// Create options object for jqPlot graph using optionsObj and setOptions()
			function setOptions (showData) {
				game.optionsObj = {
					      series:[
					          {
					          	// Weather
					          	label: "Weather",
					          	showMarker: false,
					          	renderer:$.jqplot.BarRenderer,
					          	rendererOptions: {
					          		barWidth: 10,
					          		barPadding: 0,
	                       			barMargin: 0,
	                       			barWidth: 10,
					            	fillToZero: true,
					            	shadowAlpha: 0
					          	},
					          	xaxis:'xaxis',
					          	yaxis:'yaxis',
					          	show: true
					      	  },
					      	  {
					      	    // CropA
					      	    label: "Crop A",
					            lineWidth: 2,
					            showMarker: false,
					            renderer:$.jqplot.LineRenderer,
					            xaxis:'xaxis',
					          	yaxis:'yaxis',
					            show: true
					          },
					          {
					            // CropB
					            label: "Crop B",
					            lineWidth: 2,
					            showMarker: false,
					            renderer:$.jqplot.LineRenderer,
					            xaxis:'xaxis',
					          	yaxis:'yaxis',
					            show: true
					          }
					      ],

					      seriesColors: [/*historic weather*/ "rgba(152, 152, 152, .7)", /*color A*/ "#820000", /*color B*/ "#3811c9"],


					      grid: {
			        		//drawGridlines: true,
			        		shadow: false,
			        		borderWidth: 1,
			        		drawBorder: true,
			        		//background: "rgba(0, 200, 500, 0.05)",
			        	  },

			        	  // The "seriesDefaults" option is an options object that will
			        	  //be applied to all series in the chart.
					      seriesDefaults: {
					          shadow: false,
					          rendererOptions: {
					            smooth: true,
					            highlightMouseOver: false,
					            highlightMouseDown: false,
			        			highlightColor: null,
			        			},
							  markerOptions: {
			            		shadow: false,
					          },

					       //pointLabels uses the final value in parabolaArray[i] as its data
					          pointLabels: {
					          	show: true,
					          	location:'nw',
					          	ypadding:3,
					          	xpadding:3
					          }
					      },
					      axesDefaults: {
	        				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	    				  },
					      axes: {
							/*x2axis: {
			      				//label: "Historic weather distribution",
			      				//padMin: 0,
			      				ticks: ticksWeatherX,
			      				tickOptions:{
			                        mark: "outside",
			                        showLabel: !showData,
			                        formatString: "%#.0f",
			                        showMark: !showData,
			                        showGridline: !showData
			                    }
			      			},*/

			      			y2axis:{
			      				label: "Relative frequency",
			     				labelOptions: {
	            					show: !showData,
	            					fontSize: '11pt'
	        					},
			          			//renderer: $.jqplot.CategoryAxisRenderer,
			          			rendererOptions:{
			                    	tickRenderer:$.jqplot.CanvasAxisTickRenderer
			                    },

			                	tickOptions:{
			                        mark: "inside",
			                        showLabel: !showData,
			                        //formatString: "%#.0f",
			                        showMark: false,
			                        showGridline: false
			                    }
			      			},

			        		xaxis:{
			        			ticks: ticksWeatherX,
			        			borderWidth: 1.5,
			        			rendererOptions:{
			                    	tickRenderer:$.jqplot.AxisTickRenderer
			                    },
			                	tickOptions:{
			                        mark: "cross",
			                        //formatString: "%#.0f",
			                        showMark: true,
			                        showGridline: true
			                    },

			          			label:'Inches of rain',
			          			labelRenderer: $.jqplot.AxisLabelRenderer,
			         			labelOptions: {
			            			fontFamily: 'Verdana, sans-serif',
			            			fontSize: '12pt'
			          			}
			        		},

			        		yaxis:{
			          			ticks: ticksY,
			          			rendererOptions:{
			                    	tickRenderer:$.jqplot.CanvasAxisTickRenderer
			                    },
			                    label: "Points",
			                	tickOptions:{
			                        mark: "inside",
			                        showLabel: true,
			                        //formatString: "%#.0f",
			                        showMark: true,
			                        showGridline: true
			                    },

			          			/*label:'Points',
			          			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
									labelOptions: {
				            			fontFamily: 'Verdana, sans-serif',
				            			fontSize: '12pt',
			          				}*/
			      			}
			    		  }, // axes

						canvasOverlay: {
			        		show: true,
				            objects: [

				            	game.lineArray
								/*{verticalLine: {
				                	name: 'avgHistoricWeather',
				                	x: game.meanHistoricWeather,
				                	lineWidth: 2,
				                	color: '#565347', //gray
				                	shadow: false
				                }},

				                {verticalLine: {
				                    name: 'resultsLine',
				                    x: game.gameWeather[game.turn], // this positions the line at the current turn weather
				                    lineWidth: 4,
				                    color: 'rgb(255, 204, 51)',
				                    shadow: false
				                }}*/
						]} // end of canvasOverlay

					}; // end optionsObj object
					return game.optionsObj;
				}; //end function setOptions()

			//draw graph in #crop_payouts_chart of A/B payouts (intro dialog)
			function payoutChart () {
				//lineArray is empty for the opening dialog payout chart
				setOptions(true);
				$.jqplot("crop_payouts_chart", game.plotData, game.optionsObj);
			};

			// draw graph in #continuous_history (for intro dialog) using optionsObj above
			function historyChart () {
				$("#continuous_history.jqplot-overlayCanvas-canvas").css('z-index', '3');//send overlay canvas to front
				// populate canvasOverlay with the historic mean weather line
				game.lineArray.push( {
						verticalLine: {
					                	name: 'avgHistoricWeather',
					                	x: game.meanHistoricWeather,
					                	lineWidth: 2,
					                	color: '#565347', //gray
					                	shadow: false
					    }
				});
				setOptions(false);
				game.historyPlot = $.jqplot("continuous_history", [game.histogram], game.optionsObj);
				/*var w = parseInt($(".jqplot-yaxis").width(), 10) + parseInt($("#continuous_history").width(), 10);
				var h = parseInt($(".jqplot-title").height(), 10) + parseInt($(".jqplot-xaxis").height(), 10) + parseInt($("#continuous_history").height(), 10);
				$("#continuous_history").width(w).height(h);
				//historyPlot.replot();*/
			};

			//draw graph in sidebar #chartdiv using optionsObj above
			function givensChart () {
				//removes previous lineArray value
				game.lineArray.pop();
				game.lineArray.push({
					verticalLine: {
				                    name: 'resultsLine',
				                    x: game.gameWeather[game.turn], // this positions the line at the current turn weather
				                    lineWidth: 4,
				                    color: 'rgb(255, 204, 51)',
				                    shadow: false
				                }
				});
				setOptions(true);
				$.jqplot("chartdiv", game.plotData, game.optionsObj);
			};

			payoutChart();
			historyChart();
			givensChart();
			//console.log("optionsObj: " + game.optionsObj);

		}; //end of drawQuadratic()

		// Removes background coloration on payout/weather chart after 30 seconds
		function removeChartBackground () {
			$(".jqplot-grid-canvas").css('background-image', 'none');
		};

		setTimeout(removeChartBackground, 60000);

		//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

		function makeGameWeather (arrayName, historicBoolean) {
			//Create an array of pairs of random numbers
			var randomPairs = {
				x: undefined,
				y: undefined
			};

			var randomPairArray = [];
			var normalizedArray = [];

			for (var i = 0; i < game.maxturn; i++) {
				randomPairs = {
					x: Math.random(),
					y: Math.random()
				}
				randomPairArray[i] = randomPairs;
			}

			// Create array of Z0s
			function boxMullerTransformation () {
				for (var i = 0; i < game.maxturn; i++) {
					normalizedArray[i] = Math.sqrt(-2 * Math.log(randomPairArray[i].x))*Math.cos(2*Math.PI*randomPairArray[i].y);

				// cutoffs for high and low values of Z0; use 5th standard deviation in std normal curve
					if (normalizedArray[i] >= 5) {
						normalizedArray[i] = 5;
					}

					else if (normalizedArray[i] <= -5) {
						normalizedArray[i] = -5;
					}
				}

				return normalizedArray;
			}; //end of boxMullerTransformation

			boxMullerTransformation();

			//Apply climateChange to normalizedArray as mean + Z0 * std_dev
			function applyClimateChange () {
				for (var i = 0; i < game.maxturn; i++) {
					arrayName[i] = game.climateArray[i].mean + (normalizedArray[i]*game.climateArray[i].std_dev);

					// ensures inches of rain will always be zero or greater
					if (arrayName[i] <= 0) {
						arrayName[i] = 0;
					}
				}

				return arrayName;

			}; //end of applyClimateChange

			function historicWeatherArray () {
				for (var i = 0; i < game.maxturn; i++) {
					arrayName[i] = game.continuous.climateArray[0].mean + (normalizedArray[i]*game.continuous.climateArray[0].std_dev);
				}

				return arrayName;
			}; // end of determineHistoricWeather()

			if (historicBoolean === "false") {
				applyClimateChange();
			}

			else {
				historicWeatherArray();
			}

		}; // end function makeGameWeather

		makeGameWeather(game.gameWeather, false);
		console.log("Weather with climate change: " + game.gameWeather);
		makeGameWeather(game.historicWeather, true);
		console.log("Historic weather: " + game.historicWeather);
		drawQuadratic();

		//Calculate Max Score --------------------------------------

		function calculateMaxScore () {

			var optimalCrops = []; //array of scores per turn if you knew the weather (post-hoc optimal) and chose the correct crop for each turn
			var payout = 0; //local payout variable for calculating maxScore

			function findOptimalCrop () {
			//Strategy: if the difference between the optimal value of the crop is closest to game.gameWeather, choose that crop at the optimal crop for that turn
				for (var i = 0; i < game.maxturn; i++) {

					var Adiff = game.gameWeather[i] - game.continuous.maxAweather;
					var Bdiff = game.gameWeather[i] - game.continuous.maxBweather;

					if (Math.abs(Adiff) < Math.abs(Bdiff)) {
						optimalCrops[i] = "cropA";
					}

					else if (Math.abs(Bdiff) < Math.abs(Adiff)) {
						optimalCrops[i] = "cropB";
					}

					else {
						optimalCrops[i] = "cropA";
					}
				}
				return optimalCrops;
			}; // end of findOptimalCrop()

			findOptimalCrop(); //sets value of optimalCrops array
			console.log("The array of optimal crops is " + optimalCrops);

			function addScores (turn, beta, maxweather, maxpayout) {
				payout = beta * Math.pow((game.gameWeather[game.turn] - maxweather), 2) + maxpayout;

				if (payout <= 0) {
					payout = 0;
					//console.log("The payout is " + payout);
				}

				else if (payout > 0) {
					payout = parseInt(payout);
					//console.log("The payout for " + turn + " is " + payout);
				}

				return payout;
			}; //end of addScores()

			for (var i=0; i < game.maxturn; i++) {

				if (optimalCrops[i] === "cropA") {
					addScores(i, game.continuous.betaA, game.continuous.maxAweather, game.continuous.maxApayout); //call addScores() with values of crop A
					game.maxScore += payout;
					//console.log("The score is now " + maxScore);
				}


				else if (optimalCrops[i] === "cropB") {
					addScores(i, game.continuous.betaB, game.continuous.maxBweather, game.continuous.maxBpayout); //call addScores() with values of crop B
					game.maxScore += payout;
					//console.log("The score is now " + maxScore);
				}
			}

			return game.maxScore;
		}; //end of calculateMaxScore()


		calculateMaxScore();

		console.log("The maximum possible score is " + game.maxScore + " points");

		// Calculate bonus points and fill in bonus-marker values
		function bonusHeight (threshold1, threshold2, bonus1, bonus2) {

			var pixelHeight = parseInt($("#points_bar").css("height")); //gets CSS height of points bar, in pixels
			var pointsPerPixelRatio = game.maxScore/pixelHeight; //this ratio applies to points bar up until bonus 2

			// Total bonuses are equal to a percentage of maxScore, determined manually in game object
			bonus1 = parseInt(threshold1*game.maxScore);
			bonus2 = parseInt(threshold2*game.maxScore);
			game.continuous.bonusOneTotal = bonus1;
			game.continuous.bonusTwoTotal = bonus2;

			$("#bonus1marker, #bonusLabel1").css("bottom", (bonus1/pointsPerPixelRatio));
			$("#bonus2marker, #bonusLabel2").css("bottom", (bonus2/pointsPerPixelRatio));
			$("#bonus1value").text(bonus1);
			$("#bonus2value").text(bonus2);

			return game.continuous.bonusOneTotal, game.continuous.bonusTwoTotal;
		};

		// run bonusHeight using first and second bonus thresholds as input
		bonusHeight(game.continuous.firstBonusThreshold, game.continuous.secondBonusThreshold);

	// Populate continuous opening dialogs
		//reveals payouts chart in sidebar and payouts chart in opening dialog
		//$("#crop_payouts_chart, #chartdiv").removeClass("hidden");
		//fills in bonus information
		$("#bonus_one_instructions").text(game.continuous.bonusOneTotal);
		$("#bonus_two_instructions").text(game.continuous.bonusTwoTotal);
		//fills in historic weather info
		$("#weather_type").text(" mean yearly rainfall ");
		$("#mean_rainfall").text(parseInt(game.meanHistoricWeather) + " inches of rain");

	// Call opening dialogs
		introDialogs();

	}; // >>>>>>>>>>>>>>>>>>>>>>>>>> end of initializeContinuous function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

}); // end of initializeGame ()

// >>>>>>>>>>>>>>>>>>>> 2. Game is introduced in a series of dialog boxes. User clicks through. >>>>>>>>>>>>>>>>>>>>

// Open first dialog; keep other dialogs hidden


  function introDialogs () {
    $( "#first-message" ).dialog({
      autoOpen: true,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-15%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '375',
          dialogClass: "no-close",
      buttons: [ { text: "Next (1 of 4)",
        click: function() {
          $( this ).dialog( "close" );
          $( "#second-message" ).dialog( "open" );
          $("#givens").addClass("glow");
          //$(".ui-widget-overlay").addClass("active-left");
        }
      } ]
    });

    $("#second-message").dialog({
      autoOpen: false,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-15%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '375',
          dialogClass: "no-close",
      buttons: [ { text: "Next (2 of 4)",
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
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-15%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '375',
          dialogClass: "no-close",
      buttons: [ { text: "Next (3 of 4)",
        click: function() {
          $( this ).dialog( "close" );
          $( "#fourth-message" ).dialog( "open" );
          $("table").removeClass("glow");
          $("#points_bar, #points_flag").toggleClass("glow");
          //$(".ui-widget-overlay").removeClass("active-left");
          //$(".ui-widget-overlay").addClass("active-right");
        }
      } ]
    });

    $( "#fourth-message" ).dialog({
      autoOpen: false,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-15%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '375',
          dialogClass: "no-close",
      buttons: [ { text: "Start Game",
        click: function() {
          $( this ).dialog( "close" );
          $("#points_bar, #points_flag").toggleClass("glow");
          //$(".ui-widget-overlay").removeClass("active-right");
        }
      } ]
    });
  };

  //remove this function call when server functions are restored!!!
/*

  function createGameOnServer() {
    return $.ajax(game.serverAddress + '/games', {
      type: 'POST',
      dataType: 'json',
      data: { label: game.gameLabel }
    });
  };

  function bootstrap() {
    var $creatingGameDialog = $( "#creating-game-dialog" );

    $creatingGameDialog.dialog({
      autoOpen: true,
      modal: true,
      sticky: true,
      closeOnEscape: false,
      resizable: false,
      position: {my: 'bottom', at: 'center center-15%', of: '#container'},
      stack: true,
      height: 'auto',
      width: '375',
      dialogClass: "no-close",
    });

    createGameOnServer()
      .success(function(data) {
        console.log(data);
        game.gameID = data.id;
        console.log(game);
        $creatingGameDialog.dialog('close');
        //introDialogs();
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $creatingGameDialog.html('Creating game failed!');
      });
  };

  bootstrap();*/

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
	game.cropchoice = "cropA";
	$("#sproutA").removeClass("hidden");
	$("#sproutB").addClass("hidden");
	$("#cropB").removeClass("select");
	//$("#grow").toggleClass("highlight");
	enableGrowButton();
};

function userClickedB () {
	$("#cropB").addClass("select");
	game.cropchoice = "cropB";
	$("#sproutB").removeClass("hidden");
	$("#sproutA").addClass("hidden");
	$("#cropA").removeClass("select");
	//$("#grow").toggleClass("highlight");
	enableGrowButton();
};


$("#cropA").on("click", userClickedA);

$("#cropB").on("click", userClickedB);


//>>>>>>>>>>>>>>>>>> 4. User clicks "grow" button. Results appear. >>>>>>>>>>>>>>>>>>>>>>>>


function weatherResults () { //triggered by #grow click, calls updateGame with correct arguments

	// hide buttons
	disableGrowButton();
	$(".plant, .plant_img, #grow").addClass("hidden").css("opacity", 0);

	//Identify weather display labels
	var rainOpacity;
	var sunOpacity;

	//Show weather results line on graph ("resultsLine")
	$(".jqplot-overlayCanvas-canvas").css('z-index', '3');


	function weatherOpacity (gameVersion) {

		function discrete () {
			if (game.gameWeather[game.turn] === "Wet") {
				rainOpacity = 1, sunOpacity = 0;
			}

			else if (game.gameWeather[game.turn] === "Dry") {
				rainOpacity = 0, sunOpacity = 1;
			}

			return rainOpacity, sunOpacity;

		};

		function continuous () {
			if (game.gameWeather[game.turn] >= game.continuous.gameRoots.topRoot) {
				rainOpacity = 1, sunOpacity = 0;
				//console.log(rainOpacity, sunOpacity);
				}

			else if (game.gameWeather[game.turn] > game.continuous.gameRoots.bottomRoot && game.gameWeather[game.turn] < game.continuous.gameRoots.topRoot) {
				rainOpacity = ((game.gameWeather[game.turn] - game.continuous.gameRoots.bottomRoot)/(game.continuous.gameRoots.topRoot - game.continuous.gameRoots.bottomRoot));
				sunOpacity = 1-rainOpacity;
				//console.log("rain opacity: " + rainOpacity + " sun opacity: " + sunOpacity);

			}

			else if (game.gameWeather[game.turn] <= game.continuous.gameRoots.bottomRoot) {
				rainOpacity = 0;
				sunOpacity = 1;
				//console.log(rainOpacity, sunOpacity);
			}

		};

		if (gameVersion === "discrete") {
			discrete();
		}

		else {
			continuous();
		}

		// feed correct opacity to displayWeather (discrete version: 1 or 0, continuous version: interpolated)
		function displayWeather (displayRain, displaySun) {

			$("#rain").addClass("displayWeather").removeClass("hidden").animate({opacity: displayRain});
			$("#sun").addClass("displayWeather").removeClass("hidden").animate({opacity: displaySun});
			//alert("rain opacity is: " + rainOpacity + " sun opacity is: " + sunOpacity);
		};

		displayWeather(rainOpacity, sunOpacity);

	}; // end of weatherOpacity()


	function weatherGraphics (gameVersion) {

		function discrete () {

			var payout = 0;

		// User chose crop A
			if (game.cropchoice == "cropA" && game.gameWeather[game.turn] == "Dry") {

				game.weatherResults = "sunny";
				payout = game.discrete.payoutAdry;
				displaySun();
				$("#deadA").removeClass("hidden");
				return payout;
			}

			else if (game.cropchoice == "cropA" && game.gameWeather[game.turn] == "Wet") {

				weatherResults = "rainy";
				payout = game.discrete.payoutAwet;
				displayRain();
				$("#rowsCropA").removeClass("hidden");
				return payout;
			}

		// User chose crop B
			else if (game.cropchoice == "cropB" && game.gameWeather[game.turn] == "Dry") {

				weatherResults = "sunny";
				payout = game.discrete.payoutBdry;
				displaySun();
				$("#deadB").removeClass("hidden");
				return payout;

			}

			else if (game.cropchoice == "cropB" && game.gameWeather[game.turn] == "Wet"){

				weatherResults = "rainy";
				payout = game.discrete.payoutBwet;
				displayRain();
				$("#rowsCropB").removeClass("hidden");
				return payout;
			}

			else {
				alert("Error: did you choose a crop? Please choose Crop A or Crop B and try again!");
			}

			updateDiscrete(payout);
		};

		function continuous () {
			// A. Crop A outcomes
			if (game.cropchoice === "cropA") {

				updateContinuous(game.continuous.betaA, game.continuous.maxApayout, game.continuous.maxAweather); // call updateGame with values for crop A

			// A1. game.gameWeather is wet
				//A1.i Wet game.gameWeather is "wet" (wetter than normal)
				if (game.gameWeather[game.turn] < game.continuous.maxAweather + Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) && game.gameWeather[game.turn] >= game.continuous.maxAweather + .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) ) {
					game.weatherReport = "wet enough";
					$("#wetA").removeClass("hidden");
				}

				//A1.ii Wet game.gameWeather is too wet
				else if (game.gameWeather[game.turn] >= game.continuous.maxAweather + Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) ) {
					game.weatherReport = "too wet";
					$("#deadAwet").removeClass("hidden");
					//display too-wet crop A ("Very Wet")
				}

			// A2. game.gameWeather is dry

				//A2.i. dry game.gameWeather is "dry" (drier than normal)
				else if (game.gameWeather[game.turn] < game.continuous.maxAweather - .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) && game.gameWeather[game.turn] >= game.continuous.maxAweather - Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) {
					game.weatherReport = "dry enough";
					$("#dryA").removeClass("hidden");
				}


				//A2.ii. dry game.gameWeather is too dry
				else if (game.gameWeather[game.turn] < game.continuous.maxAweather - Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) {
					game.weatherReport = "too dry";
					//display too-dry crop A
					$("#deadAdry").removeClass("hidden");
				}

			// A3. game.gameWeather is normal
				else if (game.gameWeather[game.turn] < (game.continuous.maxAweather + .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) && game.gameWeather[game.turn] >= (game.continuous.maxAweather - .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)))) {
					$("#rowsCropA").removeClass("hidden");
					game.weatherReport = "optimal weather";
				}
			}

			// 2. Crop B outcomes
			else if (game.cropchoice === "cropB") {

				updateContinuous(game.continuous.betaB, game.continuous.maxBpayout, game.continuous.maxBweather); // call updateGame with values for crop B

			// B1. game.gameWeather is wet

				//B1.i Wet game.gameWeather is wet
				if (game.gameWeather[game.turn] < game.continuous.maxBweather + Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaA)) && game.gameWeather[game.turn] >= game.continuous.maxBweather + .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB)) ) {
					game.weatherReport = "wet enough";
					//display healthy crop B (range of normal)
					$("#wetB").removeClass("hidden");
				}

				//B1.ii Wet game.gameWeather is too wet
				else if (game.gameWeather[game.turn] >= game.continuous.maxBweather + Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB))) {
					game.weatherReport = "too wet";
					$("#deadBwet").removeClass("hidden");
				}

			// B2. game.gameWeather is dry

				//B2.i Dry game.gameWeather is dry
				else if (game.gameWeather[game.turn] < game.continuous.maxAweather - .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) {
					game.weatherReport = "dry enough";
					$("#dryB").removeClass("hidden");
				}

				//B2.ii Dry game.gameWeather is too dry
				else if (game.gameWeather[game.turn] < game.continuous.maxBweather - Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB))) {
					game.weatherReport = "too dry";
					$("#deadBdry").removeClass("hidden");
				}


			//B3 Weather is in normal range
				else if (game.gameWeather[game.turn] < (game.continuous.maxBweather + .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaA))) && game.gameWeather[game.turn] >= (game.continuous.maxBweather - .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB)))) {
					$("#rowsCropB").removeClass("hidden");
					game.weatherReport = "optimal weather";
				}
			}
		}; // end of continuousWeather()

		if (gameVersion === "discrete") {
			discrete();
			console.log("Running the discrete version of weatherGraphics");
		}

		else {
			continuous();
			console.log("Running the continuous version of weatherGraphics");
		}

	}; //end of weatherGraphics()

	// fadeWeather: For both versions of game
	function fadeWeather () {
		//setTimeout calls function after a certain time; currently 3000 ms
		rainOpacity = 0;
		sunOpacity = 0;
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden");
	   	$(".croprows").addClass("hidden");
	   	$(".plant").removeClass("select");
	   	$(".plant, .plant_img, #grow").removeClass("hidden").animate({opacity: 1}, 1000);
	   	$(".jqplot-overlayCanvas-canvas").css('z-index', '-1'); //resets graph resultsLine to hidden
	};

	// Call the appropriate functions
	if (gameVersion.discreteWeather === true) {
		weatherOpacity("discrete");
		weatherGraphics("discrete");
		console.log("Calling discrete functions");
	}

	else {
		weatherOpacity("continuous");
		weatherGraphics("continuous");
		console.log("Calling continuous functions");
	}

	setTimeout(fadeWeather, 4000);

}; // end of weatherResults

// >>>>>>>>>>> 5. Game updates and loops back to the beginning of the code >>>>>>>>>>>>>>>>>>>

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Discrete Game Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function updateDiscrete (payout) {

	updateGame(payout);
	console.log("Discrete payout: " + payout);

	//carve up post-second-bonus pixels into fixed amount between this turn and last turn

	// WARNING: .css modifies the element's <style> property, not the CSS sheet!

	//updates dollars counter if bonus is reached. These functions are called from displayResultsDialog above

}; // end of updateDiscrete()

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Continuous Game Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

function updateContinuous (beta, maxpayout, maxweather) {

	var payout = 0;

	function calculatePayout () {
	var formula = beta * Math.pow((game.gameWeather[game.turn] - maxweather), 2) + maxpayout;

		if (formula <= 0) {
			payout = 0;
		}

		else if (formula > 0) {
			payout = parseInt(formula);
		}

		return payout;
	};

	calculatePayout();

	updateGame(payout);

}; // End of updateContinuous function

function updateGame (payout, gameVersionObject) { //this function is called and given arguments inside weatherResults function above

	if (gameVersion.discreteWeather === true) {
		gameVersionObject="game.continuous"
	}

	else {
		gameVersionObject="game.discrete"
	}

	// Functions shared by both versions

	var oldscore = game.score;
	var newscore = oldscore + payout;
	console.log("Update game payout: " + payout);
	console.log("Old score is " + oldscore + ", new score is " + newscore);

	function displayResultsDialog () {

		$(".results").dialog({
			autoOpen: false,
			modal: false,
			closeOnEscape: false,
			dialogClass: "no-close",
	        resizable: false,
	        draggable: false,
	        position: {my: 'top', at: 'top+25%', of: '#farm'},
	        stack: false,
	        width: '30%'
	    });

		//populate spans inside all results dialogs
	    $(".results").find("#weather_outcome").text(game.gameWeather[game.turn]);
    	$(".results").find("#new_score").text(payout);
    	$(".results").find("#weather_report").text(game.weatherReport);
    	$(".results").find("#chosen_crop").text(game.cropchoice);

		// bonus dialogs
		if (oldscore < gameVersionObject.bonusOneTotal && newscore >= gameVersionObject.bonusOneTotal) { //this only works now because I made totalRandomPoints global
			$("#bonus_results").dialog("open");
			$("#bonus_count").text("$" + bonusOneDollars);
			addBonus1();
		}

		else if (oldscore < gameVersionObject.bonusTwoTotal && newscore >= gameVersionObject.bonusTwoTotal) {
			$("#bonus_results").dialog("open");
			$("#bonus_count").text("$" + bonusTwoDollars);
			addBonus2();
		}

		//end game dialog
		else if (game.turn === maxturn) {
			$("#end_results").dialog("open");
			$("#total_score").text($("#point_count > h5").text()); //gets text of #point_count h5
			$("#total_dollars").text($("#dollars_counter").text()); //gets text of #dollars_counter
			// $("#playerID") //need Tony's work on this
		}

		//normal results dialogs
		else {
			$("#normal_results").dialog("open");
		}

		setTimeout(function() {$( ".results" ).dialog( "close" )}, 3500);
	}; // end of displayResultsDialog()

	//displayResultsDialog();

	function addTurn () {
		game.turn = game.turn + 1;
		$("#turns_counter").html("<h5>" + game.turn + "/" + game.maxturn + "</h5>");
	};

	setTimeout(addTurn, 4000);

	function newScore () {

		function animatePoints () {

			$("#points_bar").animate({ boxShadow : "0 0 15px 10px #ffcc33" });
			setTimeout(function () {$("#points_bar").animate({boxShadow : "0 0 0 0 #fff" })}, 3500);

		};

		function movePointsFlag () { //increase height of #points_flag using absolute positioning

			//Height of #points_bar as an integer, as defined by its CSS rule (in pixels)
			var pixelHeight = parseInt($("#points_bar").css("height"));

			//Current CSS position for #points_flag "bottom" as an integer
			var flagHeight = parseInt($("#points_flag").css("bottom"));

			//Current CSS height of #points_fill with "height" as an integer
			var fillHeight = parseInt($("#points_fill").css("height"));

			//Ratio of points per pixel
			var pointsPerPixelRatio = game.maxScore/pixelHeight; //use game.maxScore for now

			//Points_counter moves upward this number of pixels per turn, depending on the turn payout
			var perTurnHeight = payout/pointsPerPixelRatio;

			// Add perTurnHeight pixels to increase height of #points_flag and #points_fill
			flagHeight+=perTurnHeight;
			fillHeight +=perTurnHeight;

			// Set new heights in CSS style rules for #points_flag and #points_fill
			$("#points_flag").css("bottom", flagHeight);
			$("#points_fill").css("height", fillHeight);

			//carve up post-second-bonus pixels into fixed amount between this turn and last turn
		};

		movePointsFlag();
		animatePoints();

		game.score += payout;
		console.log("game score is now " + game.score);
		$("#point_count").html("<h5>" + game.score + "</h5>");

		return game.score; //this updates the value of game score

	}; //end of function newScore

	newScore();

	// Call addBonus functions from displayResultsDialog function, triggered at same time as bonus dialogs
	function addBonus1 () {
		game.realDollars = game.bonusOneDollars; //change value of realDollars to bonusOne
		$("#dollars_counter").html("$"+game.realDollars);
	};

	function addBonus2 () {
		game.realDollars = game.bonusOneDollars + game.bonusTwoDollars;
		$("#dollars_counter").html("$"+game.realDollars); //change value of realDollars to combined value of bonuses
	};

	//Record relevant data for the current turn
	/*function recordData (game) {
	    var payload = {
	      crop_choice: game.cropchoice,
	      weather:     game.gameWeather[game.turn],
	      game_over:   game.gameOver,
	      score:       payout
	    };

	    $.ajax(game.serverAddress + '/games/' + game.gameID + '/rounds', {
	      type: 'POST',
	      dataType: 'json',
	      data: payload
	    }).success(function(data) {
	      console.log('Round recorded successfully', data);
	    }).fail(function(jqXHR, text, err) {
	      console.log('Round record failed', jqXHR, text, err);
	    });
	};

    if (game.turn === game.maxturn) {
    	game.gameOver = true;
    }

	recordData(game);

	// If maxturn has been reached or exceeded, this function is called
	function endGame () {
		//call end-of-game dialog box
		$("button #grow").addClass("hidden");
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		$("#playerID").text(game.gameID);
		$("#total_score").text(score);
		$("#total_dollars").text(realDollars);
 		$( "#end_results" ).dialog({
	      autoOpen: false,
	      modal: true,
	      sticky: true,
	      closeOnEscape: false,
	          resizable: false,
	          position: {my: 'bottom', at: 'center center-15%', of: '#container'},
	          stack: true,
	          height: 'auto',
	          width: '375',
	          dialogClass: "no-close",
	      buttons: [ { text: "OK",
	        click: function() {
	          $( this ).dialog( "close" );
	        }
	      } ]
	    });
	};

	if (game.gameOver) {
		setTimeout(endGame, 1000);
	}*/

	// Reset crop values for new turn
	game.cropchoice = "";
};


//>>>>>>>>>>>>>>>>>>>>> Clicking #grow button triggers updateGame <<<<<<<<<<<<<

$("#grow").on("click", function () {
		/*if (gameVersion.discreteWeather == true) {
			gameVersionObject = discrete
		}
		else {
			gameVersionObject = continuous
		}*/

	if (($(this).hasClass("highlight"))&& game.turn <= game.maxturn) {
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		setTimeout(weatherResults, 100);
	}
});

//For Fran: test functionality of game in advance

function test (testValue) {
	if (testValue == null) {
		console.log("Enter game.climateArray or indifferencePoint to see the value of the variable");
	}

	else if (testValue == game.climateArray) {
		climateChange();
		return game.climateArray;
	}

	else if (testValue == game.discrete.indifferencePoint) {
		calculateIndifferencePoint();
		return game.discrete.indifferencePoint;
	}
};

}); //End of .ready ()


