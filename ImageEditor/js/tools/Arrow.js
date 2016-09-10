var Arrow = function(){
	this.title = 'Arrow Tool';
	this.iconUrl = 'images/tool_arrow.png';	
	this.cursor = 'images/tool_arrow.png';
}
Arrow.prototype.domReady = function(){
}
Arrow.prototype.start = function(){



	self = this;
	$(document.body).bind('mousedown.Arrow',function(e){
		if(e.button!==0)return;



		

		canvs = self.getCanvas();
		ctx = canvs.getContext("2d");
		obj = layerManager.newLayer(canvs);	 
		self.obj = obj;
		




		self.x1 = e.originalEvent.pageX - $(this).offset().left;
		self.y1 = e.originalEvent.pageY - $(this).offset().top; 

		self.isWindowSameSize(canvas);



		$(this).bind('mousemove.Arrow',function(e)
		{
	    	self.x2 = e.originalEvent.pageX - $(this).offset().left;
			self.y2 = e.originalEvent.pageY - $(this).offset().top; 

			ctx.clearRect(0,0,canvs.width,canvs.height);
			self.drawArrow(ctx);
			obj.$thumb.attr('src',canvs.toDataURL());	 

	    });	 

		$(this).bind('mouseup.Arrow',function(e)
		{
			if(e.button!==0)return;		
			$(this).unbind('mousemove.Arrow');		
			$(this).unbind('mouseup.Arrow');	

			//redraw layer to min dimensions needed for arrow size
			self.cropImageFromCanvas(ctx,canvs);

	    });	


	}).bind('dragstart.Arrow',function(e){
		if(e.button!==0)return;
		e.originalEvent.preventDefault();
		e.originalEvent.stopPropagation();
	}).bind('mouseout.Arrow',function(e){

	});

}
Arrow.prototype.drawArrow=function(ctx){
    
    var distance = Math.sqrt( Math.pow((this.x1-this.x2),2) + Math.pow((this.y1-this.y2),2) );

    // arbitrary styling
    ctx.strokeStyle=colorPicker.color;
    ctx.fillStyle=colorPicker.color;
    ctx.lineWidth=Math.round(distance*0.04);
   
    ctx.lineCap="round";
    ctx.lineJoin="round";
    // draw the line
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    //ctx.bezierCurveTo(this.x1,this.y1,this.x2*0.8,this.y2*.8,this.x2,this.y2);
    ctx.stroke();

      
    
    // draw the starting arrowhead
    var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    startRadians+=((this.x2>=this.x1)?-90:90)*Math.PI/180;
    this.drawArrowhead(ctx,this.x1,this.y1,startRadians,distance);
    // draw the ending arrowhead
    var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    endRadians+=((this.x2>=this.x1)?90:-90)*Math.PI/180;
    //this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
    
}
Arrow.prototype.drawArrowhead=function(ctx,x,y,radians,d){
    ctx.save();
    
    var arrow_width = d*.10;
    var arrow_height = d*.20;
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(0,0,arrow_width*0.1,arrow_height*.4,arrow_width,arrow_height);
    //ctx.lineTo(arrow_width,arrow_height);
    ctx.bezierCurveTo(0+(arrow_width*.4),arrow_height*.6,
                      0-(arrow_width*.4),arrow_height*.6,
                      0-arrow_width,arrow_height);   
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(0,0,arrow_width*0.1,arrow_height*.1,0-arrow_width,arrow_height);
    //ctx.lineTo(0-arrow_width,arrow_height);
    //ctx.closePath();
    

    ctx.fill();
    /*	bendy arrow
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(	0,0,
    					0+(arrow_width*.7),d-(arrow_height*1),
    					0,d);
    */				    	    
    ctx.stroke();
    ctx.restore();
    
}
Arrow.prototype.stop = function(){
	$(document.body).unbind('mousedown.Arrow mouseup.Arrow dragstart.Arrow');	
}
Arrow.prototype.getCanvas = function(i){
	canvas = document.createElement('canvas');
	canvas.width = $(window).width();
	canvas.height = $(window).height();

	context = canvas.getContext("2d");
	this.applyStlye(context);
	return canvas;
}
Arrow.prototype.applyStlye = function(context){
	context.strokeStyle = '#fff';
	context.lineWidth = 5;
	context.lineCap="round";
	context.lineJoin = 'round';
}
Arrow.prototype.isWindowSameSize = function(canvasO){
	//do nothing if same size, else redraw canvas 
	if((canvasO.width===$(window).width())&&(canvasO.height===$(window).height()))return;

	canvas = this.getCanvas();
	canvas.getContext("2d").drawImage(canvasO, 0, 0);

	canvasO.width = $(window).width();
	canvasO.height = $(window).height();
	context = canvasO.getContext("2d");
	context.drawImage(canvas, 0, 0);
	this.applyStlye(context);
	$(canvas).remove();	
}
Arrow.prototype.cropImageFromCanvas = function(ctx, canvas){

	var w = canvas.width,
	h = canvas.height,
	pix = {x:[], y:[]},
	imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
	x, y, index;

	for (y = 0; y < h; y++) {
	    for (x = 0; x < w; x++) {
	        index = (y * w + x) * 4;
	        if (imageData.data[index+3] > 0) {

	            pix.x.push(x);
	            pix.y.push(y);

	        }   
	    }
	}
	pix.x.sort(function(a,b){return a-b});
	pix.y.sort(function(a,b){return a-b});
	var n = pix.x.length-1;

	//empty canvas so delete it, remove layerbar if empty
	if(n==-1){
		this.obj.layer.parentNode.removeChild(this.obj.layer);
		this.obj.$thumb.get(0).parentNode.removeChild(this.obj.$thumb.get(0));
		uiManager.deleteEmptyLayerBar();
		return	
	}

	w = pix.x[n] - pix.x[0];
	h = pix.y[n] - pix.y[0];
	var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

	canvas.width = w;
	canvas.height = h;
	canvas.style.top = pix.y[0];
	canvas.style.left = pix.x[0];
	ctx.putImageData(cut, 0, 0);
}
var arrow = new Arrow();


