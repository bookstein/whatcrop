//SEMANTICS
//threshold: defines which random numbers indicate rain and which indicate dry.
//climateChange: makes changes to the threshold at each turn.
//payout: these variables show payout for crop choices.
//crop: all references to actual choices A and B (not seed, not plant)
//

///////////////////////////


$(document).ready(function(){


//>>>>>>>>>>>> GAME OBJECT - change game version and parameters here <<<<<<<<<<<<<<<


game = {
	// Change game version
	discreteWeather: true,
	continuousWeather: !true,

	// Discrete game version
	discrete: {
		// Discrete weather crop payouts
	    payoutAwet: 70,
		payoutAdry: 80,
		payoutBwet: 100,
		payoutBdry: 50,
		// Set rain threshold
		threshold: 600,
		// Set bonus payments
		bonusOneDollars : 1.25,
		bonusTwoDollars : 0.75,
		totalRandomPoints : 0,
		totalOptimalPoints : 0,
	}

	// Continuous game version
	continuous: {
		// Continuous weather crop payouts
		betaA : -.002,
		betaB : -.002,
		maxApayout : 200, //P*(A)
		maxAweather : 400, //w*(A)
		maxBpayout : 120, //P*(B)
		maxBweather : 200, //w*(B)
		// Roots of payout parabolas
		gameRoots : {
			topRoot: 0,
			bottomRoot: 0
		},
	},


	// Manually set climate change by turn, up to game.maxturn
	climateArray : [
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
	],

	// Shared global variables:
	cropchoice: "",
	gameWeather: [],
	weatherReport : "",
	historyPlot : {},
	meanHistoricWeather : 0,

	// Set number of turns per game
    maxturn : 50,
	//Turn Counter
	turn : 0,

	//Points Counter
	maxScore : 0,
	score : 0, //starting score is 0

	// Real Dollars Earned
	realDollars : 0 //real earnings in dollars start at 0

}; //end of game object


// >>>>>>>>>>>>>>>>> GAME SET-UP <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$(function initializeGame () {

	//Turn Counter
	$("#turns_counter").text(game.turn + "/" + game.maxturn);

	//Points Counter
	$("#point_count").html("<h5>"+game.score+"</h5>"); //writes initial score to points counter

	// Real Dollars Earned
	$("#dollars_counter").text("$"+game.realDollars); //writes initial realDollars to dollars counter

	function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
		$("table").find("td#payoutAwet").text(payoutAwet );
		$("table").find("td#payoutAdry").text(payoutAdry );
		$("table").find("td#payoutBwet").text(payoutBwet );
		$("table").find("td#payoutBdry").text(payoutBdry );
	};

	writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry);

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


function climateChange () {

		var autoFillClimateChange = true; //If true, the "for loop" below will autofill the value of climateChange inside climateArray.
										//If false, then manually enter the climate change values you wish to use below under "else".
		climateArray = [];
		manualClimateArray = [];

		if (autoFillClimateChange == true) {


			for (var i =0; i < maxturn; i++) {
				climateArray[i]=10; //<<<<<<<<<<<<<<<<<<< change this value to alter climate change.
			}


			//output array of (x,y) points for use in jqPlot chart: [root1, lower normal-weather bound, vertex, upper normal-weather bound, root2]
			parabolaArray = [[root1, 0, null], lower, [maxweather, maxpayout, null], upper, [root2, 0, null]];


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



		findUpperBoundX();

		function findUpperBoundY () {
			var vertexA = plotA[2][1];
			var vertexB = plotB[2][1];


	function makeThresholdArray () {

		thresholdArray[0] = threshold; //sets first value equal to threshold

		for (var i = 1; i < maxturn; i++)
		{
			thresholdArray[i] = thresholdArray[i-1] - (climateArray[i]);
		}

		return thresholdArray;
	};

	makeThresholdArray(); //sets thresholdArray to new value based on climate change


		// Create graphable data array for historicWeather using freqency of values
		function historicWeatherHistogram () {


	gameWeather = [];


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
				console.log("[" + parseInt(intervalBottom) + ", " + count + "]");
				return [intervalBottom, count, null];

			}; // end countOccurrence();

			//creates empty array to fill with arrays ([interval number, count])
			var frequency = [];

			//populates each item j in frequency array using value of countOccurrence()
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

			console.log("ticksWeatherX: "+ ticksWeatherX);
			console.log("frequency array: " + frequency);

			return frequency;
		}; //end historicWeatherHistogram

		var histogram = historicWeatherHistogram();
		console.log("Histogram data: " + histogram);

		// variables containing all data to be plotted
		var plotData = [histogram, plotA, plotB];

		var optionsObj = {};
		// Create options object for jqPlot graph using optionsObj and setOptions()
		function setOptions (showBoolean) {
			optionsObj = {
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
				          	yaxis:'y2axis',
				          	show: true // change to 'false' to remove historicWeather from graph
				      	  },
				      	  {
				      	    // CropA
				      	    label: "Crop A",
				            lineWidth: 2,
				            showMarker: false,
				            renderer:$.jqplot.LineRenderer,
				            xaxis:'xaxis',
				          	yaxis:'yaxis',
				            show: showBoolean
				          },
				          {
				            // CropB
				            label: "Crop B",
				            lineWidth: 2,
				            showMarker: false,
				            renderer:$.jqplot.LineRenderer,
				            xaxis:'xaxis',
				          	yaxis:'yaxis',
				            show: showBoolean
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
		                        showLabel: !showBoolean,
		                        formatString: "%#.0f",
		                        showMark: !showBoolean,
		                        showGridline: !showBoolean
		                    }
		      			},*/

		      			y2axis:{
		      				label: "Occurrences",
		     				labelOptions: {
            					show: !showBoolean,
            					fontSize: '11pt'
        					},
		          			//renderer: $.jqplot.CategoryAxisRenderer,
		          			rendererOptions:{
		                    	tickRenderer:$.jqplot.CanvasAxisTickRenderer
		                    },

		                	tickOptions:{
		                        mark: "inside",
		                        showLabel: !showBoolean,
		                        formatString: "%#.0f",
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
		                        formatString: "%#.0f",
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
		        		show: showBoolean, // turn this on and off to show results
			            objects: [
			                {verticalLine: {
			                    name: 'resultsLine',
			                    x: game.gameWeather[game.turn], // this positions the line at the current turn weather
			                    lineWidth: 4,
			                    color: 'rgb(255, 204, 51)',
			                    shadow: false
			                }}
					]} // end of canvasOverlay
				}; // end optionsObj object
				return optionsObj;
			}; //end function setOptions()

		// draw graph in #intro_graph (for intro dialog) using optionsObj above

		function chart1 () {
			setOptions(false);
			game.historyPlot = $.jqplot("intro_graph", [histogram], optionsObj);
			var w = parseInt($(".jqplot-yaxis").width(), 10) + parseInt($("#intro_graph").width(), 10);
			var h = parseInt($(".jqplot-title").height(), 10) + parseInt($(".jqplot-xaxis").height(), 10) + parseInt($("#intro_graph").height(), 10);
			$("#intro_graph").width(w).height(h);
			game.historyPlot.replot();
		};

		//draw graph in #chartdiv using optionsObj above

		function chart2 () {
			setOptions(true);
			$.jqplot("chartdiv", plotData, optionsObj);
		};

		chart1();
		chart2();

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
				arrayName[i] = game.climateArray[0].mean + (normalizedArray[i]*game.climateArray[0].std_dev);
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
	makeGameWeather(historicWeather, true);
	console.log("Historic weather: " + historicWeather);
	drawQuadratic();


	//Populate spans in opening and ending dialogs

	$(".turncount_instructions").text(game.maxturn + " turns");
	//$("#weather_instructions").text((1000-threshold)/1000*100 + "%");
	//$("#bonus_one_instructions").text(game.totalRandomPoints);
	//$("#bonus_two_instructions").text(game.totalOptimalPoints);
	$("#mean_rainfall").text(game.meanHistoricWeather + " inches of rain");

	//Calculate Max Score --------------------------------------

	function calculateMaxScore () {

		var optimalCrops = []; //array of scores per turn if you knew the weather (post-hoc optimal) and chose the correct crop for each turn
		var payout = 0; //local payout variable for calculating maxScore

		function findOptimalCrop () {
		//Strategy: if the difference between the optimal value of the crop is closest to game.gameWeather, choose that crop at the optimal crop for that turn
			for (var i = 0; i < game.maxturn; i++) {

				var Adiff = game.gameWeather[i] - game.maxAweather;
				var Bdiff = game.gameWeather [i] - game.maxBweather;

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
				addScores(i, game.betaA, game.maxAweather, game.maxApayout); //call addScores() with values of crop A
				game.maxScore += payout;
				//console.log("The score is now " + maxScore);
			}


			else if (optimalCrops[i] === "cropB") {
				addScores(i, game.betaB, game.maxBweather, game.maxBpayout); //call addScores() with values of crop B
				game.maxScore += payout;
				//console.log("The score is now " + maxScore);
			}
		}

		return game.maxScore;
	}; //end of calculateMaxScore()

	$(".turncount_instructions").text(maxturn + " turns");
	$("#bonus_one_instructions").text(totalRandomPoints);
	$("#bonus_two_instructions").text(totalOptimalPoints);


	calculateMaxScore();

	console.log("The maximum possible score is " + game.maxScore + " points");

}); //end of initialization function

// >>>>>>>>>>>>>>>>>>>> 2. Game is introduced in a series of dialog boxes. User clicks through. >>>>>>>>>>>>>>>>>>>>

// Open first dialog; keep other dialogs hidden

$(function introDialogs () {

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

		if (game.gameWeather[game.turn] >= game.gameRoots.topRoot) {
				rainOpacity = 1, sunOpacity = 0;
				console.log(rainOpacity, sunOpacity);
			}

			else if (game.gameWeather[game.turn] > game.gameRoots.bottomRoot && game.gameWeather[game.turn] < game.gameRoots.topRoot) {
				rainOpacity = ((game.gameWeather[game.turn] - game.gameRoots.bottomRoot)/(game.gameRoots.topRoot - game.gameRoots.bottomRoot));
				sunOpacity = 1-rainOpacity;
				console.log(rainOpacity, sunOpacity);

			}

			else if (game.gameWeather[game.turn] <= game.gameRoots.bottomRoot) {
				rainOpacity = 0;
				sunOpacity = 1;
				console.log(rainOpacity, sunOpacity);
			}

		return rainOpacity, sunOpacity;
	};

	function displayWeather (displayRain, displaySun) {
		weatherOpacity();

		$("#rain").addClass("displayWeather").removeClass("hidden").animate({opacity: displayRain});
		$("#sun").addClass("displayWeather").removeClass("hidden").animate({opacity: displaySun});
		//alert("rain opacity is: " + rainOpacity + " sun opacity is: " + sunOpacity);
	};


	displayWeather(rainOpacity, sunOpacity);


	// A. Crop A outcomes
	if (game.cropchoice === "cropA") {


		// A1. game.gameWeather is wet



		//A1.i Wet game.gameWeather is "wet" (wetter than normal)
		if (game.gameWeather[game.turn] < game.maxAweather + Math.sqrt(game.maxApayout/(-game.betaA)) && game.gameWeather[game.turn] >= game.maxAweather + .33*Math.sqrt(game.maxApayout/(-game.betaA)) ) {
			game.weatherReport = "wet enough";
			$("#wetA").removeClass("hidden");
		}

		//A1.ii Wet game.gameWeather is too wet
		else if (game.gameWeather[game.turn] >= game.maxAweather + Math.sqrt(game.maxApayout/(-game.betaA)) ) {
			game.weatherReport = "too wet";
			$("#deadAwet").removeClass("hidden");
			//display too-wet crop A ("Very Wet")
		}

		// A2. game.gameWeather is dry

		//A2.i. dry game.gameWeather is "dry" (drier than normal)
		else if (game.gameWeather[game.turn] < game.maxAweather - .33*Math.sqrt(game.maxApayout/(-game.betaA)) && game.gameWeather[game.turn] >= game.maxAweather - Math.sqrt(game.maxApayout/(-game.betaA))) {
			game.weatherReport = "dry enough";
			$("#dryA").removeClass("hidden");
		}


		//A2.ii. dry game.gameWeather is too dry
		else if (game.gameWeather[game.turn] < game.maxAweather - Math.sqrt(game.maxApayout/(-game.betaA))) {
			game.weatherReport = "too dry";
			//display too-dry crop A
			$("#deadAdry").removeClass("hidden");
		}

		// A3. game.gameWeather is normal
		else if (game.gameWeather[game.turn] < (game.maxAweather + .33*Math.sqrt(game.maxApayout/(-game.betaA))) && game.gameWeather[game.turn] >= (game.maxAweather - .33*Math.sqrt(game.maxApayout/(-game.betaA)))) {
			$("#rowsCropA").removeClass("hidden");
			game.weatherReport = "optimal weather";
		}

		updateGame(game.betaA, game.maxApayout, game.maxAweather); // call updateGame with values for crop A
	}


	// 2. Crop B outcomes
	else if (game.cropchoice === "cropB") {

		// B1. game.gameWeather is wet

		//B1.i Wet game.gameWeather is wet
		if (game.gameWeather[game.turn] < game.maxBweather + Math.sqrt(game.maxBpayout/(-game.betaA)) && game.gameWeather[game.turn] >= game.maxBweather + .33*Math.sqrt(game.maxBpayout/(-game.betaB)) ) {
			game.weatherReport = "wet enough";
			//display healthy crop B (range of normal)
			$("#wetB").removeClass("hidden");
		}

		//B1.ii Wet game.gameWeather is too wet
		else if (game.gameWeather[game.turn] >= game.maxBweather + Math.sqrt(game.maxBpayout/(-game.betaB))) {
			game.weatherReport = "too wet";
			$("#deadBwet").removeClass("hidden");
		}

		// B2. game.gameWeather is dry

		//B2.i Dry game.gameWeather is dry
		else if (game.gameWeather[game.turn] < game.maxAweather - .33*Math.sqrt(game.maxApayout/(-game.betaA))) {
			game.weatherReport = "dry enough";
			$("#dryB").removeClass("hidden");
		}

		//B2.ii Dry game.gameWeather is too dry
		else if (game.gameWeather[game.turn] < game.maxBweather - Math.sqrt(game.maxBpayout/(-game.betaB))) {
			game.weatherReport = "too dry";
			$("#deadBdry").removeClass("hidden");
		}


		//B3 Weather is in normal range
		else if (game.gameWeather[game.turn] < (game.maxBweather + .33*Math.sqrt(game.maxBpayout/(-game.betaA))) && game.gameWeather[game.turn] >= (game.maxBweather - .33*Math.sqrt(game.maxBpayout/(-game.betaB)))) {
			$("#rowsCropB").removeClass("hidden");
			game.weatherReport = "optimal weather";
		}

		updateGame(game.betaB, game.maxBpayout, game.maxBweather); // call updateGame with values for crop B
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
		payout = beta * Math.pow((game.gameWeather[game.turn] - maxweather), 2) + maxpayout;

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
		$("#point_count").html("<h5>" + game.score + "</h5>");
		return game.score; //this updates the value of the global variable "score"


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
	        position: {my: 'top', at: 'top+25%', of: '#farm'},
	        stack: false,
	        width: '30%'
	    });

		//populate spans inside all results dialogs
	    $(".results").find("#weather_outcome").text(parseInt(game.gameWeather[game.turn]));
    	$(".results").find("#new_score").text(payout);
    	$(".results").find("#weather_report").text(game.weatherReport);
    	$(".results").find("#chosen_crop").text(game.cropchoice);

	    $("#normal_results").dialog("open");


		setTimeout(function() {$( ".results" ).dialog( "close" )}, 3000);

	};

	displayResultsDialog();

	function addTurn () {
		game.turn = game.turn + 1;
		$("#turns_counter").html("<h5>" + turn + "/" + game.maxturn + "</h5>");
		//setTimeout(assignTurnWeather, 100); //runs function assignTurnWeather with new turn value
		//alert("game.gameWeather is now " + game.gameWeather[turn] + " because it is turn #" + turn);
	};


		setTimeout(addTurn, 4000);


	//Record relevant data for the current turn
	function recordData (game) {
		var gameID = game.gameID;
		var cropChoice = game.cropChoice;
		var turn = game.turn;
		var weather = game.gameWeather[game.turn];
		var turnScore = payout;
		var totalScore = game.score;
		var time = ""; // ? ?
		//also record date, version title (and url??)
		alert("Data for this game is: " + playerID/*placeholder*/+ " " + gameID/*placeholder*/ + " " + cropchoice + " " + turn + " " + payout + " " + newscore + " " + timestamp/*placeholder*/);
	};

	recordData(game);

	// Reset values for new turn
	game.cropchoice = "";

}; // End of updateGame function


function endGame () {
	//call end-of-game dialog box
	$("button #grow").addClass("hidden");
	//inclusive of last turn (50)
};

//>>>>>>>>>>>>>>>>>>>>> Clicking #grow button triggers updateGame <<<<<<<<<<<<<

$("#grow").on("click", function () {
	if (($(this).hasClass("highlight"))&& game.turn<game.maxturn) {
		// hide crop sprout graphics
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		//call displayWeather function
		//displayWeather();
		//callsback updateGame function 200ms after displayWeather
		setTimeout(weatherResults, 100);
	}

		else if (($(this).hasClass("highlight")) && turns === game.maxturn) {

		//summon end-of-game dialog instead of update
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		//call displayWeather function
		//displayWeather();
		//callsback updateGame function 200ms after displayWeather
		setTimeout(weatherResults, 100);
		setTimeout(endGame, 1000);
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

	else if (testValue == indifferencePoint) {
		calculateIndifferencePoint();
		return indifferencePoint;
	}
};

}); //End of .ready ()


