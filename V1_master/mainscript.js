//TOP OF GAME

$(document).ready(function(){


//>>>>>>>>>>>> 1. GAME OBJECT - change game version and parameters here <<<<<<<<<<<<<<<

// Switches game between discrete and continuous versions
gameVersion = {
	discreteWeather: true, //INPUT
	testing: true //INPUT
};

// Game-wide variables
game = {

	// Title of game
	gameLabel: 'c1', //INPUT

	// Shared global variables:
	cropchoice: "",
	gamtaeWeher: [], // name intentionally scrambled
	weatherReport : "",
	histogram: [],
	meanHistoricWeather: 0,

	// Set number of turns per game
    maxturn : 15, //INPUT
	//Turn Counter
	turn : 0,
	// Total length of each turn (in milliseconds) from clicking #grow button to new turn
	turnLength: 4000, //INPUT

	//Points Counter
	score : 0, //starting score is 0

	// Real Dollars Earned
	realDollars : 0.50, //INPUT

	// Signals end of game when true
	gameOver: false,

	// Data will be sent to this server address
	serverAddress: 'http://v2.whatcrop.org',

	//Bonus point thresholds
		//in discrete version, determined by points expected through randomy play and optimal strategy play (calculated in initializeDiscrete)
		//in continuous version, determined by fraction of maxScore (user input)

	bonusOneTotal: 0,
	bonusTwoTotal: 0,

	// Bonus payments, in dollars
	bonusOneDollars: 1.25, //INPUT
	bonusTwoDollars: 0.75, //INPUT

// Discrete game version
	discrete: {

		// Discrete weather crop payouts
	    payoutAwet: 55, //INPUT
		payoutAdry: 30, //INPUT
		payoutBwet: 80, //INPUT
		payoutBdry: 10, //INPUT
		// Set rain threshold
		threshold: 750, //INPUT
		//array of scores if you knew the weather (post-hoc optimal) and chose the correct crop for each turn; used to calculate maxScore
		optimalCrops: [],
		// maximum possible score, determined by optimalCrops
		maxScore : 0,
		optimalChoice1: [], // arrays used to calculate bonusTwoTotal
		optimalChoice2: [],
		// Indifference point (at which crops A and B are equally good choices)
		// and indifferentTurn (turn at which indiff point is reached)
		indifferencePoint: 0,
		indifferentTurn: 0,
		// Climate change per turn
		climateArray: []
	},

// Continuous game version
	continuous: {
		// Bonuses are manually determined as a percentage of maxScore
		// Change the percentage of maxScore using firstBonusThreshold and secondBonusThreshold
		maxScore: 1000, //INPUT
		firstBonusThreshold: .75, //INPUT
		secondBonusThreshold: .90, //INPUT
		// Continuous weather crop payouts -- enter here
		betaA : -.004, //INPUT
		betaB : -.001, //INPUT
		maxApayout : 200, //P*(A) //INPUT
		maxAweather : 800, //w*(A) //INPUT
		maxBpayout : 120, //P*(B) //INPUT
		maxBweather : 450, //w*(B) //INPUT
		// Roots of payout parabolas, calculated below
		gameRoots : {
			topRoot: 0,
			bottomRoot: 0
		},
		// Manually set climate change by turn, up to game.maxturn
		climateArray : [],

		// Contains continuous game chart options. setOptions() function stores completed objects here
		optionsObj: {
			payoutObj: {},
			historyObj: {},
			givensObj: {}
		},

		// Array values filled in using historicWeatherArray() below
		historicWeather : [],

		// Stores the payout graph (inside "chartdiv") that updates with weather results during the game
		payoutData: [],
		givensChart: {}
	}

}; //end of game object


// >>>>>>>>>>>>>>>>> 2. GAME SET-UP -- discrete and continuous initialization functions <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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

// >>>>>>>>>>>>>>>>>> 2.A Initialize discrete version <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	function initializeDiscrete () {

		// Unhide discrete version elements

		$("#crop_payouts_table").removeClass("hidden");
		$("#discrete_history").removeClass("hidden");
		$("#tablediv").removeClass("hidden");

		// Populate discrete.climateArray //INPUT

		game.discrete.climateArray[0] = 0;
		game.discrete.climateArray[1] = 0;
		game.discrete.climateArray[2] = 0;
		game.discrete.climateArray[3] = 0;
		game.discrete.climateArray[4] = 0;
		game.discrete.climateArray[5] = 0;
		game.discrete.climateArray[6] = 0;
		game.discrete.climateArray[7] = 0;
		game.discrete.climateArray[8] = 0;
		game.discrete.climateArray[9] = 0;
		game.discrete.climateArray[10] = 0;
		game.discrete.climateArray[11] = 0;
		game.discrete.climateArray[12] = 0;
		game.discrete.climateArray[13] = 0;
		game.discrete.climateArray[14] = 0;
		game.discrete.climateArray[15] = 0;
		game.discrete.climateArray[16] = 25;
		game.discrete.climateArray[17] = 25;
		game.discrete.climateArray[18] = 25;
		game.discrete.climateArray[19] = 25;
		game.discrete.climateArray[20] = 25;
		game.discrete.climateArray[21] = 25;
		game.discrete.climateArray[22] = 25;
		game.discrete.climateArray[23] = 25;
		game.discrete.climateArray[24] = 25;
		game.discrete.climateArray[25] = 25;
		game.discrete.climateArray[26] = 25;
		game.discrete.climateArray[27] = 25;
		game.discrete.climateArray[28] = 25;
		game.discrete.climateArray[29] = 25;
		game.discrete.climateArray[30] = 25;
		game.discrete.climateArray[31] = 25;
		game.discrete.climateArray[32] = 25;
		game.discrete.climateArray[33] = 25;
		game.discrete.climateArray[34] = 25;
		game.discrete.climateArray[35] = 25;
		game.discrete.climateArray[36] = 0;
		/*game.discrete.climateArray[37] = 0;
		game.discrete.climateArray[38] = 0;
		game.discrete.climateArray[39] = 0;
		game.discrete.climateArray[40] = 0;
		game.discrete.climateArray[41] = 0;
		game.discrete.climateArray[42] = 0;
		game.discrete.climateArray[43] = 0;
		game.discrete.climateArray[44] = 0;
		game.discrete.climateArray[45] = 0;
		game.discrete.climateArray[46] = 0;
		game.discrete.climateArray[47] = 0;
		game.discrete.climateArray[48] = 0;
		game.discrete.climateArray[49] = 0;
		game.discrete.climateArray[50] = 0;
		game.discrete.climateArray[51] = 0;
		game.discrete.climateArray[52] = 0;
		game.discrete.climateArray[53] = 0;
		game.discrete.climateArray[54] = 0;
		game.discrete.climateArray[55] = 0;
		game.discrete.climateArray[56] = 0;
		game.discrete.climateArray[57] = 0;
		game.discrete.climateArray[58] = 0;
		game.discrete.climateArray[59] = 0;
		game.discrete.climateArray[60] = 0;
		game.discrete.climateArray[61] = 0;
		game.discrete.climateArray[62] = 0;
		game.discrete.climateArray[63] = 0;
		game.discrete.climateArray[64] = 0;
		game.discrete.climateArray[65] = 0;
		game.discrete.climateArray[66] = 0;
		game.discrete.climateArray[67] = 0;
		game.discrete.climateArray[68] = 0;
		game.discrete.climateArray[69] = 0;
		game.discrete.climateArray[70] = 0;
		game.discrete.climateArray[71] = 0;
		game.discrete.climateArray[72] = 0;
		game.discrete.climateArray[73] = 0;
		game.discrete.climateArray[74] = 0;*/


		// Create list of random numbers that will become weather-------

		weatherArray = [];

		function makeWeatherArray() {
			for (var i = 0; i < game.maxturn; i++) {
				var weather = Math.floor((Math.random()*1000)+1);
				weatherArray[i] = weather;
			}

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

			return thresholdArray;
		};

		makeThresholdArray(); //sets thresholdArray to new value based on climate change

		// Set game weather -------

		function makeGameWeather() { //makeGameWeather takes local empty variable "perTurnWeather" and gives it value depending on parameter x

		for (var i = 0; i < game.maxturn; i++) {
			if (weatherArray[i] <= thresholdArray[i])
				{
					var perTurnWeather = "Wet";
					game.gamtaeWeher[i] = perTurnWeather;
				}

			else if (weatherArray[i] > thresholdArray[i])
				{
					var perTurnWeather = "Dry";
					game.gamtaeWeher[i] = perTurnWeather;
				}

				} //end of for loop

			return game.gamtaeWeher;
		};

		makeGameWeather(); //sets value of gameWeather (array containing weather for length of game)

		//Calculate Max Score --------------------------------------

		function calculateOptimalCrop () {

			for (var i = 0; i <= game.maxturn-1; i++) {


				if (game.gamtaeWeher[i] === "Wet" && game.discrete.payoutAwet > game.discrete.payoutBwet)
				{
					game.discrete.optimalCrops[i] = game.discrete.payoutAwet;
				}
				else if (game.gamtaeWeher[i] === "Dry" && game.discrete.payoutAdry > game.discrete.payoutBdry)
				{
					game.discrete.optimalCrops[i] = game.discrete.payoutAdry;
				}
				else if (game.gamtaeWeher[i] === "Wet" && game.discrete.payoutBwet > game.discrete.payoutAwet)
				{
					game.discrete.optimalCrops[i] = game.discrete.payoutBwet;
				}
				else if (game.gamtaeWeher[i] === "Dry" && game.discrete.payoutBdry > game.discrete.payoutAdry)
				{
					game.discrete.optimalCrops[i] = game.discrete.payoutBdry;
				}
			} //end of for loop

			return game.discrete.optimalCrops;
		};

		calculateOptimalCrop(); //sets value of optimalCrops array

		// Adds up values inside game.discrete.optimalCrops, which is equal to the maximum possible score
		function calculateMaxScore () {
			for (var i=0; i <= game.maxturn-1; i++) {
				game.discrete.maxScore += game.discrete.optimalCrops[i]
			}
			return game.discrete.maxScore;
		};

		calculateMaxScore();

		// Calculate Random Play bonus threshold ---------------------------------

				// A. Check indifference point and calculate turn at which indifference point occurs

		pWet = [];

		function checkIndifferencePoint () {
			var indifference = (game.discrete.payoutBwet - game.discrete.payoutAwet)/(game.discrete.payoutAdry - game.discrete.payoutAwet + game.discrete.payoutBwet - game.discrete.payoutBdry);

			// Assign the value of the indifference point to the game variable
			game.discrete.indifferencePoint = indifference;

			return game.discrete.indifferencePoint;
		};

				// B. on which turn does the probability of wet weather = indifference point?

		function findTurnAtIndifferencePoint () { //calculates the turn at which the probability of wet weather equals the indiff point

			for (var i = 0; i <= game.maxturn-1; i++) {
				pWet[i] = thresholdArray[i]/1000;
			}

			// if 1) the probablility of wet weather (pWet) equals the indifference point, or if 2) the probability crosses the indifference point from above or 3) below,
				// the turn at which it equals/crosses the indifferencePoint is stored in variable indifferentTurn
			for (var i = 0; i <= game.maxturn-1; i++) {

				if ((pWet[i] === game.discrete.indifferencePoint) || (pWet[i] > game.discrete.indifferencePoint && pWet[i+1] < game.discrete.indifferencePoint)
						|| (pWet[i] < game.discrete.indifferencePoint && pWet[i+1] > game.discrete.indifferencePoint)) {
					console.log("at this i, crossed indiff point " + i);
					game.discrete.indifferentTurn = i; // indifferentTurn is the turn at which the indifferencePoint has already been crossed; hence, i+1
				}
			}

			return game.discrete.indifferentTurn;
		};

				// C. Calculate probability of dry weather for all turns.
				//How many points would you make playing by random chance as of the indifferentTurn?

		pDry=[];

		function calculateProbabilityDry () { // Creates an array, pDry, that lists the probability of dry weather for all turns.
			for (var i = 0; i <= game.maxturn-1; i++) {
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
			for (var i = 0; i <= game.maxturn-1; i++) {
				randomPoints[i] = .5*pDry[i]*game.discrete.payoutAdry + .5*pWet[i]*game.discrete.payoutAwet +
				 .5*pDry[i]*game.discrete.payoutBdry + .5*pWet[i]*game.discrete.payoutBwet;
			}

			for (var i = 0; i <= game.maxturn-1; i++) {
				game.bonusOneTotal += parseFloat(randomPoints[i]);
			}

			return game.bonusOneTotal;
		};

		calculateRandomPlayPoints();

		// Calculate Ante-Hoc Optimal Play bonus threshold ---------------------------------
		// bonusTwoTotal is the number of points expected with optimal play

		// Fill arrays optimalChoice1/2 with zeroes
		for (var i = 0; i <= game.maxturn-1; i++) {
			game.discrete.optimalChoice1[i] = 0;
			game.discrete.optimalChoice2[i] = 0;
		};

		function optimalChoice (min, max, payoutDry, payoutWet) {
			var result = [];

			for (var i = 0; i < min; i++) {
				result[i]=0;
			};

			for (var i = min; i <= max; i++) {
				result[i] = pDry[i] * payoutDry + pWet[i] * payoutWet;
			};

			return result;

		};

		function optimalScenario () {

		// if indifferentTurn has a value between 0 (not inclusive) and maxturn (inclusive)
			if (game.discrete.indifferentTurn > 0 && game.discrete.indifferentTurn < game.maxturn) {
				// If A is the first optimal choice (regardless of starting pWet and pDry)
				if ((game.discrete.payoutAwet*pWet[0]+game.discrete.payoutAdry*pDry[0]) > (game.discrete.payoutBwet*pWet[0]+game.discrete.payoutBdry*pDry[0])) {
					game.discrete.optimalChoice1 = optimalChoice(0, game.discrete.indifferentTurn, game.discrete.payoutAdry, game.discrete.payoutAwet);
					game.discrete.optimalChoice2 = optimalChoice(game.discrete.indifferentTurn, game.maxturn-1, game.discrete.payoutBdry, game.discrete.payoutBwet);
				}

				// If B is first optimal choice (regardless of starting pWet and pDry)
				else if ((game.discrete.payoutAwet*pWet[0]+game.discrete.payoutAdry*pDry[0]) <= (game.discrete.payoutBwet*pWet[0]+game.discrete.payoutBdry*pDry[0])) {
					game.discrete.optimalChoice1 = optimalChoice(0, game.discrete.indifferentTurn, game.discrete.payoutBdry, game.discrete.payoutBwet);
					game.discrete.optimalChoice2 = optimalChoice(game.discrete.indifferentTurn, game.maxturn-1, game.discrete.payoutAdry, game.discrete.payoutAwet);
				}

				calculateOptimalPlayPoints(game.discrete.indifferentTurn, game.maxturn-1);
			}

		// if indifferentTurn has a value equal to or less than 0, or is greater than or equal to maxturn

			else if (game.discrete.indifferentTurn <=0 || game.discrete.indifferentTurn >= game.maxturn) {

				if ((game.discrete.payoutAwet*pWet[0]+game.discrete.payoutAdry*pDry[0]) > (game.discrete.payoutBwet*pWet[0]+game.discrete.payoutBdry*pDry[0])) {
					game.discrete.optimalChoice1 = optimalChoice(0, game.maxturn-1, game.discrete.payoutAdry, game.discrete.payoutAwet);
				}

				else if ((game.discrete.payoutAwet*pWet[0]+game.discrete.payoutAdry*pDry[0]) <= (game.discrete.payoutBwet*pWet[0]+game.discrete.payoutBdry*pDry[0])) {
					game.discrete.optimalChoice1 = optimalChoice(0, game.maxturn-1, game.discrete.payoutBdry, game.discrete.payoutBwet);
				}

				calculateOptimalPlayPoints(game.maxturn-1, game.maxturn-1);
			}
		}; // end of optimalScenario()

		function calculateOptimalPlayPoints (turn, max) {

			var totalOptimalChoice1 = 0;
			var totalOptimalChoice2 = 0;


			function sumtotal1 () {
				for (var i = 0; i <= turn; i++) {
					totalOptimalChoice1 += game.discrete.optimalChoice1[i];
				}
				return totalOptimalChoice1;
			};

			var total1 = sumtotal1();

			function sumtotal2 () {
				for (var i = turn; i <= max; i++) {
					totalOptimalChoice2 += game.discrete.optimalChoice2[i];
				}

				return totalOptimalChoice2;
			};

			var total2 = sumtotal2();

			//bonusTwoTotal is the sum of total optimal choice 1 + total optimal choice 2
			game.bonusTwoTotal = parseFloat(totalOptimalChoice1 + totalOptimalChoice2);

			return game.bonusTwoTotal;
		}; // end of calculateOptimalPlayPoints();

		optimalScenario();

			/*optimalScenario();

			var totalOptimalChoice1 = 0;
			var totalOptimalChoice2 = 0;

			for (var i = 0; i <= game.maxturn-1; i++) {
				totalOptimalChoice1 += game.discrete.optimalChoice1[i];
				totalOptimalChoice2 += game.discrete.optimalChoice2[i];
			}

			console.log("optimal choice 1 sum total = " + totalOptimalChoice1);
			console.log("optimal choice 2 sum total = " + totalOptimalChoice2);

			game.bonusTwoTotal = parseFloat(totalOptimalChoice1+totalOptimalChoice2);

			return game.bonusTwoTotal;
		};

		calculateOptimalPlayPoints();*/


	// Populate empty spans with discrete-specific data

		function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
			$("table").find("td#payoutAwet").text(payoutAwet );
			$("table").find("td#payoutAdry").text(payoutAdry );
			$("table").find("td#payoutBwet").text(payoutBwet );
			$("table").find("td#payoutBdry").text(payoutBdry );
		};
		writeCropPayout (game.discrete.payoutAwet, game.discrete.payoutAdry, game.discrete.payoutBwet, game.discrete.payoutBdry);

		//Populates opening dialogs
		$("#weather_type").text(" weather ");
		$("#weather_modifier").text(" rainy");
		var dryPercent = ((1000-game.discrete.threshold)/1000)*100;
		var wetPercent = 100 - ((1000-game.discrete.threshold)/1000)*100;
		$(".dry_percent").text(dryPercent + "%");
		$(".wet_percent").text(wetPercent + "%");
		$("#sun_probability").css("height", dryPercent);
		$("#rain_probability").css("height", wetPercent);

	}; // >>>>>>>>>>>>>>>>>>>>>>>>> end of initializeDiscrete function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>2.B Initialize continuous version <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	function initializeContinuous () {

		// Unhide continuous version elements
		$("#crop_payouts_chart, #continuous_history, #continuous_payout").removeClass("hidden");

		//Populate continuous.climateArray //INPUT

		game.continuous.climateArray = [
			{mean: 750, std_dev: 80}, //0 -- initial climate
			{mean: 750, std_dev: 80}, //1
			{mean: 750, std_dev: 80}, //2
			{mean: 750, std_dev: 80}, //3
			{mean: 750, std_dev: 80}, //4
			{mean: 750, std_dev: 80}, //5
			{mean: 750, std_dev: 80}, //6
			{mean: 750, std_dev: 80}, //7
			{mean: 750, std_dev: 80}, //8
			{mean: 750, std_dev: 80}, //9
			{mean: 750, std_dev: 80}, //10
			{mean: 750, std_dev: 80}, //11
			{mean: 750, std_dev: 80}, //12
			{mean: 750, std_dev: 80}, //13
			{mean: 750, std_dev: 80}, //14
			{mean: 350, std_dev: 80}, //15
			{mean: 350, std_dev: 80}, //16
			{mean: 350, std_dev: 80}, //17
			{mean: 350, std_dev: 80}, //18
			{mean: 350, std_dev: 80}, //19
			{mean: 350, std_dev: 80}, //20
			{mean: 350, std_dev: 80}, //21
			{mean: 350, std_dev: 80}, //22
			{mean: 350, std_dev: 80}, //23
			{mean: 350, std_dev: 80}, //24
			{mean: 350, std_dev: 80}, //25
			{mean: 350, std_dev: 80}, //26
			{mean: 350, std_dev: 80}, //27
			{mean: 350, std_dev: 80}, //28
			{mean: 350, std_dev: 80}, //29
			{mean: 350, std_dev: 80}, //30
			{mean: 350, std_dev: 80}, //31
			{mean: 350, std_dev: 80}, //32
			{mean: 350, std_dev: 80}, //33
			{mean: 350, std_dev: 80}, //34
			{mean: 350, std_dev: 80}, //35
			{mean: 350, std_dev: 80}, //36
			{mean: 350, std_dev: 80}, //37
			{mean: 350, std_dev: 80}, //38
			{mean: 350, std_dev: 80}, //39
			{mean: 350, std_dev: 80}, //40
			{mean: 350, std_dev: 80}, //41
			{mean: 350, std_dev: 80}, //42
			{mean: 350, std_dev: 80}, //43
			{mean: 350, std_dev: 80}, //44
			{mean: 350, std_dev: 80}, //45
			{mean: 350, std_dev: 80}, //46
			{mean: 350, std_dev: 80}, //47
			{mean: 350, std_dev: 80}, //48
			{mean: 350, std_dev: 80}, //49
			{mean: 350, std_dev: 80}  //50
		];


		$.jqplot.config.enablePlugins = true;

		// objects containing data series arrays and canvas overlay arrays to be drawn in continuous payout and historic weather charts


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
			var maxY = [upperBoundY+50];
			var ticksY = [[0, ""], [game.continuous.maxApayout, game.continuous.maxApayout], [game.continuous.maxBpayout, game.continuous.maxBpayout], [upperBoundY, ""], [maxY, ""]];
			var ticksWeatherX = [[]]; // populated below
			var ticksWeatherY = [];


			// Create graphable data array for historicWeather using freqency of values
			function historicWeatherHistogram () {

				var range = Math.max.apply(Math, game.continuous.historicWeather) - 0;
				var intervalNumber = 2*Math.ceil(Math.sqrt(game.continuous.historicWeather.length)); // total intervals is 8 and the interval numbers are 0,1,2,3,4,5,6,7 in the case of 50 turns
				var intervalWidth = range/intervalNumber;

				//console.log("range: " + range + " number of intervals: " + intervalNumber + " interval width: " + intervalWidth);

				function countOccurrence(newinterval) { //this functions runs for each interval

					var intervalBottom = newinterval*intervalWidth;
					var intervalTop = ((newinterval+1)*intervalWidth);

					//console.log(intervalBottom + " to " + intervalTop);

					var count = 0;
					var scaleCount = 0;

					function originalCount () {
						for (var i =0; i < game.continuous.historicWeather.length; i++) {

							if (game.continuous.historicWeather[i] >= intervalBottom && game.continuous.historicWeather[i] < intervalTop) {
								count += 1;
							}

							else if (newinterval === (intervalNumber-1) && game.continuous.historicWeather[i] >= intervalBottom) {
								count +=1;
							}

							else {
								count = count;
							}
						}

						return count;
					};

					originalCount();

					//console.log("[" + parseInt(intervalBottom) + ", " + count + "]");

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

				return frequency;
			}; //end historicWeatherHistogram


			game.histogram = historicWeatherHistogram();
			//console.log("Histogram data ([intervalBottom, count, null]): " + game.histogram);

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

		chartObjects = {
			payoutObj: {
				seriesArray: [],
				canvasOverlayLine: {verticalLine:{
						name: 'resultsLine',
	                    x: undefined, // this positions the line on the x-axis
	                    lineWidth: 4,
	                    color: 'rgb(255, 204, 51)', //yellow
	                    shadow: false
				}},
				color: ["#000","#820000", "#3811c9"]
			},
			historyObj: {
				seriesArray: [],
				canvasOverlayLine: {verticalLine:{
						name: 'avgHistoricWeather',
			        	x: game.meanHistoricWeather,
			        	lineWidth: 4,
			        	color: '#3811c9', //blue
			        	shadow: false
				}},
				color: ["rgba(152, 152, 152, 1)", "#820000", "#3811c9"]
			},
			givensObj: {
				seriesArray: [],
				canvasOverlayLine: {verticalLine:{
						name: 'resultsLine',
	                    x: undefined, // this positions the line on the x-axis
	                    lineWidth: 4,
	                    color: 'rgb(255, 204, 51)', //yellow
	                    shadow: false
				}},
				color: ["#000", "#820000", "#3811c9"]
			}
		};

		// Create options object for jqPlot graph using optionsObj and setOptions()
			function setOptions (seriesName, showData, showLabel) {

				if (seriesName === "payoutObj" || seriesName === "givensObj") {
					chartObjects[seriesName]["seriesArray"][0] = {};
					chartObjects[seriesName]["seriesArray"][1] =
									{
						      	    // CropA
						      	    label: "Crop A",
						            lineWidth: 2,
						            showMarker: false,
						            renderer:$.jqplot.LineRenderer,
						            xaxis:'xaxis',
						          	yaxis:'yaxis',
						            show: true
						          };

					chartObjects[seriesName]["seriesArray"][2] = {
						            // CropB
						            label: "Crop B",
						            lineWidth: 2,
						            showMarker: false,
						            renderer:$.jqplot.LineRenderer,
						            xaxis:'xaxis',
						          	yaxis:'yaxis',
						            show: true
						          };
				}

				else if (seriesName === "historyObj") {
					chartObjects[seriesName]["seriesArray"][0] = {
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
					};
					chartObjects[seriesName]["seriesArray"][1] = {};
					chartObjects[seriesName]["seriesArray"][2] = {};
				}

				game.continuous.optionsObj[seriesName] = {
					      series:
					          chartObjects[seriesName]["seriesArray"]
					      ,

					      seriesColors:
					      		chartObjects[seriesName]["color"]
					      ,


					      grid: {
			        		drawGridlines: true,
			        		shadow: false,
			        		borderWidth: 1,
			        		drawBorder: true,
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
					          	show: showData,
					          	location:'n',
					          	ypadding:3,
					          	xpadding:3,
					          	formatString: "%#.0f"
					          }
					      },

					      axesDefaults: {
	        				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	    				  },
					      axes: {

			      			/*y2axis:{
			      				label: "Relative frequency",
			     				labelOptions: {
	            					show: false,
	            					fontFamily: 'Georgia, serif',
	            					fontSize: '11pt'
	        					},
			          			//renderer: $.jqplot.CategoryAxisRenderer,
			          			rendererOptions:{
			                    	tickRenderer:$.jqplot.CanvasAxisTickRenderer
			                    },
			                	tickOptions:{
			                        mark: "inside",
			                        showLabel: showLabel,
			                        //formatString: "%#.0f",
			                        showMark: false,
			                        showGridline: false
			                    }
			      			},*/

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

			          			label:'Rainfall (inches)',
			          			labelRenderer: $.jqplot.AxisLabelRenderer,
			         			labelOptions: {
			            			fontFamily: 'Georgia, serif',
			            			fontSize: '12pt'
			          			}
			        		},

			        		yaxis:{
			          			ticks: ticksY,
			          			rendererOptions:{
			                    	tickRenderer:$.jqplot.CanvasAxisTickRenderer
			                    },

			                	tickOptions:{
			                        mark: "cross",
			                        showLabel: showData,
			                        //formatString: "%#.0f",
			                        showMark: true,
			                        showGridline: true
			                    },

			          			label:'Points',
			          			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
									labelOptions: {
				            			fontFamily: 'Georgia, serif',
				            			fontSize: '12pt',
				            			show: showLabel
			          				}
			      			}
			    		  }, // end of axes

						canvasOverlay: {
			        		show: true,
				            objects:

				            	[chartObjects[seriesName]["canvasOverlayLine"]]

						} // end of canvasOverlay

					}; // end optionsObj object

				return game.continuous.optionsObj[seriesName];
			}; //end function setOptions()

	// writes crop payout dataset to game object
			game.continuous.payoutData = [[null], plotA, plotB];


	//CHART 1: draw graph in #crop_payouts_chart of A/B payouts (intro dialog)
			setOptions("payoutObj", true, true);
			var payoutChart = $.jqplot("crop_payouts_chart", game.continuous.payoutData, game.continuous.optionsObj.payoutObj);

	// CHART 2: draw graph in #continuous_history (for intro dialog) using optionsObj above

			setOptions("historyObj", false, false);
			var historyChart = $.jqplot("continuous_history", [game.histogram, [null], [null]], game.continuous.optionsObj.historyObj);


	//CHART 3: draw graph in sidebar #chartdiv using optionsObj above
			setOptions("givensObj", false, true);
			game.continuous.givensChart = $.jqplot("chartdiv", game.continuous.payoutData, game.continuous.optionsObj.givensObj);

		}; //end of drawQuadratic()

		// Removes background coloration on payout/weather chart after 30 seconds
		function removeChartBackground () {
			$(".jqplot-xaxis").css('background-image', 'none');
		};

		//setTimeout(removeChartBackground, game.turnLength*5);

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

			if (historicBoolean === false) {
				applyClimateChange();
			}

			else {
				historicWeatherArray();
			}

		}; // end function makeGameWeather

		makeGameWeather(game.gamtaeWeher, false);

		makeGameWeather(game.continuous.historicWeather, true);

		drawQuadratic();

	// Populate opening dialogs with continuous-specific data
		$("#weather_type").text(" mean yearly rainfall ");
		$("#mean_rainfall").text(parseInt(game.meanHistoricWeather) + " inches of rain");
	}; // >>>>>>>>>>>>>>>>>>>>>>>>>> end of initializeContinuous function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//Shared Initialization (Both Games)

	// Set height of bonus markers
	function bonusHeight (bonus1, bonus2) {

		var pixelHeight = parseFloat($("#points_bar").css("height")); //gets CSS height of points bar, in pixels

		// If playing the discrete version
		if (gameVersion.discreteWeather) {

			var pointsPerPixelRatio = game.discrete.maxScore/pixelHeight; //this ratio applies to points_bar up until bonus 2

			//If the indifference point is not reached during the game, show only bonus 1
			if (game.discrete.indifferentTurn <=0 || game.discrete.indifferentTurn >= game.maxturn-1) {
				$("#bonus1marker, #bonusLabel1").css("bottom", (bonus1/pointsPerPixelRatio));
				$("#bonus2marker, #bonusLabel2, #bonus_two_instructions").addClass("hidden");

				// Fill in bonus information in opening dialog
				$("#bonus_one_instructions").text(parseInt(game.bonusOneTotal));
			}

			else {
				console.log("Assigning bonuses as normal");
			}

		}

		else if (!gameVersion.discreteWeather) {

			var pointsPerPixelRatio = game.continuous.maxScore/pixelHeight; //this ratio applies to points_bar up until bonus 2

			// Total bonuses are equal to a percentage of maxScore, determined manually in game object
			bonus1 = parseFloat(game.continuous.firstBonusThreshold*game.continuous.maxScore);
			bonus2 = parseFloat(game.continuous.secondBonusThreshold*game.continuous.maxScore);
			game.bonusOneTotal = bonus1;
			game.bonusTwoTotal = bonus2;
		}

		// Position bonus markers and labels on points_bar
		$("#bonus1marker, #bonusLabel1").css("bottom", (bonus1/pointsPerPixelRatio));
		$("#bonus2marker, #bonusLabel2").css("bottom", (bonus2/pointsPerPixelRatio));
		$("#bonus1value").text(parseInt(bonus1));
		$("#bonus2value").text(parseInt(bonus2));

		// Populate bonus information spans in opening dialogs
		$("#bonus_one_instructions").text(parseInt(game.bonusOneTotal));
		$("#bonus_two_instructions").text(" and " + parseInt(game.bonusTwoTotal));

		return game.bonusOneTotal, game.bonusTwoTotal;
	};

	bonusHeight(game.bonusOneTotal, game.bonusTwoTotal);

	//Populate shared spans in opening dialogs

	//Turn Counter
	$("#turns_counter").text(game.turn + "/" + game.maxturn);

	//Points Counter - writes initial score to points counter
	$("#point_count").html("<h5>"+game.score+"</h5>");

	// Real Dollars Earned - writes initial realDollars to dollars counter
	$("#dollars_counter").text("$"+game.realDollars+"0");

	// Populate # of turns to play in opening and ending dialogs
	$(".turncount_instructions").text(game.maxturn);


	// If gameVersion.testing = true, the test function at the bottom of the code will run after initialization is complete
	if (gameVersion.testing) {
		setTimeout(test, 1000);
	}


	// Detects user's browser and throws an alert if browser is not Firefox, Chrome, or Safari

	var BrowserDetect = {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				   string: navigator.userAgent,
				   subString: "iPhone",
				   identity: "iPhone/iPod"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]
	};

	BrowserDetect.init();

	if (BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "Firefox" || BrowserDetect.browser == "Safari" || BrowserDetect.browser == "Opera") {
		bootstrap();
	}

	else {
		alert("WARNING: Your browser might not be compatible with the game. Please use only Firefox, Chrome, Safari, or Opera to play.");
		var agree = prompt("Please type the letter 'Y' if you would like to proceed. Otherwise, your score will not be recorded.");

		if (agree === "Y" || agree === "y") {
			bootstrap();
		}

		else {
			alert("Game canceled. Please try again in another browser.");
		}

	}


}); // end of initializeGame ()

// >>>>>>>>>>>>>>>>>>>> 3. INTRO DIALOGS. Game is introduced in a series of dialog boxes. User clicks through. >>>>>>>>>>>>>>>>>>>>

// Open first dialog; keep other dialogs hidden


  function introDialogs () {

    $( "#first-message" ).dialog({
      autoOpen: true,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-25%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '400',
          dialogClass: "no-close",
      buttons: [ { text: "Next (1 of 5)",
        click: function() {
          $( this ).dialog( "close" );
          $( "#second-message" ).dialog( "open" );
        }
      } ]
    });

    $("#second-message").dialog({
      autoOpen: false,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-25%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '400',
          dialogClass: "no-close",
      buttons: {
      	"Next (2 of 5)": function () {
      		$(this).dialog("close");
      		$( "#third-message" ).dialog( "open" );
      	},
      	"Back": function () {
      		$(this).dialog("close");
      		$("#first-message").dialog("open");
      	}
      }
    });

    $("#third-message").dialog({
      autoOpen: false,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-25%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '400',
          dialogClass: "no-close",
	      buttons: {
	      	"Next (3 of 5)": function () {
	      		$(this).dialog("close");
	      		$( "#fourth-message" ).dialog( "open" );
	      	},
	      	"Back": function () {
	      		$(this).dialog("close");
	      		$("#second-message").dialog("open");
	      	}
	      }
    });

    $( "#fourth-message" ).dialog({
      autoOpen: false,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-25%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '400',
          dialogClass: "no-close",
	       buttons: {
	      	"Next (4 of 5)": function () {
	      		$(this).dialog("close");
	      		$("#final-message").dialog("open");
	      	},
	      	"Back": function () {
	      		$(this).dialog("close");
	      		$("#third-message").dialog("open");
	      	}
	      }
    });

    $( "#final-message" ).dialog({
      autoOpen: false,
      modal: true,
      sticky: true,
      closeOnEscape: false,
          resizable: false,
          position: {my: 'bottom', at: 'center center-25%', of: '#container'},
          stack: true,
          height: 'auto',
          width: '400',
          dialogClass: "no-close",
	       buttons: {
	      	"Start Game": function () {
	      		$(this).dialog("close");
	      	},
	      	"Back": function () {
	      		$(this).dialog("close");
	      		$("#fourth-message").dialog("open");
	      	}
	      }
    });
  };

// >>>>>>>>>>>>>>>>>>>> 4. CREATE GAME ON SERVER. Game is created on server. On completion, introDialogs run. >>>>>>>>>>>>>>>>>>>>

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
        //console.log(data);
        game.gameID = data.id;
        //console.log(game);
        $creatingGameDialog.dialog('close');
        introDialogs();
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $creatingGameDialog
          .html(
						'<p>Unable to create a game on the server!</p>' +
					  '<p>You can play the game, but your progress will not be saved.</p>'
          )
          .dialog({ buttons: [ {
              text: 'Continue Without Saving',
							icons: { primary: 'ui-icon-alert' },
              click: function() {
                $(this).dialog('close');
                introDialogs();
              }
            } ]
					});
      });
  };

// >>>>>>>>>>>>>>>>>> 5. CROP CHOICE. User chooses crop. Grow button is highlighted. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



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
	game.cropchoice = "crop A";
	$("#sproutA").removeClass("hidden");
	$("#sproutB").addClass("hidden");
	$("#cropB").removeClass("select");
	//$("#grow").toggleClass("highlight");
	enableGrowButton();
};

function userClickedB () {
	$("#cropB").addClass("select");
	game.cropchoice = "crop B";
	$("#sproutB").removeClass("hidden");
	$("#sproutA").addClass("hidden");
	$("#cropA").removeClass("select");
	//$("#grow").toggleClass("highlight");
	enableGrowButton();
};


$("#cropA").on("click", userClickedA);

$("#cropB").on("click", userClickedB);


//>>>>>>>>>>>>>>>>>> 6. WEATHER RESULTS. Crop and weather graphics selected based on weather and user choice.  >>>>>>>>>>>>>>>>>>>>>>>>


function weatherResults () { //triggered by #grow click, calls updateGame with correct arguments

	// hide buttons
	disableGrowButton();
	$(".plant, .plant_img, #grow").addClass("hidden").css("opacity", 0);

	//Declare weather display labels
	var rainOpacity = 0;
	var sunOpacity = 0;

	//Declare sound files
	var rainsound = new Audio("sound/rainstick_3.0.mp3");
	var sunsound = new Audio("sound/cigales_3.0.mp3");

	// 6.A Weather opacity chosen for discrete and continuous games separately. <<<<<<<<<<<<<<<<<<

	function weatherOpacity (gameVersion) {

		function discrete () {
			if (game.gamtaeWeher[game.turn] === "Wet") {
				rainOpacity = 1, sunOpacity = 0;
			}

			else if (game.gamtaeWeher[game.turn] === "Dry") {
				rainOpacity = 0, sunOpacity = 1;
			}

			return rainOpacity, sunOpacity;

		}; // end of discrete [weather opacity]

		function continuous () {

			if (game.gamtaeWeher[game.turn] >= game.continuous.gameRoots.topRoot) {
				rainOpacity = 1, sunOpacity = 0;
				//console.log(rainOpacity, sunOpacity);
				}

			else if (game.gamtaeWeher[game.turn] > game.continuous.gameRoots.bottomRoot && game.gamtaeWeher[game.turn] < game.continuous.gameRoots.topRoot) {
				rainOpacity = ((game.gamtaeWeher[game.turn] - game.continuous.gameRoots.bottomRoot)/(game.continuous.gameRoots.topRoot - game.continuous.gameRoots.bottomRoot));
				sunOpacity = 1-rainOpacity;
				//console.log("rain opacity: " + rainOpacity + " sun opacity: " + sunOpacity);

			}

			else if (game.gamtaeWeher[game.turn] <= game.continuous.gameRoots.bottomRoot) {
				rainOpacity = 0;
				sunOpacity = 1;
				//console.log(rainOpacity, sunOpacity);
			}

		}; // end of continuous [weather opacity]

		if (gameVersion === "discrete") {
			discrete();
		}

		else {
			continuous();
		}

		// feed correct opacity to displayWeather (discrete version: 1 or 0, continuous version: interpolated)
		function displayWeather (displayRain, displaySun) {

			if (displayRain > 0 && displaySun == 0) {
				$("#rain").addClass("displayWeather").removeClass("hidden").animate({opacity: displayRain});
			}

			else if (displaySun > 0 && displayRain == 0) {
				$("#sun").addClass("displayWeather").removeClass("hidden").animate({opacity: displaySun});
			}

			else {
				$("#rain").addClass("displayWeather").removeClass("hidden").animate({opacity: displayRain});
				$("#sun").addClass("displayWeather").removeClass("hidden").animate({opacity: displaySun});
			}
		};

		displayWeather(rainOpacity, sunOpacity);

	}; // end of weatherOpacity()

	// 6.B Weather graphics selected (see interior functions for discrete and continuous versions) based on user crop choice, <<<<<<<
		// triggering gameUpdate functions
	function weatherGraphics (gameVersion) {

		function discrete () {

			var payout = 0;

			function findPayout () {
				// User chose crop A
				if (game.cropchoice == "crop A" && game.gamtaeWeher[game.turn] == "Dry") {

					game.weatherReport = "sunny";
					payout = game.discrete.payoutAdry;
					$("#deadAdry").removeClass("hidden");
					sunsound.currenttime=0;
					sunsound.play();
					return payout;
				}

				else if (game.cropchoice == "crop A" && game.gamtaeWeher[game.turn] == "Wet") {

					game.weatherReport = "rainy";
					payout = game.discrete.payoutAwet;
					$("#rowsCropA").removeClass("hidden");
					rainsound.currenttime=0;
					rainsound.play();
					return payout;
				}

				// User chose crop B
				else if (game.cropchoice == "crop B" && game.gamtaeWeher[game.turn] == "Dry") {

					game.weatherReport = "sunny";
					payout = game.discrete.payoutBdry;
					$("#deadBdry").removeClass("hidden");
					sunsound.currenttime=0;
					sunsound.play();
					return payout;

				}

				else if (game.cropchoice == "crop B" && game.gamtaeWeher[game.turn] == "Wet"){

					game.weatherReport = "rainy";
					payout = game.discrete.payoutBwet;
					$("#rowsCropB").removeClass("hidden");
					rainsound.currenttime=0;
					rainsound.play();
					return payout;
				}

				else {
					alert("Error: did you choose a crop? Please choose Crop A or Crop B and try again!");
				}

			}; //end of findPayout()

			findPayout();
			updateDiscrete(payout);

		}; // end of discrete [weather graphics]

		function continuous () {
			//Show weather results line on graph ("resultsLine")
				// update value of X
			//game.continuous.givensChart.destroy();
			game.continuous.optionsObj.givensObj.canvasOverlay.objects =[
				{verticalLine:{
							name: 'resultsLine',
		                    x: game.gamtaeWeher[game.turn], // this positions the line at the current turn weather
		                    lineWidth: 4,
		                    color: 'rgb(255, 204, 51)', //yellow
		                    shadow: false
				}}
			];

			 game.continuous.givensChart = $.jqplot("chartdiv", game.continuous.payoutData, game.continuous.optionsObj.givensObj);


			// A. Crop A outcomes
			if (game.cropchoice === "crop A") {

			// A1. game.gameWeather is wet
				//A1.i Wet game.gameWeather is "wet" (wetter than normal)
				if (game.gamtaeWeher[game.turn] < game.continuous.maxAweather + Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) && game.gamtaeWeher[game.turn] >= game.continuous.maxAweather + .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) ) {
					game.weatherReport = "a little too wet";
					$("#wetA").removeClass("hidden");
				}

				//A1.ii Wet game.gameWeather is too wet
				else if (game.gamtaeWeher[game.turn] >= game.continuous.maxAweather + Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) ) {
					game.weatherReport = "too wet";
					$("#deadAwet").removeClass("hidden");
				}

			// A2. game.gameWeather is dry

				//A2.i. dry game.gameWeather is "dry" (drier than normal)
				else if (game.gamtaeWeher[game.turn] < game.continuous.maxAweather - .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)) && game.gamtaeWeher[game.turn] >= game.continuous.maxAweather - Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) {
					game.weatherReport = "a little too dry";
					$("#dryA").removeClass("hidden");
				}


				//A2.ii. dry game.gameWeather is too dry
				else if (game.gamtaeWeher[game.turn] < game.continuous.maxAweather - Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) {
					game.weatherReport = "too dry";
					//display too-dry crop A
					$("#deadAdry").removeClass("hidden");
				}

			// A3. game.gameWeather is normal
				else if (game.gamtaeWeher[game.turn] < (game.continuous.maxAweather + .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA))) && game.gamtaeWeher[game.turn] >= (game.continuous.maxAweather - .33*Math.sqrt(game.continuous.maxApayout/(-game.continuous.betaA)))) {
					$("#rowsCropA").removeClass("hidden");
					game.weatherReport = "optimal weather";
				}

				updateContinuous(game.continuous.betaA, game.continuous.maxApayout, game.continuous.maxAweather); // call updateGame with values for crop A

			} // end of A

			// 2. Crop B outcomes
			else if (game.cropchoice === "crop B") {

			// B1. game.gameWeather is wet

				//B1.i Wet game.gameWeather is wet
				if (game.gamtaeWeher[game.turn] < game.continuous.maxBweather + Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB)) && game.gamtaeWeher[game.turn] >= game.continuous.maxBweather + .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB)) ) {
					game.weatherReport = "a little too wet";
					//display healthy crop B (range of normal)
					$("#wetB").removeClass("hidden");
				}

				//B1.ii Wet game.gameWeather is too wet
				else if (game.gamtaeWeher[game.turn] >= game.continuous.maxBweather + Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB))) {
					game.weatherReport = "too wet";
					$("#deadBwet").removeClass("hidden");
				}

			// B2. game.gameWeather is dry

				//B2.i Dry game.gameWeather is dry
				else if (game.gamtaeWeher[game.turn] < game.continuous.maxBweather - .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB))) {
					game.weatherReport = "a little too dry";
					$("#dryB").removeClass("hidden");
				}

				//B2.ii Dry game.gameWeather is too dry
				else if (game.gamtaeWeher[game.turn] < game.continuous.maxBweather - Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB))) {
					game.weatherReport = "too dry";
					$("#deadBdry").removeClass("hidden");
				}


			//B3 Weather is in normal range
				else if (game.gamtaeWeher[game.turn] < (game.continuous.maxBweather + .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB))) && game.gamtaeWeher[game.turn] >= (game.continuous.maxBweather - .33*Math.sqrt(game.continuous.maxBpayout/(-game.continuous.betaB)))) {
					$("#rowsCropB").removeClass("hidden");
					game.weatherReport = "optimal weather";
				}

				updateContinuous(game.continuous.betaB, game.continuous.maxBpayout, game.continuous.maxBweather); // call updateGame with values for crop B

			} // end of B

			if (game.weatherReport === "optimal weather" || game.weatherReport === "a little too wet" || game.weatherReport === "too wet") {
				rainsound.currenttime=0;
				rainsound.play();
			}

			else {
				sunsound.currenttime=0;
				sunsound.play();
			}


		}; // end of continuous [weather graphics]

		if (gameVersion === "discrete") {
			discrete();
		}

		else {
			continuous();
		}

	}; //end of weatherGraphics()

	// 6.C Fade out weather graphics for both versions of game <<<<<<<<<<<<<<<<
	function fadeWeather () {
		rainOpacity = 0;
		sunOpacity = 0;
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden");
	   	$(".croprows").addClass("hidden");
	   	$(".plant").removeClass("select");
	   	$(".plant, .plant_img, #grow").removeClass("hidden").animate({opacity: 1}, 1000);
	   	// resets payout chart (chartdiv), removing weather resultsLine
	   	if (!gameVersion.discreteWeather) {
		   	game.continuous.givensChart.destroy();
		   	game.continuous.optionsObj.givensObj.canvasOverlay.objects[0].verticalLine.x = undefined;
		   	game.continuous.givensChart = $.jqplot("chartdiv", game.continuous.payoutData, game.continuous.optionsObj.givensObj);
		}
	};

	// Call the appropriate functions
	if (gameVersion.discreteWeather === true) {
		weatherOpacity("discrete");
		weatherGraphics("discrete");
	}

	else {
		weatherOpacity("continuous");
		weatherGraphics("continuous");
	}

	// removes weather graphics after this many milliseconds
	setTimeout(fadeWeather, game.turnLength);

}; // end of weatherResults

// >>>>>>>>>>> 7. UPDATE GAME. Game updates score and turn, and loops back to (5) crop choice >>>>>>>>>>>>>>>>>>>

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 7.A Discrete Game Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function updateDiscrete (payout) {
	updateGame(payout);

}; // end of updateDiscrete()

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 7.B Continuous Game Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

function updateContinuous (beta, maxpayout, maxweather) {

	var payout = 0;

	function calculatePayout () {
	var formula = beta * Math.pow((game.gamtaeWeher[game.turn] - maxweather), 2) + maxpayout;

		if (formula <= 0) {
			payout = 0;
		}

		else if (formula > 0) {
			payout = parseFloat(formula);
		}

		return payout;
	};

	calculatePayout();

	updateGame(payout);

}; // End of updateContinuous function

// 7.C Using calculated payout, game displays results dialogs, calculates bonus if applicable,  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// updates score and score display, adds turn

function updateGame (payout) { //this function is called and given arguments inside weatherResults function above
	var bonusOneTotal;
	var bonusTwoTotal;

	bonusOneTotal = game.bonusOneTotal;
	bonusTwoTotal = game.bonusTwoTotal;

	// Functions shared by both versions

	var oldscore = game.score;
	var newscore = oldscore + payout;

	function displayResultsDialog () {
		//populate spans inside all results dialogs
	    if (gameVersion.discreteWeather == true) {
	    	$(".results").find("#weather_outcome").text(game.gamtaeWeher[game.turn]);
	    	$(".results").find("#weather_report").text(" and " + game.weatherReport);
	    }
	    else {
	    	$(".results").find("#weather_outcome").text(parseInt(game.gamtaeWeher[game.turn]) + " inches of rain");
	    	$(".results").find("#weather_report").removeClass("emphasize").text(", which was " + game.weatherReport);
	    }

    	$(".results").find("#new_score").text(parseInt(payout) + " points");

    	$(".results").find("#chosen_crop").text(" for " + game.cropchoice);

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

		// Bonus dialogs
		if (oldscore < bonusOneTotal && newscore >= bonusOneTotal) { //this only works now because I made totalRandomPoints global
			$("#bonus_count").text("$" + game.bonusOneDollars);
			addBonus1();
			$("#bonus_results").dialog("open");
		}

		else if (oldscore < bonusTwoTotal && newscore >= bonusTwoTotal) {
			$("#bonus_count").text("$" + game.bonusTwoDollars);
			addBonus2();
			$("#bonus_results").dialog("open");
		}

		//Normal results dialogs
		else {
			$("#normal_results").dialog("open");
		}

		setTimeout(function() {$( ".results" ).dialog( "close" )}, .75*game.turnLength);
	}; // end of displayResultsDialog()

	setTimeout(displayResultsDialog, .25*game.turnLength);

	function addTurn () {
		if (game.turn < game.maxturn-2) {
			game.turn = game.turn + 1;
		}

		else if (game.turn === game.maxturn-2) {
			game.turn = game.turn + 1;
			game.gameOver = true;
		}

		else {
			game.turn = game.maxturn-1;
		}

		$("#turns_counter").text(game.turn + "/" + game.maxturn);
	};

	function newScore () {

		function animatePoints () {

			$("#points_bar").animate({ boxShadow : "0 0 15px 10px #ffcc33" });
			setTimeout(function () {$("#points_bar").animate({boxShadow : "0 0 0 0 #fff" })}, .9*game.turnLength);

		};

		function movePointsFlag (maxScore) { //increase height of #points_flag using absolute positioning
			var indifferentTurn = game.discrete.indifferentTurn;

			if (gameVersion.discreteWeather && indifferentTurn <= game.maxturn-1 && indifferentTurn > 0) {
				maxScore = game.discrete.maxScore;
			}

			else if (gameVersion.discreteWeather && (indifferentTurn > game.maxturn-1 || indifferentTurn <= 0)) {
				maxScore = game.bonusOneTotal;
			}

			else if (!gameVersion.discreteWeather) {
				maxScore = game.bonusTwoTotal;
			}

			//Height of #points_bar as an integer, as defined by its CSS rule (in pixels)
			var pixelHeight = parseFloat($("#points_bar").css("height"));

			//Current CSS position for #points_flag "bottom" as an integer
			var flagHeight = parseFloat($("#points_flag").css("bottom"));

			//Current CSS height of #points_fill with "height" as an integer
			var fillHeight = parseFloat($("#points_fill").css("height"));

			//Ratio of points per pixel
			var pointsPerPixelRatio = maxScore/pixelHeight;

			//Points_counter moves upward this number of pixels per turn, depending on the turn payout
			var perTurnHeight = payout/pointsPerPixelRatio;

			// If player has already reached bonus 2
			if (game.score > game.bonusTwoTotal) {
				var remainingPixelsPerTurn;

				if (oldscore < game.bonusTwoTotal && newscore >= game.bonusTwoTotal) {
					var remainingHeight = pixelHeight - fillHeight;
					remainingPixelsPerTurn = remainingHeight/((game.maxturn-game.turn)+0.5);
				}

				flagHeight+=remainingPixelsPerTurn;
				fillHeight = flagHeight+20;
			}

			else {
				// Add perTurnHeight pixels to increase height of #points_flag and #points_fill
				flagHeight+=perTurnHeight;
				fillHeight = flagHeight + 20;
			}

			// Set new heights in CSS style rules for #points_flag and #points_fill
			$("#points_flag").css("bottom", flagHeight);
			$("#points_fill").css("height", fillHeight);

		};

		movePointsFlag();
		animatePoints();

		game.score += payout;
		$("#point_count").html("<h5>" + parseInt(game.score) + "</h5>");

		return game.score; //this updates the value of game score

	}; //end of function newScore

	newScore();

	// Call addBonus functions from displayResultsDialog function, triggered at same time as bonus dialogs
	function addBonus1 () {
		game.realDollars += game.bonusOneDollars; //add value of bonus to realDollars
		$("#dollars_counter").html("$"+game.realDollars);
	};

	function addBonus2 () {
		game.realDollars += game.bonusTwoDollars;
		$("#dollars_counter").html("$"+game.realDollars); //change value of realDollars to combined value of bonuses
	};

	//7.D Server receives selected data for the current turn
	function recordData (game) {
		// Ensure game created on server
		if (game.gameID === undefined) { return; }

		var payload = {
		    crop_choice: game.cropchoice,
		    weather:     game.gamtaeWeher[game.turn],
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

	recordData(game);

	// If maxturn has been reached or exceeded, this function is called
	function endGame () {
		//call end-of-game dialog box
		$("button #grow").addClass("hidden");
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		$("#playerID").text(game.gameID);
		$("#total_score").text(parseInt(game.score));
		$("#total_dollars").text(game.realDollars);

 		$( "#end_results" ).dialog({
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
	};

	if (game.gameOver === true) {
		setTimeout(endGame, game.turnLength);
	}

	//Advance to the next turn
	setTimeout(addTurn, game.turnLength);
};


//>>>>>>>>>>>>>>>>>>>>> 8. "GROW" BUTTON. Clicking Grow button (#grow) runs weather results, which runs all following functions <<<<<<<<<<<<<

$("#grow").on("click", function () {
	if (game.turn <= game.maxturn) {

		if ($(this).hasClass("highlight")) {
			$("#sproutA").addClass("hidden");
			$("#sproutB").addClass("hidden");
			weatherResults();
		}
	}

	else if (game.turn > game.maxturn) {
		alert("You have reached turn number " + game.maxturn + ". The game is over!");
	}

});

//9. TESTING. Tests functionality of game in advance

function test () {

	console.log("Now running test function! See console for output");

	if (gameVersion.discreteWeather) {

		console.log(game.discrete);

		if (game.discrete.climateArray.length < game.maxturn-1) {
			alert("WARNING: You need to add data in the discrete game's climateArray. You don't have " + game.maxturn + " (maxturn) number of rows!");
			console.log("WARNING: You need to more data in the discrete game's climateArray. You don't have maxturn number of rows!");
		}

		if (game.discrete.indifferencePoint >=1 || game.discrete.indifferencePoint <=0) {
			alert("WARNING: the indifference point between A and B is: " + game.discrete.indifferencePoint + "!");
			console.log("WARNING: the indifference point between A and B is: " + game.discrete.indifferencePoint + "!");
		}

		if (game.discrete.indifferentTurn == 0 || game.discrete.indifferentTurn >= game.maxturn) {
			alert("There is no turn during the game at which the probability of dry weather equals the indifference point!");
			console.log("There is no turn during the game at which the probability of dry weather equals the indifference point!");
		}

		if (game.bonusTwoTotal < game.bonusOneTotal) {
			alert("Bonus 2 is less than bonus 1!  " + game.bonusTwoTotal + "<" + game.bonusOneTotal);
			console.log("Bonus 2 is less than bonus 1!  " + game.bonusTwoTotal + "<" + game.bonusOneTotal);
		}

	}

	else if (!gameVersion.discreteWeather) {

		console.log(game.continuous);

		if (game.continuous.climateArray.length < game.maxturn-1) {
			alert("WARNING: You need to add data in the continuous game's climateArray. You don't have " + game.maxturn + " (maxturn) number of rows!");
			console.log("WARNING: You need to more data in the continuous game's climateArray. You don't have maxturn number of rows!");
		}
	}

};

}); //End of .ready ()


