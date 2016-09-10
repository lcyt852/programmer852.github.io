
//pensize +toolbar
//layering
//resizing canvas if drawing is smaller
//undo redo
//colors

var Pencil = function(){
	this.title = 'Pencil';
	this.iconUrl = 'images/tool_pencil.png';	
	this.cursor = 'images/tool_pencil.png';
}
Pencil.prototype.init = function(){}
Pencil.prototype.start = function(){
	uiManager.toolbar_sizePicker.bar.show();
	uiManager.toolbar_sizePicker.bar.css('left',$(window).width()-56);	
	this.layerHolder = layerManager.newLayer(this.getCanvas());	 	
	this.canvas = this.layerHolder.layer;
	this.$thumb = this.layerHolder.$thumb;
	self = this;
	$(document.body).bind('mousedown.Pencil',function(e){
		if(e.button!==0)return;
    	var x = e.originalEvent.pageX - $(this).offset().left;
		var y = e.originalEvent.pageY - $(this).offset().top; 

		self.isWindowSameSize();

		context = self.canvas.getContext("2d");
		self.applyStlye(context);
		context.beginPath(); 
		context.lineTo(x,y);
		context.lineTo(x+1,y+1);
		context.stroke();			
		self.$thumb.attr('src',self.canvas.toDataURL());
		$(this).bind('mousemove.Pencil',function(e)
		{
	    	var x = e.originalEvent.pageX - $(this).offset().left;
			var y = e.originalEvent.pageY - $(this).offset().top; 

    		context.lineTo(x,y);		    		
    		context.stroke();
			self.$thumb.attr('src',self.canvas.toDataURL());

	    });	    
	}).bind('dragstart.Pencil',function(e){
		if(e.button!==0)return;
    	e.originalEvent.preventDefault();
    	e.originalEvent.stopPropagation();
	}).bind('mouseup.Pencil',function(e){
		if(e.button!==0)return;		
		$(this).unbind('mousemove.Pencil');		
	});
}
Pencil.prototype.stop = function(){
	$(document.body).unbind('mousedown.Pencil mouseup.Pencil dragstart.Pencil');
	uiManager.toolbar_sizePicker.bar.hide();
	this.cropImageFromCanvas(self.canvas.getContext("2d"),self.canvas);
}
Pencil.prototype.applyStlye = function(ctx){
	context.strokeStyle = colorPicker.color;
	context.lineWidth = uiManager.toolbar_sizePicker.size;
	context.lineCap="round";
	context.lineJoin = 'round';
}
Pencil.prototype.getCanvas = function(i){
	canvas = document.createElement('canvas');
	canvas.width = $(window).width();
	canvas.height = $(window).height();

	context = canvas.getContext("2d");
	return canvas;
}
Pencil.prototype.isWindowSameSize = function(){
	//do nothing if same size, else redraw canvas 
	if((this.canvas.width===$(window).width())&&(this.canvas.height===$(window).height()))return;

	canvas = this.getCanvas();
	canvas.getContext("2d").drawImage(this.canvas, 0, 0);

	this.canvas.width = $(window).width();
	this.canvas.height = $(window).height();
	context = this.canvas.getContext("2d");
	context.drawImage(canvas, 0, 0);
	$(canvas).remove();	

}
Pencil.prototype.cropImageFromCanvas = function(ctx, canvas){

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
		this.canvas.parentNode.removeChild(this.canvas);
		this.$thumb.get(0).parentNode.removeChild(this.$thumb.get(0));
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
var pencil = new Pencil();





