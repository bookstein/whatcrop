$(document).ready(function(){

//>>>>>>>>>>>>> 1. Introduction screen and set-up code for game

// Game instructions - toggle #instructions with nav button "Game instructions"
$('nav a').click(function(event){
  event.preventDefault;
  $(this).closest("header").find("#instructions").toggle();

  });
  
//To hide #instructions
$('#instructions a').click(function(event) {
  event.preventDefault;
  $(this).closest("header").find("#instructions").toggle();

  });


//Code for game (taken from V0 (original))

//VARIABLES THAT MIGHT NEED TO BE CHANGED
//ADJUST MAXIMUM NUMBER OF TURNS HERE
var maxturn = 50;

//HERE ARE THE SCORES FOR THE PLANTS
var payoutAwet = 70; //formerly named "aplantwet"
var payoutAdry = 80; //formerly named "aplantdry"
var payoutBwet = 100; //"bplantwet"
var payoutBdry = 50; //"bplantdry"

//ADJUST MAXSCORE HERE
var maxscore = 0; // ? 


var playerchoices = [maxturn+1]; //creates an array containing "51". 

//sets up first turn
var turn = 1; 
var score = 0; //starting score is 0
var bevent = ""; //What is bevent?
var GameOver = false;
var weather = Math.floor((Math.random()*1000)+1); //chooses random weather
var rweather = Math.floor((Math.random()*2)+1); //rweather chooses random # between 0 and 3
var clouds = ""; //"Empty" global variable called "clouds"
var lastcloud = "Dry"; //What is lastcloud??
var water = false;
var plantstatus = "";
var seedchosen = "";
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


//>>>>>>>>>>>>>>>>>>>>>> 2. User chooses crop. 
					//   3. Grow button is highlighted after choice.


function userclickedA () {
	$("#cropA").toggleClass("select");
	var cropchoice = "cropA";
	$("#grow").toggleClass("highlight");
};

function userclickedB () {
	$("#cropB").toggleClass("select");
	var cropchoice = "cropB";
	$("#grow").toggleClass("highlight");
};


$("#cropA").on("click", userclickedA);

$("#cropB").on("click", userclickedB);


//>>>>>>>>>>>>>>>>>> 4. Weather is randomly chosen. 


var threshold = 600; //formerly "rainchance." The threshold between wet and dry (.6*1000)
//Be able to modify this number easily.
var climateChange = //formerly "pollution"
[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 
5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]; //creates a new array with 51 "5"s.
//Need to be able to modify each of these numbers easily

function setclouds(x) //defining function called setclouds with parameter x
{
	if (x<=threshold) //if x is less than or equal to 600, clouds = "Wet"
	{clouds = "Wet";} //changes value of clouds variable to "Wet"
	else				//if x is greater than 600, changes value of clouds variable to "Dry"
	{clouds = "Dry";} //changes value of clouds variable to "Wet"
}

function updateGame()
{
	setclouds(weather); //calling function setclouds within function updateGame
						//parameter x is now "weather"
	
	if (bevent == "A" && clouds == "Dry" && water) //if user chooses A *and* clouds are equal to dry *and* water (?)
	{
		//Dry Season
		water = false;
		bevent = "";
		weather = Math.floor((Math.random()*1000)+1); 
		//Sets "weather" equal to random number between 0 and 999 (+1= 1000)
		score += payoutAdry; //sets score = score + aplantdry
		playerchoices[turn] = {Turn: turn, Seed: "A", Weather: "Dry", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;A:Weather;Dry:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		turn = turn + 1;
		keeptime = 0;
		lastcloud = "Dry";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "dead";
		seedchosen = "A";
		updatedaybar();
		timerbar = wait;
		sunsound.currenttime=0;
		sunsound.play();
		wmessage = sunmessage;
		cmessage = aplantdrymessage;
	}
	
	if (bevent == "A" && clouds == "Wet" && water)
	{
		//Wet Season
		water = false;
		bevent = "";
		weather = Math.floor((Math.random()*1000)+1);
		score += payoutAwet;
		playerchoices[turn] = {Turn: turn, Seed: "A", Weather: "Wet", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;A:Weather;Wet:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		turn = turn + 1;
		keeptime = 0;
		lastcloud = "Wet";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "healthy";
		seedchosen = "A";
		updatedaybar();
		timerbar = wait;
		rainsound.currenttime=0;
		rainsound.play();
		wmessage = rainmessage;
		cmessage = aplantwetmessage;
	}
	
	if (bevent == "B" && clouds == "Wet" && water)
	{
		//Wet Season
		water = false;
		bevent = "";
		weather = Math.floor((Math.random()*1000)+1);
		score += payoutBwet;
		playerchoices[turn] = {Turn: turn, Seed: "B", Weather: "Wet", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;B:Weather;Wet:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		turn = turn + 1;
		keeptime = 0;
		lastcloud = "Wet";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "healthy";
		seedchosen = "B";
		updatedaybar();
		timerbar = wait;
		rainsound.currenttime=0;
		rainsound.play();
		wmessage = rainmessage;
		cmessage = bplantwetmessage;
	}
	if (bevent == "B" && clouds == "Dry" && water)
	{
		//Dry Season
		water = false;
		bevent = "";
		weather = Math.floor((Math.random()*1000)+1);
		score += payoutBdry;
		playerchoices[turn] = {Turn: turn, Seed: "B", Weather: "Dry", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;B:Weather;Dry:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		turn = turn + 1;
		keeptime = 0;
		lastcloud = "Dry";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "dead";
		seedchosen = "B";
		updatedaybar();
		timerbar = wait;
		sunsound.currenttime=0;
		sunsound.play();
		wmessage = sunmessage;
		cmessage = bplantdrymessage;
	}
	
	water = false;
	keeptime +=1;
	if (timerbar > -1) timerbar--;
	if (turn > maxturn) GameOver=true;
};


//5. "Weather realization screen": weather results are displayed.
function displayWeather () {
	//change this to if else statements!
	$(".weather").toggleClass("displayWeather");
	$(".weather").toggleClass("hiddenWeather");
};

$("#grow").on("click", displayWeather);

//Must change so that only EITHER #sun or #rain is chosen.
//Do this by making two different functions: displayRain and displaySun,
//and trigger each using if statements.
//Need to know how to use Math.random before I can do this.


}); //End of .ready ()