/**
 * Created by IntelliJ IDEA.
 *
 * User: phil
 * Date: 15/11/12
 * Time: 11:04 AM
 *
 */
(function ($) {

    var self = this, container, running=false, currentY = 0, targetY = 0, oldY = 0, maxScrollTop= 0, minScrollTop, direction, onRenderCallback=null,
            fricton = 0.95, // higher value for slower deceleration
            vy = 0,
            stepAmt = 1,
            minMovement= 0.1,
            ts=0.1;

    var updateScrollTarget = function (amt) {
        targetY += amt;
        vy += (targetY - oldY) * stepAmt;
      
        oldY = targetY;


    }
    var render = function () {
        if (vy < -(minMovement) || vy > minMovement) {

            currentY = (currentY + vy);
            if (currentY > maxScrollTop) {
                currentY = vy = 0;
            } else if (currentY < minScrollTop) {
                    vy = 0;
                    currentY = minScrollTop;
                }
           
            container.scrollTop(-currentY);

            vy *= fricton;
            
         //   vy += ts * (currentY-targetY);
            // scrollTopTweened += settings.tweenSpeed * (scrollTop - scrollTopTweened);
            // currentY += ts * (targetY - currentY);

            if(onRenderCallback){
                onRenderCallback();
            }
        }
    }
    var animateLoop = function () {
        if(! running)return;
        requestAnimFrame(animateLoop);
        render();
        //log("45","animateLoop","animateLoop", "",stop);
    }
    var onWheel = function (e) {
        e.preventDefault();
        var evt = e.originalEvent;
       
        var delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
        var dir = delta < 0 ? -1 : 1;
        if (dir != direction) {
            vy = 0;
            direction = dir;
        }
        
        updateScrollTarget(delta);
    }

    /*
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    window.requestAnimFrame = (function () {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }; 
              
                
    })();

    /*
     * http://jsbin.com/iqafek/2/edit
     */
    var normalizeWheelDelta = function () {
        // Keep a distribution of observed values, and scale by the
        // 33rd percentile.
        var distribution = [], done = null, scale = 30;
        return function (n) {
            // Zeroes don't count.
            if (n == 0) return n;
            // After 500 samples, we stop sampling and keep current factor.
            if (done != null) return n * done;
            var abs = Math.abs(n);
            // Insert value (sorted in ascending order).
            outer: do { // Just used for break goto
                for (var i = 0; i < distribution.length; ++i) {
                    if (abs <= distribution[i]) {
                        distribution.splice(i, 0, abs);
                        break outer;
                    }
                }
                distribution.push(abs);
            } while (false);
            // Factor is scale divided by 33rd percentile.
            var factor = scale / distribution[Math.floor(distribution.length / 3)];
            if (distribution.length == 500) done = factor;
            return n * factor;
        };
    }();


    $.fn.smoothWheel = function () {
        //  var args = [].splice.call(arguments, 0);
        var options = jQuery.extend({}, arguments[0]);
        return this.each(function (index, elm) {

            if(!('ontouchstart' in window)){
                container = $(this);
                container.bind("mousewheel", onWheel);
                container.bind("DOMMouseScroll", onWheel);
                currentY = targetY = 0;
                minScrollTop = container.get(0).clientHeight - container.get(0).scrollHeight;
                if(options.onRender){
                    onRenderCallback = options.onRender;
                }
                if(options.remove){
                    log("122","smoothWheel","remove", "");
                    running=false;
                    container.unbind("mousewheel", onWheel);
                    container.unbind("DOMMouseScroll", onWheel);
                }else if(!running){
                    running=true;
                    animateLoop();
                }

            }
        });
    };


           $.fn.smoothWheel.options = {
        axis: 'y',
        step: 2000,
        speed: 100,
        easing: "easeOutQuint",
        preventDefault: true,
        callbackL: function() {},
        callbackR: function() {}
    };

})(jQuery);


/* JQUERY FOR SLIDING NAVIGATION */   
$(document).ready(function() {

    $("").smoothWheel()

  $('a[href*=#]').each(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    && location.hostname == this.hostname
    && this.hash.replace(/#/,'') ) {
      var $targetId = $(this.hash), $targetAnchor = $('[name=' + this.hash.slice(1) +']');
      var $target = $targetId.length ? $targetId : $targetAnchor.length ? $targetAnchor : false;
       if ($target) {
         var targetOffset = $target.offset().top; 
/* JQUERY CLICK FUNCTION REMOVE AND ADD CLASS "ACTIVE" + SCROLL TO THE #DIV */   
         $(this).click(function() {
            $("#nav li a").removeClass("active");
            $(this).addClass('active');
           $('html, body').animate({scrollTop: targetOffset}, 1000);
           return false;
         });
      }
    }
  });

    var topOfOthDiv = $("#spodek").offset().top;
    var topOfOthDiv2 = $("#paticka").offset().top;
    $(window).scroll(function () {
        if ($(window).scrollTop() > topOfOthDiv && $(window).scrollTop() < topOfOthDiv2) {
      
        $(".nahoru").show();
        } else {
    
        $(".nahoru").hide();
        }
    });

    var topOfOthDiv = $("#about").offset().top;
    var topOfOthDiv2 = $("#spodek").offset().top;
    $(window).scroll(function () {
        if ($(window).scrollTop() > topOfOthDiv && $(window).scrollTop() < topOfOthDiv2) {
        $("#strana").css( { "margin-right" : "140px", "margin-right" : "140px" } );
        $("#nav").css( { "width" : "140px", "width" : "140px" } );
        } else {
        $("#nav").css( { "width" : "0px", "width" : "0px" } );
        $("#strana").css( { "margin-right" : "0px", "margin-right" : "0px" } );
        }
    });

    var topOfOthDiv = $("#about").offset().top;
    var topOfOthDiv2 = $("#spodek").offset().top;
    $(window).scroll(function () {
        if ($(window).scrollTop() > topOfOthDiv && $(window).scrollTop() < topOfOthDiv2) {
        $("#strana").css( { "margin-right" : "140px", "margin-right" : "140px" } );
        $("#nav").css( { "width" : "140px", "width" : "140px" } );
        } else {
        $("#nav").css( { "width" : "0px", "width" : "0px" } );
        $("#strana").css( { "margin-right" : "0px", "margin-right" : "0px" } );
        }
    });

});

$(function() {
    function unifyHeights() {
        var maxHeight = 0;
        $('#slide2').children('#fotky_pravo').each(function() {
            var height = $(this).outerHeight();
            // alert(height);
            if ( height > maxHeight ) {
                maxHeight = height;
            }
        });
        $('#fotky_pravo').css('height', maxHeight);
    }
    unifyHeights();
}); 
    
    $(window).scroll(function () { 
   $('#text_slowd').css({
      'bottom' : -($(this).scrollTop()/5)+"px" // increase # to make even slower
   }); 
}); 
    var $nav = $(".cbp-spmenu");
    var $navBtn = $("#showTop");
    var navHeight = $nav.height() + "px";
    var navTop = "-" + navHeight;
    //$('.cbp-spmenu-top').hide();
$nav.css({top: navTop});
$navBtn.on("click", function(e) {
    e.preventDefault();
    if ( !$nav.hasClass("active") ) {
        $nav.addClass("active");
        $nav.removeAttr("style");
    } else {
        $nav.removeClass("active");
        $nav.css({top: navTop});        
    }
});

$(document).ready(function() {
    $("sectiona").css("position", "absolute");
});
$(window).scroll(function() {
    $("sectiona").css("top", $(window).scrollTop() + "px");
}); 

 
  $(document).ready(function () {
      var size = $("#data > a").size();
      $(".Column1 > a").each(function (index) {
          if (index >= size / 2) {
              $(this).appendTo("#Column2");
          }
      });
  });
 

var MTUserId='574e0598-bf12-4637-b66e-0655389ba99f';
var MTFontIds = new Array();

MTFontIds.push("774932"); // Futura® W02 Book 
MTFontIds.push("774938"); // Futura® W02 Medium 
(function() {
var mtTracking = document.createElement('script');
mtTracking.type='text/javascript';
mtTracking.async='true';
mtTracking.src=('https:'==document.location.protocol?'https:':'http:')+'//www.fast.fonts.net/lt/trackingCode.js';

(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(mtTracking);
})();