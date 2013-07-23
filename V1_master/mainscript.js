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

//Should these be inside an object?

	maxturn = 50;
	payoutAwet = 70;
	payoutAdry = 80;
	payoutBwet = 100;
	payoutBdry = 50;
	threshold = 600; //formerly "rainchance"
	climateArray = [];
	function climateChange () {
		for (var i =0; i < maxturn+1; i++)
			{
				climateArray[i]=10; //change climateArray here
			}
			return climateArray; //assigns value of climateArray to function climateChange
		};
	cropchoice = ""; //formerly bevent
	//"var" is local; removed var to make variable global
	//the first time JS sees variable, it will declare it. (without var)
	



//>>>>>>>>> 1. Game generates game weather >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

climateChange(); //runs function climateChange, sets climateArray to new value

// -------

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

// -------

thresholdArray = [];

function makeThresholdArray () {
	for (var i = 0; i < maxturn+1; i++)
	{
	thresholdArray[i] = threshold + climateArray[i];
	}
	
	return thresholdArray; 
};

makeThresholdArray(); //sets thresholdArray to new value


// -------

gameWeather = [];

function makeGameWeather(x) //makeGameWeather takes empty variable "turnWeather" and gives it value depending on parameter x
{

for (var i = 0; i < maxturn+1; i++) {
	if (weatherArray[i] < thresholdArray[i])
		{
			turnWeather = "Wet";
			gameWeather[i] = turnWeather;
		}

	if (weatherArray[i] > thresholdArray[i])
		{
			turnWeather = "Dry";
			gameWeather[i] = turnWeather;
		}
		
		} //end of for loop

	return gameWeather;
};

makeGameWeather(); //sets value of gameWeather (weather for length of game)

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>2. Game sets up initial game values >>>>>>>>>>>>>>>>>>>>>>

//Crop Information Table
function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
	$("table").find("td#payoutAwet").text(payoutAwet + " points");
	$("table").find("td#payoutAdry").text(payoutAdry + " points");
	$("table").find("td#payoutBwet").text(payoutBwet + " points");
	$("table").find("td#payoutBdry").text(payoutBdry + " points");
};

writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry);

//Turn Counter

turn = 1;
$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
GameOver = false;

//Points Counter

score = 0;

//Calculate Max Score

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

calculateOptimalCrop(); //sets value of optimalCrops array

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
var plantstatus = "";


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


// >>>>>>>>>>>>>>>>>>3. User chooses crop. Grow button is highlighted. >>>>>>>>>>>>>>

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
	cropchoice = "cropA"; //var declares NEW variables
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


//>>>>>>>>>>>>>>>>>> 4. User clicks "grow" button. >>>>>>>>>>>>>>>>>>>>>>>>

//"Weather realization screen": weather results are displayed.
	//create two functions: displayRain and displaySun. 
	//Use these also on the dialog boxes prompted by weather outcome.

//Call this function to display weather results graphically 
function displayWeather () {

	//remove seedpackets and buttons using class .hidden
$(".plant, .plant_img, #grow").fadeOut(function(){
	$(this).addClass("hidden");
	}); 

	//reveal dry outcome with Crop A
	if(cropchoice == "cropA" && turnWeather == "Dry")
	{
		displaySun();
	}

	//reveal dry outcome with Crop B
	if(cropchoice == "cropB" && turnWeather == "Dry")
	{
		displaySun();
	}

	//reveal wet outcome with Crop A
	if(cropchoice == "cropA" && turnWeather == "Wet")
	{
		displayRain();
	}

	//reveal wet outcome with Crop B
	if(cropchoice =="cropB" && turnWeather == "Wet")
	{
		displayRain();
	}
	

};

//What is the correct order of functions?? (originally I had these "definition" functions 
	//up at the top BEFORE displayWeather function)


//displays "Dry" results
function displaySun () {
	$("#sun").fadeIn(1000, function(){
		$(this).addClass("displayWeather");
	fadeWeather();
	});
};

//displays "Wet" results
function displayRain () {
	$("#rain").fadeIn(1000, function(){
		$(this).addClass("displayWeather");
	fadeWeather();
	});
};

//Fades out weather images and restores "choice screen" after certain period of time
//Loops back to the beginning of the code


function addTurn () {
	turn = turn + 1;
	$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
};

function fadeWeather () {
	setTimeout(function() {   //setTimeout calls function after a certain time
	   	$("#sun, #rain").fadeOut(function(){
	   		$(this).removeClass("displayWeather").addClass("hidden");
	   		});
	   	$(".plant").removeClass("select");
	   	$("#grow").removeClass("highlight");
	   	$(".plant, .plant_img, #grow").fadeIn(function(){
			$(this).removeClass("hidden");
			});
		setTimeout(addTurn, 800); //Waits 800 ms after callback function to execute because fadeIn is done after 400ms 
	}, 3000); //time in milliseconds (1000 ms = 1 s)

};

//Grow button only calls displayWeather() if a crop has been chosen
$("#grow").on("click", function () {

	if ($("input").hasClass("disabled")) {
		alert("Please choose a crop first!");
	} else if ($("input").hasClass("highlight")) {
		displayWeather(); //call a function with parentheses
	}
});



function updateGame() {
	//alert("Updating!");
//	weather = Math.floor((Math.random()*1000)+1); 
//	setclouds(weather); //calling function setclouds within function updateGame
						//"weather" is actually the Clark Kent of x (x on the inside)
	
	if (cropchoice == "cropA" && turnWeather == "Dry")  //if user chooses crop A *and* weather is dry
	{
		score += payoutAdry; //sets score = score + payoutAdry	
		plantstatus = "dead";
		cropChosen = "cropA"; //records the crop that was chosen for this turn
		cropchoice = ""; // resets value of cropchoice to ""
		
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
	}
	
	if (cropchoice == "cropA" && turnWeather == "Wet") 
	{
		score += payoutAwet; //sets score = score + payoutAwet	
		plantstatus = "healthy";
		cropChosen = "cropA";
		cropchoice = ""; 
		
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
	}
	
	if (cropchoice == "cropB" && turnWeather == "Wet") 
	{
		score += payoutBwet; //sets score = score + payoutBwet	
		plantstatus = "healthy";
		cropChosen = "cropB";
		cropchoice = ""; 
		
		
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
	}

	if (cropchoice == "cropB" && turnWeather == "Dry") 
	{
		
		score += payoutBdry; //sets score = score + payoutBdry	
		plantstatus = "dead";
		cropChosen = "cropB";
		cropchoice = ""; 
		
		
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
	}
	
	////>>>> Add in later <<<<
	//keeptime +=1;
	//if (timerbar > -1) timerbar--;
	//if (turn > maxturn) GameOver=true;
	//sunsound.currenttime=0;
	//sunsound.play();
	//keeptime = 0;
};





//Grow button calls the function displayWeather on click
//$("#grow").click(displayWeather); 



}); //End of .ready ()