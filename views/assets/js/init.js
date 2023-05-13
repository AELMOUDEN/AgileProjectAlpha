/************* Template Init Js File ************************
    Template Name: Nuxa - Product Landing Page
    Author: Deveable
    Version: 1.0
    Copyright 2021
*************************************************************/


$(function () {

	"use strict";
	var wind = $(window);

	/*==================================
	ScrollIt Setup
	====================================*/

	$.scrollIt({
		upKey: 38, // key code to navigate to the next section
		downKey: 40, // key code to navigate to the previous section
		easing: 'swing', // the easing function for animation
		scrollTime: 600, // how long (in ms) the animation takes
		activeClass: 'active', // class given to the active nav element
		onPageChange: null, // function(pageIndex) that is called when page is changed
		topOffset: -15 // offste (in px) for fixed top navigation
	});

	

});

