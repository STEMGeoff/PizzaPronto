var COLOR_RED = "#FF0000";
var COLOR_YELLOW = "#FFFF00";
var COLOR_GREEN = "#00FF00";

function StopLight(container, opts){
	var COLOR_BLACK = "#000000";
	var containerId = container;
	var box = Dom.get(containerId);
	var ctx = box.getContext("2d");
	var radius, boxWidth, boxHeight;
	var currentColor = COLOR_GREEN;
	var intervalForYellowLight = 1000;
	function getContainerDimensions(){
		boxHeight = box.offsetHeight;
		boxWidth = box.offsetWidth;
		radius = getRadius();
	}
	function calculateCenters(){
		var eachSection = (boxHeight/3);
		var halfEachSection = eachSection/2;
		var centers = [];
		centers[0] = halfEachSection;
		centers[1] = eachSection + halfEachSection;
		centers[2] = (2*eachSection) + halfEachSection;
		return centers;
	}
	function getRadius(){
		return (boxWidth/2) - 25;
	}
	function drawCircle(x,y,color){
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(x,y,radius,0,2*Math.PI,true);
		ctx.fill();
		ctx.closePath();
	}
	this.hide = function(){
		Dom.hide(containerId);
	};
	this.show = function(){
		Dom.show(containerId);
	};
	this.getCurrentColor = function(){
		return currentColor;
	};
	function _changeColor(COLOR){
		var circleCentersY = calculateCenters();
		var circleCenterX = boxWidth/2;
		switch(COLOR){
			case COLOR_RED:
				currentColor = COLOR;
				drawCircle(circleCenterX, circleCentersY[0],COLOR_RED);
				drawCircle(circleCenterX, circleCentersY[1],COLOR_BLACK);
				drawCircle(circleCenterX, circleCentersY[2],COLOR_BLACK);
				break;
			case COLOR_YELLOW:
				drawCircle(circleCenterX, circleCentersY[0],COLOR_BLACK);
				drawCircle(circleCenterX, circleCentersY[1],COLOR_YELLOW);
				drawCircle(circleCenterX, circleCentersY[2],COLOR_BLACK);
				break;
			case COLOR_GREEN:
				currentColor = COLOR;
				drawCircle(circleCenterX, circleCentersY[0],COLOR_BLACK);
				drawCircle(circleCenterX, circleCentersY[1],COLOR_BLACK);
				drawCircle(circleCenterX, circleCentersY[2],COLOR_GREEN);
				break;
		}
	};
	this.switchColor = function(){
		switch(currentColor){
			case COLOR_RED:
				_changeColor(COLOR_GREEN);
				break;
			case COLOR_GREEN:
				_changeColor(COLOR_YELLOW);
				window.setTimeout(function(){
						_changeColor(COLOR_RED);
					},intervalForYellowLight);
				break;
		}
	};
	this.init = function(){
		this.show();
		getContainerDimensions();
		_changeColor(currentColor);
	}
}