//SEMANTICS
//threshold: defines which random numbers indicate rain and which indicate dry.
//climateChange: makes changes to the threshold at each turn.
//payout: these variables show payout for crop choices.
//crop: all references to actual choices A and B (not seed, not plant)
//

///////////////////////////


$(document).ready(function(){


//>>>>>>>>>>>> GLOBAL VARIABLES - change game parameters here <<<<<<<<<<<<<<<

	cropchoice = "";
	gameWeather = [];

	// Set number of turns per game
    maxturn = 50;
    endOfGame = false;

	// Set crop payouts using equation Payout = beta(w-w*) + P*

		// Crop A
	betaA = -.002;
	maxApayout = 200; //P*(A)
	maxAweather = 800; //w*(A)

		// Crop B
	betaB = -.001;
	maxBpayout = 120; //P*(B)
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
	maxScore = 0;
	score = 0; //starting score is 0
	$("#point_count").html("<h5>"+score+"</h5>"); //writes initial score to points counter

	// Real Dollars Earned

	realDollars = 0; //real earnings in dollars start at 0
	$("#dollars_counter").html("$"+realDollars); //writes initial realDollars to dollars counter


// >>>>>>>>>>>>>>>>> GAME SET-UP <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$(function initializeGame () {

	$.jqplot.config.enablePlugins = true;
	var historicWeather = []; // Array values filled in using historicWeatherArray() below

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

			//output array of (x,y) points for use in jqPlot chart: [(root1), (vertex), (root2)]
			parabolaArray = [[root1, 0, crop], [maxweather, maxpayout, maxpayout + " pts"], [root2, 0, null]];
			return parabolaArray;
		}; //end of dataArrays

		// Call dataArrays function and create arrays for A and B
		var plotA = dataArrays(betaA, maxAweather, maxApayout, "A");
		var plotB = dataArrays(betaB, maxBweather, maxBpayout, "B");


		// Set upper bounds on graph
		var upperBoundX = 1200; //default value for upper bound of graph x-axis
		var upperBoundY = 250; //default value for upper bound of graph y-axis

		function findUpperBoundX () {
		//modifies upper bound on x-axis based on largest parabola root (point at which crop value is (X,0) with largest possible value of X)
			var root1A = plotA[0][0];
			var root2A = plotA[2][0];
			var root1B = plotB[0][0];
			var root2B = plotB[2][0];

			var rootArray = [root1A, root2A, root1B, root2B];
			var maxRoot = Math.max.apply(Math, rootArray);

			upperBoundX = Math.ceil(maxRoot/100)*100;

			return upperBoundX;
		};

		findUpperBoundX();

		function findUpperBoundY () {
			var vertexA = plotA[1][1];
			var vertexB = plotB[1][1];

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
		var ticksX = [[0, "0"], [maxAweather, maxAweather/2], [maxBweather, maxBweather/2], [upperBoundX, upperBoundX/2]];
		var ticksY = [[0, ""], [maxApayout, maxApayout], [maxBpayout, maxBpayout], [upperBoundY, upperBoundY], [maxY, ""]];

		// Create graphable data array for historicWeather using freqency of values
		function historicWeatherHistogram () {

			var range = Math.max.apply(Math, historicWeather) - Math.min.apply(Math, historicWeather);
			var intervalNumber = Math.ceil(Math.sqrt(maxturn));
			var intervalWidth = Math.ceil(range/intervalNumber);

			console.log("range: " + range + " interval number: " + intervalNumber + " interval width: " + intervalWidth);

			var frequency = [];
			var count = 0;

			for (var intervalBottom = 0; intervalBottom < (Math.max.apply(Math, historicWeather)) - intervalWidth; intervalBottom+=intervalWidth) {
				for (var i = 0; i < maxturn; i++) {

					if (historicWeather[i] >= intervalBottom && historicWeather[i] < intervalBottom+intervalWidth) {
						frequency[i] = [intervalBottom, count+=1]
					}

					else {
						frequency[i] = [intervalBottom, count];
					}
				}
			}
			//console.log(frequency);
			return frequency;
		}; // end of historicWeatherHistogram()

		var plotHistory = historicWeatherHistogram();


		//draw parabolas in #chartdiv
		var cropValues = $.jqplot('chartdiv', [plotA, plotB], {

		      //stackSeries: true, --> this breaks the graph

		      grid: {
        		//drawGridlines: true,
        		shadow: false,
        		borderWidth: 1,
        		drawBorder: true,
        		//background: "rgba(0, 200, 500, 0.05)",
        	  },

		      seriesDefaults: {
		          rendererOptions: {
		              smooth: true
		          },

		       // labels for payout curves at vertex
		       //pointLabels uses the final value in parabolaArray as its data
		          pointLabels: {
		          	show: true,
		          	location:'nw',
		          	ypadding:3,
		          	xpadding:2
		          }
		      },

		      /*canvasOverlay: {
        		show: true,
        		objects: [{
          				rectangle: {
          					xmin: upperBoundX/2,
          					xmax: upperBoundX,
          					xminOffset: "0px",
          					xmaxOffset: "0px",
          					yminOffset: "0px",
          					ymaxOffset: "0px",
                    		color: "rgba(0, 200, 500, 0.1)",
                    		showTooltip: false,
                    		tooltipFormatString: "Rain"
                    	},

                    	rectangle: {
                    		xmin: 0,
          					xmax: upperBoundX/2,
          					xminOffset: "0px",
          					xmaxOffset: "0px",
          					yminOffset: "0px",
          					ymaxOffset: "0px",
                    		color: "rgba(255, 204, 51, 0.3)",
                    		showTooltip: false,
                    		tooltipFormatString: "Sun"
                    	}
                    }]
      		  },*/

		      seriesColors: [/*color A*/ "#820000", /*color B*/ "#3811c9"],
		      axes: {
        		xaxis:{
        			ticks: ticksX,
        			borderWidth: 1.5,
        			rendererOptions:{
                    	tickRenderer:$.jqplot.AxisTickRenderer
                    },
                	tickOptions:{
                        mark: "cross",
                        formatString: "%#.0f",
                        showMark: true,
                        showGridline: true
                    },

          			label:'Weather (inches of rain)',
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
                	tickOptions:{
                        mark: "inside",
                        showLabel: false,
                        formatString: "%#.0f",
                        showMark: true,
                        showGridline: true
                    },

          			/*label:'Points',
          			labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
						labelOptions: {
	            			fontFamily: 'Verdana, sans-serif',
	            			fontSize: '12pt',
          				}*/
      			},

    		  },

		      series:[
		          {
		            // CropA
		            lineWidth:2,
		            showMarker: false
		          },
		          {
		            // CropB
		            lineWidth:2,
		            showMarker: false
		          },
		          {
		          	// Weather
		          	lineWidth: 0,
		          	showMarker: false
		      	  }
		      ]
		    }
		  );
	}; //end of drawQuadratic()

	//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	function makeGameWeather (arrayName, historicBoolean) {
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
				arrayName[i] = climateArray[i].mean + (normalizedArray[i]*climateArray[i].std_dev);
			}

			return arrayName;

		}; //end of applyClimateChange

		function historicWeatherArray () {
			for (var i = 0; i < maxturn; i++) {
				arrayName[i] = climateArray[0].mean + (normalizedArray[i]*climateArray[0].std_dev);
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

	makeGameWeather(gameWeather, false);
	console.log("Weather with climate change: " + gameWeather);
	makeGameWeather(historicWeather, true);
	console.log("Historic weather: " + historicWeather);
	drawQuadratic();


	//Populate spans in opening and ending dialogs
/*
	$(".turncount_instructions").text(maxturn + " turns");
	$("#weather_instructions").text((1000-threshold)/1000*100 + "%");
	$("#bonus_one_instructions").text(totalRandomPoints);
	$("#bonus_two_instructions").text(totalOptimalPoints); */

	//Calculate Max Score --------------------------------------

	function calculateMaxScore () {

		var optimalCrops = []; //array of scores per turn if you knew the weather (post-hoc optimal) and chose the correct crop for each turn
		var payout = 0; //local payout variable for calculating maxScore

		function findOptimalCrop () {
		//Strategy: if the difference between the optimal value of the crop is closest to gameWeather, choose that crop at the optimal crop for that turn
			for (var i = 0; i < maxturn; i++) {

				var Adiff = gameWeather[i] - maxAweather;
				var Bdiff = gameWeather [i] - maxBweather;

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
			payout = beta * Math.pow((gameWeather[turn] - maxweather), 2) + maxpayout;

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

		for (var i=0; i < maxturn; i++) {

			if (optimalCrops[i] === "cropA") {
				addScores(i, betaA, maxAweather, maxApayout); //call addScores() with values of crop A
				maxScore += payout;
				//console.log("The score is now " + maxScore);
			}

			else if (optimalCrops[i] === "cropB") {
				addScores(i, betaB, maxBweather, maxBpayout); //call addScores() with values of crop B
				maxScore += payout;
				//console.log("The score is now " + maxScore);
			}
		}

		return maxScore;
	}; //end of calculateMaxScore()

	calculateMaxScore();

	console.log("The maximum possible score is " + maxScore + " points");
}); //end of initialization function

// >>>>>>>>>>>>>>>>>>>> 2. Game is introduced in a series of dialog boxes. User clicks through. >>>>>>>>>>>>>>>>>>>>

// Open first dialog; keep other dialogs hidden

$(function introDialogs () {

	$( "#first-message" ).dialog({
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

	//var historicMean = climateArray[0]["mean"]; //uses initial (historic) mean to divide weather into qualitative "Wet" and "Dry"
	//var historicStd_Dev = climateArray[0]["std_dev"]; //uses initial (historic) standard deviation to label extremes "Very Wet" and "Very Dry"
	var weatherReport = "";
	var inchesRain = 0;

	disableGrowButton();

	$(".plant, .plant_img, #grow").addClass("hidden").css("opacity", 0);

	function displaySun (weatherOpacity) { // fadeIn causes the HTML to change to style="display:inline; opacity: 1"
		$("#sun").addClass("displayWeather").removeClass("hidden").animate({opacity: weatherOpacity});
		//alert("This is sun and game weather is "+ gameWeather[turn]);
	};

	function displayRain (weatherOpacity) {
		$("#rain").addClass("displayWeather").removeClass("hidden").animate({opacity: weatherOpacity});
		//alert("This is rain and game weather is " + gameWeather[turn]);
	};

	// A. Crop A outcomes
	if (cropchoice === "cropA") {
		updateGame(betaA, maxApayout, maxAweather); // call updateGame with values for crop A

		// A1. gameWeather is wet

		//A1.i Wet gameWeather is "wet" (wetter than normal)
		if (gameWeather[turn] < maxAweather + Math.sqrt(maxApayout/(-betaA)) && gameWeather[turn] >= maxAweather + .33*Math.sqrt(maxApayout/(-betaA)) ) {
			weatherReport = "wet";
			displayRain(.7);
			$("#wetA").removeClass("hidden");
		}

		//A1.ii Wet gameWeather is too wet
		else if (gameWeather[turn] >= maxAweather + Math.sqrt(maxApayout/(-betaA)) ) {
			weatherReport = "very wet";
			displayRain(1);
			$("#deadAwet").removeClass("hidden");
			//display too-wet crop A ("Very Wet")
		}

		// A2. gameWeather is dry

		//A2.i. dry gameWeather is "dry" (drier than normal)
		else if (gameWeather[turn] < maxAweather - .33*Math.sqrt(maxApayout/(-betaA)) && gameWeather[turn] >= maxAweather - Math.sqrt(maxApayout/(-betaA))) {
			weatherReport = "dry";
			displaySun(.7);
			$("#dryA").removeClass("hidden");
		}

		//A2.ii. dry gameWeather is too dry
		else if (gameWeather[turn] < maxAweather - Math.sqrt(maxApayout/(-betaA))) {
			weatherReport = "very dry";
			displaySun(1);
			//display too-dry crop A
			$("#deadAdry").removeClass("hidden");
		}

		// A3. gameWeather is normal
		else if (gameWeather[turn] < (maxAweather + .33*Math.sqrt(maxApayout/(-betaA))) && gameWeather[turn] >= (maxAweather - .33*Math.sqrt(maxApayout/(-betaA)))) {
			displaySun(.7);
			displayRain(.7)
			$("#rowsCropA").removeClass("hidden");
		}
	}

	// 2. Crop B outcomes
	else if (cropchoice === "cropB") {
		updateGame(betaB, maxBpayout, maxBweather); // call updateGame with values for crop B

		// B1. gameWeather is wet

		//B1.i Wet gameWeather is wet
		if (gameWeather[turn] < maxBweather + Math.sqrt(maxBpayout/(-betaA)) && gameWeather[turn] >= maxBweather + .33*Math.sqrt(maxBpayout/(-betaB)) ) {
			weatherReport = "wet";
			displayRain(.7);
			//display healthy crop B (range of normal)
			$("#wetB").removeClass("hidden");
		}

		//B1.ii Wet gameWeather is too wet
		else if (gameWeather[turn] >= maxBweather + Math.sqrt(maxBpayout/(-betaB))) {
			weatherReport = "very wet";
			displayRain(1);
			$("#deadBwet").removeClass("hidden");
		}

		// B2. gameWeather is dry

		//B2.i Dry gameWeather is dry
		else if (gameWeather[turn] < maxAweather - .33*Math.sqrt(maxApayout/(-betaA))) {
			weatherReport = "dry";
			displaySun(.7);
			$("#dryB").removeClass("hidden");
		}

		//B2.ii Dry gameWeather is too dry
		else if (gameWeather[turn] < maxBweather - Math.sqrt(maxBpayout/(-betaB))) {
			weatherReport = "very dry";
			displaySun(1);
			$("#deadBdry").removeClass("hidden");
		}

		//B3 Weather is in normal range
		else if (gameWeather[turn] < (maxBweather + .33*Math.sqrt(maxBpayout/(-betaA))) && gameWeather[turn] >= (maxBweather - .33*Math.sqrt(maxBpayout/(-betaB)))) {
			displaySun(.7);
			displayRain(.7);
			$("#rowsCropB").removeClass("hidden");
		}
	}

}; // end of weatherResults

// >>>>>>>>>>> 5. Game updates and loops back to the beginning of the code >>>>>>>>>>>>>>>>>>>

function updateGame (beta, maxpayout, maxweather) { //this function is called and given arguments inside weatherResults function above

	cropchoice = ""; //resets value of cropchoice to none
	var payout = 0;

	function newPayout () {
		payout = beta * Math.pow((gameWeather[turn] - maxweather), 2) + maxpayout;

		if (payout <= 0) {
			payout = 0;
		}

		else if (payout > 0) {
			payout = parseInt(payout);
		}

		return payout;
	};

	function newScore () {

		function animatePoints () {
			//$("#points_bar").toggleClass("glow");

			$("#points_bar").animate({ boxShadow : "0 0 15px 10px #ffcc33" });
			setTimeout(function () {$("#points_bar").animate({boxShadow : "0 0 0 0 #fff" })}, 3500);
			//$(".glow").css({ "-webkit-box-shadow, -moz-box-shadow, box-shadow" }).animate()
  		};


		function movePointsFlag () { //increase height of #points_flag using absolute positioning

			//Height of #points_bar as an integer, as defined by its CSS rule (in pixels)
			var pixelHeight = parseInt($("#points_bar").css("height"));

			//Current CSS position for #points_flag "bottom" as an integer
			var flagHeight = parseInt($("#points_flag").css("bottom"));

			//Current CSS height of #points_fill with "height" as an integer
			var fillHeight = parseInt($("#points_fill").css("height"));

			//Ratio of points per pixel
			var pointsPerPixelRatio = maxScore/pixelHeight; //use maxScore for now

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

		score += payout;
		$("#point_count").html("<h5>" + score + "</h5>");
		return score; //this updates the value of the global variable "score"

	}; //end of function newScore

	newPayout();
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

		//populate spans inside all results dialogs
	    $(".results").find("#weather_outcome").text(gameWeather[turn]);
	    $(".results").find("#new_score").text(payout);
	    $("#normal_results").dialog("open");


		setTimeout(function() {$( ".results" ).dialog( "close" )}, 3000);

	};

	displayResultsDialog();

	function fadeWeather () {
		//setTimeout calls function after a certain time; currently 3000 ms
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden").animate({opacity: 0});
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


