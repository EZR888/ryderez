$(document).ready(function(){
	$('#viewport').carousel('#simplePrevious', '#simpleNext');
	
	
	//rollover hover
	 $("#viewport li").hover(function() { //On hover...

		var thumbOver = $(this).find("img").attr("src"); //Get image url and assign it to 'thumbOver'
		
		$(this).find("a").css({'background' : 'url(' + thumbOver + ') no-repeat center bottom'});
		$(this).find("em").stop().animate({bottom:"-1"}, "fast")
		//Animate the image to 0 opacity (fade it out)
		$(this).find("span").stop().fadeTo('normal', 0 , function() {
		$(this).hide() //Hide the image after fade
		});
		}, function() { //on hover out...
		//Fade the image to full opacity 
		$(this).find("span").stop().fadeTo('normal', 1).show();
		$(this).find("em").stop().animate({bottom:"-86"}, "fast")
	});
	 
	 $('.scroll-pane').jScrollPane({showArrows:false, scrollbarWidth:11, dragMaxHeight:63});
	 
});