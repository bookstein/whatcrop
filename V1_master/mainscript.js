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

// Set crop payouts
	payoutAwet = 70;
	payoutAdry = 80;
	payoutBwet = 100;
	payoutBdry = 50;

// Set rain threshold
	threshold = 600; //formerly "rainchance"

// Set climate change by altering value inside function climateChange below
	climateArray = [];
	function climateChange () {
		for (var i =0; i < maxturn+1; i++)
			{
				climateArray[i]=10; //<<<<<<<<<<<<<<<<<<< change this value to alter climate change.
	
			}
			return climateArray; //assigns value of climateArray to function climateChange
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


//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Create list of random numbers that will become weather-------

weatherArray = [];

function makeWeatherArray() {
	for (var i = 0; i < maxturn+1; i++)
	{
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
	thresholdArray[i] = thresholdArray[0] - (climateArray[i]*i);
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

//!!!!!!!!!!!!!!!Everything works up until this point. The graphics aren't in line with turnWeather.

// Assign turnWeather (weather per turn) -------

turnWeather = "";

function assignTurnWeather() {
	turnWeather = gameWeather[turn];
	//alert("Value of turnWeather is now " + gameWeather[turn]);
	return turnWeather;
};

assignTurnWeather(); //sets value of turnWeather for the first turn (and each turn thereafter as part of updateGame)


//Calculate Max Score -------

optimalCrops = []; //array of all optimal crops, by turn

function calculateOptimalCrop () {
	for (var i = 0; i < maxturn+1; i++) {

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

calculateOptimalCrop(); //sets value of optimalCrops array -------

maxScore = 0;

function calculateMaxScore () {
		for (var i=0; i < optimalCrops.length; i++)
		{
		maxScore += optimalCrops[i]
		} //maxScore = maxScore + optimalTurnCrop[i]
	return maxScore;
};

calculateMaxScore();


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


function hoverGrow () {
	$("input").attr('value', $(this).replace('Grow this crop','Please choose a crop'));
}; //this still doesn't work!

$("input, .disabled").on("hover", hoverGrow);

function highlightGrow () {
	$("#grow").addClass("highlight").removeClass("disabled");
};

function userclickedA () {
	$("#cropA").toggleClass("select");
	cropchoice = "cropA"; 
	$("#cropB").removeClass("select");
	//$("#grow").toggleClass("highlight");
	highlightGrow();
};

function userclickedB () {
	$("#cropB").toggleClass("select");
	cropchoice = "cropB";
	$("#cropA").removeClass("select");
	//$("#grow").toggleClass("highlight");
	highlightGrow();
};


$("#cropA").on("click", userclickedA);

$("#cropB").on("click", userclickedB);


//>>>>>>>>>>>>>>>>>> 4. User clicks "grow" button. Results appear. >>>>>>>>>>>>>>>>>>>>>>>>

//"Weather realization screen": weather results are displayed.
	//create two functions: displayRain and displaySun. 
	//Use these also on the dialog boxes prompted by weather outcome.

//TEST
function displaySun () { // fadeIn causes the HTML to change to style="display:inline; opacity: 1"
	$("#sun").addClass("displayWeather").removeClass("hidden");
		alert("This is sun and game weather is "+ turnWeather);
		setTimeout(fadeWeather, 4000);
};

function displayRain () {
	$("#rain").addClass("displayWeather").removeClass("hidden");
		alert("This is rain and game weather is " + turnWeather);
		setTimeout(fadeWeather, 4000);
};

function fadeWeather () {
		//setTimeout calls function after a certain time; currently 3000 ms
	   	$("#sun, #rain").removeClass("displayWeather").addClass("hidden");
	   	$(".plant").removeClass("select");
	   	$(".plant, .plant_img, #grow").removeClass("hidden");
		setTimeout(addTurn, 400); //Waits 400 ms after callback function to execute because fadeIn is done after 400ms 
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
	$(".plant, .plant_img, #grow").addClass("hidden"); //originally used .fadeOut(function{}) 
	$("#grow").removeClass("highlight");

	//reveal dry outcome with Crop A
	if(cropchoice === "cropA" && turnWeather === "Dry")
	{
		displaySun();
		//crop graphics
	}

	//reveal dry outcome with Crop B
	else if(cropchoice === "cropB" && turnWeather === "Dry")
	{
		displaySun();
		//crop graphics
	}

	//reveal wet outcome with Crop A
	else if(cropchoice === "cropA" && turnWeather === "Wet")
	{
		displayRain();
		//crop graphics
	}

	//reveal wet outcome with Crop B
	else if(cropchoice ==="cropB" && turnWeather === "Wet")
	{
		displayRain();
		//crop graphics
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
	return turn;
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

	//Current CSS height for #points_flag "bottom" as an integer
	flagHeight = parseInt($("#points_flag").css("bottom"));

function movePointsFlag () {
	
	$("#points_flag").css("bottom", ((flagHeight + perTurnHeight) + "px"));
	return flagHeight; //!!!!! apply this same height to the height of the yellow bar!!!!
};

//Game updates given cropchoice and game weather for this turn

function updateGame() {
	
	if (cropchoice == "cropA" && gameWeather[turn] == "Dry")  //if user chooses crop A *and* weather is dry
	{
		score += payoutAdry; //sets score = score + payoutAdry	
		newScore();
		movePointsFlag();
		plantstatus = "dead";
		cropChosen = "cropA"; //records the crop that was chosen for this turn
		cropchoice = ""; // resets value of cropchoice to ""
		assignTurnWeather(); //updates turnWeather
		
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
	
	
	if (cropchoice == "cropA" && gameWeather[turn] == "Wet") 
	{
		score += payoutAwet; //sets score = score + payoutAwet	
		newScore();
		plantstatus = "healthy";
		cropChosen = "cropA";
		cropchoice = ""; 
		assignTurnWeather(); //runs function assignTurnWeather with new turn value
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
	
	
	if (cropchoice == "cropB" && gameWeather[turn] == "Wet") 
	{
		score += payoutBwet; //sets score = score + payoutBwet
		newScore();	
		plantstatus = "healthy";
		cropChosen = "cropB";
		cropchoice = ""; 
		assignTurnWeather(); //updates turnWeather
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
	

	if (cropchoice == "cropB" && gameWeather[turn] == "Dry") 
	{
		
		score += payoutBdry; //sets score = score + payoutBdry
		newScore();	
		plantstatus = "dead";
		cropChosen = "cropB";
		cropchoice = ""; 
		assignTurnWeather(); //updates turnWeather
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



//Grow button calls displayWeather() ONLY if a crop has been chosen (if "input" has the "highlight" class)
$("#grow").on("click", function () {

	if ($("input").hasClass("disabled")) {
		alert("Please choose a crop first!");
	} else if ($("input").hasClass("highlight")) {
		displayWeather(); //calls displayWeather function
		updateGame(); //calls updateGame function
	}
});


}); //End of .ready ()