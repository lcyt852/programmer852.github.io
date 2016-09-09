var Text = function(){
	this.title = 'Text Tool';
	this.iconUrl = 'images/tool_text.png';	
	this.cursor = 'images/tool_text.png';
}
Text.prototype.init = function(){}
Text.prototype.start = function(){

	self = this;
	$(document.body).bind('mousedown.Text',function(e){
		if(e.button!==0)return;
    	var x = e.originalEvent.pageX - $(this).offset().left;
		var y = e.originalEvent.pageY - $(this).offset().top; 


		$input = self.getTextArea(x,y);

		$input.appendTo('body');

		$(document).on('mouseup.Text',function(e){
			$input.focus();
    		$input.css('pointer-events','auto');	
			$(this).off('mouseup.Text');
		 });


	});

}
Text.prototype.stop = function(){
	$(document.body).unbind('mousedown.Text')
}
Text.prototype.getTextArea = function(x,y){

	var fontSize = 15;
	var font = 'Arial';

	var $input = $('<input size="2">').css({
					'position':'absolute',
					'z-index':'1200',
					'height':fontSize+3+"px",
					'border':'none',
					'top':y+'px',
					'left':x+'px',
					'background':'none',
					'font-size':fontSize,
					'line-height':fontSize,
					'font-family':font,
					'pointer-events':'none',									
					'text-align':'left',
					'opacity':'1',
					'color':colorPicker.color
					});

	$input.bind({

		keydown:function(e)
		{
			this.size = ( this.value.length+1 > 2 ) ? this.value.length+1 : 2;
		},
		keyup: function(e)
		{
		},			    		
		focusin: function(e)
		{			    						    			
		},
		focusout:function(e)
		{
			//remove unused and whitespaced input
			if(this.value.replace(/ /g,'').length==0){
				this.parentNode.removeChild(this);
				return;
			}

			//convert text to canvas			
			canvas = document.createElement('canvas');
			

			canvas.height = fontSize+3;
			canvas.width = $(this).width();
			context = canvas.getContext("2d");


			context.font = fontSize+'px '+font;
			context.fillStyle = colorPicker.color;
			context.fillText(this.value, 1, fontSize);

			obj = layerManager.newLayer(canvas);

			obj.layer.style.left = this.style.left;
			obj.layer.style.top = this.style.top;
			obj.layer.style.position = 'absolute';
			//$('body').append($(canvas));

			this.parentNode.removeChild(this);


	

		},
		showDragHandle:function()
		{					
		},
		hideDragHandle:function()
		{
		}

	});

	return $input
}


var text = new Text();

