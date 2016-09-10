var Save = function(){
	this.title = 'Save';
	this.iconUrl = 'images/tool_save.png';	

}
Save.prototype.init = function(){}
Save.prototype.start = function(){
	//convert canvases to jpg
		//get dimensions of merge canvas
		//compile canvases 
		//to datasrc?
		//to jpgdfP


	//console.time('merger');

	

	var x1 = $(window).width();
	var y1 = $(window).height();
	var x2 = 0;
	var y2 = 0;

	//calc dimensions of final canvas
	$('canvas.layer').each(function(){
		var left = parseInt(this.style.left, 10);
		var top = parseInt(this.style.top, 10);
		var w = left+this.width;
		var h = top+this.height;

		x1 = (left < x1) ? left : x1; 
		y1 = (top < y1) ? top : y1;

		x2 = (w > x2) ? w : x2;
		y2 = (h > y2) ? h : y2;

	})

	//create final canvas, assign bg color
	canvas = document.createElement('canvas');
	canvas.height = y2 - y1;
	canvas.width = x2 - x1;
	context = canvas.getContext('2d');
	context.fillStyle = backgroundColor.color;
	context.fillRect(0, 0, canvas.width, canvas.height);

	//merge canvases to final canvas
	$('canvas.layer').each(function(){
		var left = parseInt(this.style.left, 10) - x1;
		var top = parseInt(this.style.top, 10) - y1;

		context.drawImage(this,left,top);

	});

	//$('body').append(canvas);

	this.triggerDownload(canvas.toDataURL("image/png"));
	
	//console.timeEnd('merger');

	


}
Save.prototype.triggerDownload = function(src){

	//change data to stream and simulate a click to download
	src = src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    var a = document.createElement('a');
	a.href = src
	a.download = 'canvas.png';
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click(); 
	delete a;


}
Save.prototype.stop = function(){}
var save = new Save();