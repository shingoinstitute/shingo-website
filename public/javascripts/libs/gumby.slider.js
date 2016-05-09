// Slider Library
// Author Dustin E. Homan
// spartancoding.com

var IntervalId;

function createSlider(interval_in_mill_seconds){
	IntervalId = startInterval(interval_in_mill_seconds);
	setCssForSlides(interval_in_mill_seconds - 1300);
	setPauseListener(interval_in_mill_seconds);
}

function startInterval(interval_in_mill_seconds){
	// Set the sliders timerId for ability to cancel
	timer = setInterval(function(){ moveRight(); },interval_in_mill_seconds);
	return timer;
}

function setCssForSlides(interval_timing){
	var $section = $('#sliderContent');
	var $divArr = $section.children();
	var timing = interval_timing / 1000 + 's';
	
	$divArr.detach();
	$divArr.each(function(){
		if($(this).hasClass('tab-content')){
			$(this).css('animation-name', 'fadein, fadeout');
			$(this).css('animation-duration', '3s, 2.5s');
			$(this).css('animation-delay', '0s, ' + timing);
			
			$(this).css('-webkit-animation-name', 'fadein, fadeout');
			$(this).css('-webkit-animation-duration', '3s, 2.5s');
			$(this).css('-webkit-animation-delay', '0s, ' + timing);
		}
	});
	
	$divArr.appendTo($section);
}

function moveRight(){
					
	// Get Index of active li item
	var $l = $('#slider').children('.active');
	var i = 0;
	$l.each(function(){
		i = $(this).index();
	});
	
	// Wrap to beginning if at end
	if(i < $('#slider').children().length - 1)
		i = i + 1;
	else
		i = 0;					
	
	change_tab(i);
}

function setPauseListener(interval_in_mill_seconds){
	var $ul = $('#slider');
	
	var $liArr = $ul.children('li');
	
	$liArr.detach();			
	
	$liArr.each(function(){
		$(this).click(function(){
			clearInterval(IntervalId);
			IntervalId = startInterval(interval_in_mill_seconds);						
		});
	});
					
	$liArr.appendTo($ul);
}

function change_tab (new_index){
	// Use Gumgy's Tabs.js API to change tab
	var $tabs = $('.tabs');
	$tabs.trigger('gumby.set', new_index);
}