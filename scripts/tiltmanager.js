function TiltManager(callback, sensitivityX, sensitivityY){
	var prevTiltX = 0;
	var prevTiltY = 0;
	var callback = callback;
	var currOrientation;
	function setOrientation(){
		currOrientation = (window.orientation == -90)?TiltManager.CLOCKWISE:TiltManager.ANTICLOCKWISE;
	}
	function init(){
		if (window.DeviceOrientationEvent) {
    		window.addEventListener("deviceorientation", function () {
        		tilt([event.beta, event.gamma]);
    		}, false);
		} else if (window.DeviceMotionEvent) {
    		window.addEventListener('devicemotion', function () {
        		tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
    		}, true);
		} else {
    		window.addEventListener("MozOrientation", function () {
        		tilt([orientation.x * 50, orientation.y * 50]);
    		}, true);
		}
		setOrientation();
		window.onorientationchange = setOrientation;
	}
	function tilt(x){
		var shouldReturn = false;
		if(currOrientation == TiltManager.ANTICLOCKWISE){
			if(x[0]<-sensitivityX) callback(TiltManager.LEFT);
			else if(x[0]>sensitivityX) callback(TiltManager.RIGHT);
			else callback(TiltManager.LEVEL);
		} else{
			if(x[0]>sensitivityX) callback(TiltManager.LEFT);
			else if(x[0]<-sensitivityX) callback(TiltManager.RIGHT);
			else callback(TiltManager.LEVEL);
		}
	}
	init();
}
TiltManager.LEFT = 'left';
TiltManager.RIGHT = 'right';
TiltManager.LEVEL = 'level';
TiltManager.ANTICLOCKWISE = '90Anticlockwise';
TiltManager.CLOCKWISE = '90Clockwise';