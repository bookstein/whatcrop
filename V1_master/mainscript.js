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

//ADJUST MAXIMUM NUMBER OF TURNS HERE
var maxturn = 50;

//HERE ARE THE SCORES FOR THE PLANTS
var payoutAwet = 70; //formerly named "aplantwet"
var payoutAdry = 80; //formerly named "aplantdry"
var payoutBwet = 100; //formerly "bplantwet"
var payoutBdry = 50; //formerly "bplantdry"

//These values are then plugged into the crop information table (discrete weather version)
function writeCropPayout (payoutAwet, payoutAdry, payoutBwet, payoutBdry) {
	$("table").find("td#payoutAwet").text(payoutAwet + " points");
	$("table").find("td#payoutAdry").text(payoutAdry + " points");
	$("table").find("td#payoutBwet").text(payoutBwet + " points");
	$("table").find("td#payoutBdry").text(payoutBdry + " points");
};

writeCropPayout ("70", "80", "100", "50");

//ADJUST MAXSCORE HERE
var maxscore = 0; // ? 


var playerchoices = [maxturn+1]; //creates an array containing "51". 

//sets up first turn
var turn = 1; 
$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
var score = 0; //starting score is 0 
var GameOver = false;
var weather = Math.floor((Math.random()*1000)+1); //chooses random weather
var rweather = Math.floor((Math.random()*2)+1); //rweather chooses random # between 0 and 3
var clouds = ""; //"Empty" global variable called "clouds"
var lastcloud = "Dry"; //What is lastcloud??
//var water = false;
var plantstatus = "";
cropchoice = ""; //formerly seedchosen; formerly bevent
//"var" is local; removed var to make variable global
//the first time JS sees variable, it will declare it. (without var)

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

//Choice time (From dialog "Okay" to click "Grow")
/*var start = null;
            $(window).load(function(event) {
                start = event.timeStamp;
            });
            $(window).unload(function(event) {
                var time = event.timeStamp - start;
                $.post('/collect-user-time/ajax-backend.php', {time: time});
*/

//>>>>>>>>>>>>>>>>>>>>> 3. Grow button is highlighted after choice.

function hoverGrow () {
	$("input").attr('value', $(this).replace('Grow this crop','Please choose a crop'));
};

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


//>>>>>>>>>>>>>>>>>> 4. User clicks "grow" button. Weather is randomly chosen. 


$("#grow").on("click", function (event) {

	if ($("input").hasClass("disabled"))
	{
		alert("Please choose a crop first!");
		event.stopPropagation();
	}

	else if ($("input").hasClass("highlight"))
	{
		weather = Math.floor((Math.random()*1000)+1);
		setclouds(weather);
	}
});

var climateChange = //formerly "pollution"
[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 
5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]; //creates a new array with 51 "5"s.
//Fran needs to be able to modify each of these numbers easily


function setclouds(x) //setclouds takes empty variable "clouds" and gives it value depending on parameter x
{
	if (x<=threshold) //if x is less than or equal to 600, clouds = "Wet"
	{clouds = "Wet";} //changes value of clouds variable to "Wet"
	else				//if x is greater than 600, changes value of clouds variable to "Dry"
	{clouds = "Dry";} //changes value of clouds variable to "Wet"
	alert("Weather is " + clouds); //temporary placeholder
};

var threshold = 600; //formerly "rainchance." The threshold between wet and dry (.6*1000)
//Be able to modify this number easily.



function updateGame() {
	alert("Updating!");
	weather = Math.floor((Math.random()*1000)+1); 
	setclouds(weather); //calling function setclouds within function updateGame
						//"weather" is actually the Clark Kent of x (x on the inside)
	
	if (cropchoice == "cropA" && clouds == "Dry") //&& water) //if user chooses A *and* clouds are equal to dry
	{
		//Dry Season
		//water = false;
		cropchoice = "";
		//Sets "weather" equal to random number between 0 and 999 (+1= 1000)
		score += payoutAdry; //sets score = score + aplantdry
		playerchoices[turn] = {Turn: turn, Seed: "cropA", Weather: "Dry", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;A:Weather;Dry:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		//turn = turn + 1;
		keeptime = 0;
		lastcloud = "Dry";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "dead";
		cropchoice = "cropA";
		updatedaybar();
		timerbar = wait;
		sunsound.currenttime=0;
		sunsound.play();
		wmessage = sunmessage;
		cmessage = aplantdrymessage;
	}
	
	if (cropchoice == "cropA" && clouds == "Wet") //&& water)
	{
		//Wet Season
		//water = false;
		cropchoice = "";
		weather = Math.floor((Math.random()*1000)+1);
		score += payoutAwet;
		playerchoices[turn] = {Turn: turn, Seed: "cropA", Weather: "Wet", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;A:Weather;Wet:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		//turn = turn + 1;
		keeptime = 0;
		lastcloud = "Wet";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "healthy";
		cropchoice = "cropA";
		updatedaybar();
		timerbar = wait;
		rainsound.currenttime=0;
		rainsound.play();
		wmessage = rainmessage;
		cmessage = aplantwetmessage;
	}
	
	if (cropchoice == "cropB" && clouds == "Wet") //&& water)
	{
		//Wet Season
		//water = false;
		cropchoice = "";
		weather = Math.floor((Math.random()*1000)+1);
		score += payoutBwet;
		playerchoices[turn] = {Turn: turn, Seed: "cropB", Weather: "Wet", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;B:Weather;Wet:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		//turn = turn + 1;
		keeptime = 0;
		lastcloud = "Wet";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "healthy";
		seedchosen = "cropB";
		updatedaybar();
		timerbar = wait;
		rainsound.currenttime=0;
		rainsound.play();
		wmessage = rainmessage;
		cmessage = bplantwetmessage;
	}
	if (cropchoice == "cropB" && clouds == "Dry") //&& water)
	{
		//Dry Season
		//water = false;
		cropchoice = "";
		weather = Math.floor((Math.random()*1000)+1);
		score += payoutBdry;
		playerchoices[turn] = {Turn: turn, Seed: "cropB", Weather: "Dry", Time: (keeptime-wait)/60, Score: score, GameID: gameID};
		playerchoices[turn].Time = Math.round(playerchoices[turn].Time*10)/10;
		playerchoices[turn].string = "Turn;" + turn + ":Seed;B:Weather;Dry:Time;" + playerchoices[turn].Time+";Score:" + score + ";PlayerID:" + gameID;
		ajaxFunction(playerchoices[turn].string);
		threshold -= climateChange[turn];
		//turn = turn + 1;
		keeptime = 0;
		lastcloud = "Dry";
		rweather = Math.floor((Math.random()*2)+1);
		plantstatus = "dead";
		cropchoice = "cropB";
		updatedaybar();
		timerbar = wait;
		sunsound.currenttime=0;
		sunsound.play();
		wmessage = sunmessage;
		cmessage = bplantdrymessage;
	}
	
	//water = false;
	keeptime +=1;
	if (timerbar > -1) timerbar--;
	if (turn > maxturn) GameOver=true;
};


//5. "Weather realization screen": weather results are displayed.
	//create two functions: displayRain and displaySun. 
	//Use these also on the dialog boxes prompted by weather outcome.

//Call this function to display weather results 
function displayWeather () {

	//remove seedpackets and buttons using .hidden
$(".plant, .plant_img").fadeOut(function(){
	$(this).addClass("hidden");
	}); 

	//reveal dry outcome with Crop A
	if(cropchoice == "cropA" && clouds == "Dry")
	{
		displaySun();
	}

	//reveal dry outcome with Crop B
	if(cropchoice == "cropB" && clouds == "Dry")
	{
		displaySun();
	}

	//reveal wet outcome with Crop A
	if(cropchoice == "cropA" && clouds == "Wet")
	{
		displayRain();
	}

	//reveal wet outcome with Crop B
	if(cropchoice =="cropB" && clouds == "Wet")
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
	console.log("Eek!");
	$("#turns_counter").html("<h5>" + turn + "/" + maxturn + "</h5>");
};

function fadeWeather () {
	setTimeout(function() {   //setTimeout calls function after a certain time
	   	$("#sun, #rain").fadeOut(function(){
	   		$(this).removeClass("displayWeather").addClass("hidden");
	   		});
	   	$(".plant").removeClass("select");
	   	$("#grow").removeClass("highlight");
	   	$(".plant, .plant_img").fadeIn(function(){
			$(this).removeClass("hidden");
			});
		setTimeout(addTurn, 800); //Waits 800 ms after callback function to execute because fadeIn is done after 400ms 
	}, 1000); //time in milliseconds (1000 ms = 1 s)

};



//Grow button calls the function displayWeather on click
$("#grow").click(displayWeather);



}); //End of .ready ()