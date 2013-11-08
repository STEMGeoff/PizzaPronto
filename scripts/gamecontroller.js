function GameController(opts){
	var canvasId = opts.canvas, hudId = opts.hud;
	var tiltManager, stopLight;
	var gameCanvas = Dom.get(canvasId);
	var hud = Dom.get(hudId);
	var gameHtml = gameCanvas.innerHTML;
	var car_image1 = Dom.get('car-image1');
	var car_image2 = Dom.get('car-image2');
	var car_image3 = Dom.get('car-image3');
	var stoplightCanvas = opts.stoplightCanvas;
	var stopLight = new StopLight(stoplightCanvas);
	var saveIntervalTime = 1000; //1 second
	var startTime, endTime, currentName, saveInterval, tripData, currentTimeCounter;
	var hasTilt = false, deviceHasTilt = window.DeviceOrientationEvent ||
											window.DeviceMotionEvent;
	var deviceHasTouch = !!('ontouchstart' in window);
	var chosenVehicle;
	var startOptions = {
	  canvas: canvas, render: render, update: update, step: step,
	  images: ["background", "sprites"],
	  keys: [
	  { keys: [KEY.LEFT,  KEY.A], mode: 'down', action: function() { keyLeft   = true;  } },
	  { keys: [KEY.RIGHT, KEY.D], mode: 'down', action: function() { keyRight  = true;  } },
	  { keys: [KEY.UP,    KEY.W], mode: 'down', action: function() { keyFaster = true;  } },
	  { keys: [KEY.DOWN,  KEY.S], mode: 'down', action: function() { keySlower = true;  } },
	  { keys: [KEY.LEFT,  KEY.A], mode: 'up',   action: function() { keyLeft   = false; } },
	  { keys: [KEY.RIGHT, KEY.D], mode: 'up',   action: function() { keyRight  = false; } },
	  { keys: [KEY.UP,    KEY.W], mode: 'up',   action: function() { keyFaster = false; } },
	  { keys: [KEY.DOWN,  KEY.S], mode: 'up',   action: function() { keySlower = false; } }
	  ],
	  ready: function(images) {
	    background = images[0];
	    sprites    = images[1];
	    reset();
	    Dom.storage.fast_lap_time = Dom.storage.fast_lap_time || 180;
	  }
	};

	//PRIVATE
	function addClickListeners(element, listener){
		Dom.on(element,'click',listener);
		Dom.on(element,'touchstart',listener);
	}
	function showGameCanvas(){
		Dom.show(canvasId);Dom.show(hudId);
	}
	function hideGameCanvas(){
		gameCanvas.style.display = 'none';
		hud.style.display = 'none';
	}
	function clearCanvas(){
		canvas.width = canvas.width;
	}
	function writeText(canvas, text){
		var canvasWidth = parseInt(gameCanvas.offsetWidth);
		var canvasHeight = parseInt(gameCanvas.offsetHeight);
		var context = canvas.getContext('2d');
		clearCanvas();
		context.fillStyle = '#ff8a00';
		context.font = 'bold 150px Times New Roman';
		context.fillText(text, canvasWidth/2-30, canvasHeight/2+50);
	}
	function stopScrolling(touchEvent){
		touchEvent.preventDefault();
	}
	function showFinalScreen(){
		Dom.show('final-screen');
		drawGraph();
	}
	function drawGraph(){
		var ctx = Dom.get('questionCanvas').getContext("2d");
		var labels = [];
		var dataPoints = [];
		var tripStamps = tripData.tripStamps;
		for(var i = 0;i<tripStamps.length;i++){
			labels.push(tripStamps[i].tripTime);
			dataPoints.push(tripStamps[i].currentSpeed);
		}
		var data = {
			labels : labels,
			datasets : [
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : dataPoints
				}
			]
		};
		var options = {
			scaleGridLineColor : "rgba(0,0,0,.3)"
			, animation: false
		};
		new Chart(ctx).Line(data, options);
	}
	function hideControls(){
		Dom.hide('speed_controls');
		Dom.hide('direction_controls');
	}
	function showControls(hasTilt){
		if(!deviceHasTouch) return;
		Dom.show('speed_controls');
		if(!hasTilt) Dom.show('direction_controls');
	}
	function setSpeedParams(segLength){
		segmentLength = segLength;
		maxSpeed      = segmentLength/step;
		accel         =  maxSpeed/5;
		breaking      = -maxSpeed/3;
		decel         = -maxSpeed/5;
		offRoadDecel  = -maxSpeed/2;
		offRoadLimit  =  maxSpeed/4;
	}

	//PUBLIC
	this.endGame = function(){
		endTime = new Date().getTime();
		window.clearInterval(saveInterval);
		currentTimeCounter = 0;
		Dom.un(document, 'touchmove', stopScrolling);
		hideControls();
		Dom.hide('game-screen');
		showFinalScreen();
	}

	//SCREENS
	function showGameScreen(){
		function displayCountdown(){
			Dom.show('game-screen');
			var currentStep = 3;
			var interval = window.setInterval(function(){
	  			writeText(canvas, currentStep);
	  			currentStep--;
			}, 1000);
			window.setTimeout(function(){
				clearCanvas();
				window.clearInterval(interval);
				startGame()
			}, 4000);
		}
		function startGame(){
			Dom.show('speedometer')
			Game.run(startOptions);
			stopLight.init();
			document.addEventListener('touchstart', stopScrolling, false);
			document.addEventListener('touchmove', stopScrolling, false);
			startTime = new Date().getTime();tripData = new TripData();
			currentTimeCounter = 0;
			saveInterval = window.setInterval(function(){
				saveState();
			}, saveIntervalTime);
			saveState()
		}
		if(window.location.href.indexOf("?tilt") > 0 && deviceHasTilt){
			var tiltManager = new TiltManager(handleTilt, 4);
			hasTilt = true;
		}

		Dom.hide("instructions-screen");
		showControls(hasTilt);
		showGameCanvas();
		displayCountdown();
	}

	function TripData(){
		this.userName = currentName;
		this.chosenVehicle = chosenVehicle;
		this.tripStamps = [];
	}

	function TripStamp(speed, time){
		this.currentSpeed = speed;
		this.tripTime = time;
	}

	function saveState(){
		tripData.tripStamps.push(new TripStamp(getCurrentSpeed(), currentTimeCounter));
		currentTimeCounter++;
	}
	function showHelpScreen(){
		Dom.hide('stats-screen');
		Dom.show('instructions-screen');
		addClickListeners('next3', showGameScreen);
	}
	function showStatsScreen(){
		currentName = Dom.get('player-name').value;
		if(currentName == '') return;
		Dom.hide('name-screen');
		Dom.show('stats-screen');
		Dom.get("player-name-title").innerHTML = currentName;

		addClickListeners('next2', function(){
			setSpeedParams(chosenVehicle.segLength);
			showHelpScreen();
		});
		addClickListeners(car_image1, function(){selectVehicle(this, 0);});
		addClickListeners(car_image2, function(){selectVehicle(this, 1);});
		addClickListeners(car_image3, function(){selectVehicle(this, 2);});
		function selectVehicle(elem, id) {
			car_image1.style.borderWidth = '2px';
			car_image2.style.borderWidth = '2px';
			car_image3.style.borderWidth = '2px';
			elem.style.borderWidth = '7px';
			chosenVehicle = CARS[id];
			Dom.get('veh-name').innerHTML = chosenVehicle.name;
			Dom.get('veh-mass').innerHTML = chosenVehicle.mass + ' lbs';
			Dom.get('veh-max-speed').innerHTML = chosenVehicle.maxSpeed + ' mph';
			Dom.get('veh-num-pizzas').innerHTML = chosenVehicle.pizzas;
			drawStat(Dom.get('veh-accel'), chosenVehicle.accel);
			drawStat(Dom.get('veh-decel'), chosenVehicle.decel);
			function drawStat(elem, stat){
				var i = 0;
				var imageTemp = '<img src="./images/pizza-small.gif" class="pizza-small">';
				var tempHtml = '';
				for(i=0;i<stat;i++){
					tempHtml += imageTemp;	
				}
				elem.innerHTML = tempHtml;
			}
		}
	}
	function showNameScreen(){
		Dom.show("name-screen");
		addClickListeners('next', showStatsScreen);
	}

	function handleTilt(tiltDirection){
		switch(tiltDirection){
			case TiltManager.LEFT:
				keyLeft = true;
				keyRight = false;
				break;
			case TiltManager.RIGHT:
				keyRight = true;
				keyLeft = false;
				break;
			case TiltManager.LEVEL:
				keyRight = false;
				keyLeft = false;
				break;
		}
	}

	function init(){
		stopLight = new StopLight("stop-light");
		Dom.on(document, 'touchmove', stopScrolling);
		showNameScreen();
	}
	init();

	//TODO: Try this later to see what it does
	function reset(options) {
	  options       = options || {};
	  canvas.width  = width  = Util.toInt(options.width,          width);
	  canvas.height = height = Util.toInt(options.height,         height);
	  lanes                  = Util.toInt(options.lanes,          lanes);
	  roadWidth              = Util.toInt(options.roadWidth,      roadWidth);
	  cameraHeight           = Util.toInt(options.cameraHeight,   cameraHeight);
	  drawDistance           = Util.toInt(options.drawDistance,   drawDistance);
	  fogDensity             = Util.toInt(options.fogDensity,     fogDensity);
	  fieldOfView            = Util.toInt(options.fieldOfView,    fieldOfView);
	  segmentLength          = Util.toInt(options.segmentLength,  segmentLength);
	  rumbleLength           = Util.toInt(options.rumbleLength,   rumbleLength);
	  cameraDepth            = 1 / Math.tan((fieldOfView/2) * Math.PI/180);
	  playerZ                = (cameraHeight * cameraDepth);
	  resolution             = height/480;
	  if ((segments.length==0) || (options.segmentLength) || (options.rumbleLength))
	      resetRoad(); // only rebuild road when necessary
	}
}