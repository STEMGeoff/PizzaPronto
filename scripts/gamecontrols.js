function GameControls(container, opts){
	opts = opts?opts:{};
	var box = Dom.get(container);
	var ctx = box.getContext("2d");
	var canvas = opts.canvas?opts.canvas:null;
	if(canvas == null) return;
	canvas = Dom.get(canvas);
	var boxWidth = canvas.offsetWidth;
	var boxHeight = canvas.offsetHeight;
	var controlWidth = opts.controlWidth?opts.controlWidth:(0.2*boxHeight);
	var controlHeight = 150;
	var controlBackgroundColor = opts.controlBackgroundColor?opts.controlBackgroundColor:"red";
	var leftHandler = opts.left?opts.left:null;
	var rightHandler = opts.right?opts.right:null;
	var upHandler = opts.up?opts.up:null;
	var downHandler = opts.down?opts.down:null;
	function drawDirectionControls(){
		ctx.fillStyle = "red";
		ctx.fillRect(0, boxHeight-controlHeight , controlWidth, controlHeight);
	}
	function drawSpeedControls(){

	}
	function init(){
		drawDirectionControls();
		//drawSpeedControls();
	}
	window.setTimeout(function(){
		init();
	}, 3000);
}