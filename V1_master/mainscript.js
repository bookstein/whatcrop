//SEMANTICS
//threshold: defines which random numbers indicate rain and which indicate dry.
//climateChange: makes changes to the threshold at each turn.
//payout: these variables show payout for crop choices.
//crop: all references to actual choices A and B (not seed, not plant)
//




$(document).ready(function(){

//>>>>>>>>>>>>> 1. Introduction screen and set-up code for game

//Welcome dialog pop-up "Introduction screen"

	//this dialog should appear as soon as the whole DOM loads.

//setTimeout (function() {
//	$(".dialog .instructions").addClass("hidden");
//	}, 5000);


// Game instructions - toggle #instructions with nav button "Game instructions"
//$('nav a').click(function(event){
  //event.preventDefault;
  //$(this).closest("header").find("#instructions").toggle();

//  });

//To hide #instructions
//$('#instructions a').click(function(event) {
  //event.preventDefault;
 // $(this).closest("header").find("#instructions").toggle();

  //});


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

	// Set climate change, either using "for loop" or manually; choose using autoFillClimateChange variable

	function climateChange () {

		var autoFillClimateChange = true; //If true, the "for loop" below will autofill the value of climateChange inside climateArray.
										//If false, then manually enter the climate change values you wish to use below under "else".
		climateArray = [];
		manualClimateArray = [];

		if (autoFillClimateChange == true) {

			for (var i =0; i < maxturn+1; i++) {
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


// >>>>>>>>>>>>>>>>> GAME SET-UP <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Crop Information table

function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
	$("table").find("td#payoutAwet").text(payoutAwet + " points");
	$("table").find("td#payoutAdry").text(payoutAdry + " points");
	$("table").find("td#payoutBwet").text(payoutBwet + " points");
	$("table").find("td#payoutBdry").text(payoutBdry + " points");
};

writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry);

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


//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Create list of random numbers that will become weather-------

weatherArray = [];

function makeWeatherArray() {
	for (var i = 0; i < maxturn+1; i++) {
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

	for (var i = 1; i < maxturn+1; i++)
	{
		thresholdArray[i] = thresholdArray[i-1] - (climateArray[i]);
	}

	return thresholdArray;
};

makeThresholdArray(); //sets thresholdArray to new value based on climate change


// Set game weather -------

gameWeather = [];

function makeGameWeather() //makeGameWeather takes local empty variable "perTurnWeather" and gives it value depending on parameter x
{

for (var i = 0; i < maxturn+1; i++) {
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

// Assign turnWeather (weather per turn) -------

//turnWeather = "";

//function assignTurnWeather() {
//	turnWeather = gameWeather[turn];
//	alert("Value of turnWeather is now " + gameWeather[turn]);
//	return turnWeather;
//};

//assignTurnWeather(); //sets value of turnWeather for the first turn (and each turn thereafter as part of updateGame)


//Calculate Max Score --------------------------------------

optimalCrops = []; //array of scores per turn if you knew the weather (post-hoc optimal) and chose the correct crop for each turn

function calculateOptimalCrop () {
	for (var i = 0; i < maxturn + 1; i++) {

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

function calculateMaxScore () { //adds up the value of optimal crop to calculate the maximum possible score given the game weather
		for (var i=0; i < optimalCrops.length; i++)
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

	for (var i = 0; i < maxturn + 1 ; i++) {
			pWet[i] = thresholdArray[i]/1000;
	}

		console.log(pWet);

	for (var i = 0; i < maxturn + 1; i++) {
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
	for (var i = 0; i < maxturn + 1; i++) {
		pDry[i] = (1-pWet[i]);
	}

	return pDry;
};

totalRandomPoints = 0;

//Run all previous functions
checkIndifferencePoint();
findTurnAtIndifferencePoint();
calculateProbabilityDry();

function calculateRandomPlayPoints () { //expected points earned by picking A or B randomly

	randomPoints = [];
	for (var i = 0; i < maxturn + 1; i++) {
		randomPoints[i] = .5*pDry[i]*payoutAdry + .5*pWet[i]*payoutAwet +
		 .5*pDry[i]*payoutBdry + .5*pWet[i]*payoutBwet;
	}

	for (var i = 0; i < maxturn + 1; i++) {
		totalRandomPoints += randomPoints[i];
	}

	return totalRandomPoints;
};

calculateRandomPlayPoints();
console.log("The first bonus will trigger at " + totalRandomPoints + " points");

// Calculate Ante-Hoc Optimal Play bonus threshold ---------------------------------


optimalChoice1 = [];
optimalChoice2 = [];

for (var i = 0; i < maxturn; ++i) {
	optimalChoice1[i] = 0;
	optimalChoice2[i] = 0;
}

function optimalChoice (min, max, probDry, probWet, payoutDry, payoutWet) {
			var result = [];
			for (var i = min; i < max; i++) {
				result[i] = probDry[i] * payoutDry + probWet[i] * payoutWet;
			}
			return result;
		};



function firstOptimalChoiceA () {
	optimalChoice1 = optimalChoice(0, indifferentTurn, pDry, pWet, payoutAdry, payoutAwet);
};

function secondOptimalChoiceB () {
	optimalChoice2 = optimalChoice(indifferentTurn, maxturn, pDry, pWet, payoutBdry, payoutBwet);
};

function firstOptimalChoiceB() {
	optimalChoice1 = optimalChoice(0, indifferentTurn, pDry, pWet, payoutBdry, payoutBwet);
};

function secondOptimalChoiceA () {
	optimalChoice2 = optimalChoice(indifferentTurn, maxturn, pDry, pWet, payoutAdry, payoutAwet);
};

function calculateOptimalPlayPoints () {

	if (payoutAwet > payoutBwet && pWet[turn] > pDry[turn]) { //higher payout of A(wet), greater chance of rain
		alert("first case");
		firstOptimalChoiceA();
		secondOptimalChoiceB();
	}

	else if (payoutAwet < payoutBwet && pWet[turn] > pDry[turn]) { //higher payout of B(wet), greater chance of rain
		alert("second case");
		firstOptimalChoiceB();
		secondOptimalChoiceA();
	}

	else if (payoutAdry > payoutBdry && pWet[turn] < pDry[turn]) { //higher payout of A(dry), greater chance of sun
		alert("third case");
		firstOptimalChoiceA();
		secondOptimalChoiceB();
	}

	else if (payoutAdry < payoutBdry && pWet[turn] < pDry[turn]) { //higher payout of B(dry), greater chance of sun
		alert("fourth case");
		firstOptimalChoiceB();
		secondOptimalChoiceA();
	}

	totalOptimalChoice1 = 0;

	function total1 () {
		for (var i = 0; i <= indifferentTurn; i++) {
			totalOptimalChoice1 += optimalChoice1[i];
		}
		return totalOptimalChoice1;
		alert("total optimal choice 1 calculated" + totalOptimalChoice1);
	};

	total1();

	totalOptimalChoice2 = 0;

	function total2 () {
		for (var i = 0; i > indifferentTurn, i < maxturn + 1; i++) {
			totalOptimalChoice2 += optimalChoice2[i];
		}
		//return totalOptimalChoice2;
		alert("total optimal choice 2 calculated" + totalOptimalChoice2);
	};

	total2();
	//totalOptimalPoints is the sum of total optimal choice 1 + total optimal choice 2

	totalOptimalPoints = totalOptimalChoice1 + totalOptimalChoice2;
	alert("total optimal points now calculated!!!!" + totalOptimalPoints);

	return totalOptimalPoints;
};

calculateOptimalPlayPoints();
console.log("The second bonus will trigger at " + totalOptimalPoints + " points");


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//var weather = Math.floor((Math.random()*1000)+1); //chooses random weather
//var rweather = Math.floor((Math.random()*2)+1); //rweather chooses random # between 0 and 3
//var clouds = ""; //"Empty" global variable called "clouds"
//var lastcloud = "Dry"; //What is lastcloud??
//var water = false;
//var plantstatus = "";


//var timerbar = -1;

//ADJUST THIS VARIABLE TO DETEMINE PAUSE BETWEEN TURNS. PAUSE = X/60 SO FOR 2 SECONDS PUT IN 120
//var wait = 120;
//var keeptime = wait;

//var daybarx = 800;
//var daybary = 450;
//var daybarwidth = 10;
//var daybarheight = 0;

//var daybarmax = 250;
//var daybarrate = daybarmax / maxturn;
//var bordery = daybary - daybarrate*maxturn;


// >>>>>>>>>>>>>>>>>> 3. User chooses crop. Grow button is highlighted. >>>>>>>>>>>>>>

//Choice time (From dialog "Okay" to click "Grow")
/*var start = null;
            $(window).load(function(event) {
                start = event.timeStamp;
            });
            $(window).unload(function(event) {
                var time = event.timeStamp - start;
                $.post('/collect-user-time/ajax-backend.php', {time: time});
*/




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

//"Weather realization screen": weather results are displayed.
	//create two functions: displayRain and displaySun.
	//Use these also on the dialog boxes prompted by weather outcome.

//TEST -- removing fadeIn and fadeOut
function displaySun () { // fadeIn causes the HTML to change to style="display:inline; opacity: 1"
	$("#sun").addClass("displayWeather").removeClass("hidden");
		//alert("This is sun and game weather is "+ gameWeather[turn]);
		setTimeout(fadeWeather, 4000);
};

function displayRain () {
	$("#rain").addClass("displayWeather").removeClass("hidden");
		//alert("This is rain and game weather is " + gameWeather[turn]);
		setTimeout(fadeWeather, 4000);
};

function fadeWeather () {
		//setTimeout calls function after a certain time; currently 3000 ms
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden");
	   	$(".plant").removeClass("select");
	   	$(".plant, .plant_img, #grow").removeClass("hidden");
	   	setTimeout(addTurn, 200);
	};


//displays "Dry" weather
//function displaySun () { // fadeIn causes the HTML to change to style="display:inline; opacity: 1"
//	$("#sun").fadeIn(1000, function(){
//		$(this).addClass("displayWeather");
//		$(this).removeClass("hidden");
//		alert("This is sun and game weather is "+ turnWeather);
//		fadeWeather();
//	});

//};

//displays "Wet" weather
//function displayRain () {
//	$("#rain").fadeIn(1000, function(){
//		$(this).addClass("displayWeather");
//		$(this).removeClass("hidden");
//		alert("This is rain and game weather is " + turnWeather);
//		fadeWeather();
//	});
//};

//Call this function to display weather results graphically
function displayWeather () {

	//remove seedpackets and buttons using class .hidden
	disableGrowButton();
	$(".plant, .plant_img, #grow").addClass("hidden"); //removed .fadeOut(function{})
	//$("#grow").removeClass("highlight");

	//reveal dry outcome with Crop A
	if(cropchoice === "cropA" && gameWeather[turn] === "Dry")
	{
		displaySun();
		//crop graphics
		$("#deadA").removeClass("hidden");
	}

	//reveal dry outcome with Crop B
	else if(cropchoice === "cropB" && gameWeather[turn] === "Dry")
	{
		displaySun();
		//crop graphics
		$("#deadB").removeClass("hidden");
	}

	//reveal wet outcome with Crop A
	else if(cropchoice === "cropA" && gameWeather[turn] === "Wet")
	{
		displayRain();
		//crop graphics
		$("#rowsCropA").removeClass("hidden");
	}

	//reveal wet outcome with Crop B
	else if(cropchoice ==="cropB" && gameWeather[turn] === "Wet")
	{
		displayRain();
		//crop graphics
		$("#rowsCropB").removeClass("hidden");
	}
};

//Fades out weather images and restores "choice screen" after setTimeout-specified period
//function fadeWeather () {
//	setTimeout(function() {   //setTimeout calls function after a certain time; currently 3000 ms
//	   	$("#sun, #rain").fadeOut(function(){
//	   		$(this).removeClass("displayWeather").addClass("hidden");
//	   		});
//	   	$(".plant").removeClass("select");
//	   	$("#grow").removeClass("highlight");
//	   	$(".plant, .plant_img, #grow").fadeIn(function(){
//			$(this).removeClass("hidden");
//			});
//		setTimeout(addTurn, 400); //Waits 400 ms after callback function to execute because fadeIn is done after 400ms
//	}, 3000); //time in milliseconds (1000 ms = 1 s)

//};


// >>>>>>>>>>> 5. Game updates and loops back to the beginning of the code >>>>>>>>>>>>>>>>>>>


function addTurn () {
	turn = turn + 1;
	$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
	//setTimeout(assignTurnWeather, 100); //runs function assignTurnWeather with new turn value
	//alert("gameWeather is now " + gameWeather[turn] + " because it is turn #" + turn);
};


//Score updates, and point flag height changes

function newScore () {
	$("#point_count").html("<h5>" + score + "</h5>");
	return score;
};

	//Height of #points_bar as an integer
	totalHeight = parseInt($("#points_bar").css("height"));

	//Points counter moves this amount per turn
	perTurnHeight = (totalHeight/maxturn);

	//Current CSS position for #points_flag "bottom" as an integer
	flagHeight = parseInt($("#points_flag").css("bottom"));

	//Current CSS height of #points_fill with "height" as an integer
	fillHeight = parseInt($("#points_fill").css("height"));


function movePointsFlag () {
	//increase position of #points_flag
	flagHeight+=perTurnHeight;
	$("#points_flag").css("bottom", flagHeight); // Sets value of style rule "bottom" to flagHeight
	return flagHeight;
	};

function movePointsFill () {
	//increase height of yellow #points_fill
	fillHeight+=perTurnHeight;
	$("#points_fill").css("height", fillHeight); // Sets value of style rule "bottom" to flagHeight
	return fillHeight;
	};

	// WARNING: .css modifies the element's <style> property, not the CSS sheet!

//Game updates given cropchoice and game weather for this turn

function updateGame() {

	if (cropchoice == "cropA" && gameWeather[turn] == "Dry")  //if user chooses crop A *and* weather is dry
	{
		score += payoutAdry; //sets score = score + payoutAdry
		newScore();
		movePointsFlag();
		movePointsFill();
		plantstatus = "dead";
		cropChosen = "cropA"; //records the crop that was chosen for this turn
		cropchoice = ""; // resets value of cropchoice to ""
		setTimeout(function () { $("#deadA").addClass("hidden"); }, 3500);
	}
				//>>>> Data collection<<<

		//playerchoices[turn] = {Turn: turn, Seed: "cropA", Weather: "Dry", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		//playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		//playerchoices[turn].string = "Turn;" + turn + ":Seed;A:Weather;Dry:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		//ajaxFunction(playerchoices[turn].string);

				//>>>> Add in later <<<<
		//lastcloud = "Dry";
		//updatedaybar();
		//timerbar = wait;
		//wmessage = sunmessage;
		//cmessage = aplantdrymessage;
		//sunsound.currenttime=0;
		//sunsound.play();
		//keeptime = 0;


	else if (cropchoice == "cropA" && gameWeather[turn] == "Wet")
	{
		score += payoutAwet; //sets score = score + payoutAwet
		newScore();
		movePointsFlag();
		movePointsFill();
		plantstatus = "healthy";
		cropChosen = "cropA";
		cropchoice = "";
		setTimeout(function () {$("#rowsCropA").addClass("hidden");}, 3500);
	}

		//>>>> Data collection<<<

		//playerchoices[turn] = {Turn: turn, Seed: "cropA", Weather: "Wet", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		//playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		//playerchoices[turn].string = "Turn;" + turn + ":Seed;A:Weather;Wet:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		//ajaxFunction(playerchoices[turn].string);


		//>>>> Add in later <<<<

		//keeptime = 0;
		//lastcloud = "Wet";
		//updatedaybar();
		//timerbar = wait;
		//wmessage = rainmessage;
		//cmessage = aplantwetmessage;
		//rainsound.currenttime=0;
		//rainsound.play();
		//keeptime = 0;


	else if (cropchoice == "cropB" && gameWeather[turn] == "Wet")
	{
		score += payoutBwet; //sets score = score + payoutBwet
		newScore();
		movePointsFlag();
		movePointsFill();
		plantstatus = "healthy";
		cropChosen = "cropB";
		cropchoice = "";
		setTimeout(function () {$("#rowsCropB").addClass("hidden");}, 3500);
	}

			//>>>> Data collection<<<
		//playerchoices[turn] = {Turn: turn, Seed: "cropB", Weather: "Wet", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		//playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		//playerchoices[turn].string = "Turn;" + turn + ":Seed;B:Weather;Wet:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		//ajaxFunction(playerchoices[turn].string);

			//>>>> Add in later <<<<
		//keeptime = 0;
		//lastcloud = "Wet";
		//updatedaybar();
		//timerbar = wait;
		//wmessage = rainmessage;
		//cmessage = bplantwetmessage;
		//rainsound.currenttime=0;
		//rainsound.play();
		//keeptime = 0;


	else if (cropchoice == "cropB" && gameWeather[turn] == "Dry")
	{

		score += payoutBdry; //sets score = score + payoutBdry
		newScore();
		movePointsFlag();
		movePointsFill();
		plantstatus = "dead";
		cropChosen = "cropB";
		cropchoice = "";
		setTimeout(function () {$("#deadB").addClass("hidden");}, 3500);
	}

			//>>>> Data collection<<<

		//playerchoices[turn] = {Turn: turn, Seed: "cropB", Weather: "Dry", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		//playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		//playerchoices[turn].string = "Turn;" + turn + ":Seed;B:Weather;Dry:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		//ajaxFunction(playerchoices[turn].string);

			//>>>> Add in later <<<<
		//lastcloud = "Dry";
		//updatedaybar();
		//timerbar = wait;
		//wmessage = sunmessage;
		//cmessage = bplantdrymessage;


		////>>>> Add in later <<<<
		//keeptime +=1;
		//if (timerbar > -1) timerbar--;
		//if (turn > maxturn) GameOver=true;
		//sunsound.currenttime=0;
		//sunsound.play();
		//keeptime = 0;

}; //end of updateGame function


function endGame () {
	//call end-of-game dialog box
	endOfGame = true;
	return endOfGame;
	$("button #grow").addClass("hidden");
	//inclusive of last turn (50)
};


//Grow button calls displayWeather() ONLY if a crop has been chosen (if "input" has the "highlight" class)
$("#grow").on("click", function () {
	if ($(this).hasClass("highlight") && turns < maxturn) {
		// hide crop sprout graphics
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		//call displayWeather function
		displayWeather();
		//callsback updateGame function 200ms after displayWeather
		setTimeout(updateGame, 400);
	}

	else if ($(this).hasClass("highlight") && turns == maxturn) {
		//summon end-of-game dialog instead of update
		$("#sproutA").addClass("hidden");
		$("#sproutB").addClass("hidden");
		//call displayWeather function
		displayWeather();
		//callsback updateGame function 200ms after displayWeather
		setTimeout(updateGame, 400);
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