var BackgroundColor = function(){
	this.title = 'Background Color';
	this.iconUrl = 'images/tool_backgroundColor.png';
	this.color = '#315177';


}
BackgroundColor.prototype.domReady = function(){
	$(this.$icon).spectrum({
	    color: this.color,
	    showButtons: false,
	    showInput: true,
	    allowEmpty: true,	    
	    //showAlpha:true,
	    //chooseText: 'OK',
	    containerClassName: 'yesname',
	    className: "full-spectrum",
	    showInitial: true,
	    //showPalette: true,
	    //showSelectionPalette: false,
	    clickoutFiresChange: true,
	    //maxPaletteSize: 10,
	    preferredFormat: "hex",
	    localStorageKey: "spectrum.demo",
	    move: function (color) {
	    	if(color === null){
	    		$('body').css('background', '#f3f3f3 url("images/transparent.png") repeat right top');
	    		$('#bgColorIndicator').css('background-color','#f3f3f3');
	    	}else{
	    		$('body').css('background',color.toHexString());	    		
	    		$('#bgColorIndicator').css('background-color',color.toHexString());
	    		
	    	}	    	
	    },
	    show: function () {
			var c = $(this).spectrum('container');
			c.css('background','#19294a');
			c.css('border','none');

			$('.sp-input').css('background','#19294a');
			$('.sp-input').css('color','#7AABE4');
			$('.sp-picker-container').css('border','none');
	    },
	    beforeShow: function(c){},
	    hide: function(c){},
	    change: function(c){}
	});


	//add color indicator to the icon thumbnail, set default color
	this.$icon.wrap("<div class='iconWrap'></div>");
	this.$icon.before("<div id='bgColorIndicator'></div>");
	$('#bgColorIndicator').css('background-color',this.color);
}
BackgroundColor.prototype.start = function(){
}
BackgroundColor.prototype.stop = function(){
}
var backgroundColor = new BackgroundColor();