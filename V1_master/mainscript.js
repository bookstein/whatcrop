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
	weatherReport = "";

	// Set number of turns per game
    maxturn = 50;
    endOfGame = false;

	// Set crop payouts using equation Payout = beta(w-w*) + P*

		// Crop A
	betaA = -.002;
	maxApayout = 200; //P*(A)
	maxAweather = 400; //w*(A)

		// Crop B
	betaB = -.002;
	maxBpayout = 120; //P*(B)
	maxBweather = 200; //w*(B)

	// Manually set climate change by turn, up to maxturn
	climateArray = [
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

	// Roots of payout parabolas
	gameRoots = {
		topRoot: 0,
		bottomRoot: 0
	};

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
		var plotA = dataArrays(betaA, maxAweather, maxApayout, "A");
		var plotB = dataArrays(betaB, maxBweather, maxBpayout, "B");


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

			gameRoots["topRoot"] = maxRoot;
			gameRoots["bottomRoot"] = minRoot;

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
		var ticksX = [[0, "0"], [maxAweather, maxAweather], [maxBweather, maxBweather], [maxX, maxX]];
		var ticksY = [[0, ""], [maxApayout, maxApayout], [maxBpayout, maxBpayout], [upperBoundY, upperBoundY], [maxY, ""]];
		var ticksWeatherX = [];
		var ticksWeatherY = [];


		// Create graphable data array for historicWeather using freqency of values
		function historicWeatherHistogram () {

			var range = Math.max.apply(Math, historicWeather) - 0;
			var intervalNumber = 2*Math.ceil(Math.sqrt(historicWeather.length)); // total intervals is 8 and the interval numbers are 0,1,2,3,4,5,6,7 in the case of 50 turns
			var intervalWidth = range/intervalNumber;


			console.log("range: " + range + " number of intervals: " + intervalNumber + " interval width: " + intervalWidth);

			function countOccurrence(newinterval) { //this functions runs for each interval

				var intervalBottom = newinterval*intervalWidth;
				var intervalTop = ((newinterval+1)*intervalWidth);

				console.log(intervalBottom + " to " + intervalTop);

				var count = 0;

				for (var i =0; i < historicWeather.length; i++) {

					if (historicWeather[i] >= intervalBottom && historicWeather[i] < intervalTop) {
						count += 1;
					}

					else if (newinterval === (intervalNumber-1) && historicWeather[i] >= intervalBottom) {
						count +=1;
					}

					else {
						count = count;
					}
				}

				return [newinterval*intervalWidth, count, null];

			}; // end countOccurrence();

			//creates empty array to fill with arrays ([interval number, count])
			var frequency = [];

			//populates each item j in frequency array using value of countOccurrence()
			for (var j = 0; j < intervalNumber; j++) {
				frequency[j] = countOccurrence(j);
			}

			function ticksWeather () {
				for (var j = 0; j < intervalNumber; j++) {
					ticksWeatherX[j] = intervalWidth*j;
				}

				return ticksWeatherX;
			};

			ticksWeather();

			console.log(ticksWeatherX);

			return frequency;
		}; //end historicWeatherHistogram

		var histogram = historicWeatherHistogram();

		console.log(histogram);


		//draw parabolas in #chartdiv
		var cropValues = $.jqplot('chartdiv', [histogram, plotA, plotB], {

		      series:[

		          {
		          	// Weather
		          	lineWidth: 0,
		          	showMarker: false,
		          	renderer:$.jqplot.BarRenderer,
		          	xaxis:'x2axis',
		          	yaxis:'y2axis'
		      	  },
		      	  {
		      	    // CropA
		            lineWidth:2,
		            showMarker: false
		          },
		          {
		            // CropB
		            lineWidth:2,
		            showMarker: false
		          }
		      ],

		      seriesColors: [/*historic weather*/ "rgba(0, 200, 500, .8)", /*color A*/ "#820000", /*color B*/ "#3811c9"],


		      grid: {
        		//drawGridlines: true,
        		shadow: false,
        		borderWidth: 1,
        		drawBorder: true,
        		//background: "rgba(0, 200, 500, 0.05)",
        	  },

		      seriesDefaults: {
		          rendererOptions: {
		            smooth: true,
		            highlightMouseOver: false,
		            highlightMouseDown: false,
        			highlightColor: null,
        			},
				  markerOptions: {
            		shadow: false,
		          },

		       // labels for payout curves at vertex
		       //pointLabels uses the final value in parabolaArray as its data
		          pointLabels: {
		          	show: true,
		          	location:'nw',
		          	ypadding:3,
		          	xpadding:3
		          }
		      },

		      axes: {
				x2axis: {
      				ticks: ticksWeatherX,
      				tickOptions:{
                        mark: "inside",
                        showLabel: false,
                        formatString: "%#.0f",
                        showMark: false,
                        showGridline: false
                    }
      			},

      			y2axis:{

          			renderer: $.jqplot.CategoryAxisRenderer,
          			rendererOptions:{
                    	tickRenderer:$.jqplot.CanvasAxisTickRenderer
                    },
                	tickOptions:{
                        mark: "inside",
                        showLabel: false,
                        formatString: "%#.0f",
                        showMark: false,
                        showGridline: false
                    }
      			},

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
                        showLabel: true,
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
      			}
    		  }, // axes

	      	canvasOverlay: {
        		show: true, // turn this on and off to show results
	            objects: [
	                {verticalLine: {
	                    name: 'resultsLine',
	                    x: gameWeather[turn], // this positions the line at the current turn weather
	                    lineWidth: 4,
	                    color: 'rgb(255, 204, 51)',
	                    shadow: false
	                }}
			]} // end of canvasOverlay
		    } // cropValues object
		  ); // cropValues jqplot
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

	//Show weather results line on graph ("resultsLine")

	$(".jqplot-overlayCanvas-canvas").css('z-index', '3');

	//Identify weather display labels
	var rainOpacity;
	var sunOpacity;

	// hide buttons
	disableGrowButton();
	$(".plant, .plant_img, #grow").addClass("hidden").css("opacity", 0);

	function weatherOpacity () {

		if (gameWeather[turn] >= gameRoots.topRoot) {
				return rainOpacity = 1, sunOpacity = 0;
			}

			else if (gameWeather[turn] > gameRoots.bottomRoot && gameWeather[turn] < gameRoots.topRoot) {
				return rainOpacity = gameWeather[turn]/1000, sunOpacity = 1-rainOpacity;
			}

			else if (gameWeather[turn] <= gameRoots.bottomRoot) {
				return rainOpacity = 0, sunOpacity = 1;
			}
	};

	function displayWeather (displayRain, displaySun) {
		weatherOpacity();

		$("#rain").addClass("displayWeather").removeClass("hidden").animate({opacity: displayRain});
		$("#sun").addClass("displayWeather").removeClass("hidden").animate({opacity: displaySun});
		//alert("rain opacity is: " + rainOpacity + " sun opacity is: " + sunOpacity);
	};

	displayWeather(rainOpacity, sunOpacity);

	// A. Crop A outcomes
	if (cropchoice === "cropA") {

		// A1. gameWeather is wet

		//A1.i Wet gameWeather is "wet" (wetter than normal)
		if (gameWeather[turn] < maxAweather + Math.sqrt(maxApayout/(-betaA)) && gameWeather[turn] >= maxAweather + .33*Math.sqrt(maxApayout/(-betaA)) ) {
			weatherReport = "wet enough";
			$("#wetA").removeClass("hidden");
		}

		//A1.ii Wet gameWeather is too wet
		else if (gameWeather[turn] >= maxAweather + Math.sqrt(maxApayout/(-betaA)) ) {
			weatherReport = "too wet";
			$("#deadAwet").removeClass("hidden");
			//display too-wet crop A ("Very Wet")
		}

		// A2. gameWeather is dry

		//A2.i. dry gameWeather is "dry" (drier than normal)
		else if (gameWeather[turn] < maxAweather - .33*Math.sqrt(maxApayout/(-betaA)) && gameWeather[turn] >= maxAweather - Math.sqrt(maxApayout/(-betaA))) {
			weatherReport = "dry enough";
			$("#dryA").removeClass("hidden");
		}

		//A2.ii. dry gameWeather is too dry
		else if (gameWeather[turn] < maxAweather - Math.sqrt(maxApayout/(-betaA))) {
			weatherReport = "too dry";
			//display too-dry crop A
			$("#deadAdry").removeClass("hidden");
		}

		// A3. gameWeather is normal
		else if (gameWeather[turn] < (maxAweather + .33*Math.sqrt(maxApayout/(-betaA))) && gameWeather[turn] >= (maxAweather - .33*Math.sqrt(maxApayout/(-betaA)))) {
			$("#rowsCropA").removeClass("hidden");
			weatherReport = "optimal weather";
		}

		updateGame(betaA, maxApayout, maxAweather); // call updateGame with values for crop A
	}

	// 2. Crop B outcomes
	else if (cropchoice === "cropB") {

		// B1. gameWeather is wet

		//B1.i Wet gameWeather is wet
		if (gameWeather[turn] < maxBweather + Math.sqrt(maxBpayout/(-betaA)) && gameWeather[turn] >= maxBweather + .33*Math.sqrt(maxBpayout/(-betaB)) ) {
			weatherReport = "wet enough";
			//display healthy crop B (range of normal)
			$("#wetB").removeClass("hidden");
		}

		//B1.ii Wet gameWeather is too wet
		else if (gameWeather[turn] >= maxBweather + Math.sqrt(maxBpayout/(-betaB))) {
			weatherReport = "too wet";
			$("#deadBwet").removeClass("hidden");
		}

		// B2. gameWeather is dry

		//B2.i Dry gameWeather is dry
		else if (gameWeather[turn] < maxAweather - .33*Math.sqrt(maxApayout/(-betaA))) {
			weatherReport = "dry enough";
			$("#dryB").removeClass("hidden");
		}

		//B2.ii Dry gameWeather is too dry
		else if (gameWeather[turn] < maxBweather - Math.sqrt(maxBpayout/(-betaB))) {
			weatherReport = "too dry";
			$("#deadBdry").removeClass("hidden");
		}

		//B3 Weather is in normal range
		else if (gameWeather[turn] < (maxBweather + .33*Math.sqrt(maxBpayout/(-betaA))) && gameWeather[turn] >= (maxBweather - .33*Math.sqrt(maxBpayout/(-betaB)))) {
			$("#rowsCropB").removeClass("hidden");
			weatherReport = "optimal weather";
		}

		updateGame(betaB, maxBpayout, maxBweather); // call updateGame with values for crop B
	}

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

	setTimeout(fadeWeather, 4000);

}; // end of weatherResults

// >>>>>>>>>>> 5. Game updates and loops back to the beginning of the code >>>>>>>>>>>>>>>>>>>

function updateGame (beta, maxpayout, maxweather) { //this function is called and given arguments inside weatherResults function above
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
	    $(".results").find("#weather_outcome").text(parseInt(gameWeather[turn]));
    	$(".results").find("#new_score").text(payout);
    	$(".results").find("#weather_report").text(weatherReport);
    	$(".results").find("#chosen_crop").text(cropchoice);

	    $("#normal_results").dialog("open");


		setTimeout(function() {$( ".results" ).dialog( "close" )}, 3000);

	};

	displayResultsDialog();

	function addTurn () {
		turn = turn + 1;
		$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
		//setTimeout(assignTurnWeather, 100); //runs function assignTurnWeather with new turn value
		//alert("gameWeather is now " + gameWeather[turn] + " because it is turn #" + turn);
	};

		setTimeout(addTurn, 4000);

	// Reset values for new turn
	cropchoice = "";

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


