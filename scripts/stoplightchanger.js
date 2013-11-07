function StopLightChanger(stoplight, maxinterval){
	var defaultInterval = 5000; //seconds
	var intervalForYellowLight = 1000;
	var _stopLight = stoplight;
	var _interval = (typeof interval != 'undefined')?maxinterval: defaultInterval;
	this.switchColor = function(){
		var currentColor = _stopLight.getCurrentColor();
		switch(currentColor){
			case COLOR_RED:
				_stopLight.changeColor(COLOR_GREEN);
				break;
			case COLOR_GREEN:
				_stopLight.changeColor(COLOR_YELLOW);
				window.setTimeout(function(){
						_stopLight.changeColor(COLOR_RED);
					},intervalForYellowLight);
				break;
		}
	};
	this.getRandomInterval = function(){
		
	};
	window.setInterval(this.switchColor, _interval);
}