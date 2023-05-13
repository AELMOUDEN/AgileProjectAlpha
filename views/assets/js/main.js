/************* Template Main Js File ************************
    Template Name: Nuxa - Product Landing Page
    Author: Deveable
    Version: 1.0
    Copyright 2021
*************************************************************/

/*------------------------------------------------------------------------------------
    
JS INDEX
=============
01 - Testimonial Slider JS
02 - Popup JS
03 - Mouse Move JS
04 - Email Setup JS
05 - Preloader Js
06 - Scroll Header Js


-------------------------------------------------------------------------------------*/


(function($) {
    "use strict";

    jQuery(document).ready(function($) {


        /* 
		=================================================================
		01 - Testimonial Slider JS
		=================================================================	
		*/

        $(".testimonial-slider").owlCarousel({
            autoplay: true,
            loop: true,
            margin: 0,
            items: 1,
            touchDrag: true,
            mouseDrag: true,
            nav: true,
            dots: false,
            autoplayTimeout: 6000,
            autoplaySpeed: 1200,
            navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"]
        });
        /* 
		=================================================================
		02 - Popup JS
		=================================================================	
		*/

        $('.popup-youtube').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        /* 
		=================================================================
		03 - Mouse Move JS
		=================================================================	
		*/
        $(document).on("mousemove", function(e) {
            $('.moving1').parallax(50, e);
            $('.moving2').parallax(90, e);
            $('.moving3').parallax(60, e);
        });

        /* 
		=================================================================
		04 - Email Setup JS
		=================================================================	
		 

        $("#contact-form").on('submit', function (e) {
            e.preventDefault();

            //Get input field values from HTML form
            var user_name = $("input[name=name]").val();
            var user_email = $("input[name=email]").val();
            var user_subject = $("input[name=subject]").val();
            var user_phone = $("input[name=phone]").val();
            var user_message = $("textarea[name=message]").val();

            //Data to be sent to server
            var post_data;
            var output;
            post_data = {
                'user_name': user_name,
                'user_email': user_email,
                'user_subject': user_subject,
                'user_message': user_message
            };

            //Ajax post data to server
            $.post('assets/email/contact_form.php', post_data, function (response) {

                //Response server message
                if (response.type == 'error') {
                    output = '<div class="alert alert-danger"><i class="fa fa-exclamation" aria-hidden="true"></i><span class="notification-text">' + response.text + '</span></div>';
                } else {
                    output = '<div class="alert alert-info"><i class="fa fa-check" aria-hidden="true"></i><span class="notification-text">' + response.text + '</span></div>';

                    //If success clear inputs
                    $("input, textarea").val('');
                }

                $("#notification").html(output);

                $(".notification").delay(15000).queue(function (next) {
                    $(this).addClass("scale-out");
                    next();
                });
                $(".notification").on("click", function () {
                    $(this).addClass("scale-out");
                });

            }, 'json');
        }); 
        */

    });

    new WOW().init();

    /*==============================
	05 - Preloader Js
	==============================*/
    $(window).on('load', function() {
        $('#preloader').fadeOut('1000', function() {
            $(this).remove();
        });
    });

    /*==============================
	06 - Scroll Header Js
	==============================*/

    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();
        if (scroll < 200) {
            $(".navbar").removeClass("fixed");
        } else {
            $(".navbar").addClass("fixed");
        }
    });



}(jQuery));