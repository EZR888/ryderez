/*
 * Turtle skin libraries
 *
 * Copyright (c) 2008 - 2013 Lazaworx
 * http://www.lazaworx.com
 * Author: Laszlo Molnar
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 * Bound to jAlbum licensing terms
 *  - http://jalbum.net/en/terms-and-conditions
 *
 */
/* Verified using http://www.jshint.com/ */
/*jshint smarttabs:true, eqnull:true, eqeqeq:false, scripturl:true, unused:false */
/*global jQuery:true, google:true, gapi:true, FOTOMOTO:true, Search:true, _jaShowAds:true */

var VER = '5.1.3',
	DEBUG = true,
	UNDEF = 'undefined',
	NOLINK = 'javascript:void(0)',
	LOCAL = location.protocol.indexOf('file:') === 0,
	TOUCH_START = 'touchstart',
	TOUCH_MOVE = 'touchmove',
	TOUCH_END = 'touchend',
	LOCALSTORAGE = (function(){
		try {
			localStorage.setItem('_t', VER);
            localStorage.removeItem('_t');
			return true;
		} catch(e) {
			return false;
		}
	}());
var VEND = (function(ua) {
/*
	PC:
		IE 8: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)"
		IE 9: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Tablet PC 2.0; .NET4.0C)"
		IE 10: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C)"
		Opera 12: "Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.15"
		Firefox 21: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0"
		Chrome 27: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.94 Safari/537.36"
	Mac:
		Chrome 27: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36"
		Firefox 21: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/21.0"
		Safari 6: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/536.26.14 (KHTML, like Gecko) Version/6.0.1 Safari/536.26.14"
 */
		if (ua.indexOf('Trident') > 0) {
			return 'ms';
		} else if (ua.indexOf('AppleWebKit') > 0) {
			return 'webkit';
		} else if (ua.indexOf('Gecko') > 0) {
			return 'moz';
		} else if (ua.indexOf('Presto') > 0) {
			return 'o';
		} else if (ua.indexOf('Blink') > 0) {
			return 'webkit';
		}
		return '';		
	}(navigator.userAgent));

/*
 * Extending String object with new methods
 */
 
String.wsp = [];
String.wsp[0x0009] = true;
String.wsp[0x000a] = true;
String.wsp[0x000b] = true;
String.wsp[0x000c] = true;
String.wsp[0x000d] = true;
String.wsp[0x0020] = true;
String.wsp[0x0085] = true;
String.wsp[0x00a0] = true;
String.wsp[0x1680] = true;
String.wsp[0x180e] = true;
String.wsp[0x2000] = true;
String.wsp[0x2001] = true;
String.wsp[0x2002] = true;
String.wsp[0x2003] = true;
String.wsp[0x2004] = true;
String.wsp[0x2005] = true;
String.wsp[0x2006] = true;
String.wsp[0x2007] = true;
String.wsp[0x2008] = true;
String.wsp[0x2009] = true;
String.wsp[0x200a] = true;
String.wsp[0x200b] = true;
String.wsp[0x2028] = true;
String.wsp[0x2029] = true;
String.wsp[0x202f] = true;
String.wsp[0x205f] = true;
String.wsp[0x3000] = true;

String.prototype.trim = function() { 
    var str = this + '', j = str.length;
    if (j) {
        var ws = String.wsp, 
        	i = 0;
        --j;
		while (j >= 0 && ws[str.charCodeAt(j)]) {
			--j;
		}
		++j;
		while (i < j && ws[str.charCodeAt(i)]) { 
			++i; 
		}
        str = str.substring(i, j);
    }
    return str;
};

String.prototype.trunc = function( n ) {
	var t = this + '';
	if (t.length <= n) {
		return t.toString();
	}
	var s = t.substring(0, n - 1), i = s.lastIndexOf(' ');
	return ((i > 6 && (s.length - i) < 20)? s.substring(0, i) : s) + '...';
};

String.prototype.startsWith = function( s ) {
	return (this + '').indexOf( s ) === 0;
};

String.prototype.endsWith = function( s ) {
	return (this + '').substring(this.length - s.length) === s;
};

String.prototype.getExt = function() {
	var t = this + '', i = t.lastIndexOf('.');
	return (i <= 0 || i >= t.length - 1)? '' : t.substring(i + 1).toLowerCase();
};

String.prototype.replaceExt = function( s ) {
	var t = this + '', i = t.lastIndexOf('.');
	return (i <= 0)? t : (t.substring(0, i + 1) + s);  
};

String.prototype.fixExtension = function() {
	return (this + '').replace(/.gif$/gi, '.png').replace(/.tif+$/gi, '.jpg');
};

String.prototype.getDir = function() {
	var u = (this + '').split('#')[0];
	return u.substring(0, u.lastIndexOf('/') + 1);
};

String.prototype.getFile = function() {
	var u = (this + '').split('#')[0];
	return u.substring(u.lastIndexOf('/') + 1);
};

String.prototype.getRelpath = function(level) {
	var t = (this + ''), i = t.lastIndexOf('#');
	if (i === -1) {
		i = t.length - 1;
	} else {
		i--;
	}
	for (; i >= 0; i--) {
		if (t[i] === '/' && (level--) === 0)
			break;
	}
	return t.substring(i + 1);
};

String.prototype.fixUrl = function() {
	var i, j, t = this + '';
	while ( (i = t.indexOf('../')) > 0) {
		if ( i === 1 || (j = t.lastIndexOf('/', i - 2)) === -1 ) {
			return t.substring(i + 3);
		}
		t = t.substring(0, j) + t.substring(i + 2);
	}
	return t;
};

String.prototype.fullUrl = function() {
	var t = this + '';
	if ( !t.match(/^(http|ftp|file)/) ) {
		t = window.location.href.getDir() + t;
	}
	return t.fixUrl();
};

String.prototype.cleanupHTML = function() {
	var htmlregex = [
		[ /<br>/gi, '\n' ],
		[ /\&amp;/gi, '&' ],
		[ /\&lt;/gi, '<' ],
		[ /\&gt;/gi, '>' ],
		[ /\&(m|n)dash;/gi , '-' ],
		[ /\&apos;/gi, '\'' ],
		[ /\&quot;/gi, '"' ]
	];
	var t = this + '';
	for ( var i = htmlregex.length - 1; i >= 0; i-- ) {
		t = t.replace( htmlregex[i][0], htmlregex[i][1] );
	}
	return t; 
};

String.prototype.stripHTML = function() { 
	return (this + '').replace(/<\/?[^>]+>/gi, ''); 
};

String.prototype.stripQuote = function() {
	return (this + '').replace(/\"/gi, '&quot;');
};

String.prototype.appendSep = function(s, sep) {
	return (this.length? (this + (sep || ' &middot; ')) : '') + s; 
};

String.prototype.rgb2hex = function() {
	var t = this + '';
	if (t.charAt(0) === '#' || t === 'transparent') {
		return t;
	}
	var n, r = t.match(/\d+/g), h = '';
	if ( r ) {
		for ( var i = 0; i < r.length && i < 3; i++ ) {
			n = parseInt( r[i], 10 ).toString(16);
			h += ((n.length < 2)? '0' : '') + n;
		}
		return '#' + h;
	}
	return 'transparent';
};

String.prototype.template = function( s ) {
	if ( !s || !this ) {
		return this;
	}
	var t = this + '';
	for ( var i = 0; i < s.length; i++ ) {
		t = t.replace( new RegExp('\\{' + i + '\\}', 'gi'), s[i] );
	}
	return t;
};

Math.minMax = function(a, b, c) {
	b = (isNaN(b))? parseFloat(b) : b;
	return  (b < a)? a : ((b > c)? c : b); 
};

/*
 * Getting coordinates of a touch event
 */
 
var getCoords = function( e ) {
	if ( e.touches && e.touches.length > 0 ) {
		return { 
			x: Math.round(e.touches[0].clientX),
			y: Math.round(e.touches[0].clientY)
		};
	} else if ( e.clientX !== null ) {
		return {
			x: Math.round(e.clientX),
			y: Math.round(e.clientY)
		};
	}
	return null;
};

/*
 * Dummy function to avoid further events
 */
 
var noAction = function(e) {
	//e.stopPropagation();
	e.preventDefault();
	return false;
};

/*
 * Removing the extra parameters from url in order Facebook can display 
 * the comments belonging to a page. Can be called before jQuery.
 */
 
var fixFbComments = function( pageName ) {
	var u = window.location.href;
	if (u.indexOf('?fb_comment_id=') === -1) {
		u = u.split('#')[0];
		if (pageName && u[u.length-1] === '/') {
			u += pageName;
		}
	} else {
		u = u.split('?')[0];
	}
	document.getElementById('fb-comments').setAttribute('data-href', u);
};

/*
 * Hiding the browser bar on mobile devices
 * partly from http://menacingcloud.com/?c=iPhoneAddressBar
 */
 
var initMobile = function() {
	if ( !/Mobile/.test(navigator.userAgent) || 
		screen.width > 980 || screen.height > 980 || 
		(window.innerWidth !== document.documentElement.clientWidth && (window.innerWidth - 1) !== document.documentElement.clientWidth) ) {
		return;
	}
	var scrTop = function() {
		if (window.hasOwnProperty('pageYOffset')) {
			window.scrollTo(0, window.pageYOffset + 1);
		}
		return true;
	};
	setTimeout(function() {
		scrTop();
	}, 1000);
	$(window).on('orientationchange', scrTop);
};


/*	
 *	Debugging functions
 */

 var log = function() {};
 
(function($) {
		
	// log: logging function
	
	var _logel, _logover = false, _lastlog, _lastcnt = 1;
	
	log = function(c) {
		if ( !DEBUG || _logover ) {
			return;
		}
		if ( !_logel ) {
			_logel = $('<div id="log" style="position:fixed;left:0;top:0;width:200px;bottom:0;overflow:auto;padding:10px;background-color:rgba(0,0,0,0.5);color:#fff;font-size:15px;z-index:99999"></div>').hover(function(){
				_logover = true;
			}, function(){
				_logover = false;
			}).appendTo('body');
		}
		if (c === _lastlog) {
			_logel.children(':first').empty().html(_lastlog + ' (' + (++_lastcnt) + ')');
		} else {
			$('<div style="height:2em;overflow:hidden;">' + c + '</div>').prependTo(_logel);
			_lastlog = c;
			_lastcnt = 1;
		}
	};
	
	// logEvents :: debugging events
	
	$.fn.logEvents = function( e ) {
		if ( !DEBUG ) {
			return;
		}
		
		var events = e || 'mousedown mouseup mouseover mouseout mousewheel dragstart click blur focus load unload reset submit change abort cut copy paste selection drag drop orientationchange touchstart touchmove touchend touchcancel MSPointerDown MSPointerMove MSPointerUp gesturestart gesturechange gestureend';

		return this.each(function() {
			$(this).on(events, function(e) {
				if (typeof e === UNDEF) {
					log('Undefined event');
				} else if (e.target) {
					if (e.target.id !== 'log') { 
						log(e.type + ' <span style="padding:0 4px;font-size:0.8em;background-color:#000;border-radius:4px;"><b>' + (e.target.nodeName? e.target.nodeName.toLowerCase() : '???') + '</b>' + (e.target.id? (':'+e.target.id) : '') + '</span>' + 
							(e.relatedTarget? (' <span style="padding:0 4px;font-size:0.8em;background-color:#800;border-radius:4px;"><b>' + e.relatedTarget.nodeName.toLowerCase() + '</b>' + (e.relatedTarget.id? (':'+e.relatedTarget.id) : '') + '</span>') : ''));
					}
				} else {
					log('No event target!');
				}
				return true;
			});
		});
	};
	
	// logCss :: tracks css values until the element is live
	
	$.fn.logCss = function( p, dur, step ) {
		if ( !DEBUG ) {
			return;
		}
		
		step = step || 20;
		dur = dur || 2000;
		var t0 = new Date();
		
		return this.each(function() {
			var el = $(this);
			var show = function( nm ) {
				var t = new Date() - t0;
				log(t + '&nbsp;::&nbsp;' + nm + ' = ' + el.css(nm));
				if (t > dur) {
					clearInterval(iv);
				}
			};
			var iv = setInterval(function() {
				if ( $.isArray(p) ) {
					for (var i = 0; i < p.length; i++) {
						show(p[i]);
					}
				}
				else {
					show(p);
				}
			}, step);
		});
	};
	
})(jQuery);

/*
 *	Translate function
 *	returns a translated key, or the default value (if exists), or the key itself de-camelcased
*/

var translate = function(key, def) {
	
	key = key.trim();
	
	if (typeof Texts !== UNDEF) {
		if ( Texts.hasOwnProperty(key) ) {
			return Texts[key];
		}
	}
	
	if (typeof def !== UNDEF) {
		// Using the default
		if (DEBUG && console) {
			console.log('Using default translation: '+key+'='+def);
		}
		return def;
	}
	
	if (DEBUG && console) {
		console.log('Missing translation: '+key);
	}
	var s = key.replace(/([A-Z])/g, ' $1').toLowerCase();
	s[0] = s.charAt(0).toUpperCase();
	return s;
};

/* 
 *	Simpler method 
 *	text = getKeys('key1,key2,key3', [defaults])
*/

var getKeys = function(keys, def) {
	
	var t = {}, i, k = keys.split(','), l = k.length;
	
	for (i = 0; i < l; i++) {
		t[k[i]] = translate(k[i], def[k]);
	}
	
	return t;
};

/*
 *	Finds translation for each key in def Object
 *	def should contain only elements that need translation
*/

var getTranslations = function(def) {
	
	var t = {}, k;
	
	for (k in def) {
		if (typeof def[k] === 'object') {
			t[k] = getTranslations(def[k]);
		} else {
			t[k] = translate(k, def[k]);
		}
	}
	
	return t;
};

/*
 *  Relative date
 */

var getRelativeDate = function(days) {
	
	if (!days)
		return translate('today');
	
	if (days===1)
		return translate('yesterday');
		
	var s, n;
	
	if (days >= 730) {
		s = translate('yearsAgo');
		n = Math.floor(days / 365);
	} else if (days >= 60) {
		s = translate('monthsAgo');
		n = Math.floor(days / 30.5);
	} else {
		s = translate('daysAgo');
		n = days;
	}
	
	return s.replace('{0}', n);
};


/*
 *	Touch mode detection
 *	Chrome >= 23, MSIE >= 10 :: dynamic
 *	all other browsers pre-initialized 
*/

(function($, d) {

	// Dynamic touch mode detection based on detecting the latest event
	// currently detects the first event only
	/* later...
	var touch = function() {
		d.touchMode = true;
		$(d).off('.touchdetect');
		return true;
	};
	var mouse = function() {
		d.touchMode = false;
		$(d).off('.touchdetect');
		return true;
	};
		$(d).on({
			'touchstart.touchdetect': touch,
			'mouseover.touchdetect': mouse
		});
	*/
	if ( /Trident/.test(navigator.userAgent) ) {
		if ( /IEMobile/.test(navigator.userAgent) ) {
			if (window.navigator.msPointerEnabled) {
				TOUCH_START = 'MSPointerDown';
				TOUCH_MOVE = 'MSPointerMove';
				TOUCH_END = 'MSPointerUp';
			} else {
				TOUCH_START = 'pointerDown';
				TOUCH_MOVE = 'pointerMove';
				TOUCH_END = 'pointerUp';
			}
			d.touchMode = true;
		} else {
			d.touchMode = false;
		}
	} else {
		TOUCH_START = 'touchstart';
		TOUCH_MOVE = 'touchmove';
		TOUCH_END = 'touchend';
		if ( /(Chrome|CriOS)/.test(navigator.userAgent) ) {
			d.touchMode = /Mobile/.test(navigator.userAgent); 
		} else {
			d.touchMode = 'ontouchstart' in window;
		}
	}
	
	var TRANSFORM = (VEND === 'moz')? 'transform' : ('-' + VEND + '-transform');	
	// (VEND === 'webkit')? 'transform' : VEND[0].toUpperCase() + VEND.substring(1)
	
	$.fn.translate = function(x, y, cls) {
		return this.each(function() {
			if (cls) {                                    
				$(this).addClass(cls).data('tr_cls', cls);
			}
			this.style[TRANSFORM] = 'translate(' + (x || 0) + 'px,' + (y || 0) + 'px)';
			$(this).data({
				tr_x: x,
				tr_y: y
			});
		});
	};
	
	$.fn.translateToPos = function() {
		return this.each(function() {
			var t = $(this),
				x = t.data('tr_x') || 0, 
				y = t.data('tr_y') || 0;
			if (x || y) {
				var pos = t.position(),
					cls = t.data('tr_cls');
				if (cls) {
					t.removeClass(cls);
				}
				this.style[TRANSFORM] = 'translate(0,0)';
				t.removeData('tr_x tr_y').css({
					left: pos.left,
					top: pos.top
				});
			}
		});
	};

	
})(jQuery, document);


/*! jQuery requestAnimationFrame - v0.1.2 - 2013-04-15
* https://github.com/gnarf37/jquery-requestAnimationFrame
* Copyright (c) 2013 Corey Frang; Licensed MIT */

(function( $ ) {

	// requestAnimationFrame polyfill adapted from Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	
	
	var animating,
		lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame;
	
	for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
		requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
		cancelAnimationFrame = cancelAnimationFrame ||
			window[ vendors[lastTime] + "CancelAnimationFrame" ] || 
			window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
	}
	
	function raf() {
		if ( animating ) {
			requestAnimationFrame( raf );
			jQuery.fx.tick();
		}
	}
	
	if ( requestAnimationFrame ) {
		// use rAF
		window.requestAnimationFrame = requestAnimationFrame;
		window.cancelAnimationFrame = cancelAnimationFrame;
		jQuery.fx.timer = function( timer ) {
			if ( timer() && jQuery.timers.push( timer ) && !animating ) {
				animating = true;
				raf();
			}
		};
	
		jQuery.fx.stop = function() {
			animating = false;
		};
	} else {
		// polyfill
		window.requestAnimationFrame = function( callback, element ) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
				id = window.setTimeout( function() {
					callback( currTime + timeToCall );
				}, timeToCall );
			lastTime = currTime + timeToCall;
			return id;
		};
	
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
		
	}

}( jQuery ));

/*	
 *	mousewheel :: mouse wheel event handling
 *
 *	Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 *
 *	Usage: 
 *		$(element).on('mousewheel', action)
 *		$(element).off('mousewheel', action)
 */

(function($) {
	
	var mousewheelTypes = ['DOMMouseScroll', 'mousewheel'];

	if ($.event.fixHooks) {
		for ( var i = mousewheelTypes.length; i; ) {
			$.event.fixHooks[ mousewheelTypes[--i] ] = $.event.mouseHooks;
		}
	}
	
	$.event.special.mousewheel = {
		
		setup: function(){
			if ( this.addEventListener ) {
				for ( var i = mousewheelTypes.length; i; ) {
					this.addEventListener( mousewheelTypes[--i], mousewheelHandler, false );
				}
			} else { 
				this.onmousewheel = mousewheelHandler;
			}
		},
		
		teardown: function() {
			if ( this.removeEventListener ) {
				for ( var i = mousewheelTypes.length; i; ) {
					this.removeEventListener( mousewheelTypes[--i], mousewheelHandler, false );
				}
			} else { 
				this.onmousewheel = null;
			}
		}
	};

	$.fn.extend({
			
		mousewheel: function( fn ){
			return fn? this.bind( 'mousewheel', fn ) : this.trigger('mousewheel');
		},
		
		unmousewheel: function( fn ){
			return this.unbind( 'mousewheel', fn );
		}
	});
	
	var mousewheelHandler = function( event ) {
		var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, deltaX = 0, deltaY = 0;
		event = $.event.fix( orgEvent );
		event.type = 'mousewheel';
		
		// old school
		if ( orgEvent.wheelDelta ) { 
			delta = orgEvent.wheelDelta / 120; 
		} else if ( orgEvent.detail ) { 
			delta = -orgEvent.detail / 3; 
		}
		
		// new school (touchpad)
		deltaY = delta;
		
		// Gecko
		if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
			deltaY = 0;
			deltaX = -1 * delta;
		}
		
		// Webkit
		if ( orgEvent.wheelDeltaY !== undefined ) { 
			deltaY = orgEvent.wheelDeltaY / 120; 
		}
		if ( orgEvent.wheelDeltaX !== undefined ) { 
			deltaX = -1 * orgEvent.wheelDeltaX / 120; 
		}
		args.unshift( event, delta, deltaX, deltaY );
		
		return ($.event.dispatch || $.event.handle).apply( this, args );
	};

})(jQuery);

/*	
 *	dbltap :: double tap handling on touch devices
 *
 *	Usage: 
 *		$(element).on('dbltap', action)
 *		$(element).off('dbltap', action)
 */

(function($) {

	$.event.special.dbltap = {
		
		setup: function() {
			$(this).on('touchend.dbltap', $.event.special.dbltap.handler);
		},
	
		teardown: function() {
			$(this).off('touchend.dbltap');
		},
	
		handler: function( e ) {
			var args = [].slice.call( arguments, 1 ),
				t = $(e.target),
				now = new Date().getTime(),
				d = now - (t.data('lastTouch') || 0);

			if ( d > 5 && d < 300 ) {
				e.preventDefault();
				t.data('lastTouch', 0);
				e = $.e.fix( e || window.event );
				e.type = 'dbltap';
				args.unshift( e );
				return ($.e.dispatch || $.e.handle).apply( this, args );
			} else {
				t.data('lastTouch', now);
				return true;
			}
		}
	};
	
})(jQuery);

/*	
 *	cookie() :: Cookie handling - using localStorage if exists
 *
 *	Usage: 
 *		cookie( key ) :: returns cookie or null
 *		cookie( key, null ) :: deletes cookie
 *		cookie( key, value, [expire]) :: saves cookie, expire in # seconds - default expiry is 1 hour
 */
 
(function($) {
				
	$.cookie = function( key, value, expire ) { 
		//log('c('+key+(value? (','+value):'')+(expire? (','+expire):'')+')');
		var c, d;
		
		var cookie_sep = "; ";
		
		var cookie_val = function( v ) {
			return (/^(true|yes)$/).test(v)? true : ( (/^(false|no)$/).test(v)? false : ( (/^([\d.]+)$/).test(v)? parseFloat(v) : v ) );
		};
		
		if ( arguments.length > 1 ) { 
			// write
			d = new Date();
			
			if ( value === null ) {
				// remove
				if ( LOCALSTORAGE ) {
					localStorage.removeItem( key );
				} else {
					document.cookie = encodeURIComponent( key ) + "=" + '; expires=' + d.toGMTString() + "; path=/";
				}
			} else if ( /^(string|number|boolean)$/.test( typeof value ) ) {
				// store
				d.setTime(d.getTime() + (((typeof expire !== 'number')? 3600 : expire) * 1000));
				if ( LOCALSTORAGE ) {
					localStorage.setItem( key, String( value ) + cookie_sep + String( d.getTime() ));
				} else {
					document.cookie = encodeURIComponent( key ) + "=" + String( value ) + '; expires=' + d.toGMTString() + "; path=/";
				}
			}
			return value;
		
		} else if ( key ) { 
			// read
			if ( LOCALSTORAGE ) {
				c = localStorage.getItem( key );
				if ( c ) {
					c = c.split(cookie_sep);
					if ( $.isArray(c) && c.length > 1 ) {
						d = new Date();
						if ( d.getTime() < parseInt(c[1], 10) ) {
							// not yet expired 
							return cookie_val( c[0] );
						} else {
							// remove expired cookie
							localStorage.removeItem( key );
						}
					} else {
						// no expiration was set
						return cookie_val( c );
					}
				}
			} else {
				var v;
				c = document.cookie.split(';');					
				key += '=';
				for ( var i = 0; i < c.length; i++ ) {
					v = c[i].trim();
					if ( v.indexOf(key) === 0 ) {
						v = v.substring( key.length );
						cookie_val( v );
					}
				}
			}
		}
		
		return null;
	};
	
})(jQuery);

/*	
 *	history plugin
 *
 *	Licensed under MIT License / Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari) / Copyright (c) 2010 Takayuki Miwa
 *	http://tkyk.github.com/jquery-history-plugin/
 */
 
(function($) {
			
	(function(){
		
		var needDecode = navigator.userAgent.indexOf('Firefox') === -1;
		
		var locationWrapper = {
			put: function(hash, win) {
				(win || window).location.hash = this.encoder(hash);
			},
			get: function(win) {
				var hash = ((win || window).location.hash).replace(/^#/, '');
				try {
					return needDecode? decodeURIComponent(hash) : hash;
				}
				catch (error) {
					return hash;
				}
			},
			encoder: encodeURIComponent
		};

		function initObjects(options) {
			options = $.extend({
					unescape: false
				}, options || {});
	
			locationWrapper.encoder = encoder(options.unescape);
	
			function encoder(unescape_) {
				if(unescape_ === true) {
					return function(hash){ return hash; };
				}
				if(typeof unescape_ === "string" &&
					(unescape_ = partialDecoder(unescape_.split(""))) || 
					typeof unescape_ === "function") {
					return function(hash) { return unescape_(encodeURIComponent(hash)); };
				}
				return encodeURIComponent;
			}
	
			function partialDecoder(chars) {
				var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
				return function(enc) { return enc.replace(re, decodeURIComponent); };
			}
		}
	
		var implementations = {};
	
		implementations.base = {
			callback: undefined,
			type: undefined,
			check: function() {},
			load:  function() {}, // function(hash) ?
			init:  function(callback, options) {
				initObjects(options);
				self.callback = callback;
				self._options = options;
				self._init();
			},
	
			_init: function() {},
			_options: {}
		};
	
		implementations.timer = {
			_appState: undefined,
			_init: function() {
				var current_hash = locationWrapper.get();
				self._appState = current_hash;
				self.callback(current_hash);
				setInterval(self.check, 100);
			},
			check: function() {
				var current_hash = locationWrapper.get();
				if(current_hash !== self._appState) {
					self._appState = current_hash;
					self.callback(current_hash);
				}
			},
			load: function(hash) {
				if(hash !== self._appState) {
					locationWrapper.put(hash);
					self._appState = hash;
					self.callback(hash);
				}
			}
		};

		implementations.hashchangeEvent = {
			_init: function() {
				//console.log('history.init()');
				self.callback(locationWrapper.get());
				$(window).on('hashchange', self.check);
			},
			check: function() {
				//console.log('history.check()');
				self.callback(locationWrapper.get());
			},
			load: function(hash) {
				//console.log('history.load('+hash+')');
				locationWrapper.put(hash);
			}
		};
	
		var self = $.extend({}, implementations.base);
	
		if ('onhashchange' in window) {
			self.type = 'hashchangeEvent';
		} else {
			self.type = 'timer';
		}
	
		$.extend(self, implementations[self.type]);
		$.history = self;
	})();
	
})(jQuery);

/*	
 *	addModal() :: adding modal window to any layer (typically 'body')
 *
 *	Usage: $(element).addModal( content, buttons, options );
 *		content = text or jQuery element [required]
 *		buttons = [ { 
 *			t: 'string',		// title 
 *			h: function(){}		// handler
 *		} , ... ] [optional]
 *		options = 
		uid:							// unique identifier, will be used as <div id="">
		title:							// the title of the window displayed in the header
		speed: 250,						// transition speed in ms
		autoFade: 0,					// automaticcaly disappearing after X ms, 0 = remain
		width: 400,						// default width
		resizable: false,				// user can resize the window
		enableKeyboard: true,			// enable button selection with keyboard (left, right, enter, esc)
		closeOnClickOut: true,			// closing the modal window on clicking outside the window
		closeWindow: 'Close window',	// 'close window' tooltip text
		okButton: 'okButton',			// adds a default OK button, which closes the modal when clicked
		darkenBackground: true,			// darken the background behind the window
		savePosition: true,				// save window position and size and re-apply fot the windows with the same 'uid'
		pad: 6,							// padding to the edges
		type: 'normal'					// 'normal' | 'question' | 'message' | 'warning' | 'error'
 */

(function($) {
		
	$.fn.addModal = function( content, buttons, settings  ) {
		
		var self = $(this);
		
		if (typeof content === 'string') {
			content = $(content);
		}
		
		if (!(content instanceof $ && content.length)) {
			return;
		}
				
		if ( !$.isArray(buttons) ) { 
			settings = buttons; 
			buttons = null;
		}
		
		settings = $.extend( {}, $.fn.addModal.defaults, settings );
		settings.savePosition = settings.savePosition && (typeof settings.uid !== UNDEF);
		
		var text = getTranslations($.fn.addModal.text);
		
		if (settings.defaultButton) {
			settings.defaultButton = translate(settings.defaultButton, 'OK');
		}
		
		var id = {
			w: '_m_window',
			p: '_m_panel',
			h: '_m_head',
			c: '_m_cont',
			ci: '_m_cont_i',
			x: 'close',
			r: 'resize'
		};
				
		var w, p, h, x, c, ci,
			// container dimensions
			ww, wh,
			// diff in height between the whole window and the content
			dh = 0,
			// to = timeout for autoFade
			to;
		
		/* old way
		w = $(this).find($('.' + id.w));
		
		if ( !w.length ) {
			
			// Create new
			
			w = $('<div>', {
				'class': id.w,
				role: 'modal'
			}).css({
				opacity: 0
			}).appendTo( $(this) );
			
			$(this).css({
				position: 'relative'
			});
			
			if ( !settings.darkenBackground ) {
				w.css({
					backgroundImage: 'none',
					backgroundColor: 'transparent'
				});
			}
			
		} else {
			
			// If unique remove the old if exists
			
			if ( settings.uid ) {
				w.find('#' + settings.uid).remove();
			}
			
			// if window has started to fade
			
			to = clearTimeout(to);
			w.stop(true, false).css({
				opacity: 1,
				display: 'block'
			});
		}*/
		
		if ( settings.uid ) {
			$('#' + settings.uid).parents('.' + id.w).remove();
		}
		
		// Create new
		
		w = $('<div>', {
			'class': id.w,
			role: 'modal'
		}).css({
			opacity: 0
		}).appendTo( self );
		
		self.css({
			position: 'relative'
		});
		
		// Maintaining container dimensions
		
		var updateDimensions = function() {
			ww = self.width();
			wh = self.height();
		};
		
		updateDimensions();
		
		$(window).on('resize', updateDimensions);
		
		// Darken background
		
		if ( settings.darkenBackground ) {
			w.addClass('darken');
		}
		
		// Panel
		
		p = $('<div>', {
			id: settings.uid || ('_mod_' + Math.floor(Math.random()*10000)),
			'class': id.p + ' ' + settings.type
		}).css({
			width: settings.width
		}).appendTo( w );
					
		// Header
		
		h = $('<header>', {
			'class': id.h
		}).appendTo( p );
		
		h.append($('<h5>', {
			text: settings.title || ((settings.type === 'error' || settings.type === 'warning')? text[settings.type] : '')
		}));
		
		if (settings.type === 'error' || settings.type === 'warning') {
			h.append($('<span>', {
				'class': settings.type,
				text: '!'
			}));
		}
		
		// Close
		
		var closePanel = function() {
			x.trigger('removeTooltip');
			to = clearTimeout(to);
			w.animate({
				opacity: 0
			}, settings.speed, function() {
				w.remove();
			});
			return false;
		};
		
		w.on('destroy', closePanel);
		
		// Closing by clicking outside the window
		
		if ( settings.blocking && settings.closeOnClickOut ) {
			w.on('click', function(e) {
				if ( $(e.target).hasClass(id.w) ) {
					return closePanel(e);
				}
			});
		}
		
		// Close button
		
		x = $('<a>', {
			href: NOLINK,
			'class': id.x,
			html: '&times;'
		}).appendTo( h );
		
		if ( document.touchMode ) {
			x[0].addEventListener(TOUCH_END, closePanel);
		} else {
			x.on('click', closePanel);
			x.addTooltip(text.closeWindow);
		}
		
		// Drag moving
		
		var dragStart = function(e) {
			e.preventDefault();
			var x0 = p.position().left, 
				y0 = p.position().top,
				ec0 = getCoords(e),
				lm = ww - p.width() - settings.pad,
				tm = wh - p.height() - settings.pad,
				oc = h.css('cursor');
			
			h.css({
				cursor: 'move'
			});
			
			var dragMove = function(e) {
				e.preventDefault();
				var ec = getCoords(e);
				
				p.css({
					left: Math.minMax( settings.pad, x0 + ec.x - ec0.x, lm ),
					top: Math.minMax( settings.pad, y0 + ec.y - ec0.y, tm )
				});
				return false;
			};
			
			var dragStop = function(e) {
				e.preventDefault();
				$(document).off({
					mousemove: dragMove,
					mouseup: dragStop
				});
				
				h.css('cursor', oc);
				
				if ( settings.savePosition ) {
					savePosition();
				}
				return false;
			};
			
			if ( document.touchMode ) {
				this.addEventListener(TOUCH_END, dragStop);
				this.addEventListener(TOUCH_MOVE, dragMove);
				//return true;
			} else {
				$(document).on({
					mousemove: dragMove,
					mouseup: dragStop
				});
			}
			return false;
		};

		if ( settings.movable ) {
			if ( document.touchMode ) {
				h[0].addEventListener(TOUCH_START, dragStart);
			} else {
				h.on('mousedown', dragStart);
			}
		}
			
		// Adding content inside a wrap element
				
		c = $('<div>', {
			'class': id.c
		}).appendTo( p );
		
		ci = $('<div>', {
			'class': id.ci
		}).append( content ).appendTo( c );
		
		// Default button
		
		if ( !buttons && settings.defaultButton ) {
			buttons = [{
				t: settings.defaultButton,
				h: closePanel
			}];
		}	
		
		// Dialog panel (has buttons)
		
		if ( buttons ) {
			
			var i, a, btns, btn = $('<div>', { 
				'class': 'buttons' 
			}).appendTo( ci );	
			
			var select = function(n) { 
				btns.each(function(i) { 
					$(this).toggleClass('active', i === n); 
				}); 
			};
			
			var close = function() {
				$(document).off('keydown', keyhandler);
				closePanel();
			};

			var keyhandler = function(e) {
				if ( document.activeElement && document.activeElement.nodeName === 'input' || 
					( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) ) {
					return true;
				}
				var k = e? e.keyCode : window.event.keyCode;
				if ( k === 27 ) {
					close();
					return false;
				} else if ( btn ) {
					var a = btn.find('a.active'), 
						i = btns.index(a);
					switch (k) {
						case 13: 
						case 10: 
							if ( $.isFunction(a[0].handler) ) {
								if (a[0].handler.call(w) !== false) {
									close();
								}
							}
							break;
						case 39: 
							select( (i + 1) % btns.length ); 
							break;
						case 37: 
							select( i? (i - 1) : (btns.length - 1) );
							break;
						default:
							return true;
					}
					return false;
				}
				return true;
			};

			var clickhandler = function(e) {
				e.preventDefault();
				var a = e.target;
				if ( $.isFunction(a.handler) ) {
					if (a.handler.call(w, p) !== false) {
						close();
					}
				}
				return false;
			};
			
			for ( i = 0; i < buttons.length; i++ ) {
				if ( i ) {
					btn.append(' ');
				}
				
				a = $('<a>', { 
					href: NOLINK,
					html: buttons[i].t
				}).on('click', clickhandler).appendTo(btn);
				
				if ( $.isFunction(buttons[i].h) ) {
					a[0].handler = buttons[i].h;
				}
				
			}
			
			btns = btn.children('a');
			btns.last().addClass('active');
			
			if ( $.isFunction(settings.enableKeyboard) || settings.enableKeyboard ) {
				$(document).on('keydown', keyhandler);
			}
		}
		
		// Resizing the window
		
		if ( settings.resizable ) {
			
			// Double-click functionality (maximize / previous state)
			var toggleMaximize = function(e) {
				e.preventDefault();
				
				var cp = [ p.position().left, p.position().top, p.width(), p.height() ],
					mp = [ settings.pad, settings.pad, ww - 2 * settings.pad, wh - 2 * settings.pad ];
				
				var setPos = function( np ) {		
					p.css({
						left: Math.minMax( settings.gap, np[0], ww - np[2] - settings.gap ),
						top: Math.minMax( settings.gap, np[1], wh - np[3] - settings.gap ),
						width: np[2],
						height: np[3]
					});
					ci.css({
						height: np[3] - dh
					});			
				};
				
				if ( cp[0] === mp[0] && cp[1] === mp[1] && cp[2] === mp[2] && cp[3] === mp[3] ) {
					setPos( p.data('wpos') );
				} else {
					setPos( mp );
					p.data( 'wpos', cp );
				}
				
				if ( settings.savePosition ) {
					savePosition();
				}
				
				return false;
			}
			
			h.on(document.touchMode? 'dbltap' : 'dblclick', toggleMaximize);
			
			// Resize handle
		
			var r = $('<a>', {
				'class': id.r
			}).appendTo( p );

			var resizeStart = function(e) {
				e.preventDefault();
				var w0 = p.width(), 
					h0 = p.height(),
					ec0 = getCoords(e),
					mw = w.width(),
					mh = wh - settings.pad - p.position().top - dh,
					mw = ww - settings.pad - p.position().left;
					
				var resizeMove = function(e) {
					e.preventDefault();
					var ec = getCoords(e),
						nh = Math.min(Math.max(h0 + ec.y - ec0.y - dh, 20), mh);
					
					p.css({
						width: Math.min(Math.max(w0 + ec.x - ec0.x, 60), mw),
						height: nh + dh
					});
					ci.css({
						height: nh
					});
					return false;
				};
				
				var resizeStop = function(e) {
					e.preventDefault();
					$(document).off({
						mousemove: resizeMove,
						mouseup: resizeStop
					});
					
					if ( settings.savePosition ) {
						savePosition();
					}
					return false;
				};
			
				if ( document.touchMode ) {
					this.addEventListener(TOUCH_MOVE, resizeMove);
					this.addEventListener(TOUCH_END, resizeStop);
				} else {
					$(document).on({
						mousemove: resizeMove,
						mouseup: resizeStop
					});
				}
				return false;
			};
			
			if (document.touchMode) {
				r[0].addEventListener(TOUCH_START, resizeStart);
			} else {
				r.on('mousedown', resizeStart);
			}
		}
		
		// placing the window at given position
		
		var alignPanel = function() {
						
			var pw = p.width(),
				ph = p.height();
			
			dh = ph - ci.height();
			
			if ( pw && ph && ww && wh ) {
				
				if ( pw + 2 * settings.pad > ww ) {
					p.css({
						width: pw = ww - 2 * settings.pad
					});
				}
				
				if ( ph + 2 * settings.pad > wh ) {
					p.css({
						height: ph = wh - 2 * settings.pad
					});
					ci.css({
						height: wh - 2 * settings.pad - dh
					});
				}
				
				p.css({
					left: Math.max( Math.round((ww - pw) * settings.pos[0] / 2), settings.pad ),
					top: Math.max( Math.round((wh - ph) * settings.pos[1] / 2), settings.pad )
				});
				
			}
		};
		
		// placing the window at a given position
		
		var placePanel = function( pos ) {
			
			var l = Math.minMax(settings.pad, parseInt(pos[0], 10), ww - settings.pad - 60),
				t = Math.minMax(settings.pad, parseInt(pos[1], 10), wh - settings.pad - 60),
				pw = Math.minMax(120, parseInt(pos[2], 10), ww - l - settings.pad),
				ph;
				
			if ( isNaN(l) || isNaN(t) || isNaN(pw) ) {
				alignPanel();
			}

			dh = h.outerHeight() + 
				parseInt(c.css('padding-top'), 10) + 
				parseInt(c.css('padding-bottom'), 10) + 
				parseInt(ci.css('padding-top'), 10) + 
				parseInt(ci.css('padding-bottom'), 10) + 
				parseInt(c.css('border-top-width'), 10);

			p.css({ 
				position: 'absolute',
				left: l,
				top: t,
				width: pw
			});
			
			if ( p.height() > (ph = wh - t - settings.pad) ) { 
				p.css({
					height: ph
				});
				ci.css({
					height: ph - dh
				});
			}
		};
		
		// Saving the position
		
		var savePosition = function() {
			$.cookie('modalPosition' + settings.uid, (p.position().left + ',' + p.position().top + ',' + p.width() + ',' + p.height()) );
		};
				
		// Showing the window
		
		var showPanel = function( pos ) {
			
			w.css({
				opacity: 0
			}).show();
			
			// leave enough time to create content
			
			setTimeout( function() {
				
				if (pos && (pos = pos.split(',')) && $.isArray(pos) && pos.length > 3) {
					placePanel(pos);
				} else {
					alignPanel();
				}
				
				if ( !settings.blocking ) {
					w.css({
						width: 0,
						height: 0,
						right: 'auto',
						bottom: 'auto',
						overflow: 'visible'
					});
				}
				
				w.animate({
					opacity: 1
				}, settings.speed);
				
				if ( settings.savePosition ) {
					savePosition();
				}
				
				if ( settings.autoFade ) {
					to = setTimeout(closePanel, settings.autoFade);
				}

				if ( settings.scrollIntoView ) {
					setTimeout(function() {
						var el = ci.children(':not(.buttons)').find('.active:first');
						if (el && el.length) {
							ci.scrollTop(Math.max(Math.floor(el.position().top) - 50, 0));
						}
					}, 200);
				}
				
				
			}, 40);
		};
		
		// showing at center or retrieving the previous position / size
		
		showPanel( settings.savePosition? $.cookie('modalPosition' + settings.uid) : null );
				
		return this;
	};
	
	$.fn.addModal.defaults = {
		speed: 300,
		autoFade: 0,
		width: 400,
		resizable: false,
		movable: true,
		blocking: true,
		enableKeyboard: true,
		closeOnClickOut: true,
		darkenBackground: true,
		savePosition: false,
		scrollIntoView: false,
		defaultButton: 'okButton',
		pad: 6,
		pos: [ 1, 1 ],
		type: 'normal'
	};
	
	$.fn.addModal.text = {
		closeWindow: 'Close window',
		error: 'error',
		warning: 'warning'
	};

})(jQuery);

/*	
 *	addTooltip() :: little Popup displaying 'title' text, or passed text (can be HTML)
 *
 *	Usage: $(element).addTooltip( [txt,] options );
 *	options:
		id: 'hint',
		stay: 3000,
		posX: ALIGN_CENTER,
		posY: ALIGN_BOTTOM,
		toX: ALIGN_CENTER,
		toY: ALIGN_TOP
 */

(function($) {
			
	$.fn.addTooltip = function(content, settings) {
		
		if (content && typeof content !== 'string' && !content.jquery) {
			settings = content;
			content = null;
		}
		
		id = {
			tooltip: 'tooltip'
		};

		settings = $.extend( {}, $.fn.addTooltip.defaults, settings );
		
		$.fn.hideAllTooltips = function() {
			$('.' + settings.className).hide();
		};
		
		var createNew = function(el, cont) {
			var c;
			
			if (!cont) {
				
				if (cont = el.data(id.tooltip)) {
					// read from related layer
					if (cont.charAt(0) === '.') {
						cont = el.find(cont);
					} else if (cont.charAt(0) === '#') {
						cont = $(cont);
					}
					if (cont.jquery) {
						cont.removeClass('hidden');
					}
				} else {
					// read from data or title attr
					cont = el.attr('title');
					el.removeAttr('title');
				}
				
				if (!cont || !cont.length) {
					return null;
				}
				
				c = $('<div>', {
					html: cont
				}).appendTo('body');
				
			} else if (typeof cont === 'string') {
				
				// paased directly :: html structure as string
				c = $('<div>', {
					html: cont
				}).appendTo('body');
				
			} else if (cont.jquery) {
				
				// jQuery element
				if (!$.contains(document.body, cont[0])) {
					c = cont.appendTo('body');
				} else {
					c = cont;
				}
				
			} else {
				return null;
			}
			
			c.addClass(settings.className).hide();
			return c;
			
		};
		
		return this.each(function() {
				
			var self = $(this), 
				cont,
				to, rto,			// timeout, remove timeout
				over = false,		// over the tooltip 
				focus = false,		// tooltip input got focus
				offs;				// last offset
						
			// getFocus
			var getFocus =  function() {
				rto = clearTimeout(rto);
				over = true;
				cont.finish().show();
			};
			
			// lostFocus
			var lostFocus = function() {
				if ( focus ) {
					return;
				}
				clearTimeout(rto);
				over = false;
				rto = setTimeout(remove, 100);
			};
				
			// Leaving the trigger element
			var leave = function(e) {
				to = clearTimeout(to);
				clearTimeout(rto);
				over = false;
				rto = setTimeout(remove, 100);
			};
			
			// The hotspot clicked
			var clicked = function(e) {
				leave();
				return true;
			};
			
			// Fading the popup
			var remove = function() {
				if ( !over && cont ) {
					cont.stop(true, false).fadeOut(200, function() { 
						cont.hide();
					});
				}
			};
			
			// Remove later :: automatically on touch devices
			var removeLater = function() {
				clearTimeout(rto);
				rto = setTimeout(remove, settings.stay);
			}
			
			// Create
			var create = function() {
				
				if (!(cont = createNew(self, content))) {
					return false;
				}
				
				// Keep the popup live while the mouse is over
				if (!document.touchMode) {
					cont.on('mouseover', getFocus);
					cont.on('mouseout', lostFocus);
				}
				// ... or an input box has focus
				cont.find('input, textarea').on({
					focus: function() {
						focus = true;
						getFocus();
					},
					blur: function() {
						focus = false;
					}
				});
				
				return true;
			};
			
			// Showing, aligning and fading in
			var show = function() {
				var o = self.offset();
				//log(o.left + ':' + o.top);
				if (o.top === offs.top && o.left === offs.left) {
					// only if target layer not in move
					cont.fadeIn(300).alignTo(self, { 
						pos: settings.pos
					});
				}
			};
			
			// Entering the hotspot
			var enter = function() {
				
				if (!cont) {
					if (!create()) {
						return;
					}
				} else {
					cont.stop(true, false);
					rto = clearTimeout(rto);
				}
				
				offs = self.offset();
				//log(offs.left + ':' + offs.top);
				clearTimeout(to);
				to = setTimeout(show, settings.delay);
				
				if (!document.touchMode) {
					over = true;
				} else {
					// Remove hint automatically on touch devices, because there's no explicit mouse leave event is triggered
					removeLater();
				}
			};
			
			// Touch (toggling the popup element)
			var touchStart = function(e) { //log('touchStart');
				e.preventDefault();
				//rto = clearTimeout(rto);
				if (!cont || cont.is(':hidden')) {
					enter();
				} else {
					over = false;
					leave();
					if (self[0].nodeName === 'A') {
						var l = self.attr('href');
						if (l && !l.startsWith('javascript:')) {
							//self[0].removeEventListener('click', click);
							window.location.href = l;
						} else {
							self.trigger('click');
						}
					}
				}
				return false;
			}
						
			var doNothing = function(e) {
				e.preventDefault();
				e.stopPropagation();
			};
			
			// Custom event = Force removing the hint
			self.on('removeTooltip', leave);
						
			if (document.touchMode) {
				this.addEventListener(TOUCH_START, touchStart);
				this.addEventListener(TOUCH_END, doNothing);
				this.addEventListener('click', doNothing);
			} else {
				self.on({
					'focus mouseenter': enter,
					'blur mouseleave': leave,
					'click': clicked
				});
			}
		});
	};
	
	/*
		ALIGN_LEFT = ALIGN_TOP = 0
		ALIGN_CENTER = ALIGN_MIDDLE = 1
		ALIGN_RIGHT = ALIGN_BOTTOM = 2
	*/
	$.fn.addTooltip.defaults = {
		delay: 50,
		className: 'hint',
		stay: 2000,
		pos: [1,2,1,0]
	};
	
})(jQuery);

/*	
 *	loadImages() :: loads images only that are visible in a container
 *
 *	Usage: $(element).loadImages( options );
 *	options:
		selector: '.cont',		// container selector
		loadClass: 'toload',	// class to mark the images still to load
		d: 80					// negative distance to boundaries that should load
 */

(function($) {
	
	$.fn.loadImages = function( settings ) {
		
		settings = $.extend( {}, $.fn.loadImages.defaults, settings );

		return this.each(function() {
				
			var w = $(this),
				c = w.find(settings.selector).eq(0) || w.children().eq(0);
				
			//log((w.attr('class')||('#'+w.attr('id')))+'['+(w.is(':visible')?'+':'-')+'] '+c.attr('class')+'['+(c.is(':visible')?'+':'-')+']');
			if ( !c.length || !w.is(':visible') || !c.is(':visible') ) {
				return;
			}
			
			var i = c.find('img.' + settings.loadClass);
			
			if ( !i.length ) {
				return;
			}
			
			var ap = c.css('position') === 'absolute',
				cl = -( (typeof settings.left !== UNDEF)? settings.left : (c.position().left - (ap? 0 : w.scrollLeft())) ) - settings.d,
				ct = -( (typeof settings.top !== UNDEF)? settings.top : (c.position().top - (ap? 0 : w.scrollTop())) ) - settings.d,
				ol = c.offset().left,
				ot = c.offset().top,
				ww = (ap? w.width() : $(window).width()) + 2 * settings.d,
				wh = (ap? w.height() : $(window).height()) + 2 * settings.d,
				p, t, tt, tl, s, wt;
				
			//log('Load['+i.length+'] ct:'+c.position().top+' st:'+w.scrollTop());
			var cnt = 0;
			i.each( function() {
				t = $(this);
				p = t.parent();
				if ( (s = t.data('src')) ) {
					tl = p.offset().left - ol;
					tt = p.offset().top - ot;
					//log(tt+'('+p.outerHeight()+') in ['+ct+'-'+(ct+wh)+']?');
					
					if ( (tt < (ct + wh)) && (tl < (cl + ww)) && 
						((tt + p.outerHeight()) > ct) && ((tl + p.outerWidth()) > cl) ) {
						
						wt = $('<span>', {
							'class': settings.wait
						}).appendTo(p);
						
						t.hide().on('load', function() {
							$(this).fadeIn().siblings('.' + settings.wait).remove();
						}).attr({
							src: s
						}).removeClass(settings.loadClass);
						cnt++;
					}
				}
			});
			//log(cnt + ' loaded');
		});
	};

	$.fn.loadImages.defaults = {
		selector: '.load',
		loadClass: 'toload',
		wait: 'wait',
		d: 80
	};
	
})(jQuery);

/*	
 *	addScroll() :: adds vertical scroll to a layer
 *
 *	Usage: $(element).addScroll( options );
 *
 *	options:
		dragMinSize: 10,
		speed: 300,
		effect: 'swing',
		disabledOpacity: 0.3,
		wheelIncr: 50,
		enableKeyboard: true,
		enableMouseWheel: true,
		refresh: 0
 */

(function($) {
			
	$.fn.addScroll = function( settings ) {
		
		settings = $.extend( {}, $.fn.addScroll.defaults, settings );
				
		return this.each(function() {
			var to, 
				cont = $(this), 
				wrap = cont.parent(), 
				sup, sdn, sbar, shan, ctrls, cheight, wheight, scroll,
				ey = 0, y0, tY, tT, tY1, speed, dist, min;
			
			cont.css({
				position: 'absolute', 
				width: wrap.width - 20
			});
			
			wrap.css({
				overflow: 'hidden'
			});
			
			if ( wrap.css('position') !== 'absolute' ) {
				wrap.css({ 
					position: 'relative' 
				});
			}
			
			sup = $('<div>', { 
				'class': settings.upbtn 
			}).appendTo(wrap);
			
			sdn = $('<div>', { 
				'class': settings.dnbtn 
			}).appendTo(wrap);
			
			sbar = $('<div>', { 
				'class': settings.scbar 
			}).appendTo(wrap);
			
			shan = $('<div>').appendTo(sbar);
			
			ctrls = sup.add(sdn).add(sbar);
			ctrls.hide();
			
			var getHeights = function() {
				cheight = cont.height();
				wheight = wrap.height();
			};
			
			var getTop = function() { 
				return cont.position().top; 
			};
			
			var getSt = function(t) { 
				return Math.round( (sbar.height() - 6) * (-((t == null)? getTop() : t)) / cheight ) + 3; 
			};
			
			var getSh = function() { 
				return Math.max( Math.round( (sbar.height() - 6) * wheight / cheight ), settings.dragMinSize ); 
			};
			
			var setCtrl = function(t) {
				if ( t == null ) {
					t = getTop();
				}
				sup.css({
					opacity: t? 1 : settings.disabledOpacity
				});
				sdn.css({
					opacity: (t === wheight - cheight)? settings.disabledOpacity : 1
				});
			};
			
			var noSelect = function() {
				return false;
			};
			
			var matchScr = function() {
				var bc = cheight, bw = wheight;

				getHeights();
				
				if ( wrap.scrollTop() ) {
					cont.css({
						top: -wrap.scrollTop()
					});
					wrap.scrollTop(0);
				}
				
				// Check if container dimensions has changed
				if ( bc !== cheight || bw !== wheight ) {
					
					if ( cheight <= wheight ) {
						// content is smaller than wrap -> No scroll needed
						cont.css({
							top: 0
						}).off('selectstart', noSelect); 
						ctrls.hide();
					} else {
						// content is taller than wrap -> Show scroll controls
						if ( cont.position().top < (wheight - cheight) ) {
							cont.css({        
								top: wheight - cheight
							});
						}
						shan.css({
							top: getSt(), 
							height: getSh()
						});
						cont.on('selectstart', noSelect);
						ctrls.show();
						setCtrl();
					}
					
					wrap.loadImages();
				}
			};
			
			var matchCnt = function() { 
				cont.css({
					top: Math.minMax(wheight - cheight, -Math.round((shan.position().top - 3) * cheight / (sbar.height() - 6)), 0)
				}); 
				setCtrl(); 
				wrap.loadImages();
			};
			
			var animateTo = function(t) {
				clearInterval(scroll);
				
				if ( wheight >= cheight ) {
					return;
				}
				
				t = Math.minMax(wheight - cheight, Math.round(t), 0);
				
				shan.stop(true, false).animate({
					top: getSt(t)
				}, settings.speed, settings.effect);
				
				cont.stop(true, false).animate({
					top: t
				}, settings.speed, settings.effect, function() {
					setCtrl(t);
				});
				
				wrap.loadImages({
					top: t
				});
			};
			
			sup.on('click', function() { 
				animateTo(getTop() + wheight); 
				return false; 
			});
			
			sdn.on('click', function() { 
				animateTo(getTop() - wheight); 
				return false; 
			});
			
			sbar.on('click', function(e) {
				if (e.pageY < shan.offset().top) {
					animateTo(getTop() + wheight);
				} else if (e.pageY > (shan.offset().top + shan.height())) {
					animateTo(getTop() - wheight);
				}
				return false;
			});
			
			if ( settings.enableMouseWheel ) {
				cont.on('mousewheel', function(e, d) {
					if (d) {
						clearTimeout(scroll);
						shan.stop(true, true);
						cont.stop(true, true);
						animateTo(getTop() + settings.wheelIncr * ((d < 0)? -1 : 1));
					}
					return false;
				});
			}
			
			var dragSh = function(e) {
				e.preventDefault();
				shan.css({
					top: Math.minMax(2, Math.round(e.pageY - shan.data('my')), sbar.height() - shan.height() - 2)
				}); 
				matchCnt();
				return false;
			};
			
			var dragShStop = function(e) {
				e.preventDefault();
				$(document).off('mousemove', dragSh).off('mouseup', dragShStop);
				return false;
			};
			
			shan.on('mousedown', function(e) {
				e.preventDefault();
				$(this).data('my', Math.round(e.pageY) - $(this).position().top);
				$(document).on({
					'mousemove': dragSh,
					'mouseup': dragShStop
				});
				return false;
			});
			
			var getY = function(e) {
				ey = (e.touches && e.touches.length > 0 )? e.touches[0].clientY : ( e.clientY ? e.clientY : ey );
				return ey;
			};
			
			var dragExtra = function() {
				dist += Math.round(speed / 20);
				var nY = tY1 + dist;
				if (nY > 0 || nY < min) {
					clearInterval(scroll);
					wrap.loadImages();
					return;
				}
				cont.css({
					top: nY
				});
				shan.css({
					top: getSt(), 
					height: getSh()
				});
				speed *= 0.8;
				if (Math.abs(speed) < 10) {
					speed = 0;
					clearInterval(scroll);
					wrap.loadImages();
				}
			};
			
			var dragMove = function(e) { 
				e.preventDefault();
				if ( tY ) {
					var dY = getY(e) - tY;
					if ( dY ) {
						cont.data('dragOn', true);
						cont.css({
							top: Math.minMax(min, y0 + dY, 0)
						});
						shan.css({
							top: getSt(), 
							height: getSh()
						});
					}
				} else {
					tY = getY(e);
				}
				return false;
			};
			
			var dragStop = function(e) {
				e.preventDefault();
				tY1 = getTop();
				var dY = getY(e) - tY;
				var dT = new Date().getTime() - tT;
				speed = 1000 * dY / dT;
				scroll = setInterval(dragExtra, 50);
				if ( document.touchMode ) {
					this.removeEventListener(TOUCH_MOVE, dragMove);
					this.removeEventListener(TOUCH_END, dragStop);
				} else {
					$(document).off({
						mousemove: dragMove,
						mouseup: dragStop
					});
				}
				setTimeout(function() {
					cont.data('dragOn', false);
				}, 20);
				
				wrap.loadImages();
				return (Math.abs(dY) < 4) && (dT < 300);
			};
			
			var dragStart = function(e) { // idea from quirsksmode.org
				var n = e.target.nodeName;
				if (n === 'INPUT' || n === 'TEXTAREA' || n === 'BUTTON' || n === 'SELECT') {
					return true;
				}
				
				e.preventDefault();
				if ( cont.data('dragOn') ) {
					// recursive call
					dragStop( e );
					return true;
				}
				if ( (e.target.scrollHeight - 1) > e.target.clientHeight ) {
					// inner scrollable element
					return true;
				}
				if ( settings.dontDrag && 
					($(e.target).is(settings.dontDrag).length || $(e.target).parents(settings.dontDrag).length) ) {
					// exception (e.g. map)
					return true;
				}
				if ( wheight >= cheight ||
					((e.type === 'touchstart' || e.type === 'touchmove') && 
					(!e.touches || e.touches.length > 1 || cont.is(':animated'))) ) {
					return true;
				}
				shan.stop(true, true);
				cont.stop(true, true);
				clearInterval(scroll);
				// te = e; ?
				y0 = getTop();
				tY = getY(e);
				tT = new Date().getTime();
				dist = 0;
				min = wheight - cheight;
				if ( document.touchMode ) {
					$(e.target).closest('a').focus();
					this.addEventListener(TOUCH_MOVE, dragMove);
					this.addEventListener(TOUCH_END, dragStop);
					return true;
				} else {				
					$(document).on({
						mousemove: dragMove,
						mouseup: dragStop
					});
				}
				
				return false;
			};
			
			if (document.touchMode) {
				cont[0].addEventListener(TOUCH_START, dragStart);
			} else {
				cont.on('mousedown', dragStart);
			}
			
			$(window).on('resize', function() { 
				clearTimeout(to); 
				to = setTimeout(matchScr, 50);
			});
			
			to = setTimeout(matchScr, 10);
			
			// Automatic match for changing content, e.g. comment box
			
			if ( settings.refresh ) {
				setInterval(function() {
					if ( !$('[role=gallery]').is(':visible') ) {
						matchScr();
					}
				}, settings.refresh);
			}
			
			cont.attr('role', 'scroll').data('dragOn', false).on('adjust', matchScr);
			
			ctrls.on('selectstart', noSelect); 
			
			// Move active element into view
			
			var setactive = function() {
				if ( cont.data('dragOn') ) {
					return;
				}
				var e = ($(this).parent() === cont)? $(this) : $(this).parent(),
					et = e.position().top, 
					eh = e.outerHeight(true),
					ct = cont.position().top,
					wh = wrap.height();
				
				if ( wh > cont.height() ) {
					return;
				} else if ((et + eh) > (wh - ct)) {
					ct = Math.max(wh - eh - et, wh - cont.height());
				} else if (et < -ct) {
					ct = -et;
				} else { 
					return;
				}
				
				animateTo(ct);
			};
			
			if ( settings.focusActive ) {
				cont.find('a').on('setactive', setactive);
			}
			
			// Avoid click events during drag
			var avoidClick = function(e) {
				//log(e.target.nodeName + ':' + cont.data('dragOn'));
				if (cont.data('dragOn')) {
					//e.stopPropagation();
					e.preventDefault();
					return false;
				}
				return true;
			};
			cont.find('a').on('click', avoidClick);
				
			// Keyboard handler
			
			if ( $.isFunction(settings.enableKeyboard) || settings.enableKeyboard ) {
				$(document).on('keydown', function(e) {
					if (document.activeElement && document.activeElement.nodeName === 'INPUT' || 
						( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard() ) ) {
						return true;
					}
					var k = e? e.keyCode : window.event.keyCode;
					switch( k ) {
						case 33: 
							e.preventDefault();
							animateTo( getTop() + wheight ); 
							return false;
						case 34: 
							e.preventDefault();
							animateTo( getTop() - wheight ); 
							return false;
					}
					return true;
				});
			}
		});
	};
	
	$.fn.addScroll.defaults = {
		upbtn: 'scrup',
		dnbtn: 'scrdn',
		scbar: 'scrbar',
		dragMinSize: 10,
		speed: 300,
		effect: 'swing',
		disabledOpacity: 0.3,
		wheelIncr: 50,
		enableKeyboard: true,
		enableMouseWheel: true,
		focusActive: true,
		refresh: 0
	};
	
})(jQuery);

/*	
 *	thumbScroll() :: adds horizontal scrolling to layer
 *
 *	Usage: $(element).thumbScroll( options );
 *	options:
		speed: 1500,
		incr: 100,
		effect: 'easeOutBack',
		headRoom: 0.67,
		disabledOpacity: 0.3,
		enableMouseWheel: true
 */

(function($) {
	
	// Easing functions for animations by George Smith
	$.extend( jQuery.easing, {
		easeOutBack: function (x,t,b,c,d,s) { 
			if (s == null) {
				s = 1.70158;
			}
			return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
		}
	});

	$.fn.scrollThumbs = function(settings) {
		
		settings = $.extend( {}, $.fn.scrollThumbs.defaults, settings );
				
		return this.each(function() {
			var co = $(this), 
				wr = co.parent(),
				ex = 0, x0, tX, tT, tX1, speed, dist, min, scroll, seek,
				scleft = $('<div>', { 
					'class': settings.scleft 
				}).insertAfter(wr),
				scright = $('<div>', { 
					'class': settings.scright 
				}).insertAfter(wr);
										
			var setCtrl = function( x ) {
				x = (x == null)? co.position().left : x;
				scleft.css({ 
					opacity: (x < 0)? 1 : settings.disabledOpacity 
				});
				scright.css({ 
					opacity: (wr.width() < (x + co.width()))? 1 : settings.disabledOpacity 
				});
			};
			
			var animateTo = function( x ) {
				var w = wr.width(), c = co.width();
				if ( !w || !c || w >= c || !$.isNumeric(x) ) {
					return;
				} else if ( x > 0 ) {
					x = 0;
				} else if ( x < w - c ) {
					x = w - c;
				}
				setCtrl(x);
				co.stop(true, false);
				clearInterval(scroll);
				co.animate( { 
					left: x 
				}, settings.speed, settings.effect);
				
				wr.loadImages({
					left: x
				});
				
			};	
			
			var scleftfn = function(e) {
				e.preventDefault();
				seekOn();
				animateTo(co.position().left + wr.width()); 
				return false; 
			};
			
			
			var scrightfn = function(e) {
				e.preventDefault();
				seekOn();
				animateTo(co.position().left - wr.width()); 
				return false; 
			};
			
			scleft.on('click', scleftfn);
			scright.on('click', scrightfn);
			
			// User is performing a seek - don't move active into view
			
			var seekOn = function(state) {
				if (typeof seek === 'number') {
					clearTimeout(seek);
				}
				if (typeof state !== UNDEF) {
					seek = state;
				} else {
					seek = setTimeout(function() {
						seek = false;
					}, settings.seekStay);
				}
			};
			
			var setactive = function() {
				if (co.data('dragOn') || seek) {
					return;
				}
				
				var e = co.find(settings.active).closest('li');
				
				if ( e.length ) {
					var el = e.position().left, 
						ew = e.outerWidth(true),
						hr = Math.round(ew * settings.headRoom),
						cl = co.position().left,
						ww = wr.width();
					
					if ( ww > co.width() ) {
						return;
					} else if (el > (ww - ew - hr - cl)) {
						cl = Math.max(ww - ew - hr - el, ww - co.width());
					} else if (el < -cl + hr) {
						cl = -el + hr;
					} else { 
						return;
					}
					
					animateTo(cl);
				}
			};
			
			co.on('setactive', setactive);
			
			var mousewheel = function(e, d) {
				e.preventDefault();
				if ( d ) {
					co.stop(true, false);
					clearInterval(scroll);
					seekOn();
					animateTo(co.position().left + wr.width() * ((d < 0)? -1 : 1));
				}
				return false;
			};
			
			if ( settings.enableMouseWheel ) {
				co.on('mousewheel', mousewheel);
			}
			
			setCtrl();

			var getX = function( e ) {
				ex = ( e.touches && e.touches.length > 0 )? e.touches[0].clientX : ( e.clientX ? e.clientX : ex );
				return ex; 
			};
			
			var dragExtra = function() {
				dist += Math.round(speed / 20);
				var nX = tX1 + dist;
				if (nX > 0 || nX < min) {
					clearInterval(scroll);
					return;
				}
				co.css({
					left: nX
				});
				speed *= 0.8;
				if (Math.abs(speed) < 10) {
					speed = 0;
					clearInterval(scroll);
				}
			};
			
			var dragMove = function(e) {
				e.preventDefault();
				if ( tX ) {
					var dX = getX(e) - tX;
					if ( dX ) {
						co.data('dragOn', true);
						co.css({
							left: Math.minMax(min, x0 + dX, 0)
						});
					}
				} else {
					tX = getX(e);
				}
				return false;
			};
			
			var dragStop = function( e ) {
				e.preventDefault();
				tX1 = co.position().left;
				var dX = getX(e) - tX,
					dT = new Date().getTime() - tT;
				
				speed = 1000 * dX / dT;
				scroll = setInterval(dragExtra, 50);
				seekOn();
				
				if ( document.touchMode ) {
					co[0].removeEventListener(TOUCH_MOVE, dragMove);
					co[0].removeEventListener(TOUCH_END, dragStop);
					
					if (Math.abs(dX) < 10) {
						$(e.target).parents('a').trigger('click');
					}
				} else {
					$(document).off({
						mousemove: dragMove,
						mouseup: dragStop
					});
				}
				
				setTimeout(function(){
					co.data('dragOn', false);
				}, 20 );
				
				wr.loadImages();				
				
				return (Math.abs(dX) < 4) && (dT < 300);
			};
			
			var dragStart = function(e) {
				e.preventDefault();
				if ((e.type === 'touchstart' || e.type === 'touchmove') && 
					(!e.touches || e.touches.length > 1 || co.is(':animated'))) {
					return true;
				}
				co.stop(true, false);
				clearInterval(scroll);
				seekOn(true);
				x0 = co.position().left;
				tX = getX(e);
				tT = new Date().getTime();
				dist = 0;
				min = wr.width() - co.width();
				if (min >= 0) {
					return true;
				}
				
				if ( document.touchMode ) {
					$(e.target).closest('a').focus();
					co[0].addEventListener(TOUCH_MOVE, dragMove);
					co[0].addEventListener(TOUCH_END, dragStop);
					//return true;
				} else {
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
				}
				return false;
			};
			
			// Wiring drag start event
			
			if ( document.touchMode ) {
				co[0].addEventListener(TOUCH_START, dragStart);
			} else {
				co.on('mousedown', dragStart);
			}
			
			co.attr('role', 'scroll').data('dragOn', false);
			
			co.add(scleft).add(scright).on('selectstart', noAction);
			
			wr.loadImages();
									
		});
	};
	
	$.fn.scrollThumbs.defaults = {
		active: '.active',
		scleft: 'scleft',
		scright: 'scright',
		seekStay: 3000,
		speed: 1500,
		incr: 100,
		effect: 'easeOutBack',
		headRoom: 0.67,
		disabledOpacity: 0.3,
		enableMouseWheel: true
	};

})(jQuery);

/*	
 *	addSwipe() :: Swipe gesture support
 *
 *	Usage: $(element).addSwipe( leftFn, rightFn, options );
 *	Options: treshold, oversizeTreshold, margin
		treshold: 40,			// Considering as click instead of move
		oversizeTreshold: 0.15,	// The proportion of screen size moving within this boundary still don't trigger prev/next action 
		margin: 15				// Re-align to this margin, when moved over
 */
 
 (function($) {
	
	// Easing function by George Smith
	$.extend( jQuery.easing, {
		easeOutCubic: function (x,t,b,c,d) {
			return c*((t=t/d-1)*t*t+1)+b;
		}
	});
	
	$.fn.addSwipe = function( leftFn, rightFn, settings ) {
		
		settings = $.extend( {}, $.fn.addSwipe.defaults, settings );
														
		return this.each(function() {
			
			var t = $(this),
				tp = t.parent(),
				self = this;
				
			var x0 = 0, y0 = 0,			// storing transform offset
				cw = tp.outerWidth(),	// container width, height
				ch = tp.outerHeight(),	
				ew = t.outerWidth(), 	// element width, height
				eh = t.outerHeight(),
				mx,						// max x for panoramic
				uto,					// window resize update timeout
				mto,					// auto move timeout
				tt,						// touch start time
				ex0, ey0,				// event start coords
				dx, dy,					// relative move
				cax;					// constrain to x axis
			
			var updateClipDim = function() {
				cw = tp.outerWidth();
				ch = tp.outerHeight();
			}
			
			$(window).on('resize.addswipe', function() {
				clearTimeout(uto);
				uto = setTimeout(updateClipDim, 50);
			});
			
			var clicked = function(e) { //log('clicked '+(self.dragOn?'1':'0'));
				if (self.dragOn) {
					return false;
				} else {
					e.target.trigger('click', e);
				}
			}
			
			var move = function(e) {
				if (cax) {
					dx = ((e.touches && e.touches.length > 0)? e.touches[0].clientX : e.clientX) - ex0;
					t.translate(x0 + dx, 0);
				} else {
					if (e.touches && e.touches.length > 0) {
						dx = e.touches[0].clientX - ex0;
						dy = e.touches[0].clientY - ey0;
					} else if (e.clientX !== null ) {
						dx = e.clientX - ex0;
						dy = e.clientY - ey0;
					}
					t.translate(x0 + dx, y0 + dy);
				}
			};
						
			var touchEnd = function(e) { //log('touchEnd '+(self.dragOn?'1':'0'));
				swiped();
				self.removeEventListener(TOUCH_MOVE, touchMove);
				self.removeEventListener(TOUCH_END, touchEnd);
				return false;
			};
			
			var dragEnd = function(e) {
				e.preventDefault();
				swiped();
				$(document).off('mousemove.addswipe mouseup.addswipe');
				return false;
			};
			
			var touchMove = function(e) { //log('touchMove');
				e.preventDefault();
				move(e);
				return false;
			};
			
			var dragMove = function(e) {
				e.preventDefault();
				move(e.originalEvent);
				return false;
			};
			
			var touchStart = function(e) { //log('touchStart '+(self.dragOn?'1':'0'));
				if (!e.touches) {
					ex0 = e.clientX;
					ey0 = e.clientY;
				} else if (e.touches.length > 1) {
					// multi finger flick
					return true;
				} else {
					ex0 = e.touches[0].clientX;
					ey0 = e.touches[0].clientY;
				}
				startSwipe();
				self.addEventListener(TOUCH_MOVE, touchMove);
				self.addEventListener(TOUCH_END, touchEnd);
				return true;
			};
			
			var mouseDown = function(e) { //log('mouseDown '+(self.dragOn?'1':'0'));
				ex0 = e.originalEvent.clientX;
				ey0 = e.originalEvent.clientY;
			};
			
			var dragStart = function(e) { //log('dragStart '+(self.dragOn?'1':'0'));
				e.preventDefault();
				mouseDown(e);
				startSwipe();
				t.on('click.addswipe', clicked);
				$(document).on({
					'mousemove.addswipe': dragMove,
					'mouseup.addswipe': dragEnd
				});
				return false;
			};
			
			var startSwipe = function() {
				t.removeClass('smooth');
				self.dragOn = true;
				tt = new Date().getTime();
				cw = cw || tp.outerWidth();
				ew = t.outerWidth();
				eh = t.outerHeight();
				cax = eh <= ch;
				x0 = t.data('tr_x') || 0;
				y0 = cax? 0 : (t.data('tr_y') || 0);
				dx = dy = 0;
				//log('x0 = ' + x0);
				mx = (ew > cw)? Math.round((ew - cw * (1 - settings.oversizeTreshold)) / 2) : 0;
			};
						
			var swiped = function() { //log('swiped '+(self.dragOn?'1':'0'));
				//log('x0='+x0+' dx='+dx);
				
				if (cax && !mx && (Math.abs(dx) < settings.treshold)) {
					
					// Small move -> click
					self.dragOn = null;
					t.translate(0, 0);
					t.trigger('click');
					
				} else {
					
					var dt = (new Date().getTime() - tt),
						tx = x0 + dx + (dx * 300 / dt),
						ty = cax? 0 :  (y0 + dy + (dy * 300 / dt));
					//speed = 1000 * (cax? dx : Math.sqrt(dx * dx + dy * dy)) / ;
					//mto = setInterval(moveExtra, 50);
					t.translate(tx, ty, 'smooth');
					
					//move(Math.round(333 * dx / ts), cax? 0 : Math.round(333 * dy / ts), 500);
					//log('swiped:'+Math.round(tx)+' / '+mx);
					if ( tx < -mx ) {
						if ( $.isFunction(leftFn) ) {
							//log('leftFn');
							leftFn.call(self); 
						}
					} else if ( tx > mx ) {
						if ( $.isFunction(rightFn) ) {
							//log('rightFn');
							rightFn.call(self);
						}
					} else {
					}
					
				}
				
				setTimeout(function() { 
					self.dragOn = null;
				}, 100);
				
				return false;
			};
			
			t.attr('draggable', 'true');
			
			if (document.touchMode) {
				self.addEventListener(TOUCH_START, touchStart);
			} else {
				t.on({
					'dragstart.addswipe': dragStart,
					'mousedown.addswipe': mouseDown
				});
			}
			
			var dragCancel = function() { //log('dragCancel '+(self.dragOn?'1':'0'));
				setTimeout(function() { 
					self.dragOn = null;
				}, 20);
				t.translate(0, 0, 'smooth');
				return false;
			};
			
			t.on('dragcancel.addswipe', dragCancel);
			
			var unSwipe = function() { //log('unSwipe '+(self.dragOn?'1':'0'));
				setTimeout(function() { 
					self.dragOn = null;
				}, 20);
				t.removeAttr('draggable');
				if ( document.touchMode ) {
					self.removeEventListener(TOUCH_MOVE, touchMove);
					self.removeEventListener(TOUCH_END, touchEnd);
					self.removeEventListener(TOUCH_START, touchStart);
				} else {
					t.off('.addswipe');
					$(document).off('.addswipe');
				}
			};
			
			// Unswipe - removing the swipe event
			t.on('unswipe.addswipe', unSwipe);
			
			// No select
			t.on('selectstart.addswipe', noAction); 

		});
	};
	
	$.fn.addSwipe.defaults = {
		treshold: 40,
		oversizeTreshold: 0.2,
		margin: 15
	};

})(jQuery);

/*
(function($) {
	
	// Easing function by George Smith
	$.extend( jQuery.easing, {
		easeOutCubic: function (x,t,b,c,d) {
			return c*((t=t/d-1)*t*t+1)+b;
		}
	});
	
	$.fn.addSwipe = function( leftFn, rightFn, settings ) {
		
		settings = $.extend( {}, $.fn.addSwipe.defaults, settings );
		
		var effect = 'easeOutCubic';
		
		return this.each(function() {
			
			var t = $(this);
			var ex = 0, ey = 0,	// event coords
				tx = 0, ty = 0,	// layer coords
				x0, y0,		// original
				tt,			// touch time
				cw, ch,		// window width
				cr, cl,		// swipe left / right boundary
				tw, th,		// layer dimensions
				xm, ym,		// min left / top
				cax;		// constrain axis
				
			t.attr('draggable', 'true');
			
			var getPos = function(e) {
				if ( e.touches && e.touches.length > 0 ) {
					ex = e.touches[0].clientX;
					ey = e.touches[0].clientY;
				} else if ( e.clientX ) {
					ex = e.clientX;
					ey = e.clientY;
				}
			};
			
			var setPos = function(e) {
				getPos(e);
				tx = ex;
				ty = ey;
			};
			
			var dragMove = function(e) {
				e.preventDefault();
				if ( !tx ) {
					setPos(e);
				} else {
					getPos(e);
					if ( cax ) {
						t.css({
							left:  ex - tx + x0
						});
					} else {
						t.css({
							left: ex - tx + x0,
							top: ey - ty + y0
						});
					}
				}
				return false;
			};
			
			var noAction = function(e) {
				e.preventDefault();
				return false;
			};
			
			var dragStop = function(e) {
				e.preventDefault();
				getPos(e);
				var ts = new Date().getTime() - tt; 
				var dx = ex - tx;
				
				if ( document.touchMode ) {
					t[0].removeEventListener(TOUCH_MOVE, dragMove);
					t[0].removeEventListener(TOUCH_END, dragStop);
				} else {
					$(document).off({
						'mousemove': dragMove,
						'mouseup click': dragStop
					});
				}
				
				if ( tw < cw ) {
					if ( Math.abs(dx) < settings.treshold ) {
						if ( cax ) {
							t.animate({
								left: x0
							}, 200);
						} else {
							t.animate({
								left: x0,
								top: y0
							}, 200);
						}
						t.trigger('click');
					} else {
						if ( cax ) {
							t.animate({
								left: t.position().left + Math.round(333 * (ex - tx) / ts)
							}, 500, effect);
						} else {
							t.animate({
								left: t.position().left + Math.round(333 * (ex - tx) / ts),
								top: t.position().top + Math.round(333 * (ey - ty) / ts)
							}, 500, effect);
						}	
						if ( dx < 0 ) {
							if ( $.isFunction(leftFn) ) {
								leftFn.call(); 
							}
						} else {
							if ( $.isFunction(rightFn) ) {
								rightFn.call();
							}
						}
					}
				} else {
					
					if ( cax ) {
						t.animate({
							left: Math.minMax(xm, t.position().left + Math.round(333 * (ex - tx) / ts), settings.margin)
						}, 500, effect);
					} else {
						t.animate({
							left: Math.minMax(xm, t.position().left + Math.round(333 * (ex - tx) / ts), settings.margin),
							top: Math.minMax(ym, t.position().top + Math.round(333 * (ey - ty) / ts), settings.margin)
						}, 500, effect);
					}
						
					var tx1 = t.position().left;
					if ( dx < 0 ) {
						if ( ((tx1 + tw) < cr) && $.isFunction(leftFn) ) {
							leftFn.call(); 
						}
					} else {
						if ( (tx1 > cl) && $.isFunction(rightFn) ) {
							rightFn.call();
						}
					}					
				}
				
				return false;
			};
			
			var touchStart = function(e) {
				e.preventDefault();
				if (!e.touches || e.touches.length > 1 || t.is(':animated')) {
					// >= 2 finger flick
					return true;
				}
				setPos(e);
				dragStart(e);
				return false;
			};
			
			var dragStart = function(e) {
				e.preventDefault();
				t.stop(true, false);
				x0 = t.position().left;
				y0 = t.position().top;
				tt = new Date().getTime();
				cw = t.parent().outerWidth(); 
				ch = t.parent().outerHeight();
				cr = cw * (1 - settings.oversizeTreshold);
				cl = cw * settings.oversizeTreshold;
				tw = t.outerWidth();
				th = t.outerHeight();
				xm = cw - settings.margin - tw;
				ym = ch - settings.margin - th;
				cax = th <= ch;
				
				if ( document.touchMode ) {
					t[0].addEventListener(TOUCH_MOVE, dragMove);
					t[0].addEventListener(TOUCH_END, dragStop);
					return true;
				} else {
					t.off('click');
					t.click(noAction);
					$(document).on({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
					e.cancelBubble = true;
					return false;
				}
			};
			
			if ( document.touchMode ) {
				this.addEventListener(TOUCH_START, touchStart);
			} else {
				t.on({
					'dragstart': dragStart,
					'mousedown': setPos
				});
			}
			
			var dragcancel = function() {
				t.stop(true, false).animate({
					left: x0,
					top: y0
				}, 200);
				return false;
			};
			
			t.on('dragcancel', dragcancel);
			
			var unswipe = function() {
				if ( document.touchMode ) {
					t[0].removeEventListener(TOUCH_MOVE, dragMove);
					t[0].removeEventListener(TOUCH_END, dragStop);
					t[0].removeEventListener(TOUCH_START, touchStart);
				} else {
					if ( $.isFunction(t.noAction) ) {
						t.off(noAction);
					}
					if ( $.isFunction(t.dragStart) ) {
						t.off(dragStart);
					}
					$(document).off({
						'mousemove': dragMove,
						'mouseup': dragStop
					});
				}
			};
			
			t.on('unswipe', unswipe);
			
			t.on('selectstart', noAction); 

		});
	};
	
	$.fn.addSwipe.defaults = {
		treshold: 40,
		oversizeTreshold: 0.15,
		margin: 15
	};

})(jQuery);
*/

/*	
 *	alignTo() :: align a layer to another
 *
 *	Usage: $(element).alignTo( target, options);
 *	options: gap, posX, posY, toX, toY
 */

(function($) {
		
	var ALIGN_LEFT = 0,  ALIGN_TOP = 0,
		ALIGN_CENTER = 1, ALIGN_MIDDLE = 1,
		ALIGN_RIGHT = 2, ALIGN_BOTTOM = 2;
	
	$.fn.alignTo = function( el, settings ) {
		
		settings = $.extend( {}, $.fn.alignTo.defaults, settings );
		
		if (typeof el === 'string') {
			el = $(el);
		}
		if (!(el instanceof $ && el.length)) {
			return;
		}
			
		var to = el.offset(),
			tw = el.outerWidth(),
			th = el.outerHeight(),
			ww = $(window).width(),
			wh = $(window).height();
					
		return $(this).each( function() {
			var e = $(this);
			e.css('maxHeight', 'none');
			
			var	w = e.outerWidth(),
				h = e.outerHeight(),
				rx = Math.round(to.left + settings.pos[2] * tw / 2 + 
					(settings.pos[2] - 1) * settings.gap),
				ry = Math.round(to.top + settings.pos[3] * th / 2 + 
					(settings.pos[3] - 1) * settings.gap),
				l = Math.round(rx - settings.pos[0] * w / 2),
				t = Math.round(ry - settings.pos[1] * h / 2);
			
			if ( t < 0 || (t + h) > wh ) {
				// Overflow - vertical
				if ( settings.pos[2] !== ALIGN_CENTER ) {
					// Aligned to sides, just make sure it won't hang above
					t = ((2 * t + h) > wh)? (wh - h) : 0;
				} else if ( settings.pos[3] === ALIGN_TOP ) {
					if ( wh > (to.top * 2 + th) ) {
						// More space below :: moving below
						t = to.top + th + settings.gap;
					}
				} else if ( settings.pos[3] === ALIGN_BOTTOM ) { 
					if ( wh < (to.top * 2 + th) ) {
						// More space above :: move above
						t = Math.max(0, to.top - h - settings.gap);
					}
				}
				if ( t < 0 ) {
					t = 0;
				}
				if ( (t + h) > wh ) {
					// Still oversized
					e.css({
						overflow: 'auto',
						maxHeight: wh - t - (parseInt(e.css('paddingTop'), 10) + parseInt(e.css('paddingBottom'), 10))
					});
				}
			}
						
			if ( l < 0 || (l + w) > ww ) {
				// Overflow - horizontal
				if ( settings.pos[3] !== ALIGN_MIDDLE ) {
					// Not aligned to vertical center
					l = ((2 * l + w) > ww)? (ww - w) : 0;
				} else if ( settings.pos[2] === ALIGN_LEFT ) {
					if ( ww > (to.left * 2 + tw) ) {
						// More space right :: move right
						l = to.left + tw + settings.gap;
					}
				} else if ( settings.pos[2] === ALIGN_RIGHT ) { 
					if ( ww < (to.left * 2 + tw) ) {
						// More space left :: move left
						l = Math.max(0, to.left - w - settings.gap);
					}
				}
				if ( l < 0 ) {
					l = 0;
				}
				if ( (l + w) > ww ) {
					// Still oversized
					e.css({
						overflow: 'auto',
						maxWidth: ww - l - (parseInt(e.css('paddingLeft'), 10) + parseInt(e.css('paddingRight'), 10))
					});
				}
			} 
			
			e.css({
				position: 'absolute',
				left: l, 
				top: t 
			});
			
		});
	};

	$.fn.alignTo.defaults = {
		gap: 5,
		pos: [ ALIGN_CENTER, ALIGN_BOTTOM, ALIGN_CENTER, ALIGN_TOP ]
/*		posX: ALIGN_CENTER,
		posY: ALIGN_BOTTOM,
		toX: ALIGN_CENTER,
		toY: ALIGN_TOP
*/	};
	
})(jQuery);

/*	
 *	addPlayer() :: adds jPlayer video player component
 *
 *	author: Laszlo Molnar (c) 2013
 *
 *	Usage: $(element).addPlayer( options, text )
 *	Options:
		id: 'jp_container_',			// ID for the container element
		backgroundColor: '#000000',		// Background color
		resPath: '',					// Path to 'res' folder
		swf: 'Jplayer.swf',				// Name of the SWF player
		relativeUrl: false,				// Allow using relative URLs
		solution: 'html,flash',			// Priority
		auto: false,					// Auto start
		loop: false,					// Loop playback
		keyboard: true,					// Use "space" key for play toggle
		size: {							// Player size
			width: '100%',
			height: '100%'
		}
 */

(function($) {
		
	$.fn.addPlayer = function( settings ) {
		
		if (typeof $.fn.jPlayer === UNDEF) {
			return;
		}
		
		settings = $.extend( {}, $.fn.addPlayer.defaults, settings );
		
		//text = $.extend( {}, $.fn.addPlayer.text, text );
		var text = getTranslations($.fn.addPlayer.text);
		
		var macfox = navigator.userAgent.indexOf('Firefox') >= 0 && navigator.platform.indexOf('Mac') >= 0;
		
		// Class names
				
		var sel = {
			cont: 'jp-cont',
			mini: 'jp-mini',
			audio: 'jp-audio',
			video: 'jp-video',
			playerType: 'jp-type-single',
			player: 'jp-jplayer',
			title: 'jp-title',
			progress: 'jp-progress',
			controls: 'jp-controls-holder',
			startStop: 'jp-startstop',
			volume: 'jp-volume',
			times: 'jp-times',
			toggles: 'jp-toggles',
			warning: 'jp-warning',
			// defined in jPlayer
			videoPlay: 'jp-video-play',
			play: 'jp-play',
			pause: 'jp-pause',
			stop: 'jp-stop',
			seekBar: 'jp-seek-bar',
			playBar: 'jp-play-bar',
			mute: 'jp-mute',
			unmute: 'jp-unmute',
			volumeBar: 'jp-volume-bar',
			volumeBarValue: 'jp-volume-bar-value',
			volumeMax: 'jp-volume-max',
			currentTime: 'jp-current-time',
			duration: 'jp-duration',
			fullScreen: 'jp-full-screen',
			restoreScreen: 'jp-restore-screen',
			repeat: 'jp-repeat',
			repeatOff: 'jp-repeat-off',
			gui: 'jp-gui',
			noSolution: 'jp-no-solution',
			playing: 'playing'
		};
		
		// Compiling interface
		
		var getInterface = function( audio ) {
			var html;
			
			var adda = function(name) {
				return '<a class="'+sel[name]+'" title="'+text[name]+'">'+text[name]+'</a>';
			};
			
			// Progress bar
			html = '<div class="'+sel.progress+'"><div class="'+sel.seekBar+'"><div class="'+sel.playBar+'"></div></div></div>';
			
			// Controls
			html += '<div class="'+sel.controls+'">';
			
				// Start/Stop (Prev/Next)
				html += '<div class="'+sel.startStop+'">' + adda('play') + adda('pause') + adda('stop') + '</div>';
				
				// Volume
				html += '<div class="'+sel.volume+'">' + adda('mute') + adda('unmute') + 
					'<div class="'+sel.volumeBar+'"><div class="'+sel.volumeBarValue+'"></div></div>' + '</div>';
					
				// Times: Current | Total
				html += '<div class="'+sel.times+'"><div class="'+sel.currentTime+'"></div><div class="'+sel.duration+'"></div></div>';
				
				// Toggle buttons
				html += '<div class="'+sel.toggles+'">' + (audio? '' : (adda('fullScreen') + adda('restoreScreen'))) +
					adda('repeat') + adda('repeatOff') + '</div>';
			
			html += '</div>';
			return html;
		};
		
		// Fix gui to match to container's padding
		
		var fixPadding = function( c ) {
			var pt = c.css('paddingTop'),
				pl = c.css('paddingLeft'),
				pr = c.css('paddingRight'),
				pb = c.css('paddingBottom');
				
			c.find('.' + sel.gui).css({
				bottom: pb,
				left: pl,
				right: pr
			});
			c.find('.' + sel.title).css({
				top: pt,
				left: pl,
				right: pr
			});
		};
		
		// Compiling GUI
		
		var createPlayer = function( to, title, audio ) {
			
			// Required to be able to use absolute positioned GUI elements
			if ( to.css('position') !== 'absolute' && to.css('position') !== 'fixed' ) {
				to.css({
					position: 'relative'
				});
			}
			
			to.css({
				overflow: 'hidden'
			});
			
			var pl, el = $('<div class="' + (audio? sel.audio : sel.video) + '"></div>').appendTo(to);

			// Player type wrap element
			el = $('<div class="' + sel.playerType + '"></div>').appendTo(el);
			
			// Adding player box
			pl = $('<div class="' + sel.player + '"></div>').appendTo(el);
			
			// Play button overlay
			el.append('<div class="' + sel.videoPlay + '"><a>' + text.play + '</a></div>');
			
			// Title
			if ( title ) {
				el.append('<div class="' + sel.title + '"><ul><li>' + title + '</li></ul></div>');
			}
			
			// Interface
			el.append('<div class="' + sel.gui + '">' + getInterface( audio ) + '</div>');
			
			// Adding "javascript:void" links to buttons
			el.find('.' + sel.gui + ' a').attr('href', NOLINK);
			
			// Hiding the control bar in full screen by default
			if ( !document.touchMode && to.hasClass(sel.fullScreen) ) {
				el.find('.' + sel.gui).hide();
			}
			
			// No solution layer
			to.append('<div class="' + sel.noSolution + '">' + text.unsupportedMediaFormat + '</div>');

			// Fix padding
			fixPadding( to );
										
			return pl;
		};
		
		// Pause request
		
		var pauseFn = function() {
			var p;
			if ( (p = $(this).data('media')) ) {
				p.jPlayer('pause');
			}
			return false;
		};
		
		// Destroy request
		
		var destroyFn = function() {
			var p;
			if ( (p = $(this).data('media')) ) {
				p.jPlayer('destroy');
			}
			$(window).off('keydown', keyhandler);
			return false;
		};
		
		// Stop request
		
		var stopFn = function() {
			var p;
			if ( (p = $(this).data('media')) ) {
				p.jPlayer('stop');
			}
			return false;
		};
		
		// Play request
		
		var playFn = function() {
			var p;
			if ( (p = $(this).data('media')) ) {
				p.jPlayer('play');
			}
			return false;
		};
		
		// Keyboard handler hooked to the first media player element
		
		var firstPlayer = $(this).eq(0);
		var keyhandler = function(e) {
			if ( (document.activeElement && (document.activeElement.nodeName === 'INPUT' || 
					document.activeElement.nodeName === 'TEXTAREA')) ) {
				return true;
			}
		
			var k = e? e.keyCode : window.event.keyCode;
			
			if ( k === 32 ) {
				firstPlayer.find('.' + sel.player).jPlayer( firstPlayer.data(sel.playing)? 'pause' : 'play' );
				return false;
			}
			return true;
		};
		
		// Check Audio
		
		var checkAudio = function( src ) {
			return settings.hasOwnProperty('audio') ? settings.audio : ('.mp3.m4a.f4a.rtmpa'.indexOf(src.getExt()) > 0);
		};
		
		// Check if any playing is on
		
		var checkAnyPlay = function() {
			$('.' + sel.cont).each(function() {
				if ( $(this).data(sel.playing) ) {
					return true;
				}
			});
			return false;
		};
				
		// Get the media format...
		
		var getFormat = function( src ) {
			
			// Finding or guessing the format
			var format,
				av =  checkAudio( src )? 'a' : 'v';
			
			switch (src.getExt()) {
				case 'mp3':
					format = 'mp3';
					break;
				case 'mp4': 
					format = 'm4' + av;
					break;
				case 'ogg': 
					format = 'og' + av;
					break;
				case 'webm':
					format = 'webm' + av;
					break;
				case 'flv':
				case 'f4a':
				case 'f4v':
					format = 'fl' + av;
					break;
				case 'rtmp':
					format = 'rtmp' + av;
					break;
				default:
					format = null;
			}
			
			return format;
		};
		
		// Main loop
		
		return this.each(function() {
			
			var cont = $(this),
				audio,
				format,
				enableAuto,
				autoHide,
				folder = settings.folder || '',
				id, src, title, poster, elem, pl, curr = 0;
						
			if ( settings.elem ) {
				
				// Reading source, title and poster from a link element
				elem = $(this).find(settings.elem);
				src = elem.attr('href');
				title = elem.attr('title');
				var img = elem.find('img:first');
				if ( img.length ) {
					poster = img.attr('src');
					if ( !title ) {
						title = img.attr('alt');
					}
				} else {
					poster = title = '';
				}
				
			} else {
				
				// Provided through call parameters
				src = settings.src;
				title = settings.title || '';
				poster = settings.poster || '';
				
				elem = $('<a href="' + src + '"' +
					(title? (' title="' + title + '"') : '') + 
					'>' + (poster? ('<img src="' + poster + '">') : '') + 
					'</a>').appendTo($(this));
			}
						
			// Local Flash warning
			if ( LOCAL ) {
				var w = $('<div class="' + sel.warning + '">' + text.localFlashWarning + '</a></div>').appendTo(elem);
				elem.css('position', 'relative');
				w.hide();
				setTimeout(function() {
					w.fadeIn();
				}, 2000);
			}			

			if ( !src ) {
				return;
			}
			
			// Can the media auto started?
			enableAuto = settings.auto && !settings.lowPriority && !checkAnyPlay();
			
			// Playlist?
			if ( src.indexOf('::') > 0 ) {
				src = src.split('::');
				// Checking the first element
				audio = checkAudio( src[0] );
				format = getFormat( src[0] );
			} else {
				audio = checkAudio( src );
				format = getFormat( src );
			}
			
			// Adding or reading container id
			if ( !this.id ) {
				this.id = settings.id + $.fn.addPlayer.id++;
			}	
			id = '#' + this.id;
			
			$(cont).addClass(sel.cont);
			if ( settings.mini ) {
				$(cont).addClass(sel.mini);
			}
			/*
			if ( !audio && settings.fullScreen ) {
				$(cont).addClass(sel.fullScreen);
			}
			*/
			// Creating the structure
			pl = createPlayer( cont, (settings.showTitle? title : ''), audio );
			
			// Getting current media
			var getMedia = function() {
				
				// Media URL
				var sm = {},
					csrc,
					format,
					base = settings.relativeUrl? '' : location.href.substring(0, location.href.lastIndexOf('/') + 1);
				
				if ( $.isArray( src ) ) {
					if ( curr >= src.length ) {
						curr = 0;
					}
					// Playlist
					csrc = src[curr];
				} else {
					csrc = src;
					if ( poster ) {
						sm.poster = (base + folder + poster).fixUrl();
					}
				}
				
				format = getFormat(csrc);
				sm[format] = (base + folder + csrc).fixUrl();
				
				return sm;
				
			};
			
			// Saving play status
			
			var saveStatus = function() {
				if ( $.cookie ) {
					var tm = cont.find('.' + sel.currentTime).text().split(':');
					if (tm.length > 2 ) {
						tm = (parseInt(tm[0], 10) * 60 + parseInt(tm[1], 10)) * 60 + parseInt(tm[2], 10);
					} else {
						tm = parseInt(tm[0], 10) * 60 + parseInt(tm[1], 10);
					}
					$.cookie('jp_' + cont[0].id, (cont.data(sel.playing)? '1':'0') + 
						'::' + tm + 
						'::' + pl.jPlayer('option', 'volume').toString().substring(0,5) +
						((curr !== UNDEF)? ('::' + curr) : '')
					);
				}
			};
			
			// Loading play status
			
			var loadStatus = function(el) {
				if ( $.cookie ) {
					var c = $.cookie('jp_' + el[0].id);
					if ( c ) {
						c = c.split('::');
						return { 
							playing: c[0] === '1',
							time: parseInt(c[1] || 0, 10),
							volume: parseFloat(c[2] || 0.8),
							curr: parseInt(c[3] || 0, 10)
						};
					}
				}
				return null;
			};
			
			/*
			if ( $.cookie ) {
				var f = $.cookie('jp_fs');
				$(cont).find('.' + sel.fullScreen).on('click', function() {
					$.cookie('jp_fs', 'on');
					return true;
				});
				$(cont).find('.' + sel.restoreScreen).on('click', function() {
					$.cookie('jp_fs', 'off');
					return true;
				});
				if ( f ) {
					settings.fullScreen = f === 'on';
				}
			}
			*/
			
			// Auto hide if not audio and not Firefox on Mac (fixing a bug)
			autoHide = !audio && !macfox;
			
			cont.on('setEndedFn', function(e, fn) {
				if ( fn && $.isFunction(fn) ) {
					settings.ended = fn;
				} else {
					settings.ended = null;
				}
			});
			
			// Calling jPlayer
			pl.jPlayer({
				cssSelectorAncestor: id,
				backgroundColor: settings.backgroundColor,
				supplied: format,
				swfPath: settings.resPath + '/' + settings.swf,
				solution: settings.solution,
				size: {
					width: '100%',
					height: '100%'
				},
				fullWindow: !audio && settings.fullScreen,
				preload: 'auto',
				loop: settings.loop,
				volume: settings.volume,
				autohide: {
					restored: autoHide,
					full: autoHide
				},
				ready: function() {
					
					var t = $(this),
						st = settings.saveStatus? loadStatus(cont) : null;
					
					// Saving reference to player in the container element
					cont.data('media', t);
					
					// Save status on unload, set current
					if ( settings.saveStatus ) {
						$(window).on('unload', saveStatus);	
						if ( st ) {
							curr = st.curr;
						}
					}
					
					// Setting media source
					var sm = getMedia();
					
					// Hiding original poster element, showing GUI
					if ( elem ) {
						elem.hide();
					}
					
					// Hiding the control bar in full screen by default, showing otherwise
					// cont.find('.' + sel.gui).toggle(!(document.touchMode || audio));
					
					t.jPlayer('setMedia', sm);
										
					// Adding events to container
					cont.on({
						play: playFn,
						pause: pauseFn,
						stop: stopFn,
						destroy: destroyFn
					});
					
					// Auto start
					if ( settings.saveStatus && st ) {
						t.jPlayer('volume', st.volume);
						t.jPlayer(st.playing? 'play' : 'pause', st.time);
					} else if ( settings.auto && !document.touchMode ) {
						t.jPlayer('play');
					}
					
					// Key handler
					if ( !settings.lowPriority ) {
						$(window).on('keydown', keyhandler);
					}
				},
				// Playing indicator on container element
				play: function() { 
					// Avoid other jPlayers playing together
					$(this).jPlayer('pauseOthers');
					cont.data(sel.playing, true);
					if ( document.touchMode ) {
						settimeout(function() {
							cont.find('.' + sel.title).fadeOut(1000);
						}, 600);
					}
				},
				pause: function() {
					cont.data(sel.playing, false);
				},
				stop: function() {
					cont.data(sel.playing, false);
					if ( document.touchMode ) {
						cont.find('.' + sel.title).fadeIn(300);
					}
				},
				ended: function() {
					if ( $.isArray(src) && ((curr + 1) < src.length || settings.loop) ) {
						curr = (curr + 1) % src.length;
						$(this).jPlayer('setMedia', getMedia());
						if ( settings.auto ) {
							$(this).jPlayer('play');
						}
					} else {
						cont.data(sel.playing, false);
						if ( $.isFunction(settings.ended) ) {
							settings.ended.call();
						}
					}
				}
			});
		});
	};
	
	$.fn.addPlayer.id = 0;

	$.fn.addPlayer.defaults = {
		id: 'jp_container_',
		backgroundColor: '#000000',
		resPath: '',
		swf: 'Jplayer.swf',
		relativeUrl: false,
		solution: 'html,flash',
		volume: 0.8,
		auto: false,
		loop: false,
		keyboard: true,
		lowPriority: false,
		saveStatus: false,
		mini: false,
		fullScreen: false,
		showTitle: false,
		size: {
			width: '100%',
			height: '100%'
		}
	};
	
	$.fn.addPlayer.text = {
		play: 'play',
		pause: 'pause',
		stop: 'stop',
		mute: 'mute',
		unmute: 'unmute',
		fullScreen: 'full screen',
		restoreScreen: 'restore screen',
		repeat: 'repeat',
		repeatOff: 'repeat off',
		localFlashWarning: 'Local Flash playback is possibly blocked by Flash security rules. Test videos in the uploaded album!', 
		unsupportedMediaFormat: '<span>Unsupported media format</span>You might need to either update your browser or the <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a> or use another browser to play this media.'
	};

})(jQuery);

/*	
 *	addMap() :: preprocessing Google Maps map
 *
 *	author: Laszlo Molnar (c) 2013
 *
 *	Usage: $(element).addMap( options )
 *
 *	Options:
		type: 'roadmap',		// 'roadmap', 'Satellite', 'Hybrid', 'Terrain'
		zoom: 16,				// 0 .. 20
		range: 30,				// restricting the number of markers :: 30 means display markers from curr - 30 to curr + 30
		resPath:				// path to marker graphics
		markers:				// array of markers to display
		curr:					// current marker (center map here)
		click:					// function to be called upon marker click
 */

(function($) {
		
	// getLatLng :: returns google.maps position from formatted string "lat,lon" or Array(lat, lon)
	
	$.getLatLng = function( p ) { 
		if ( typeof google === UNDEF || p == null ) {
			return null;
		}
		if ( typeof p === 'string' ) {
			p = p.split(',');
			return new google.maps.LatLng(parseFloat(p[0]) || 0.0, parseFloat(p[p.length-1]) || 0.0);
		}
		return new google.maps.LatLng(p[0], p[1]);
	};


	$.fn.addMap = function( settings ) {
		
		if ( typeof google === UNDEF || !google.maps ) { 
			return this;
		}
		
		settings = $.extend( {}, $.fn.addMap.defaults, settings );
		
		var markerCurr = settings.resPath + '/marker-curr.png',
			markerEtc = settings.resPath + '/marker.png',
			miCurr = new google.maps.MarkerImage(markerCurr, new google.maps.Size(17,24), new google.maps.Point(0,0), new google.maps.Point(8,24)),
			miEtc = new google.maps.MarkerImage(markerEtc, new google.maps.Size(17,24), new google.maps.Point(0,0), new google.maps.Point(8,24)),
			miShadow = new google.maps.MarkerImage(settings.resPath + '/marker-shadow.png', new google.maps.Size(24,24), new google.maps.Point(0,0), new google.maps.Point(8,24)); 
		
		return this.each(function() {
			var t = $(this), ll, label, map, tmp, to, c, 
				markers = [], first, curr;
			
			t.readData( settings, "type,zoom,map,label,resPath,markers" );
			
			var adjust = function() {
				if ( t && t.data('fresh') ) {
					if ( map && t.is(':visible') && !t.parents(':hidden').length && t.width() && t.height() ) {
						clearTimeout(to);
						t.width(t.parent().width());
						google.maps.event.trigger( map, 'resize' );
						map.setCenter( ll );
						t.data('fresh', false);
					} else {
						to = setTimeout(adjust, 200);
					}
				}
			};
			
			if ( tmp && tmp.length ) {
				tmp.remove();
			}
			
			tmp = $('<div>').css({ 
				position: 'absolute', 
				top: '-9000px', 
				width: t.width(), 
				height: t.height() 
			}).appendTo('body');
			
			t.data('fresh', true).on({
				adjust: adjust,
				destroy: function() {
					// No remove function with Google Maps?
					map.getParentNode().removeChild(map);
					$(window).off('resize', adjust);
				}
			});
			
			if ( settings.markers && settings.markers.length && settings.curr != null ) {
				ll = settings.markers[settings.curr].map;
			} else if ( settings.map ) {
				ll = $.getLatLng(settings.map);
				label = settings.label;
			} else { 
				return;
			}
			
			// reading user prefs
			
			if ( (c = $.cookie('mapType')) !== null ) { 
				settings.type = c;
			}
			
			if ( (c = $.cookie('mapZoom')) !== null ) {
				settings.zoom = parseInt(c, 10) || settings.zoom;
			}
			
			// Leaving 20ms to get the DOM ready before adding the Map
			
			setTimeout( function() {
				
				var m, m0 = new google.maps.Map(
					tmp[0], {
						zoom: settings.zoom, 
						center: ll,
						scrollwheel: false,
						mapTypeId: settings.type.toLowerCase() 
					}
				);				
				
				google.maps.event.addListener(m0, 'maptypeid_changed', function() { 
					$.cookie('mapType', $.fn.addMap.defaults.type = m0.getMapTypeId(), 3600); 
				});
				
				google.maps.event.addListener(m0, 'zoom_changed', function() { 
					$.cookie('mapZoom', $.fn.addMap.defaults.zoom = m0.getZoom(), 3600); 
				});
				
				if ( settings.markers && settings.markers.length > 1 ) {
					var i, mo, mk, 
						first = Math.max(settings.curr - settings.range, 0),
						mx = Math.min(settings.curr + settings.range, settings.markers.length);
					
					var clicked = function() {
						settings.click.call(this); 
					};
					
					for (i = first; i < mx; i++) {
						
						mk = settings.markers[i];
						mo = { 
							position: mk.map, 
							map: m0, 
							title: mk.label,
							icon: (i === settings.curr)? miCurr : miEtc,
							shadow: miShadow,
							zIndex: (i === settings.curr)? 999 : i
						};
												
						// Adding marker
						m = new google.maps.Marker(mo);
						
						// Adding click function
						if ( $.isFunction(settings.click) && mk.link ) {
							m.link = mk.link;
							google.maps.event.addListener(m, 'click', clicked);
						}
						
						// Saving
						markers.push( m );
					}
				} else {
					m = new google.maps.Marker( $.extend({
						position: ll, 
						map: m0, 
						title: label
					}, markerCurr ));
				}
				
				tmp.css({ 
					top: 0 
				}).appendTo(t);
				
				map = m0;
				curr = settings.curr;
				
				// Adding setactive function
				t.on('setactive', function(e, n) {
					//log( 'n:'+n+' ['+first+'-'+curr+'-'+markers.length+']' );
					if ( $.isArray(markers) && markers.length ) {
						if ( curr >= first ) {
							markers[curr].setIcon(markerEtc);
							markers[curr].setZIndex(curr);
						}
						if ( typeof n !== UNDEF && n >= first && n < first + markers.length ) {
							markers[n - first].setIcon(markerCurr);
							markers[n - first].setZIndex(9999);
							map.setCenter( markers[n - first].position );
							curr = n;
						} else {
							curr = -1;
						}
					}
				});

			}, 20 ); 
			
			$(window).on('resize', function() {
				clearTimeout(to); 
				t.data('fresh', true);
				to = setTimeout(adjust, 100);
			});
		});
	};
	
	$.fn.addMap.defaults = {
		type: 'roadmap',
		zoom: 16,
		range: 30,
		resPath: ''
	};
	
})(jQuery);

/*	
 *	fullScreen() :: makes an element full-screen or cancels full screen
 *
 *	Usage: $(element).fullScreen( [true | false] );
 *
 */

(function($) {
	
	var isFullscreen = function() {
		return document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement;
	};
	
	var requestFullscreen = function( e ) {
		if (!isFullscreen()) {
			if (e.requestFullscreen) {
				e.requestFullscreen();
			} else if (e.webkitRequestFullscreen) {
				e.webkitRequestFullscreen();
			} else if (e.mozRequestFullScreen) {
				e.mozRequestFullScreen();
			} else if (e.msRequestFullscreen) {
				e.msRequestFullscreen();
			}
		}
	};
	
	var exitFullscreen = function() {
		if (isFullscreen()) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	};
	
	$.fn.fullScreen = function( v ) {
		
		if (document.fullscreenEnabled || 
			document.webkitFullscreenEnabled || 
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled
		) {
			// no state supplied :: returning the fullscreen status
			if ( typeof v === UNDEF ) {
				return isFullscreen();
			} else if ( v ) {
				requestFullscreen(this[0]);
			} else {
				exitFullscreen();
			}
			
		} else {
			return false;
		}
		
	};

})(jQuery);

/*
 * Simple decryption
 */

var xDecrypt = function(c) {
	
	if (!typeof this === 'String') {
		return '';
	}
	var xs = [0x93,0xA3,0x57,0xFE,0x99,0x04,0xC6,0x17];
	var cl = c.length,
		sl = Math.ceil(cl / 8) * 5;
	var src = new Array(sl), r = '', i, j = 0, k, v;
	for (i = 0; i < sl; i++) {
		src[i] = 0;
	}
	for (i = 0; i < cl; i++) {
		if ((v = c.charCodeAt(i) - 0x30) > 9) {
			v -= 7;
		}
		v <<= 11 - j % 8;
		k = Math.floor(j / 8);
		if (k < sl) {
			src[k] |= v >> 8;
			if (++k < sl)
				src[k] |= v & 0xff;
		}
		j += 5;
	}
	for (i = 0; i < sl; i++) {
		src[i] ^= xs[i % 8];
	}
	sl = src[0] | (src[1] << 8);
	for (v = 0, i = 4; i < sl; i++) {
		r += String.fromCharCode(src[i]);
		v += src[i];
	}
	if (v != ((src[2] & 0xff) | (src[3] << 8)))
		r = '';
	return r;
};
	

/*	
 *	addShop() :: setting up the shopping cart with Paypal
 *
 *	Usage: $(element).addShop( items, options );
 *
 *	Items: jQuery element (array) holding the elements
 *
 *	Options:
		target: 'ShoppingCart',
		currency: 'EUR',
		gateway: 'paypal',
		locale: 'US',
		quantityCap: 0,
		shippingFlat: false
 */

(function($) {
	
		
	$.fn.addShop = function(items, settings) {

		settings = $.extend( {}, $.fn.addShop.defaults, settings );
		
		if (!items || !items.length || !settings.id) {
			return this;
		}
			
		var id = $.fn.addShop.id,
			text = $.fn.addShop.text,
			seller = settings.id.replace('|','@'),
			url = (DEBUG? $.fn.addShop.st.sandboxurl : $.fn.addShop.st.url),
			currency = $.fn.addShop.st.curr_symbol[settings.currency] || settings.currency,
			btnLoc = $.fn.addShop.st.btn_lng[settings.locale] || 'en_US',
			t = $(this).eq(0), 	// target
			f, fs, fv, 			// forms 
			cnt = items.length,	// count
			sd, 				// saved discount
			el, 				// generic jQ el
			target = (cnt > 1)? $.fn.addShop.st.targetCart : $.fn.addShop.st.target,
			options;			// shop options array
			
		var getOptions = function(s) {
			var v = s.split('::'), 
				i, k, p, o, op = [];
		
			for (i = 0; i < v.length; i++) {
				k = v[i].split('=');
				if ( k.length > 1 ) {
					o = {};
					o.label = k[0];
					p = k[1].split('+');
					// Price
					if ((o.price = parseFloat(p[0])) == null)
						continue;
					// Shipping
					if (p.length > 1) {
						o.shipping = parseFloat(p[1]);
					} else {
						o.shipping = 0;
					}
					// Shipping 1+
					if (p.length > 2) {
						o.shipping2 = parseFloat(p[2]);
					} else {
						o.shipping2 = o.shipping;
					}
					// Display text
					o.text = k[0] + ' = ' + currency + ' ' + o.price.toFixed(2) + ((p.length > 1)? ('+' + o.shipping.toFixed(2)) : '');   
					op.push(o);
				}
			}
			
			return op;
		};
		
		// Adding select box
		var addOptions = function(f, op) {
			var i, e = $('<select>').appendTo(f);
			
			for (i = 0; i < op.length; i++) {
				e.append($('<option>', {
					val: op[i].price,
					html: op[i].text
				}));
			}
			
			return e;
		};
		
		// Adding an input
		var addInput = function(f, name, val, type, attr) {
			
			if (!f || !name) {
				return {};
			}
			
			var e = $('<input>', { 
					type: type || 'text'
				}).appendTo(f);
						
			// name
			e.prop('name', name); 
				
			// initial value
			if (val) {
				e.val((typeof val === 'string')? val.stripQuote() : val);
			}
				
			// simple attributes e.g. 'readonly'
			if (attr) {
				e.prop(attr, true);
			}

			return e;
		};

		// Reading or setting discount rate
		var discountRate = function(v) {
			if (typeof v === UNDEF) {
				return value((cnt > 1)? id.discountRateCart : id.discountRate);
			} else {
				if (cnt > 1) {
					value(id.discountRateCart, v);
				} else {
					value(id.discountRate, v);
					value(id.discountRate+'2', v);
				}
			}
		};
		
		// Reading or setting discount amount
		var discountAmount = function(v) {
			if (typeof v === UNDEF) {
				return value((cnt > 1)? id.discountAmountCart : id.discountAmount);
			} else {
				value((cnt > 1)? id.discountAmountCart : id.discountAmount, v);
			}
		};
		
		// Adding discount coupon name to the sent name
		var discountName = function(name, val) {
			var el = fs.children('[name=' + id.option + ']');
			if (el && el.length) {
				var s = el.val().replace(/(\s\(CC\:.+\))$/, '');
				el.val(s + ' (CC:' + name + ((typeof val !== UNDEF)? ('=' + val) : '') + ')');
			}
		};
			
		// set / get float value from fs
		var value = function(id, v) {
			var el = fs.children('[name=' + id + ']');
			if (typeof v === UNDEF) {
				// get
				return (el && el.length)? parseFloat(el.val()) : null;
			} else if (v == null) {
				// remove
				el.remove();
			} else {
				// set
				if (el && el.length) {
					el.val(v);
				} else {
					addInput(fs, id, v, 'hidden');
				}
			}
		};
		
		var curr = function() {
			var el = f.children('select').eq(0);
			return (el && el.length)? el.prop('selectedIndex') : 0;
		};
		
		// Shows total (discounted) price
		var showTotal = function() {
			var i = curr(),
				ed = f.children('.discount').eq(0),
				et = f.children('.total').eq(0),
				q = f.children('[name=copies]').val() || 1,
				pr = options[i].price,
				sh = options[i].shipping + (q - 1) * options[i].shipping2,
				da = discountAmount(),
				dr = discountRate();
			
			if (!ed.length) {
				ed = $('<span>', {
					'class': 'discount'
				}).insertAfter(f.children('select'));
			}
					
			if (da && da > 0) {
				ed.show().html('- ' + currency + ' ' + da.toFixed(2));
				et.html(currency + ' <b>' + (cnt * (q * pr + sh) - da).toFixed(2) + '</b>');
			} else if (dr && dr > 0) {
				ed.show().text('-' + dr + '%');
				et.html(currency + ' <b>' + (cnt * (q * pr * (100 - dr) / 100 + sh)).toFixed(2) + '</b>');
			} else {
				ed.hide();
				et.html(currency + ' <b>' + (cnt * (q * pr + sh)).toFixed(2) + '</b>');
			}
			
		};
			
		// Adjusting shipping fee
		/*
		var adjustShipping = function(v) {
			if (typeof v === UNDEF) {
				v = options[curr()].shipping;
			}
			if (cnt > 1) {
				value(id.handlingCart, (v || 0) * cnt + (settings.handling || 0));
			} else {
				value(id.shipping, v);
				if (!settings.shippingFlat) {
					value(id.shipping2, v);
				}
			}					
		};
		*/
		
		// Select box or Copies has Changed
		var change = function() {
			var i = curr(),
				q = f.children('[name=copies]').val() || 1,
				pr = options[i].price,
				sh = options[i].shipping,
				sh2 = options[i].shipping2;
				
			if ( settings.quantityCap && q > settings.quantityCap ) {
				f.children('[name=copies]').val(q = settings.quantityCap);
			}
			
			if (cnt > 1) {
				for (var j = 1; j <= cnt; j++) {
					value(id.price + '_' + j, pr);
					value(id.copies + '_' + j, q);
					value(id.shipping + '_' + j, sh? sh : null);
					value(id.shipping2 + '_' + j, sh2? sh2 : null);
				}
			} else {
				value(id.price, pr);
				value(id.copies, q);
				value(id.shipping, sh? sh : null);
				value(id.shipping2, sh2? sh2 : null);
			}
			
			value(id.option, options[i].text);
			
			showTotal();
		};
		
		// Validate coupon code
		var validateCoupon = function(feedback) {
			var el, now = new Date(), v, fb = feedback === true;
			
			if (settings.coupons && (el = f.children('[name=coupon]')) && (v = el.val().trim()).length) {
				var i, c, d, 
					cs = xDecrypt(settings.coupons).split('::');
					
				for (i = 0; i < cs.length; i++) {
					
					c = cs[i].split(/=|\s*<\s*/);
					
					if (c[0] === v && c.length > 1) {
						
						d = parseFloat(c[1]);
						if ( d < 0.01 ) {
							// Too small
							continue;
						}
						
						if (c.length > 2) {
							// Checking expiry
							var dt, ex = c[2].split(/-|:|\//);
							if (ex.length < 2) {
								ex[1] = 1;
							}
							if (ex.length < 3) {
								ex[2] = 1;
							}
							dt = new Date(parseInt(ex[0]),parseInt(ex[1]),parseInt(ex[2]));
							
							if (dt < now) {
								// Expired
								$('body').addModal($('<div>', {
									html: text.expired.replace('{0}', v)
								}), {
									type: 'error'
								});
								
								return false;
							}
						}
													
						if (c[1].charAt(c[1].length - 1) === '%') {
							
							// Discount rate
							
							if (d > 99 || d < 1) {
								// Not allowed
								continue;
							}
							
							var dr = discountRate();
							
							if (dr > d) {
								// Lower than current discount
								if (fb) {
									$('body').addModal($('<div>', {
										html: text.lowerThanCurrent.replace('{0}', dr + '%')
									}), {
										type: 'warning'	
									});
								}
							} else {
								// Higher
								if (fb) {
									// Redeem feedback
									$('body').addModal($('<div>', {
										html: text.accepted.replace('{0}', d + '%')
									}), {
										title: text.success	
									});
								}
								
								discountRate(d);
								discountName(v, d + '%');
								$.cookie('discountRate', v, 86400);
							}

						} else if ($.cookie('discount_' + v)) {
							
							// The discount amount has been reclaimed already
							
							if (fb) {
								// Redeem: warning, but no action
								$('body').addModal($('<div>', {
									html: text.reclaimed
								}), {
									type: 'warning'
								});
							} 
							
							// Removing discount amount, adding back the saved rate
							discountAmount(null);
							if (sd) {
								discountRate(sd);
								discountName(v, sd + '%');
							}
							
						} else {
							
							// Discount amount (coupon is not yet used in the past 24 hours)
							
							var dr = discountRate(),
								pr = options[curr()].price,
								da = discountAmount() || ((dr > 0)? (cnt * pr * dr / 100) : 0);
							
							if ((pr * cnt) < d) {
								// Price is lower than discount amount : no go
								if (fb) {
									// Redeem: warning, but no action
									$('body').addModal($('<div>', {
										html: text.higherThanPrice.replace('{0}', currency + '&nbsp;' + d)
									}), {
										type: 'warning'
									});
								}
								
							} else if (da > d) {
								// Previous discount amount is lower than current
								if (fb) {
									// Redeem: warning, but no action
									$('body').addModal($('<div>', {
										html: text.lowerThanCurrent.replace('{0}', currency + '&nbsp;' + da.toFixed(2))
									}), {
										type: 'warning'	
									});
								}
								
							} else {
							
								if (fb) {
									// Redeem: feddback
									$('body').addModal($('<div>', {
										html: text.accepted.replace('{0}', currency + '&nbsp;' + d)
									}), {
										title: text.success
									});
								} else {
									// Saving the coupon for later check
									$.cookie('discount_' + v, d, 86400);
									// Saving current discount rate
									sd = discountRate();
									discountRate(null);
								}
								
								// Adding discount amount
								discountAmount(d);
								discountName(v, settings.currency + ' ' + d);
								
							}
						}
						
						showTotal();
						return true;
					}
				}
				
				// Not found
				$('body').addModal($('<div>', {
					html: text.noSuch
				}), {
					type: 'error'			
				});
				// Do not send the form!
				return false;
			}
			
			// No coupons exists or coupon field is empty
			return true;
		};
			
		/* ***************************************
		 *          Creating the elements 
		 * *************************************** */
		 
		options = getOptions(settings.options);
		
		if (!options.length) {
			return;
		}
		
		// ******** The form to display
		
		f = $('<form>', {
			name: 'shopping',
			method: 'post'
		}).appendTo(t);
		
		// Count
		if (cnt > 1) {
			f.append($('<span>', {
				'class': 'count',
				html: '<b>' + cnt + '</b> &times;' 
			}));
		}
		
		// Options
		el = addOptions(f, options);
		el.on('change', change);

		// Discount
		if (!settings.hasOwnProperty('discount')) {
			settings.discount = $.fn.addShop.defaults.discount || 0;
		}
		if (settings.discount === '-') {
			settings.discount = 0;
		}
		/*	
		if (settings.discount && settings.discount < 100) {
			f.append($('<span>', {
				'class': 'discount',
				text: '-' + settings.discount + '%'
			}));
		}
		*/
		// Quantity
		if (settings.quantityCap !== 1) {
			f.append('&times;');
			el = addInput(f, 'copies', 1);
			el.addClass('copies').on('change', change);
		}
		
		// Total
		f.append('=');
		f.append($('<span>', {
			'class': 'total'
		}));
		
		// Coupon
		if (settings.coupons) {
			f.append($('<input>', {
				type: 'text',
				name: 'coupon',
				'class': 'coupon',
				placeholder: text.couponCode
			}));
			// Redeem btn
			var b = $('<a>', {
				href: NOLINK,
				html: '&nbsp;',
				'class': 'redeem'
			}).on('click', function(e) {
				e.preventDefault();
				validateCoupon(true);
				return false;
			});
			if (!document.touchMode) {
				b.addTooltip(text.redeem);
			}
			f.append(b);
		}
					
		// ********  Add to cart form -> Paypal
			
		fs = $('<form>', {
			name: id.form,
			target: settings.continueUrl? '_blank' : target,
			action: url + 'cgi-bin/webscr/',
			method: 'post'
		}).appendTo(t);
			
		value('cmd', '_cart');
		value('charset', 'utf-8');
		value('lc', settings.locale);
		value(id.seller, seller);
		value(id.currency, settings.currency);
		value(id.shopUrl, settings.continueUrl || decodeURIComponent(window.location.href));
		if ( settings.handling != null && $.isNumeric(settings.handling) ) {
			value(id.handlingCart, settings.handling);
		}
		value(id.option, options[0].label);
		
		if ( settings.discount && settings.discount < 100) {
			discountRate(settings.discount);
		}
		
		if (cnt > 1) {
			
			value('upload', 1);
			value(id.name, cnt + ' ' + text.items);
			//value(id.priceCart, options[0].price * items.length);
			//value(id.handlingCart, (options[0].shipping || 0) * cnt + (settings.handling || 0));
			var s;
			items.each(function(i) {
				el = $(this).find('img:first');
				s = el.data('src') || el.attr('src') || '';
				value(id.name + '_' + (i + 1), decodeURIComponent(s.getFile() + ' [' + settings.path + s.getDir().replace('thumbs/','') + ']'));
			});
				
		} else {
			
			value('add', 1);
			// (im.data(id.link) || (dynamic? (im.data(id.src) || ('No. ' + curr)) : im.attr('src'))).getFile(),
			el = items.eq(0).find('img:first');
			value(id.name, decodeURIComponent((el.data('src') || el.attr('src') || '').getFile() + ' [' + settings.path + ']'));
		}
		
		change();
		
		fs.append($('<button>', {
			id: 'shopAdd',
			name: 'submit',
			'class': 'paypalbtn',
			html: (cnt > 1)? text.buyNow : text.addCart
		}));
		
		// On submit
		fs.on('submit', function(e) {
			var succ = true, 
				el = $(e.target);
				
			if (settings.coupons) {
				succ = validateCoupon();
			}
			if (succ) {
				el.parents('[role=modal]').trigger('destroy');
				window.open('', target, 'width=1024,height=600,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,directories=no,status=no,copyhistory=no');
			}
			return succ;
		});
			
		// if there's a saved coupon
		if (settings.coupons) {
			var v = $.cookie('discountRate');
			if (v) {
				$('input[name=coupon]').val(v);
				validateCoupon(false);
			}
		}
		
		// ********  View cart form -> Paypal
		
		if ( cnt === 1 ) {
			
			fv = $('<form>', {
				'class': 'view',
				name: 'paypalview',
				target: target,
				action: url + 'cgi-bin/webscr/',
				method: 'post'
			}).appendTo(t);
			
			addInput(fv, 'cmd', '_cart', 'hidden');
			addInput(fv, 'lc', settings.locale, 'hidden');
			addInput(fv, id.seller, seller, 'hidden');
			addInput(fv, 'display', 1, 'hidden');
			
			fv.append($('<button>', {
				id: 'shopView',
				'class': 'paypalbtn',
				name: 'submit',
				html: text.viewCart
			}));
			
			// Open in new window
			fv.on('submit', function() {
				window.open('', target, 'width=1024,height=600,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,directories=no,status=no,copyhistory=no');
				return true;
			});
		}
				
		// Initializing total
		showTotal();

		return this;
	};
	
	$.fn.addShop.defaults = {
		currency: 'EUR',
		locale: 'US',
		quantityCap: 0,
		shippingFlat: false
	};
		
	$.fn.addShop.text = getTranslations({
		addCart: 'Add to Cart',
		viewCart: 'View Cart',
		buyNow: 'Buy Now',
		items: 'items',
		success: 'Success',
		couponCode: 'Coupon code',
		redeem: 'Redeem',
		noSuch: 'No such coupon exists!',
		expired: 'The coupon code <b>{0}</b> has expired!',
		accepted: 'The coupon code is accepted. You will get <b>{0}</b> discount the next time you add this item to the cart.',
		lowerThanCurrent: 'This coupon offers lower discount than the current <b>{0}</b>.',
		higherThanPrice: 'You can use this coupon only for items priced higher than <b>{0}</b>.',
		reclaimed: 'This coupon has already been used!'
	});
	
	// Static vars
	$.fn.addShop.st = {
		target: 	'ShoppingCart',
		targetCart:	'BuyNow',
		url: 		'https://www.paypal.com/',
		sandboxurl:	'https://www.sandbox.paypal.com/',
		btn_lng: {
			'DE': 'de_DE', 
			'FR': 'fr_FR', 
			'IT': 'it_IT', 
			'ES': 'es_ES', 
			'PT': 'pt_PT', 
			'PT': 'pt_BR', 
			'DA': 'da_DK', 
			'NL': 'nl_NL', 
			'NO': 'no_NO', 
			'SV': 'sv_SE', 
			'TR': 'tr_TR', 
			'RU': 'ru_RU', 
			'PL': 'pl_PL', 
			'IL': 'he_IL', 
			'TH': 'th_TH'
		},
		curr_symbol: {
			'USD': 'US$',
			'EUR': '&euro;',
			'GBP': 'GB&pound;',
			'JPY': '&yen;',
			'HUF': 'Ft'
		}
	};
	
	// Mapping names
	$.fn.addShop.id = {
		'form':				'paypal',
		'seller':			'business',
		'currency':			'currency_code',
		'name':				'item_name',
		'option':			'item_number',
		'custom':			'custom',
		'price':			'amount',
		'priceCart':		'amount_1',
		'copies':			'quantity',
		'discountRate':		'discount_rate',
		'discountRateCart':	'discount_rate_cart',
		'discountAmount':	'discount_amount',
		'discountAmountCart':'discount_amount_cart',
		'shipping':			'shipping',
		'shipping2':		'shipping2',
		'handlingCart':		'handling_cart',
		'shopUrl':			'shopping_url'
	};			

})(jQuery);

/*	
 *	addSocial() :: adds a popup box to the div to share the current page over various sharing sites
 *
 *	Usage: $(element).addSocial( options );
 *
 *	Options:
		id: 'shares',
		useHash: true,
		likeBtnTheme: 'light',
		facebookLike: true,
		twitterTweet: true,
		googlePlus: true,
		tumblrBtn: true,
		facebook: true,
		twitter: true,
		gplus: true,
		digg: true,
		delicious: true,
		myspace: true,
		stumbleupon: true,
		reddit: true,
		email: true,
		callTxt: 'Found this page',
		pos: { 
			posX: 1,
			posY: 2,
			toX: 1,
			toY: 0
		},
		localWarning: 'Can\'t share local albums. Please upload your album first!'
 */

(function($) {
	//	addSocial :: 
	
	var tumblr_photo_source = '', 
		tumblr_photo_caption = '',
		tumblr_photo_click_thru = '';
	
	$.fn.addSocial = function( settings ) {
		
		settings = $.extend( {}, $.fn.addSocial.defaults, settings );
		
		var text = getTranslations($.fn.addSocial.text)
		
		var u = window.location.href.split('#')[0] + 
			(settings.useHash? ('#' + encodeURIComponent(settings.hash || '')) : ''),
			ue = encodeURIComponent( window.location.href.split('#')[0] + (settings.useHash? ('#' + encodeURIComponent(settings.hash || '')) : '') ),
			ti = encodeURIComponent( settings.title || $('meta[name=title]').attr('content') || $('title').text() ),
			tx = encodeURIComponent( text.checkOutThis ),
			bw = settings.inline? 90 : settings.width,
			bh = 22,
			im = settings.image? 
				(window.location.href.getDir() + settings.image) : 
				$('link[rel=image_src]').attr('href');
				
		return this.each(function() {
			var a = $(this);
			
			if ( this.nodeName === 'a' ) {
				a.attr('href', NOLINK);
			}
			
			var e = $('<div>', { 
				'class': settings.className
			});
			
			if ( LOCAL && !DEBUG ) {
				e.html(text.localWarning);
			} else {
				if (!LOCAL) {
					// No buttons in local mode
					
					if ( !settings.useHash ) {
						// separate slides mode
						
						if ( settings.facebookLike ) {
							e.append('<div class="likebtn"><iframe src="//www.facebook.com/plugins/like.php?href=' + u + '&amp;layout=button_count&amp;show_faces=false&amp;width=' + bw + '&amp;action=like&amp;font=arial&amp;colorscheme=' + settings.likeBtnTheme + '&amp;height=' + bh + '" scrolling="no" frameborder="0" style="border:none;overflow:hidden;width:' + bw + 'px;height:' + bh + 'px;" allowTransparency="true"></iframe></div>');
						}
					
						if ( settings.twitterTweet ) {
							e.append('<div class="likebtn"><iframe allowtransparency="true" frameborder="0" scrolling="no" src="//platform.twitter.com/widgets/tweet_button.html?url=' + u + '&text=' + ti + '" style="width:' + bw + 'px; height:' + bh + 'px;"></iframe></div>');
						}
						
						if ( settings.googlePlus ) {
							var w = (settings.inline? 90 : 120),
							po = $('<div class="likebtn" style="max-width:' + w + 'px;min-width:' + w + 'px;"><div class="g-plusone" data-href="' + u + '"></div></div>').appendTo(e);
							// 20 attempts, 200ms in between
							var la = 20;
							var launch = function() {
								if (typeof gapi === UNDEF) {
									if (la--) {
										setTimeout(launch, 200);
									} else if (typeof console !== UNDEF) {
										console.log('Google Plus API failed to load!');
									}
								} else {
									setTimeout(function() {
										gapi.plusone.render(po[0], {
											'size': 'medium',
											'annotation': 'bubble'
										});
									}, 200);
								}
							};
							launch();
						}
						
						if ( settings.pinItBtn ) {
							e.append('<div class="likebtn" style="height:' + bh + 'px;"><a data-pin-config="beside" href="//pinterest.com/pin/create/button/?url=' + ue + '&media=' + encodeURIComponent(im) + '&description=' + ti + '" data-pin-do="buttonPin" ><img src="http://assets.pinterest.com/images/pidgets/pin_it_button.png" /></a></div>');
						}
					}
					
					if ( settings.tumblrBtn ) {
						e.append('<div class="likebtn" id="tumblr"><a href="//www.tumblr.com/share/' + (settings.image? 'photo?source=' : 'link?url=') + encodeURIComponent(u) + '&name=' + ti + '" title="Share on Tumblr" style="display:inline-block;text-indent:-9999px;overflow:hidden;width:' + bw + 'px;height:' + bh + 'px;background:url(http://platform.tumblr.com/v1/share_1.png) top left no-repeat transparent;">Tumblr</a></div>');
						tumblr_photo_source = im;
						tumblr_photo_caption = ti;
						tumblr_photo_click_thru = u;
					}
				}
				
				if (settings.facebook || settings.twitter || settings.gplus || settings.pinterest || settings.digg || settings.delicious || 
					settings.myspace || settings.stumbleupon || settings.reddit || settings.email) {
					
					if (!settings.buttonLabels) {
						e.append('<span>' + text.shareOn + '</span>');
					}
					
					if ( settings.facebook  /*&& !settings.useHash */ ) {
						// e.append('<a href="http://www.facebook.com/sharer.php?u=' + u + '&t=' + ti + '" class="facebook">Facebook</a>');
						e.append('<a href="http://www.facebook.com/sharer.php?s=100&p%5Burl%5D=' + ue + '&p%5Bimages%5D%5B0%5D=' + encodeURIComponent(im) + '&p%5Btitle%5D=' + ti + '" class="facebook"' + (settings.buttonLabels? '>Facebook':' title="Facebook">') + '</a>');
					}
					if ( settings.twitter ) {
						e.append('<a href="http://twitter.com/home?status=' + tx + ': ' + ue + '" class="twitter"' + (settings.buttonLabels? '>Twitter':' title="Twitter">') + '</a>');
					}
					if ( settings.gplus ) {
						e.append($('<a>', {
							'class': 'gplus',
							href: 'https://plus.google.com/share?url=' + ue,
							title: 'Google+',
							text: settings.buttonLabels? 'Google+':''
						}).on('click', function() {
							window.open(this.href, this.title, 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=760,width=980');
							return false;
						}));
					}
					if ( settings.pinterest ) {
						e.append('<a href="http://pinterest.com/pin/create/button/?url=' + ue + '&media=' + encodeURIComponent(im) + '&description=' + ti + '" class="pinterest"' + (settings.buttonLabels? '>Pinterest':' title="Pinterest">') + '</a>');
					}
					if ( settings.digg ) {
						e.append('<a href="http://digg.com/submit?url=' + u + '" class="digg"' + (settings.buttonLabels? '>Digg':' title="Digg">') + '</a>');
					}
					if ( settings.delicious ) {
						e.append('<a href="http://delicious.com/save?url=' + u + '&title=' + ti + '&v=5" class="delicious"' + (settings.buttonLabels? '>Delicious':' title="Delicious"') + '</a>');
					}
					if ( settings.myspace ) {
						e.append('<a href="http://www.myspace.com/index.cfm?fuseaction=postto&t=' + ti + '&u=' + u + '&l=3" class="myspace"' + (settings.buttonLabels? '>MySpace':' title="MySpace"') + '</a>');
					}
					if ( settings.stumbleupon ) {
						e.append('<a href="http://www.stumbleupon.com/submit?url=' + u + '&title=' + ti + '" class="stumbleupon"' + (settings.buttonLabels? '>StumbleUpon':' title="StumbleUpon">') + '</a>');
					}
					if ( settings.reddit ) {
						e.append('<a href="http://www.reddit.com/submit?url=' + u + '" class="reddit"' + (settings.buttonLabels? '>Reddit':' title="Reddit"') + '</a>');
					}
					e.children('a').attr('target', '_blank');
					
					if ( settings.email ) {
						e.append('<a href="mailto:?subject=' + tx + '&body=' + ti + '%0D%0A' + u.replace(/%/g, '%25') + '" class="email"' + (settings.buttonLabels? '>Email':' title="Email">') + '</a>');
					}
					if (!settings.buttonLabels && !document.touchMode) {
						e.children('a').addTooltip();
					}
				}
				
			}
			a.on('destroy', function() {
				e.remove();
			});
			if (settings.inline) {
				e.appendTo(a);
			} else {
				a.addTooltip(e, {
					width: settings.width,
					stay: 5000,
					pos: settings.pos
				});
			}
		});
	};
	
	$.fn.addSocial.defaults = {
		className: 'shares',
		width: 120,
		useHash: true,
		likeBtnTheme: 'light',
		inline: false,
		buttonLabels: true,
		/*
		facebookLike: !1,
		twitterTweet: !1,
		googlePlus: !1,
		tumblrBtn: !1,
		facebook: !1,
		twitter: !1,
		gplus: !1,
		digg: !1,
		delicious: !1,
		myspace: !1,
		stumbleupon: !1,
		reddit: !1,
		email: !1,
		*/
		pos: [1,2,1,0]
	};
	
	$.fn.addSocial.text = {
		shareOn: 'Share on',
		checkOutThis: 'Found this page',
		localWarning: 'Can\'t share local albums. Please upload your album first!'
	};

})(jQuery);


/* *****************************************************************************
 *
 *	The main skin closure :: the non-intrinsic functions that belong to the skin
 *
 ****************************************************************************** */
 
(function($) {
			
	// Reading keys: k="name1,name2,... from attr="data-k" into m
	
	$.fn.readData = function(m, k) {
		if ( m == null || k == null ) {
			return this;
		}
		k = k.split(',');
		var i, l = k.length, v;
		return this.each(function() {
			for (i = 0; i < l; i++) {
				if ((v = $(this).data(k[i])) != null) {
					m[k[i]] = v;
				}
			}
		});
	};
		
	// showin :: shows elements, like show() but display:inline-block;
	
	$.fn.showin = function() {
		return this.each(function() { 
			$(this).css('display', 'inline-block'); 
		});
	};
	
	// showin :: shows elements, like show() but display:inline-block;
	
	$.fn.togglein = function(to) {
		if (typeof to === UNDEF) {
			return this.each(function() {
				$(this).css('display', ($(this).css('display')==='none')? 'inline-block' : 'none'); 
			});
		}
		$(this).css('display', to? 'inline-block' : 'none');
		return this;
	};
	
	// getDim :: get dimensions of hidden layers
	
	$.fn.getDim = function() {
		var el = $(this).eq(0);
		var dim = { 
			width: el.width(), 
			height: el.height() 
		};
		
		if ( (dim.width === 0 || dim.height === 0) && el.css('display') === 'none' ) {
			var bp = el.css('position');
			var bl = el.css('left');
			el.css({
				position: 'absolute', 
				left: '-10000px', 
				display: 'block'
			});
			dim.width = el.width();
			dim.height = el.height();
			el.css({
				display: 'none', 
				position: bp, 
				left: bl
			});
		}
		return dim;
	};	
					
	/*
	 *	Search :: searching throughout all the album pages
	 *
	 */
	
	if ( typeof Search !== UNDEF ) {
		
		Search.text = getTranslations({
			searchBoxTip:	'Search...',
			searchResultsFor:'Search results for',
			newImages:		'New images',
			notFound:		'Not found',
			close:			'Close'
		});
		
		Search.start = function( source ) {
	
			if ( source == null ) {
				return;
			}
						
			var t = (typeof source === 'string' || $.isNumeric(source))? String(source) :
				((source.nodeName === 'FORM')? $(source).find('input[type=search]').val().trim() : $(source).text().trim());
			
			var el, found = 0, c, days, ref, sn = false, dd, cf,
				i, j, k, l, a, p, r, s, th, hr, tex, ex, re;
		
			if ( !Search.data || !$.isArray(Search.data) || !Search.data.length || !t || t.length < 2 ) {
				return;
			}
			
			el = $('<div>', { 
				'class': 'searchresults' 
			});
			
			var newSearch = function(e) {
				e.preventDefault();
				var v = $(this).closest('form').children('input:first').val().trim();
				if ( v.length >= 2 ) {
					Search.start( v );
				}
				return false;
			};
			
			if ( t.startsWith('@new') ) {
				sn = true;
				ref = Search.created || Math.round((new Date()).getTime() / 86400000);
				days = parseInt(t.split(':')[1], 10) || 30;
			} else {
				re = new RegExp('('+t.replace(/\s/g, '|')+')', 'i');
				el.append('<form><input type="text" value="' + t + '"><a class="button">&nbsp;</a></form>');
				el.find('a.button').on('click', newSearch);
				el.find('form').on('submit', newSearch);
			}
			
			r = (Search.rootPath && Search.rootPath !== '.')? (Search.rootPath + '/') : '';
			
			cf = window.location.href.getRelpath(Math.floor(r.length / 3));
			
			var clicked = function(e) {
				var a = $(e.target).closest('a');
				if ( !a.length || !a.hasClass('active') || !window.location.href.endsWith(a.attr('href')) ) { 
					if (!Search.makeSlides) {
						a.addClass('active');
						a.siblings('.active').removeClass('active');
					}
					$.cookie('lastSearch', t, 8);
					return true;
				}
				e.cancelBubble = true;
				return false;
			};
			
			for ( i = 0; i < Search.data.length; i++ ) {
				
				p = r;
				if (Search.data[i][0].length) {
					p += (Search.urlEncode? Search.data[i][0] : encodeURIComponent(Search.data[i][0]).replace(/%2F/g,'/')) + '/';
				}
				l = (Search.data[i][1]).length;
	
				for ( j = 0; j < l; j++ ) {
					
					s = Search.data[i][1][j].split(Search.sep);
					
					if ( (sn && s.length > 5 && (dd = ref - parseInt(s[5], 10)) < days)  
						|| (!sn && re.test(Search.data[i][1][j])) ) {
												
						// images or separate slide mode
						th = s[0].split(':');
						ex = th[0].getExt();
						tex = (th.length > 1)? th[1] : th[0].substring(th[0].lastIndexOf('.') + 1);
						hr = encodeURIComponent(th[0]);
						
						switch ( ex.toLowerCase() ) {
							case Search.ext:
								th = p + Search.folderThumb;
								break;
							case 'tif':
							case 'bmp':
								// Fixing extension in the link
								
								if ( !Search.makeSlides )
									hr = hr.replaceExt(tex);
								
							case 'jpg':
							case 'jpeg':
							case 'png':
							case 'mp4':
								th = p + Search.thumbs + '/' + hr.replaceExt(tex);
								break;
							case 'mp3':
								if ( tex === 'png' ) {
									// No thm exists
									th = r + 'res/audio.png';
								} else {
									th = p + Search.thumbs + '/' + hr.replaceExt(tex);
								}
								break;
							case 'gif':
								hr = hr.replaceExt(tex);
								th = p + Search.thumbs + '/' + hr;
								break;
							case 'pdf':
							case 'zip':
							case 'txt':
							case 'doc':
							case 'xls':
								th = r + 'res/' + ex + '.png';
								break;
							default:
								th = r + 'res/unknown.png';
						}
						
						if ( ex === Search.ext ) {
							// Index or Custom page
							hr = p + hr;
							th = p + Search.folderThumb;
						} else {
							// Image
							hr = p + (Search.makeSlides? 
								(Search.slides + '/' + hr.replaceExt(Search.ext)) : 
								(Search.indexName + '#' + (Search.urlEncode? hr.replace(/\'/g, '%27').replace(/%/g, '%25').replace(/\(/g, '%2528').replace(/\)/g, '%2529') : hr))
							);
						}
						
						a = $('<a>', { 
							href: hr.fixUrl() 
						}).append($('<aside>').append($('<img>', { 
							src: th 
						}))).on('click', clicked).appendTo(el);
						
						// Marking current file
						if (hr.endsWith(cf)) {
							a.addClass('active');
						}
						
						if ( s[1] ) {
							// Title
							a.append($('<h5>').append(sn? s[1] : s[1].replace(re, '<em>$1</em>')));
						}
						if ( s[2] && s[2] !== s[1] ) {
							// Comment
							a.append($('<p>').append(sn? s[2].trunc(192) : s[2].trunc(192).replace(re, '<em>$1</em>') ));
						}
						for ( k = 3; k < s.length - 1; k++ ) {
							// Keywords, Faces, ... the last one is the file mod date - don't show
							if ( s[k] && s[k].trim().length ) {
								a.append($('<p>').append(sn? s[k].trunc(192) : s[k].trunc(192).replace(re, '<em>$1</em>') ));
							}
						}
						if ( sn ) {
							a.append($('<p>').append('<em>' + getRelativeDate(dd) + '</em>') );
						}
						
						if ( window.location.hash === s[0] ) {
							c = found;
						}
						
						found++;
						//break;
					}
				}
			}
			
			if ( source.jquery ) {
				$(source).parents('.hint:first').fadeOut(100, function() {
					$(this).remove();
				});
			}
			
			if ( !found ) {
				el.append($('<p>', { 
					text: Search.text.notFound 
				}));
			} else {
				setTimeout(function() {
					$('.searchresults > a').eq(c || 0).focus();
				}, 250);
			}
			
			$('body').addModal( el, {
				uid: 'searchres',
				title: (t.startsWith('@new')? Search.text.newImages : Search.text.searchBoxTip),
				darkenBackground: false,
				movable: true,
				blocking: false,
				closeOnClickOut: false,
				defaultButton: 'close',
				resizable: true,
				width: 240,
				pos: [ 2, 0 ],
				scrollIntoView: true,
				savePosition: true
			});
						
			return false;
		};
		
		Search.rootPath = '';
		
		Search.init = function(root) {
			Search.rootPath = root;
			var t = $.cookie('lastSearch'); 
			if ( t && t.length && t !== 'null' ) {
				$.cookie('lastSearch', null); 
				Search.start( t );
			}
		};
		
	}
			
	/*
	 *	addRegions() :: adds area markers with Search functionality
	 *
	 *	Usage: $(element).addRegions( options );
	 *
	 * Options:
			id: 'regions',
			active: 'active',
			pos: { 
				posX: 1,
				posY: 2,
				toX: 1,
				toY: 0
			}
	 */
	
	$.fn.addRegions = function( el, regions, settings ) {
		
		if (!el || !el.length || !regions) {
			return;
		}
		
		settings = $.extend( {}, $.fn.addRegions.defaults, settings );
		
		var regs = [];
		
		var parseRegions = function() {
			var i, v, x, y, w, h, r = regions.split('::');
			for ( i = 0; i < r.length; i++ ) {
				v = r[i].split(';');
				if (v.length > 4 && v[0].length && 
					(x = parseFloat(v[1])) !== null &&
					(y = parseFloat(v[2])) !== null &&
					(w = parseFloat(v[3])) !== null &&
					(h = parseFloat(v[4])) !== null) {
					//regs.push([ v[0], (x - w / 2) * 100 + '%', (y - h / 2) * 100 + '%', w * 100 + '%', h * 100 + '%' ]);
					regs.push([ v[0], x * 100 + '%', y * 100 + '%', w * 100 + '%', h * 100 + '%' ]);
				}
			}
		};
		
		parseRegions();
		
		if ( !regs.length ) {
			return this;
		}
				
		return this.each(function() {
			var t = $(this), a, ra, 
				pw = parseInt(t.css('padding-top'), 10);
			
			if ( this.nodeName === 'a' ) {
				t.attr('href', NOLINK);
			}
			
			var e = $('<div>', { 
				'class': settings.id 
			}).hide();
			
			var r = $('<div>', { 
				'class': settings.id + '-cont' 
			}).css({
				left: pw,
				top: pw,
				right: pw,
				bottom: pw
			});
			
			var clicked = function(e) {
				e.preventDefault();
				Search.start(e.target);
				return false;
			};
			
			var mover = function(e) {
				r.children('a').eq($(e.target).index()).addClass(settings.active);
			};
			
			var mout = function(e) {
				r.children('a').eq($(e.target).index()).removeClass(settings.active);
			};
			
			for ( var i = 0; i < regs.length; i++ ) {
				a = $('<a href="' + NOLINK + '">' + regs[i][0] + '</a>').appendTo(e);
				ra = $('<a>').css({
					left: regs[i][1],
					top: regs[i][2],
					width: regs[i][3],
					height: regs[i][4]
				}).append($('<span>', { text: regs[i][0] })).appendTo(r);
				
				a.on({
					mouseover: mover, 
					mouseout: mout
				});
				
				if ( typeof Search !== UNDEF ) {
					ra.on('click', clicked);
				}
			}
			
			t.addTooltip(e, {
				stay: 5000
			});
			
			t.on('destroy', function() {
				e.remove();
			});
			
			if ( t.hasClass(settings.active) ) {
				r.addClass(settings.active);
			}
				
			t.on('click', function() {
				$(this).add(r).toggleClass(settings.active);
			});
			
			el.append(r);
		});
	};
	
	$.fn.addRegions.defaults = {
		id: 'regions',
		active: 'active',
		pos: [1,2,1,0]
	};
	
	/*
	 *	centerThis() :: centers an image and fits optionally into its containing element 
	 *
	 *	Usage: $(element).centerThis( options );
	 *
	 * Options:
			selector: '.main',
			speed: 500,
			fit: true,
			enlarge: true,
			marginTop: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			padding: 0,
			init: false,
			animate: false,
			effect: 'swing',
			complete: null
	 */
	
	$.fn.centerThis = function( settings ) {
		
		settings = $.extend({}, $.fn.centerThis.defaults, settings);
				
		return this.each(function() {
						
			var c = $(this),
				el = c.find(settings.selector);
				
			if ( !el.length ) {
				return;
			}
			
			var	cw, ch, tw, th, tl, tt, ow, oh, bw, pw,
				ml = settings.marginLeft + settings.padding,
				mr = settings.marginRight + settings.padding,
				mt = settings.marginTop + settings.padding,
				mb = settings.marginBottom + settings.padding;
			
			// original dimensions
			ow = el.data('ow');
			oh = el.data('oh');
			if ( !ow || !oh ) {
				el.data('ow', ow = el.width());
				el.data('oh', oh = el.height());
			}

			// border width :: assuming equal border widths
			if ( !(bw = el.data('bw')) ) {
				el.data( 'bw', bw = parseInt(el.css('border-top-width'), 10) || 0 );
			}
			
			// padding :: assuming uniform padding
			if ( !(pw = el.data('pw')) ) {
				el.data( 'pw', pw = parseInt(el.css('padding-top'), 10) || 0 );
			}
			
			// target boundaries
			cw = (c.innerWidth() || $('body').width()) - 2 * (bw + pw) - ml - mr;
			ch = (c.innerHeight() || $('body').height()) - 2 * (bw + pw) - mt - mb;
			
			// target dimensions
			if ( settings.fit && (ow > cw || oh > ch || settings.enlarge) ) {
				var r = Math.min(cw / ow, ch / oh);
				tw = Math.round(ow * r),
				th = Math.round(oh * r);
			} else {
				tw = ow;
				th = oh;
			}
			tl = Math.round((cw - tw) / 2) + ml;
			tt = Math.round((ch - th) / 2) + mt;				
			
			if (tw !== ow) {
				el.translateToPos();
			}
			
			if ( !settings.animate ) {
				
				// simply set the position and size
				el.css({
					left: tl,
					top: tt,
					width: tw,
					height: th
				});
				
				if ( $.isFunction(settings.complete) ) { 
					settings.complete.call(this);
				}
				
			} else {
				
				el.stop(true, false);
				// set prescale dimensions
				if ( settings.preScale && settings.preScale !== 1.0 ) {
					var sw = tw * settings.preScale,
						sh = th * settings.preScale;
					el.css({
						left: Math.round((cw - sw) / 2) + ml,
						top: Math.round((ch - sh) / 2) + mt,
						width: Math.round(sw),
						height: Math.round(sh)
					});
				} else if ( settings.init ) {
					el.css({
						left: tl,
						top: tt
					});
				}
				
				// animating attributes
				el.animate({
					left: tl,
					top: tt,
					width: tw,
					height: th
				}, { 
					duration: settings.speed, 
					easing: settings.effect, 
					complete: settings.complete 
				});
			}
		});
	};
	
	$.fn.centerThis.defaults = {
		selector: '.main',
		speed: 500,
		fit: true,
		enlarge: true,
		marginTop: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		padding: 0,
		init: false,
		animate: false,
		effect: 'swing',
		complete: null
	};
	
	/*
	 *	Functions that can be called on pages with no gallery, 
	 *	e.g. index pages with folders only 
	 *
	 */
	 
	// collectMarkers :: finding data-map coordinates through a set a of elements
	
	$.fn.collectMarkers = function( settings ) {
		
		settings = $.extend( {}, $.fn.collectMarkers.defaults, settings );
		
		var markers = [], c, m, t;
		
		this.each(function(n) {
			c = $(this).find(settings.selector);
			if ( c.length && (m = c.data(settings.mapid)) && (m = $.getLatLng(m)) ) {
				t = c.data(settings.captionid) || c.attr('alt');
				markers.push({ 
					map: m, 
					label: (n + 1) + (t? (': ' + t.stripHTML()) : ''), 
					link: settings.dynamic? $(this) : $(this).attr('href') 
				});
			}
		});
		
		return markers;
	};
	
	$.fn.collectMarkers.defaults = {
		selector: 'img:first',
		mapid: 'map',
		captionid: 'caption'
	};
	
	// markNewFolders :: marking the folders containing new pictures
	
	$.fn.markFoldersNew = function( settings ) {
		
		settings = $.extend( {}, $.fn.markFoldersNew.defaults, settings );
		text = getTranslations($.fn.markFoldersNew.text);
		
		if ( !settings.days ) {
			return;
		}
		
		var ref = settings.ref || Math.round((new Date()).getTime() / 86400000);
		
		return this.each(function() {
			if ( (ref - parseInt($(this).data('modified') || 0, 10)) <= settings.days ) {
				$(this).after('<span class="'+settings.cls+'">' + text.newItem + '</span>');
			}
		});
	};
			
	$.fn.markFoldersNew.defaults = {
		days: 7,		// day count :: 0 = no mark
		cls: 'newlabel'
	};
	
	$.fn.markFoldersNew.text = {
		newItem: 'NEW'
	};

	
	// turtleHelp :: sets up help for button and keyboard's F1 key
	
	$.fn.turtleHelp = function( settings ) {
		
		settings = $.extend( {}, $.fn.turtleHelp.defaults, settings );
		var text = getTranslations($.fn.turtleHelp.text);
		
		var helpWindow = $('<div>', {
			'class': 'help'
		});
		
		var addPanel = function(name) {
			if (text.hasOwnProperty(name)) {
				var c = 1, k,
					el = $('<ul>', {
						'class': name
					}).appendTo(helpWindow);
				for (k in text[name]) {
					el.append($('<li><span>' + (c++) + '</span>' + text[name][k] + '</li>'));
				}
			}
		};
		
		if (settings.index) {
			addPanel('index');
		}
		if (settings.slide) {
			addPanel('slide');
		}
		if (settings.pressF1) {
			helpWindow.append($('<p>', {
				html: text.help_pressF1
			}));
		}
		
		var showHelp = function() {
			$('body').addModal(helpWindow, {
				uid: 'help',
				title: text.help_title,
				width: 720,
				savePosition: true,
				resizable: true
			});
		};
		
		if ( settings.useF1 && !document.touchMode ) {
			$(document).on('keydown', function(e) {
				if ( document.activeElement && document.activeElement.nodeName === 'INPUT' || 
					( $.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) || 
					$('#help').is(':visible') ) {
					return true;
				}
				
				var k = e? e.keyCode : window.event.keyCode;
				
				if ( k === 112 ) {
					e.preventDefault();
					showHelp();
					return false;
				}
				return true;
			});
		}
		
		return this.each(function() {
			$(this).on('click', function(e) {
				e.preventDefault();
				showHelp();
				return false;
			});			
		});	
	};
	
	$.fn.turtleHelp.defaults = {
		useF1: true,
		index: true,
		slide: false
	};
	
	$.fn.turtleHelp.text = {
		help_title: 'Using Turtle gallery',
		help_pressF1: 'Press <b>F1</b> any time to get help!',
		index: {
			help_topNavigation: 'Top <b>navigation</b> bar with <b>Home</b> button',
			help_upOneLevel: '<b>Up</b> one level',
			help_authorInfo: 'Author or company <b>information</b>',
			help_shareAndLike: '<b>Share</b> and <b>Like</b> buttons for social networking',
			help_searchNew: 'Search <b>new images</b>',
			help_search: '<b>Search</b> button',
			help_downloadZip: '<b>Download</b> album or current folder as ZIP file',
			help_startSlideshow: 'Start <b>slideshow</b> <em>Numpad *</em>'
		},
		slide: {
			help_previousPicture: '<b>Previous</b> picture <em>Left arrow</em><em>Swipe right</em>',
			help_backToIndex: 'Back to <b>thumbnail page</b> / up one level <em>Esc</em>',
			help_toggleFit: 'Toggle <b>fit to screen</b> or <b>1:1</b> size <em>Numpad +</em>',
			help_toggleInfo: 'Show/hide <b>captions</b> and other panels, like Metadata, Map, Shopping, etc. <em>Numpad -</em>',
			help_toggleThumbnails: 'Show/hide <b>thumbnail</b> scroller <em>Numpad -</em>',
			help_toggleAutoPlay: 'Start/stop <b>slideshow</b> <em>Numpad *</em>',
			help_nextPicture: '<b>Next</b> picture <em>Right arrow</em><em>Swipe left</em>',
			help_toggleMeta: 'Toggle <b>photo data</b>',
			help_toggleMap: 'Toggle <b>map</b>',
			help_toggleShop: 'Toggle <b>shopping options</b> panel',
			help_downloadImage: 'Download <b>high resolution</b> file',
			help_shareAndLike: '<b>Share</b> and <b>Like</b> buttons for social networking',
			help_toggleComments: 'Toggle <b>Facebook comments</b>',
			help_toggleFaces: 'Toggle visibility of <b>tagged people</b>'
		}
	};	
	
	/* *******************************************************
	*
	*				Turtle gallery main
	*
	******************************************************** */
	
	$.fn.turtle = function( settings, id ) {
		
		// adding the passed settings to the defaults
		
		settings = $.extend( {}, $.fn.turtle.defaults, settings );
		id = $.fn.turtle.ids;
		var text = getTranslations($.fn.turtle.text);
		
		// Saving one key into the settings object and as cookie
		
		var saveSetting = function( n, s, e ) {
			$.cookie(n, s, e);
			settings[n] = s;
			//log('Save ' + n + ': ' + s);
		};
				
		// Loading all the settings to retain from cookies / localstorage

		(function loadSettings( sn ) {
			for ( var c, i = 0; i < sn.length; i++) { 
				if ( (c = $.cookie(sn[i])) !== null ) {
					settings[sn[i]] = c;
					//log('Load ' + sn[i] + ': ' + c);
				}
			}
		})([ 'thumbsOn', 'infoOn', 'commentsOn', 'metaOn', 'mapOn', 'regionsOn', 'shopOn', 'shareOn', 
			'printOn', 'fitImage', 'slideshowDelay', 'slideshowOn' ]);

		
		if ( document.touchMode ) {
			settings.preScale = false;
		}
		
		// Setting addScroll defaults
		$.fn.addScroll.defaults.dontDrag = '#' + id.map;
		
		// Setting up default view for the map
		$.fn.addMap.defaults.zoom = settings.mapZoom;
		$.fn.addMap.defaults.type = settings.mapType;
		$.fn.addMap.defaults.resPath = settings.resPath;
		
		// Setting up addShop defaults
		$.fn.addShop.defaults.id = settings.shopId;
		$.fn.addShop.defaults.path = (settings.albumName? (settings.albumName + '/') : '') + settings.relPath;
		$.fn.addShop.defaults.currency = settings.shopCurrency || 'EUR';
		$.fn.addShop.defaults.handling = settings.shopHandling || null;
		$.fn.addShop.defaults.locale = settings.shopLocale || 'US';
		$.fn.addShop.defaults.quantityCap = settings.shopQuantityCap || 0;
		$.fn.addShop.defaults.discount = settings.shopDiscount || 0;
		$.fn.addShop.defaults.options = settings.shopOptions || '';
		$.fn.addShop.defaults.coupons = settings.shopCoupons || '';
		if ( settings.shopContinueUrl ) {
			$.fn.addShop.defaults.continueUrl = settings.shopContinueUrl.match(/^https?:/i)?
				settings.shopContinueUrl : 
				(window.location.origin + settings.shopContinueUrl);
		}
		
		// Setting up addPlayer defaults
		$.fn.addPlayer.defaults.backgroundColor = $('body').css('background-color').rgb2hex();
		if ( !settings.linkSlides ) {
			$.fn.addPlayer.defaults.fullScreen = settings.videoMaximize;
			$.fn.addPlayer.defaults.auto = settings.videoAuto;
			$.fn.addPlayer.defaults.solution = settings.prioritizeFlash? 'flash,html' : 'html,flash';
		}
		
		// Setting up image fitting and centering options
		$.fn.centerThis.defaults.fit = settings.fitImage;
		$.fn.centerThis.defaults.animate = settings.transitions;
		$.fn.centerThis.defaults.padding = settings.fitPadding;
		$.fn.centerThis.defaults.enlarge = !settings.fitShrinkonly;
		$.fn.centerThis.defaults.selector = '.' + id.main;
		
		// Setting up share options
		(function initShares(sh) {
			for ( var i in sh ) {
				if ( sh.hasOwnProperty(i) ) {
					$.fn.addSocial.defaults[i] = sh[i];
				}
			}
		})(settings.shares);
				
		settings.shareSlides = settings.shares && 
		( 	(settings.linkSlides && settings.shares.facebookLike) || 
			/*settings.shares.twitterTweet || settings.shares.googlePlus || settings.shares.tumblrBtn || settings.shares.pinItBtn || */ 
			settings.shares.facebook ||	settings.shares.twitter || settings.shares.gplus || 
			settings.shares.pinterest || settings.shares.digg || settings.shares.delicious || 
			settings.shares.myspace || settings.shares.stumbleupon || settings.shares.reddit || 
			settings.shares.email 
		);

		var today = Math.round((new Date()).getTime() / 86400000);
		
		var useCssFilter = VEND === 'ms' && Modernizr && Modernizr.opacity === false;				
		
		/*return this.each( function() {*/
		
		// Variables
		
		var images,						// All the images as passed to turtle
			items,						// The thumbnails container on index page
			gallery,					// Structural elements 
			wait,						// Wait animation layer
			navigation,					// Top navigation container
			controls,					// Control buttons
			bottom,						// Bottom (info) panel
			ctrl = {},					// Controls
			scrollbox,					// Thumbnail scroller box
			thumbs,						// The thumbnails 
			cimg = null,				// Current image layer
			pimg = null,				// Previous image layer
			curr = 0,					// current image
			to = null,					// timeout for slideshow
			sus = null,					// suspended timeout for videos
			index = $('body').attr('id') === 'index',	// on index page
			page = $('body').attr('id') === 'page', // on custom page
			dynamic = index && !settings.linkSlides, // dynamic mode or separate slides
			markers = [];				// all GPS markers
		
		// Scroll and Control layer over state and timeout
		
		var smo = false,
			cmo = false, 
			cto = null;
		
		// last window sizes to track with the resize event
		var rto = null,
			rlw = $(window).width(), 
			rlh = $(window).height();
			
		// Window resize action(s)
		
		var windowResized = function() {
			
			clearTimeout(rto);
			rto = setTimeout(function() {
				if (!$('.jp-video-full').length) {
					var rw = $(window).width(), 
						rh = $(window).height();
						
					if (rw !== rlw || rh !== rlh) {
						recenter();
						rlw = rw;
						rlh = rh;
					}
				}
			}, 100);
		};

		// last mouse positions
		var mly = -1, 
			mlx = -1;
			
		// Adding "Start slideshow" button
			
		var addShowStart = function( hd ) {
			
			if (!hd) {
				return;
			}
			
			var stb = $('<div>', {
					'class': id.startShow
				}).appendTo(hd),
			
				tx = $('<div>', {
					'class': id.startTxt,
					width: 'auto',
					text: text.startSlideshow 
				}).appendTo('body'),
				
				ow = stb.width(),
				
				mw = tx.outerWidth();
				
			stb.append(tx);
			
			// Showing text only on mouse over the button (only if not visible by default)
			
			if ( ow < mw ) {
				tx.on({
					mouseenter: function() {
						stb.stop(true, false).animate({
							width: mw
						}, 500);
					},
					mouseleave: function() {
						stb.stop(true, false).animate({
							width: ow
						}, 500);
					}
				});
			}
			
			// Starting slideshow
			
			stb.on({
				click: function(e) {
					if ( dynamic ) {
						e.preventDefault();
						if ( settings.slideshowFullScreen ) {
							$('html').fullScreen(true);
						}
						if (curr === images.length - 1) {
							showImg(0);
						} else {
							showImg();
						}
						if (images.length) {
							setTimeout(startAuto, 1000); 
						}
						return false;
					} else {
						saveSetting('slideshowOn', true, 8);
						window.location.href = images.filter('.' + id.active).attr('href');
					}
				}
			});
			
		};
					
		// Setting up the header on the original page
		
		var setupHeader = function( hd ) {
			
			if ( hd && hd.length ) {
				if ( index && images.length && settings.showStart ) {
					addShowStart(hd);
				}
				// Storing the up link
				settings.uplink = hd.find('.' + id.parent + '>a').attr('href') || '';
			}
		};
		
		// Nag screen
		
		var showNag = function() {
			
			if ( !settings.licensee && (typeof _jaShowAds === UNDEF || _jaShowAds) && !LOCAL && !$.cookie('ls') ) {
				var logo = settings.resPath + '/logo.png',
					img = $(new Image());
				img.load(function() {
					var p = $('<div>').css({ 
						background: 'url(' + logo + ') 10px top no-repeat', 
						textAlign: 'left', 
						minHeight: '60px', 
						paddingLeft: '90px' 
					}).html('<h4>Turtle skin <small>' + VER + '</small></h4><p>Unlicensed</p>');
					$('body').addModal(p, {
						width: 240,
						defaultButton: false,
						autoFade: 600
					});
					$.cookie('ls', true);
				}).attr('src', logo);
			}
		};
									
		// Keyboard handler
		
		var keyhandler = function(e) {
			if ( (gallery && gallery.is(':visible')) ||
					(document.activeElement && (document.activeElement.nodeName === 'INPUT' || 
					document.activeElement.nodeName === 'TEXTAREA')) || 
					($.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) ) {
				return true;
			}
			
			var k = e? e.keyCode : window.event.keyCode;

			switch( k ) {
				case 13: case 10:
					// Enter
					if (dynamic) {
						showImg();
					} else {
						window.location.href = images.eq(curr).attr('href');
					}
					break;
				/*
				case 27:
					// Esc
					goUp(); 
					break;
				*/
				case 37:
					curr = (curr? curr : images.length) - 1; 
					setActive(); 
					break;
				case 38:
					if (curr && settings.cols) {
						curr = Math.max(0, curr - settings.cols);
					}
					setActive(); 
					break;
				case 39:
					curr = (curr + 1) % images.length; 
					setActive();
					break;
				case 40: 
					if (curr < images.length - 1 && settings.cols) {
						curr = Math.min(images.length - 1, curr + settings.cols);
					}
					setActive(); 
					break;
				case 97: case 35:
					// End
					curr = images.length - 1; 
					setActive(); 
					break;
				case 103: case 36:
					// Home
					curr = 0; 
					setActive(); 
					break;
				case 106: case 179:
					// Start slideshow
					if ( dynamic && settings.slideshowFullScreen ) {
						cmo = false;
						$('html').fullScreen(true);
					}
					if ( dynamic ) {
						showImg();
					}
					startAuto(); 
					break;
				default:
					return true;
			}
			
			return false;
		};
			
		var galleryKeyhandler = function(e) {
			if ( gallery.is(':hidden') || 
				(document.activeElement && (document.activeElement.nodeName === 'INPUT' || 
				document.activeElement.nodeName === 'TEXTAREA')) || 
				($.isFunction(settings.enableKeyboard) && !settings.enableKeyboard()) ) {
				return true;
			}
			
			var k = e? e.keyCode : window.event.keyCode;

			switch( k ) {
				case 27:
					// Esc
					backToIndex(); 
					break; 
				case 37: 
					leftArrow(); 
					break;
				case 38: 
					upArrow(); 
					break;
				case 39: 
					rightArrow(); 
					break;
				case 40: 
					downArrow(); 
					break;
				case 97: case 35:
					// End
					if ( dynamic ) {
						showImg(images.length - 1);
					} else {
						window.location.href = settings.firstPage;
					}
					break;
				case 103: case 36:
					// Home
					if ( dynamic ) {
						showImg(0);
					} else {
						window.location.href = settings.firstPage;
					}
					break;
				case 106: case 179:
					// * Start/Stop slideshow
					if (to) { 
						stopAuto(); 
					} else { 
						if ( dynamic && settings.slideshowFullScreen )  {
							cmo = false;
							$('html').fullScreen(true);
						}
						startAuto(); 
					} 
					break;
				case 107:
					// + = Fit toggle
					zoomToggle(); 
					break;
				case 109:
					// - = Toggle panels
					togglePanels(); 
					break;
				default:
					return true;
			}
			
			return false;
		};

		// Going up one level
		
		var goUp = function() {
			var t = (settings.level > 0)? window : parent;
			// Test!!!
			t.location.href = settings.uplink || settings.indexPage || '../';
		};
		
		// Hiding gallery
		
		var backToIndex = function() {
			
			if ( !dynamic ) {
				if (settings.curr) {
					$.cookie('curr:' + settings.albumName + '/' + settings.relPath, settings.curr, settings.keepPrefs);
				}
				window.location.href = settings.indexPage;
			}
			
			if ( settings.skipIndex && !settings.level && !settings.uplink ) {
				return;
			}
			
			var i = $('[role=main]'), p;
			
			$.fn.hideAllTooltips();
			
			if ( gallery.is(':visible') ) {
				// Gallery is on
				stopAuto();
				if ( dynamic && settings.slideshowFullScreen ) {
					$('html').fullScreen(false);
				}
				if ( settings.skipIndex ) {
					goUp();
				} else {
					if ( i.length && i.is(':hidden') ) {
						i.children().addBack().css( { 
							visibility: 'visible', 
							display: 'block' 
						} );
						items.children('.' + id.cont).trigger('adjust');
						setTimeout(function() {
							items.loadImages();
						}, 100);
					}
					
					if ( settings.transitions ) {
						gallery.fadeOut(settings.speed);
					} else {
						gallery.hide();
					}
					
					// Pausing media playback
					if ( cimg && (p = cimg.find('.' + id.video + ',.' + id.audio)).length ) {
						p.trigger('pause');
					}
					
					// Refreshing map if any
					$('#' + id.map + '>.' + id.cont).trigger('adjust');
					
					if ( settings.hash !== 'no' ) {
						$.history.load('');
					}
				}
			} else if ( i.length && i.is(':hidden') ) {
				// Index page is hidden
				i.children().addBack().css({ 
					visibility: 'visible', 
					display: 'block' 
				});
				setTimeout(function() {
					items.loadImages();
				}, 100);
			}
			
			i.find('[role=scroll]').data('dragOn', false);
				
		};
					
		// Getting an image number based on its name or a jQuery element
		
		var getImg = function( n ) {
			var i;
			if ( n == null ) {
				i = curr;
			} else if ( typeof n === 'number' ) {
				i = Math.minMax(0, n, images.length);
			} else if ( (i = images.index(n)) < 0 && thumbs ) {
				i = thumbs.index(n);
			}
			return i;
		};
		
		// Find image by name
		
		var findImg = function( n ) {
			var i, e, s;
			for ( i = 0; i < images.length; i++ ) {
				e = images.eq( i ).children('img:first');
				s = e.length && (e.data(id.link) || e.data(id.src)).getFile();
				if ( s && s === n ) {
					return( i );
				}
			}
			return -1;
		};
		
		// Get the current filename
		
		var getCurrFile = function() {
			var e = images.eq(curr).children('img:first');
			return e.length? (e.data(id.link) || e.data(id.src)).getFile() : null;
		};
		
		// Handling Checkboxes
		
		var selectAll = function(on) {
			images.children('.' + id.checkbox).toggleClass(id.active, on);
			if (gallery) {
				gallery.find('.' + id.checkbox).toggleClass(id.active, on);
			}
		}
		
		var setupCheckboxes = function() {
			
			var clickBox = function(e) {
				e.preventDefault();
				var sel = $(this).hasClass(id.active);
				$(this).toggleClass(id.active, !sel);
				if ($(this).parent().hasClass(id.active)) {
					gallery.find('.' + id.checkbox).toggleClass(id.active, !sel);
				}
				return false; 
			};
			
			var dblClickBox = function(e) {
				e.preventDefault();
				selectAll(!$(this).hasClass(id.active));
				return false; 
			};
			
			// thumbnails
			images.children('.' + id.checkbox)
				.on('click', clickBox)
				.on(document.touchMode? 'dbltap' : 'dblclick', dblClickBox);
		};
			
		// Setting active image on both the thumb scroller and the source 
		
		var setActive = function( nofocus ) {
			var a = images.eq(curr);
			images.filter('.' + id.active).removeClass(id.active);
			a.addClass(id.active);
			
			if ( !settings.skipIndex && (typeof nofocus === UNDEF || nofocus === false) ) {
				a.trigger('setactive');
			}
			if ( thumbs ) {
				thumbs.filter('.' + id.active).removeClass(id.active);
				thumbs.eq(curr).addClass(id.active).trigger('setactive');
			}
			if ( settings.mapOnIndex ) {
				$('#' + id.map + ' .' + id.cont).trigger('setactive', a.find('img:first').data(id.mapid));
			}
			if ( curr ) {
				$.cookie('curr:' + settings.albumName + '/' + settings.relPath, curr, settings.keepPrefs);
			}
		};
		
		var clearActiveCookie = function() {
			$.cookie('curr:' + settings.albumName + '/' + settings.relPath, null);
		};
						
		// Right arrow pressed
		
		var rightArrow = function() {
			var el = $('.' + id.main), w = $('.' + id.img);
			if ( !el.length ) {
				return;
			}
			if ( el.position().left + el.outerWidth() <= w.width() - settings.fitPadding ) {
				nextImg();
			} else {
				var d = Math.round(w.width() * 0.8);
				el.animate({
					left: Math.max( (el.position().left - d), w.width() - settings.fitPadding - el.outerWidth() )
				}, settings.scrollDuration );
			}
		};
		
		// Left arrow pressed
		
		var leftArrow = function() {
			var el = $('.' + id.main), w = $('.' + id.img);
			if ( !el.length ) {
				return;
			}
			if ( el.position().left >= settings.fitPadding ) {
				previousImg();
			} else {
				var d = Math.round(w.width() * 0.8);
				el.animate({
					left: Math.min( (el.position().left + d), settings.fitPadding )
				}, settings.scrollDuration ); 
			}
		};
					
		// Up arrow pressed
		
		var upArrow = function() {
			var el = $('.' + id.main), w = $('.' + id.img);
			if ( !el.length || el.position().top > settings.fitPadding ) {
				return;
			}
			var d = Math.round(w.width() * 0.8);
			el.animate({
				top: Math.min( (el.position().top + d), settings.fitPadding )
			}, settings.scrollDuration ); 
		};
		
		// Down arrow pressed
		
		var downArrow = function() {
			var el = $('.' + id.main), w = $('.' + id.img);
			if ( !el.length || el.position().top + el.outerHeight() <= w.height() - settings.fitPadding ) {
				return;
			}
			var d = Math.round(w.width() * 0.8);
			el.animate({
				top: Math.max( (el.position().top - d), w.height() - settings.fitPadding - el.outerHeight() )
			}, settings.scrollDuration );
		};
		
		// Previous image
		
		var previousImg = function() {
			//log('previousImg');
			stopAuto();
			
			if ( dynamic ) {
				if ( curr ) {
					showImg(curr - 1);
				}
				else if ( settings.afterLast === 'startover' ) {
					showImg(images.length - 1);
				}
				else {
					cimg.find('.' + id.main).trigger('dragcancel');
				}
			} else {
				var l = $('.' + id.controls + ' .' + id.prev);
				if ( l.length && (l = l.attr('href')) !== NOLINK ) {
					window.location.href = l;
				} else {
					cimg.find('.' + id.main).trigger('dragcancel');
				}
			}
		};
		
		// Next image
		
		var nextImg = function(noStop) {
			
			//log('nextImg');
			
			var buttons = [];
			
			if ( dynamic ) {
					
				if ( curr < images.length - 1 ) {
					
					if (noStop) {
						keepAuto();
					} else {
						stopAuto();
					}
					showImg(curr + 1);
					return;
					
				} else {
					
					if ( settings.afterLast === 'startover' || to && settings.slideshowLoop ) {
						
						if (noStop) {
							keepAuto();
						} else {
							stopAuto();
						}
						showImg(0);
						return;
						
					} else {
						
						clearActiveCookie();
						cimg.find('.' + id.main).trigger('dragcancel');
						
						switch (settings.afterLast) {
							
						case 'onelevelup':
							if ( settings.uplink ) {
								goUp();
							}
							break;
							
						case 'backtoindex':
							if ( !settings.skipIndex ) {
								backToIndex();
							}
							break;
							
						case 'nextfolder':
							if ( settings.nextFoldersFirst ) {
								window.location.href = settings.nextFoldersFirst;
							}
							break;
							
						case 'ask':
							
							stopAuto();
							
							if ( images.length > 1 ) {
								// Start over
								buttons.push({
										t: text.startOver,
										h: function() { 
											showImg(0); 
										}
									}
								);
							}
							
							if ( settings.uplink ) {
								// Up one level
								buttons.push({
									t: (settings.level > 0)? text.upOneLevel : (settings.homepageLinkText || text.backToHome), 
									h: function() { 
										goUp(); 
									}
								});
							}
							
							if ( !settings.skipIndex ) {
								// Back to thumbnails
								buttons.push( {
									t: text.backToIndex, 
									h: function() { 
										backToIndex(); 
									}
								});
							}
							
							if ( settings.nextFoldersFirst ) {
								// Go to next folder
								buttons.push({
									t: text.nextFolder, 
									h: function() { 
										window.location.href = settings.nextFoldersFirst;
									}
								});
							}
					
							$('body').addModal($('<p>', { 
								text: text.atLastPageQuestion
							}), buttons, {
								type: 'question',
								uid: 'dialog',
								title: text.atLastPage,
								width: 500
							});
							
						}
						
						cimg.find('.' + id.main).trigger('dragcancel');
					}
				}
				
			} else {
				
				var l = $('.' + id.controls + ' .' + id.next);
				
				if ( l.length && (l = l.attr('href')) && l.length && l !== NOLINK ) {
					
					// Has next image
					saveSetting('slideshowDelay', settings.slideshowDelay);
					if ( to ) {
						saveSetting('slideshowOn', noStop, 8);
					}
					window.location.href = l;
				
				} else if ( settings.afterLast === 'ask' ) {
					
					// At last image
					stopAuto();
					cimg.find('.' + id.main).trigger('dragcancel');
					clearActiveCookie();
					
					if ( settings.firstPage ) {
						// Start over 
						buttons.push({
							t: text.startOver,
							h: function() { 
								if ( to ) {
									saveSetting('slideshowOn', to != null, 8);
								}
								window.location.href = settings.firstPage;  
							}
						});
					}
					
					if ( settings.uplink ) {
						// Up one level
						buttons.push({
							t: (settings.level > 0)? text.upOneLevel : (settings.homepageLinkText || text.backToHome), 
							h: function() { 
								goUp();
							}
						});
					}
					
					if ( settings.indexPage ) {
						// Back to thumbnails
						buttons.push({
							t: text.backToIndex, 
							h: function() { 
								window.location.href = settings.indexPage;
							}
						});
					}
					
					if ( settings.nextFoldersFirst ) {
						// Go to next folder
						buttons.push({
							t: text.nextFolder, 
							h: function() { 
								window.location.href = settings.nextFoldersFirst;
							}
						});
					}
					
					$('body').addModal($('<p>', { 
						text: text.atLastPageQuestion
					}), buttons, {
						uid: 'dialog',
						type: 'question',
						title: text.atLastPage,
						width: 500
					});
						
				}
				
			}
		};

		// Function to call at the end of a video
		
		var endedFn = function() {
			if ( sus ) {
				sus = clearTimeout(to);
				to = setTimeout(function() {
					nextImg(true);
				}, 300);
			}
		};

		// Restarts counting down for the next image in slideshow mode
		
		var keepAuto = function() {
			if ( to ) {
				clearTimeout(to);
				to = setTimeout(function() {
					nextImg(true);
				}, settings.slideshowDelay);
			}
		};
		
		// Starts slideshow mode
		
		var startAuto = function() {
			to = clearTimeout(to);
			var p;
			ctrl.play.hide();
			ctrl.pause.showin();
			if ( (p = cimg.find('.' + id.video + ',.' + id.audio)).length && (p.data('playing') || settings.videoAuto) ) {
				sus = true;
				p.trigger('setEndedFn', endedFn);
			} else {
				to = setTimeout(function() {
					nextImg(true);
				}, settings.slideshowDelay);
			}
			if ( settings.bgAudioId ) {
				$(settings.bgAudioId).trigger('play');
			}
			fadeCtrl();
		};
		
		// Stops slideshow mode
		
		var stopAuto = function() {
			sus = false;
			if (to) {
				var p;
				ctrl.pause.hide();
				ctrl.play.showin();
				to = clearTimeout(to);
				fadeCtrl();
				if ( !dynamic ) {
					saveSetting('slideshowOn', false);
				} else if ( settings.bgAudioId ) {
					$(settings.bgAudioId).trigger('pause');
				}
				if ( (p = cimg.find('.' + id.video + ',.' + id.audio)).length && (p.data('playing') || settings.videoAuto) ) {
					p.trigger('setEndedFn', null);
				}
			}
		};
		
		// Controls is on (no duplicate animation is needed)

		var con = false;
		
		// Showing controls
		
		var showCtrl = function() { 
			
			if ( cmo || con ) {
				return;
			}
			
			con = true;
			
			controls.stop(true, false).fadeTo(200, 0.8, function() {
				if ( useCssFilter ) {
					controls.css('filter', null);
				}
			});
			
			cto = setTimeout(function() { 
				fadeCtrl();
			}, 1500);
		};
		
		// Fading controls
		
		var fadeCtrl = function() {
			if ( cmo ) { 
				cto = setTimeout(function() { 
					fadeCtrl();
				}, 750);
			} else {
				con = false;
				cto = clearTimeout(cto);
				controls.fadeTo(500, settings.controlOutOpacity);
			}
		};
		
		// Toggle controls
		
		var toggleCtrl = function(e) {
			//if ( parseFloat(controls.css('opacity')) > settings.controlOutOpacity ) {
			if (e.target && (e.target.nodeName === 'A' || $(e.target).parents('.' + id.bottom).length)) {
				return true;
			}
			
			if ( con ) {
				con = false;
				cto = clearTimeout(cto);
				controls.fadeTo(500, settings.controlOutOpacity);
			} else {
				showCtrl();
			}
			return true;				
		};
		
		// Initializing bottom panel
		
		var initCaption = function() {
			
			if ( settings.infoOn ) {
				ctrl.showInfo.hide();
				ctrl.hideInfo.showin();
				bottom.show().css({
					bottom: 0
				});
			} else {
				ctrl.hideInfo.hide();
				ctrl.showInfo.showin();
				bottom.css({
					bottom: -bottom.outerHeight()
				}).hide();
			}
		};
		
		// Hiding bottom panel (info)
		
		var hideCaption = function() {
			
			if ( !settings.infoOn ) {
				return;
			}
			
			ctrl.hideInfo.hide();
			ctrl.showInfo.showin();
			
			if ( settings.transitions ) {
				bottom.animate({
					bottom: -bottom.outerHeight()
				}, 500, function() { 
					bottom.hide(); 
				});
			} else {
				bottom.css({
					bottom: -bottom.outerHeight()
				}).hide();
			}

			if ( cimg && settings.fitFreespace ) { 
				cimg.centerThis( {
					fit: settings.fitImage,
					marginTop: scrollboxHeight(),
					marginBottom: 0
				});
			}
			
			fadeCtrl();
			saveSetting('infoOn', false);
		};
		
		// Showing bottom panel
		
		var showCaption = function() {

			if ( settings.infoOn ) {
				return;
			}
			
			ctrl.showInfo.hide();
			ctrl.hideInfo.showin();
			
			if ( bottom.is(':hidden') ) {
				bottom.show().css({ 
					bottom: -bottom.outerHeight() 
				});
			}
			
			var ma = function() {
				bottom.children('.' + id.map).trigger('adjust');
			};
			if ( settings.transitions ) {
				bottom.animate({
					bottom: 0
				}, 500, ma);
			} else {
				bottom.show().css({
					bottom: 0
				});
				ma();
			}
			
			if ( cimg && settings.fitFreespace ) { 
				cimg.centerThis( {
					fit: settings.fitImage,
					marginTop: scrollboxHeight(),
					marginBottom: bottom.outerHeight()
				});
			}
			
			fadeCtrl();
			saveSetting('infoOn', true);
		};
		
		// Initializing scroll box on slide pages
		
		var initScrollbox = function() {
			
			if ( settings.thumbsOn ) {
				ctrl.showThumbs.hide();
				ctrl.hideThumbs.showin();
				navigation.css({
					top: 0
				}).removeClass('hide');
			} else {
				ctrl.hideThumbs.hide();
				ctrl.showThumbs.showin();
				navigation.css({
					top: -scrollbox.outerHeight() - 10
				}).removeClass('hide');
			}
		};
		
		// Hiding scroll box
		
		var hideScrollbox = function() {
			
			if ( !settings.thumbsOn ) {
				return;
			}
			
			ctrl.hideThumbs.hide();
			ctrl.showThumbs.showin();
			
			if ( settings.transitions ) {
				navigation.animate({
					top: -scrollbox.outerHeight() - 10
				}, 500);
			} else {
				navigation.css({
					top: -scrollbox.outerHeight() - 10
				});
			}
			
			if ( cimg && settings.fitFreespace ) { 
				cimg.centerThis( {
					fit: settings.fitImage,
					marginTop: 0,
					marginBottom: infoboxHeight()
				});
			}
			
			fadeCtrl();
			saveSetting('thumbsOn', false);
		};
		
		// Showing scroll box
		
		var showScrollbox = function() {
			
			if ( settings.thumbsOn ) {
				return;
			}
			
			ctrl.showThumbs.hide();
			ctrl.hideThumbs.showin();
			
			if ( settings.transitions ) {
				navigation.animate({
					top: 0
				}, 500);
			} else {
				navigation.css({
					top: 0
				});
			}
			
			if (cimg && settings.fitFreespace) { 
				cimg.centerThis( { 
					fit: settings.fitImage,
					marginTop: scrollbox.outerHeight(),
					marginBottom: infoboxHeight()
				});
			}
			
			fadeCtrl();
			saveSetting('thumbsOn', true);
		};
		
		// Toggling panels
		
		var togglePanels = function() {
			var fs = settings.fitFreespace;
			
			settings.fitFreespace = false;
			
			if ( settings.infoOn || settings.thumbsOn ) {
				hideScrollbox();
				hideCaption();
				if (cimg && fs) { 
					cimg.centerThis( { 
						fit: settings.fitImage,
						marginTop: 0,
						marginBottom: 0
					});
				}
			} else {
				showScrollbox();
				showCaption();
				if (cimg && fs) { 
					cimg.centerThis( { 
						fit: settings.fitImage,
						marginTop: scrollbox.outerHeight() || 0,
						marginBottom: bottom.outerHeight() || 0
					});
				}
			}
			
			settings.fitFreespace = fs;
		};
		
		// Scroll box height to calculate the free space for fitting the main image
		
		var scrollboxHeight = function() {
			return (settings.fitFreespace && navigation.position().top >= 0)? (scrollbox.outerHeight() || 0) : 0;
		};
		
		// Info box height
		
		var infoboxHeight = function() {
			return (settings.fitFreespace && bottom.is(':visible'))? (bottom.outerHeight() || 0) : 0;
		};
		
		// Realigning the main picture to fit and center the free space
		
		var recenter = function() {
			if (cimg) { 
				cimg.centerThis( { 
					fit: settings.fitImage,
					marginTop: scrollboxHeight(),
					marginBottom: infoboxHeight()
				});
			}
		};
		
		// Handling zoom
		
		var initZoom = function() {
			if (!settings.hideFitBtn) {
				if ( settings.fitImage ) {
					ctrl.resize.hide();
					ctrl.noresize.showin();
				} else {
					ctrl.noresize.hide();
					ctrl.resize.showin();
				}
			}
		};
		
		var zoomToggle = function() {
			if ( settings.fitImage ) {
				zoomReset();
			} else {
				zoomFit();
			}
		};
		
		var zoomReset = function() {
			if (!settings.hideFitBtn) {
				ctrl.noresize.hide();
				ctrl.resize.showin();
			}
			$.fn.centerThis.defaults.enlarge = !settings.fitShrinkonly;
			cimg.centerThis( {
				fit: false, 
				marginTop: scrollboxHeight(),
				marginBottom: infoboxHeight()
			});
			
			fadeCtrl();
			saveSetting('fitImage', false);
		};
		
		var zoomFit = function() {
			if (!settings.hideFitBtn) {
				ctrl.resize.hide();
				ctrl.noresize.showin();
			}
			$.fn.centerThis.defaults.enlarge = true;
			cimg.centerThis( { 
				fit: true,
				marginTop: scrollboxHeight(),
				marginBottom: infoboxHeight()
			});

			fadeCtrl();
			saveSetting('fitImage', true);
		};
			
		// Removing the attached behaviors and handlers
		
		var cleanupImg = function( el ) {
			el.trigger('destroy');
			el.find('.' + id.video + ',.' + id.audio).trigger('destroy');
			el.find('.' + id.share + '-' + id.icon).trigger('destroy');
			el.find('.' + id.map).trigger('destroy');
		};
		
		// Click handler
		
		var thumbClick = function(e) {
			e.preventDefault();
			if ( $(this).parents('[role=scroll]').data('dragOn') === true ) {
				return false;
			}
			showImg( $(this) ); 
			return false;
		};

		// Ditching previous image
		
		var trashImg = function( img ) {
			if (img && img.length) {
				img.stop();
				cleanupImg(img);
				img.remove();
			}
		};

		// Initializing history plugin :: Jumping to the hash image
			
		var goHash = function( hash ) {			
			var n;
			if ( hash && hash.length && 
				(n = (settings.hash === 'number')? ((parseInt( hash, 10 ) || 1) - 1) : findImg( hash )) >= 0 && n < images.length) {
				showImg(n, false);
				settings.slideshowAuto = false;
			} else {
				backToIndex();
				if ( VEND == 'ms' ) { 
					setTimeout(function() {
						$('[role=main]').show();
						$('[role=scroll]').trigger('adjust');
					}, 10 );
				}
			}
		};
		
		// Loading history state
		
		var loadHistory = function( n ) {
			if ( settings.hash === 'number' ) {
				$.history.load(n + 1);
			} else {
				var h = getCurrFile();
				if ( h ) {
					$.history.load( h );
				}
			}
		};

		// Showing image N
		
		var showImg = function( n, updateHash ) {
			
			//log('showImg('+n+')');
			
			if ( typeof updateHash === UNDEF ) {
				updateHash = true;
			}
			
			// If the argument is not number get the image no
			if ( typeof n !== 'number' ) {
				n = n? getImg( n ) : curr;
			}
			
			// Show gallery if we're on the index page
			if ( gallery.is(':hidden') ) {
				if ( cimg && cimg.data('curr') !== n ) {
					trashImg( cimg );
				}
				if ( settings.transitions ) {
					gallery.fadeIn(settings.speed);
				} else {
					gallery.show();
				}
				$.fn.hideAllTooltips();
				scrollbox.children(':first').loadImages();
			}
			
			// We're on the requested image already
			if ( cimg && cimg.data('curr') === n ) {
				//console.log('On current image');
				if (updateHash !== false) {
					loadHistory( n );
				}
				return;
			}
			
			// Variables
			var a = images.eq( n ),
				src = a.attr('href'),
				im = a.children('img').eq(0), 
				el, w, h;
			
			if ( !im.length ) {
				return;
			}
			
			// Stop and remove the current image
			if ( cimg ) {
				trashImg( pimg );
				pimg = cimg;
				pimg.css({
					zIndex: 0
				});
				setTimeout(function(el) {
					el.trigger('unswipe');
				}, 50, pimg.find('.' + id.main));
				if (document.touchMode) {
					//pimg[0].removeEventListener(TOUCH_START);
				} else {
					pimg.unmousewheel();
				}
			}
			
			// Remove all trash layers if exists
			if ( (el = gallery.children('.' + id.img).not(cimg)).length ) {
				el.stop().remove();
			}
			
			// Creating current image div 
			cimg = $('<div>', {
				id: 'img' + n,
				'class': id.img 
			}).css({
				zIndex: 1, 
				display: 'none'
			}).data({
				curr: n
			}).appendTo(gallery);
			
			if ( settings.clickBesideForIndex && (!settings.skipIndex || settings.level || settings.uplink) ) { 
				cimg.on('click', function(e) {
					if ( $(e.target).hasClass('img') ) {
						e.preventDefault();
						backToIndex();
						return false;
					}
				});
			}

			// Showing wait animation
			wait.css({
				opacity: 0, 
				display: 'block'
			}).animate({
				opacity: 1
			});

			// Setting the current thumb 'active' 
			curr = n; 
			setActive();
			
			if (dynamic && updateHash) {
				loadHistory(curr);
			}
			
			// Wrapper element
			var wr = $('<div>', { 
				'class': id.main 
			});
			
			// Checking type			
			if ( im.data(id.isother) || !src ) {
				
				// Other file type or external / embedded content
				w = Math.max(im.data(id.width) || gallery.width() - 160, 280);
				h = Math.max(im.data(id.height) || gallery.height() - 120, 200);
				
				wr.addClass(id.other);
				
				var cont = im.data(id.content);
				
				if ( cont && (cont = cont.trim()).length ) {
					
					// Embedding the external content into an iframe
					wr.css({
						width: w,
						height: h
					}).append(
						cont.match(/^https?:\/\//i)?
						$('<iframe>', { 
							width: '100%',
							height: '100%',
							src: cont,
							frameborder: 0,
							allowfullscreen: 'allowfullscreen'
						}) : cont 
					);
				} else {
					
					// Adding the thumbnail with a link to the original file
					wr.append( $('<a>', { 
						href: im.data(id.link), 
						target: '_blank' 
					}) );
					wr.append( $('<p>', { 
						text: text.clickToOpen 
					}) );
					wr.children('a:first').append(im.clone());
				}
				
				imgReady( wr );
				
			} else if ( im.data(id.isvideo) || im.data(id.isaudio) ) {
				
				// Video or audio file
				w = im.data(id.width) || gallery.width() - 160;
				h = im.data(id.height) || gallery.height() - 120;
				
				// Suspending slideshow
				sus = to;
				
				if ( sus ) {
					to = clearTimeout(to);
					// stopAuto();
				}
					
				if ( im.data(id.isvideo) ) {
					// Video
					var gw = gallery.width() - 40, gh = gallery.height() - 40;
					//h += getPlayerControlHeight(im.data(id.link));
					if ( w > gw || h > gh ) {
						var r = Math.min(gw / w, gh / h);
						w = Math.round(w * r);
						h = Math.round(h * r);
					}
					wr.addClass(id.video);
				} else {
					// Audio
					w = Math.max(240, im.data(id.width) || 0);
					h = Math.max(180, im.data(id.height) || 0);
					wr.addClass(id.audio);
				}
				
				// var nm = 'media' + curr;
				// Adding the thumbnail with a link to the original file
				wr.css({
					width: w,
					height: h
				}).data({
					ow: w, 
					oh: h 
				});
									
				setTimeout( function() {
						
					el = wr.addPlayer({
						src: im.data(id.link),
						title: settings.showVideoTitle? im.attr('alt') : '',
						poster: im.data(id.poster),
						ended: endedFn,
						resPath: settings.resPath
					});
					
				}, settings.speed / 3 );
				
				imgReady( wr );
					
			} else {
				
				// Picture
				w = im.data(id.width);
				h = im.data(id.height);
				
				var img = $(new Image());
				
				wr.addClass(id.image).append(img).css({
					width: w,
					height: h
				}).data({
					ow: w, 
					oh: h 
				});
				
				img.attr({
					src: src, 
					width: w || 'auto', 
					height: h || 'auto' 
				});
				
				if ( img[0].complete ) {
					im.data('cached', true);
					imgReady( wr );
				} else {
					img.on('load', function() { 
						im.data('cached', true);
						imgReady( wr );
					}).prop({
						src: src
					});
				}	
			}
			
			if ((el = a.find('.checkbox')).length) {
				wr.append(el = el.clone());
				el.on('click', function(e) {
					e.preventDefault();
					var sel = $(this).hasClass(id.active);
					$(this).toggleClass(id.active, !sel);
					images.filter('.' + id.active).find('.' + id.checkbox).toggleClass(id.active, !sel);
					return false;
				});
			}
			
			// Appending bottom info panel
			createInfo(im, n);
			
		};
		
		// Creating regions
		
		var createRegions = function( curr ) {
			var ra = cimg.find('nav a.' + id.regions + '-icon').eq(0);
			if ( ra.length ) {
				var im = images.eq(curr).find('img:first');
				ra.addRegions( cimg.find('.' + id.main).eq(0), im.data(id.regions) );
			}
		};
		
		// Activating actions attached to the image
		
		var tempLock = function( el ) {
			if (el && el.length) {
				el.data(id.kill, true);
				setTimeout(function() {
					if (el) {
						el.removeData(id.kill);
					}
				}, 500);
			}
		};
		
		var clickForNextAction = function( e ) {
			var el = $(e.target).parents('.' + id.main);
			if ( !el.data(id.kill) && !el[0]['dragOn'] ) {
				//log('next ' + el[0].draggable + (el[0].dragOn?'1':'0'));
				tempLock(el);
				//log('click: ' + el[0].id);
				nextImg();
			}
			return false;
		};
		
		var mouseWheelAction = function( e, d ) {
			e.preventDefault();
			var el = $(e.target).parents('.' + id.img);
			if ( !el.data(id.kill) ) {
				tempLock(el);
				//log('wheel: ' + el[0].id);	
				if (d > 0) { 
					previousImg(); 
				}
				else { 
					nextImg(); 
				}
			}
			return false;
		};
		
		var setupActions = function( el ) {
			
			// Prevent right click
			
			if ( settings.rightClickProtect ) {
				el.on('contextmenu', noAction);
			}

			// Actions attached to images, delayed by half transition speed
			
			setTimeout(function() {
					
				// Mouse wheel -> prev / next image, delayed by 1/4 transition speed
				if ( !document.touchMode && settings.enableMouseWheel ) {
					cimg.on('mousewheel', mouseWheelAction);
				}
				
				if ( document.touchMode ) {
					
					// Showing on touch devices after image change and not slideshow on
					if (!to)
						showCtrl();
					// cimg.logEvents();
					// Touch image -> control box toggle
					cimg[0].addEventListener(TOUCH_START, toggleCtrl);
					el.on({
						'click': noAction,
						'dbltap': zoomToggle
					});
					
				} else if ( images.length > 1 || !dynamic ) {
					
					// Click -> next image
					if ( el.hasClass(id.image) && settings.clickForNext ) {
						el.on('click', clickForNextAction);
					} else {
						el.on({
							'click': noAction,
							'dblclick': zoomToggle
						});
					}
				}
									
				if ( el.hasClass(id.image) /*&& (images.length > 1 || !dynamic) */) {
					
					// Swipe -> prev / next image
					el.addSwipe(nextImg, previousImg);
				}
				
			}, settings.speed / 2);
			
		};
		
		// cacheImg preloads one image
		
		var cacheImg = function( a ) {
			var src = a.attr('href'), 
				im = a.children('img').eq(0);
			
			if ( !src || !im || im.data('cached') || im.data(id.isvideo) || im.data(id.isother) ) {
				return;
			}
			
			$('<img>').on('load', function() {
				im.data('cached', true);
			}).attr({
				src: src
			});
		};
		
		// Preloading the neighboring pictures
		
		var preload = function() {
			
			if ( curr < images.length - 1) {
				cacheImg(images.eq(curr + 1));
			}
			if ( curr > 0 ) {
				cacheImg(images.eq(curr - 1));
			}				
		};
		
		// Image is ready, attaching event listeners, and placing it
		
		var imgReady = function( o ) {

			// Hiding wait animation
			if ( wait && wait.length ) {
				if ( settings.transitions ) {
					wait.stop(true, false).animate({
						opacity: 0
					}, {
						duration: 100,
						complete: function() { 
							$(this).hide(); 
						}
					});
				} else {
					wait.hide();
				}	
			}
			
			if ( dynamic ) {
				
				// Normal gallery
				if ( settings.transitions ) {
				
					// Stopping previous image
					if ( pimg ) {
						pimg.stop(true, false).animate({ 
							opacity: 0	
						}, settings.speed / 2, 'linear', function() {
							trashImg(pimg);
						});
					}
				} else {
					trashImg(pimg);
				}
				
				cimg.children().not('.' + id.bottom).remove();
				cimg.append(o);
				
			} else {
				
				// Slide page
				o = cimg.find('.' + id.main);
				if ( !o.length ) {
					return;
				}
			}
			
			var isimg = o.hasClass(id.image);
			setupActions( o );
			
			setTimeout(function() {
					
				// Showing the image - delayed by 50ms to allow time for building the bottom panel
				if ( settings.transitions ) {
					
					cimg.css({ 
						opacity: 0, 
						display: 'block' 
					}).animate({ 
						opacity: 1
					}, {
						duration: settings.speed,
						complete: useCssFilter? function() { 
							cimg.css({ 
								filter: '' 
							});
						} : null
					}).centerThis({
						init: true,
						speed: Math.round(settings.speed * 0.75),
						marginTop: scrollboxHeight(),
						marginBottom: infoboxHeight(),
						preScale: isimg && settings.preScale,
						animate: isimg && settings.preScale && settings.preScale !== 1.0,
						fit: settings.fitImage
					});
				
				} else {
					
					cimg.show().centerThis({
						init: true,
						marginTop: scrollboxHeight(),
						marginBottom: infoboxHeight(),
						fit: settings.fitImage
					});
				
				}
																
				createRegions( curr );
				
			}, 50);
			
			// Handling preload, hystory
			if ( dynamic ) {
				preload();
			} else if ( settings.slideshowOn ) {
				startAuto();
			}
		};
		
		// Creating bottom info panel
		
		var createInfo = function(im, n) {
			
			var c, m,
				d, h, tw = Math.round(cimg.width() * 0.8) - 30,
				isimg = !(im.data(id.isvideo) || im.data(id.isaudio) || im.data(id.isother));
			
			if ( dynamic ) {
				
				// Creating bottom panel
				
				bottom = $('<div>', { 
					'class': id.bottom 
				}).appendTo( cimg );
									
				c = $('<div>', { 
					'class': id.cont 
				}).appendTo( bottom );					
				
				if ( (typeof n !== UNDEF) && settings.showImageNumbers ) {
					c.append('<h4 class="nr"><strong>' + (n + 1) + '</strong> / ' + images.length + '</h4>');
				}
				
				// Adding caption
				
				if ( (d = im.data(id.caption)) ) {
					c.append(d);
				}
				
			} else {
				
				c = bottom.children('.' + id.cont);
			
			}
			
			// Buttons
			
			m = $('<nav>', {
				'class': 'buttons'	
			}).prependTo(c);
			
			// Setting max width for the container
			
			if ( c.width() > tw ) {
				c.width( tw );
			}				
			
			// Button clicked event
			
			var clicked = function(e) {
				e.preventDefault();
				
				var a = $(e.target),
					t = a.data('rel'),
					p = c.children('.' + t),
					on = p.is(':visible'),
					ih = infoboxHeight(),
					ph = p.outerHeight(true);
				
				a.toggleClass( id.active, !on );
				
				if ( t === id.map ) {
					var ma = function() {
						if ( !on ) {
							p.children('.' + id.mapcont).trigger('adjust'); 
						}
					};
					if ( settings.transitions ) {
						p.slideToggle('fast', ma);
					} else {
						p.toggle();
						setTimeout(ma, 50);
					}
				} else {
					if ( settings.transitions ) {
						p.slideToggle('fast');
					} else {
						p.toggle();
					}
				}
				
				if ( cimg && settings.fitFreespace ) {
					cimg.centerThis( { 
						fit: settings.fitImage, 
						marginTop: scrollboxHeight(),
						marginBottom: ih + (on? -ph : ph)
					});
				}
				
				saveSetting(t + 'On', !on);
				
				return false;
			};
			
			var addPanel = function(name, top) {
				var e = $('<div>', {
					'class': id.panel + ' ' + name 
				}).data('rel', name);
				
				if (top) {
					// adding at top
					var be = c.find('.'+id.panel).eq(0);
					if (be.length) {
						e = e.insertBefore(be);
					} else {
						e = e.appendTo(c);
					}
				} else {
					// bottom
					e = e.appendTo(c);
				}
				
				// adding icon
				e.append( $('<div>', { 
					'class': id.icon 
				}) );
				
				return e;
			};
			
			var addButton = function(name) {
				var a = $('<a>', { 
					//href: NOLINK, 
					'class': name + '-' + id.icon
				}).data('rel', name).appendTo(m);
				
				if ( settings.buttonLabels ) {
					a.text( text[name + 'Btn'] || name );
				}
				
				if (!document.touchMode) {
					a.addTooltip(text[name + 'Label'] || (settings.buttonLabels? '' : (text[name + 'Btn'] || name)));
				}
				
				a.on('click', clicked);
				
				return a;
			};
			
			// Adding 'share' button
			
			if ( settings.shareSlides ) {
				var sha;
				
				if ( settings.shareInline ) {
					sha = addPanel(id.share, true);
					addButton(id.share);
					sha = $('<div>', {
						'class': id.shares
					}).css('min-height', '25px').appendTo(sha);
				} else {
					sha =  $('<a>', { 
						'class': id.share + '-' + id.icon
					}).appendTo(m);
					
					if ( settings.buttonLabels ) {
						sha.text( text.shareBtn ); 
					}
				}
					
				if ( dynamic ) {
					h = ( settings.hash === 'number' )? (curr + 1) : getCurrFile();
					
					setTimeout( function() {
						sha.addSocial({ 
							hash: h,
							inline: settings.shareInline,
							buttonLabels: settings.shareLabels, 
							title: (im.data(id.caption) || '').stripHTML(),
							image: im.data(id.src)
						});
					}, settings.speed / 2 );
					
				} else {
					
					sha.addSocial( {
						useHash: false,
						inline: settings.shareInline,
						buttonLabels: settings.shareLabels,
						title: (im.data(id.caption) || '').stripHTML(),
						image: im.data(id.src)
					});
				}
			}
			
			// Facebook / Disqus commenting on slides
			
			var e;
			
			if ( !dynamic && (e = c.children('.' + id.comments)).length ) {
				e.data('rel', id.comments);
				addButton(id.comments);
			}
			
			// Creating buttons, panels
			
			var t, panel = [ id.meta, id.map, id.shop, id.print ];
			
			for ( var i = 0; i < panel.length; i++ ) {
				t = panel[i];
				
				if ( im.data(t) != null && (t != id.map || settings.mapOnSlide) ) {
					addPanel(t);
					addButton(t);
				}
			}
			
			// Photos only:
			
			if ( isimg ) {
				
				// Adding 'fotomoto' button
				
				if ( settings.fotomotoOn ) {
					var fa = $('<a>', { 
						//href: '', 
						'class': id.fotomoto + '-' + id.icon,
						text: (settings.buttonLabels? text.fotomotoBtn:'')
					}).appendTo(m);
					
					fa.addTooltip(LOCAL? text.locationWarning : ('<h5>Fotomoto</h5>' + text.fotomotoLabel));
					
					setTimeout(function() {
						fa.on('click', function(e) {
							e.preventDefault();
							if ( typeof FOTOMOTO !== UNDEF && !LOCAL ) {
								FOTOMOTO.API.showWindow( 10, 
									im.data(id.link) || 
									(dynamic? im.data(id.src) : im.attr('src')).replace(settings.thumbs + '/', settings.slides + '/') 
								);
							}
							return false;
						});
					}, settings.speed);
				}

				// Adding 'mostphotos' button
				
				if ( d = im.data(id.mostphotos) ) {
					if (!d.startsWith('http')) {
						d = 'http://www.mostphotos.com/' + d;
					}
					var ma = $('<a>', { 
						href: d, 
						'class': id.mostphotos + '-' + id.icon,
						text: (settings.buttonLabels? text.mostphotosBtn:''),
						target: '_blank'
					}).appendTo(m);
					
					ma.addTooltip('<h5>' + text.mostphotosBtn + '</h5>' + text.mostphotosLabel);						
				}
				
				// Adding 'regions' button
				
				if ( im.data(id.regions) ) {
					var ra =  $('<a>', { 
						//href: '', 
						'class': id.regions + '-' + id.icon
					}).appendTo(m);
					
					if ( settings.buttonLabels ) {
						ra.text(text.people);
					}
					
					if ( settings[id.regions + 'On'] ) {
						ra.addClass( id.active );
					}
					
					ra.on('click', function() { 
						saveSetting(id.regions + 'On', !$(this).hasClass( id.active ));
					});
				}
			}
			
			// Adding 'original' button
			
			if ( (d = im.data(id.link)) && 
				((!isimg && settings.downloadNonImages) || (isimg && !settings.rightClickProtect)) ) {
				var a = $('<a>', { 
					href: d, 
					'class': id.link + '-' + id.icon,
					download: '',
					target: '_blank'
				}).appendTo(m);
				
				if ( settings.buttonLabels ) {
					a.text( im.data(id.isoriginal)? text.original : text.hiRes );
				}
				
				a.addTooltip( (settings.buttonLabels? '' : ('<strong>' + (im.data(id.isoriginal)? text.original : text.hiRes) + '</strong><br>')) + 
					(('download' in a[0])? '' : ('<small>' + text.saveTip + '<br>')) + 
					'<input class="fullw" type="text" value="' + d.fullUrl() + '" readonly></small>',
					{
						stay: 5000
					}
				);
			}
			
			// Adding custom Image Hook panel
			
			if ( settings.imgHook ) {
				
				var shh = $('<a>', {
					//href: '',
					'class': id.custom + '-' + id.icon
				}).appendTo(m);
				
				if ( settings.buttonLabels && settings.imgHookBtn ) {
					shh.text( settings.imgHookBtn );
				}
				
				shh.on('click', function(e) {
					e.preventDefault();
					var fn = im.data(id.link) || (dynamic? im.data(id.src) : im.attr('src')).replace(settings.thumbs + '/', '');
					$('body').addModal( $(settings.imgHook.replace(/\%fileName\%/g, fn)), {
						uid: id.custom,
						width: settings.imgHookWidth || 600,
						title: settings.imgHookBtn,
						defaultButton: 'okButton',
						resizable: true,
						savePosition: true
					});
					return false;
				});
			}
			
			// Calling image ready function if defined
			
			if ( settings.imgHookFn && $.isFunction(settings.imgHookFn) ) {
				settings.imgHookFn.call(im);
			}
			
			// Appending to current image layer
			
			// cimg.append( bottom );
			
			// Adding content
			
			c.children( '.' + id.panel ).each(function() {
				
				var e = $(this),
					t = e.data('rel');
				
				if ( t && (d = im.data(t)) !== null ) {
					
					if ( t === id.map ) {
						
						var mc = $('<div>', { 
							'class': id.mapcont 
						}).appendTo(e);
						
						mc.width(c.width() - 30);
						
						if ( settings.mapAll ) {
							
							var markerClick = function() {
								if ( dynamic ) {
									showImg( this.link );
								} else {
									window.location.href = this.link;
								}
							};
							
							mc.addMap({
								click: markerClick,
								markers: markers,
								curr: parseInt(dynamic? im.data(id.mapid) : thumbs.filter('.' + id.active).find('img:first').data(id.mapid), 10)
							});
							
						} else {
							var l = (im.data(id.caption) || '').stripHTML() || im.attr('alt') || ((curr + 1) + '');
							mc.addMap({
								map: d,
								label: l
							});
						}
						
						setTimeout(function() {
							mc.trigger('adjust');
						}, settings.speed );

					} else if ( t === id.shop ) {
						var op = {};
						if (d !== '+') {
							op.options = d;
						}
						if ((d = im.data(id.discount)) !== null) {
							op.discount = d;
						}
						e.addShop(im.closest('a'), op);
						
					} else {
						
						e.append(d);
					}
					
					// Setting up visibility
					
					if ( !settings[t + 'On'] ) {
						e.hide();
					} else {
						m.children('a.' + t + '-icon').addClass(id.active);
					}
				}
			});
							
			// No buttons added? > Remove menu
			
			if ( !m.html().length ) {
				m.remove();
			}
			
			// Hide the whole panel
			
			if ( !settings.infoOn ) {
				bottom.hide();
			}
			
		};
		
		// Sending feedback
		
		var sendFeedback = function() {
			
			var el = $('<div>', {
				'class': id.feedback
			});
			
			var url = window.location.href.getDir();
			
			var f = $('<form>', {
				id: id.feedback
			}).appendTo(el);
			
			if (settings.directKey) {
				f.append('<input type="hidden" name="from" value="' + settings.feedbackEmail.replace('|','@') + '">');
				f.append('<input type="hidden" name="to" value="' + xDecrypt(settings.directKey) + '">');
				f.append($('<p class="email"><label for="email">' + text.yourEmail + '</label>' +
					'<input id="email" name="email" type="email"></p>'));
			}
			
			f.append($('<p class="subject"><label for="subject">' + text.subject + '</label>' +
				'<input id="subject" name="subject" value="' + settings.albumName + (settings.relPath.length? ('/' + settings.relPath):'') + '"></p>'));
			
			f.append($('<p class="message"><label for="message">' + text.message + '</label>' +
				'<textarea id="message" name="message"></textarea></p>'));
			
			images.filter(function() { 
				return $(this).children('.' + id.active).length; 
			}).each(function(i) {
				var im = $(this).find('img').eq(0),
					t = im.data('src'),
					fn = ((im.data(id.isimage) || im.data(id.isother))? t : (im.data('link') || '')).getFile();
				f.append($('<div><aside><img src="' + t + '"></aside><div><a class="remove">&times;</a><label for="img' + i + '">' + fn + '</label>' +
					'<input type="hidden" name="file[' + (i + 1) + ']" value="' + url + '#' + encodeURIComponent(fn) + '">' +
					'<textarea id="img' + i + '" name="comment[' + (i + 1) + ']" placeholder="' + text.comment + '"></textarea></div></div>'));
			});
			
			f.find('a.remove').on('click', function(e){
				e.preventDefault();
				$(this).parents('div').eq(1).remove();
				return false;
			});
			
			var submitForm = function(w) {
				if (!w || !w.length) {
					if (console)
						console.log('Submitform Error: Missing form');
					return false;
				}
				
				var v,  
					err = false,
					f = w.find('form').eq(0), 
					url = window.location.href.split('#')[0];
				
				if (settings.directKey) {
										
					v = f.find('input#email').val();
				
					if (!v.length || !v.match(/^\S+@\S+[\.][0-9a-z]+$/)) {
						$('body').addModal($('<div>', {
							html: text.emailMissing
						}), {
							type: 'error'
						});
						return false;
					}
					
					var callback = function( data ) {
						if (data.Result === 'Ok') {
							$('body').addModal($('<div>', {
								html: text.messageSent
							}), {
								autoFade: 1500
							});
						} else {
							err = true;
							if (DEBUG && console) {
								console.log('Error sending mail: Result='+data.Result+' Cause='+data.Cause);
							}
							$('body').addModal($('<div>', {
								html: '<h3>' + text.errorSending + '</h3><p class="err">' + data.Result + ', ' + data.Cause + '</p>'
							}), {
								type: 'error'
							});
						}
					};
				   
					$.ajax({
						url: 'http://jalbum.net/integration/api/sendmail.json',
						dataType: 'jsonp',
						data: f.serialize(),
						success: function(data) { callback(data); }
					});
					
					if (err) {
						return false;
					}
					
				} else if (settings.php) { 
				
					$.ajax({
						url: resPath + 'feddback.php',
						type: 'POST',
						data: {
							'message': f.serialize(),
							'subject': 'Subject of your e-mail'
						},
						success: function(data) {
							alert('You data has been successfully e-mailed');
							alert('Your server-side script said: ' + data);
						}
					});

				} else {
				
					var s = 'mailto:' + encodeURIComponent(settings.feedbackEmail.replace('|', '@'));
				
					s += '?subject=' + encodeURIComponent(f.find('input#subject').val());
					
					s += '&body=';
					if (v = f.find('textarea#message').val()) {
						s += encodeURIComponent(v + '\n\n');
					}
					
					f.children('div').each(function(i) {
						s += encodeURIComponent((i + 1) + '. ' + url + '#' + encodeURIComponent($(this).find('label').eq(0).text()) + '\n');
						if (v = $(this).find('textarea').val()) {
							s += encodeURIComponent(v + '\n');
						}
						s += encodeURIComponent('\n');
					});
					
					if (s.length > 2048) {
						$('body').addModal($('<div>', {
							html: '<p>' + text.tooLong + '</p>'
						}), {
							type: 'error'
						});
						return false;
					}
					window.location.href = s;
				}
				
				return true;
			};
			
			f.on('submit', function() {
				return submitForm($('#feedback'));
			});
								
			$('body').addModal(el, [{
				t: text.send,
				h: submitForm
			}], {
				uid: 'feedback',
				enableKeyboard: false,
				title: text.sendFeedback,
				width: 480,
				resizable: true,
				savePosition: true
			});
			
			return false;
		};
		
		// Buying multiple items 
		
		var shopAll = function() {
			var ns = false;
			var it = images.filter(function() {
				var t = $(this), d;
				if (t.children('.'+id.checkbox).hasClass(id.active)) {
					// Filter only items with global shop options
					t = t.children('img:first');
					d = t.data(id.shop);
					ns = true;
					return !(d && d !== '+' || t.data(id.discount));
				}
				return false;
			});
			
			if (it.length === 0) {
				$('body').addModal($('<h3>' + text.noItemsSelected + '</h3><p>' + (ns? text.nonShoppableItems : text.selectItemsHint) + '</p>'), {
					type: 'warning'
				});
				return;
			}
			
			var el = $('<div>', {
				'class': id.shopAll
			});
			
			var url = window.location.href.getDir();
			
			var tl = $('<ul>', {
				'class': id.thumbs
			}).appendTo(el);
			
			it.each(function() {
				tl.append($('<li>').append($('<img>', {
					src: $(this).children('img:first').data('src')
				})));
			});
					
			var sh = $('<div>', {
				'class': id.shop
			}).appendTo(el);
			
			sh.addShop(it);
			
			$('body').addModal(el, {
				uid: id.shopAll + 'w',
				title: text.buyNItems.replace("{0}", it.length),
				width: 640,
				resizable: true,
				savePosition: true,
				enableKeyboard: false,
				blocking: true,
				defaultButton: 'close'
			});
			
		};
		
		// Creating control bar
		
		var createControls = function() {
			
			controls = $('<nav>', { 
				'class': id.controls + ' clearfix'
			}).appendTo(navigation);
			
			// Previous button
			
			ctrl.prev = $('<a>', { 
				'class': id.prev, 
				title: text.previousPicture 
			}).appendTo(controls);
			
			// Up button
			
			if ( !settings.skipIndex || settings.level || settings.uplink ) { 
				ctrl.up = $('<a>', { 
					'class': id.up, 
					title: settings.skipIndex? text.upOneLevel : text.backToIndex 
				}).appendTo(controls);
			}
			
			// Fit / 1:1 button
			
			ctrl.noresize = $('<a>', { 
				'class': id.noresize, 
				title: text.oneToOneSize 
			}).appendTo(controls);
			
			ctrl.resize = $('<a>', { 
				'class': id.resize, 
				title: text.fitToScreen 
			}).appendTo(controls);
			
			if ( settings.hideFitBtn ) {
				ctrl.resize.add(ctrl.noresize).hide();
			} else {
				ctrl.resize.togglein(!settings.fitImage); 
				ctrl.noresize.togglein(settings.fitImage);
			}
			
			// Thumbnail panel toggle button		
			
			ctrl.hideThumbs = $('<a>', { 
				'class': id.hideThumbs, 
				title: text.hideThumbs 
			}).appendTo(controls);
			
			ctrl.showThumbs = $('<a>', { 
				'class': id.showThumbs, 
				title: text.showThumbs 
			}).appendTo(controls);
			
			ctrl.showThumbs.togglein(!settings.thumbsOn); 
			ctrl.hideThumbs.togglein(settings.thumbsOn); 
			
			// Info panel toggle button		
			
			ctrl.hideInfo = $('<a>', { 
				'class': id.hideInfo, 
				title: text.hideInfo 
			}).appendTo(controls);
			
			ctrl.showInfo = $('<a>', { 
				'class': id.showInfo, 
				title: text.showInfo 
			}).appendTo(controls);
			
			ctrl.showInfo.togglein(!settings.infoOn); 
			ctrl.hideInfo.togglein(settings.infoOn); 
			
			// Play / pause button		

			ctrl.play = $('<a>', { 
				'class': id.play, 
				title: text.startAutoplay
			}).appendTo(controls);
			
			ctrl.pause = $('<a>', { 
				'class': id.pause, 
				title: text.stopAutoplay 
			}).appendTo(controls);
			
			if (images.length > 1) {
				ctrl.play.togglein(!settings.slideshowAuto); 
				ctrl.pause.togglein(settings.slideshowAuto);
			} else {
				ctrl.play.add(ctrl.pause).hide();
			}
			
			// Next image button		

			ctrl.next = $('<a>', { 
				'class': id.next, 
				title: text.nextPicture 
			}).appendTo(controls);
			
		};
		
		// Setting up control bar actions
		
		var setupControlBehavior = function() {
			
			// Calculating width
			
			var w = 0;
			
			controls.children().each(function() { 
				if ($(this).css('display') !== 'none') {
					w += $(this).outerWidth();
				}
			});
			
			controls.css({
				marginLeft: -Math.floor(w/2)
			}).width(w);
			
			if (!document.touchMode) {
				controls.children('a').not(ctrl.play).addTooltip({ 
					delay: 500 
				});
			}
			
			var sd = $('<div>', {
					'class': 'slideshowdelay',
					text: ctrl.play.prop('title')
				}),
				f = $('<form>').appendTo(sd);
			
			f.on('submit', function(e) {
				e.preventDefault();
				startAuto();
				return false;
			}).append( $('<input>', {
					type: 'text',
					value: settings.slideshowDelay / 1000
				}).focus().on('change', function() {
					saveSetting('slideshowDelay', Math.round(parseFloat($(this).val() * 1000) || $.fn.turtle.defaults.slideshowDelay));
					return true;
				})
			).append( $('<a>', {
					'class': 'button',
					href: NOLINK,
					text: ' '
				}).on('click', playClick) 
			);
			f.find('input');
			
			ctrl.play.prop('title', '').addTooltip(sd, {
				stay: 5000
			});
			
			if ( !document.touchMode ) {
				if ( dynamic ) {
					controls.hide();
				} else {
					cto = setTimeout(function() { 
						fadeCtrl();
					}, 1500);
				}
			}
			
			// Saving mouse over state
			controls.on({
				mouseenter: function() { 
					cmo = true; 
					$(this).stop(true, false).fadeTo(200, 1.0);
				},
				mouseleave: function() { 
					cmo = false;
					$(this).stop(true, false).fadeTo(200, 0.8);
				}
			});
			
			// showing control bar on mousemove
			if ( !document.touchMode ) {
				
				gallery.on('mousemove', function(e) {
					if (!smo && ((mly - e.clientY) || (mlx - e.clientX))) {
						if ( mlx >= 0 ) { 
							// Not first event
							showCtrl();
						}
						mlx = e.clientX;
						mly = e.clientY; 
					}
				});
			}
		};
		
		// Initializng the control bar
		
		var prevClick = function(e) {
			e.preventDefault();
			stopAuto(); 
			previousImg(); 
			return false; 
		};
		
		var upClick = function(e) {
			e.preventDefault();
			stopAuto();
			backToIndex(); 
			return false; 
		};
		
		var upClickSlide = function() {
			if (settings.curr) {
				$.cookie('curr:' + settings.albumName + '/' + settings.relPath, settings.curr, 600);
			}
			return true;
		}
		
		var noresizeClick = function(e) {
			e.preventDefault();
			zoomReset(); 
			return false; 
		};
		
		var resizeClick = function(e) {
			e.preventDefault();
			zoomFit(); 
			return false; 
		};
		
		var hideInfoClick = function(e) {
			e.preventDefault();
			hideCaption(); 
			return false; 
		};
		
		var showInfoClick = function(e) {
			e.preventDefault();
			showCaption(); 
			return false; 
		};
		
		var hideThumbsClick = function(e) {
			e.preventDefault();
			hideScrollbox(); 
			return false; 
		};
		
		var showThumbsClick = function(e) {
			e.preventDefault();
			showScrollbox(); 
			return false; 
		};
		
		var playClick = function(e) {
			e.preventDefault();
			if ( dynamic && settings.slideshowFullScreen ) {
				cmo = false;
				$('html').fullScreen( true );
			}
			startAuto(); 
			return false; 
		};
		
		var pauseClick = function(e) {
			e.preventDefault();
			stopAuto(); 
			return false; 
		};
		
		var nextClick = function(e) {
			e.preventDefault();
			keepAuto(); 
			nextImg(); 
			return false; 
		};
		
		var setupControls = function() {
			
			createControls();
			
			ctrl.prev.on('click', prevClick);
			if (ctrl.up) ctrl.up.on('click', upClick);
			ctrl.noresize.on('click', noresizeClick);
			ctrl.resize.on('click', resizeClick);
			ctrl.hideInfo.on('click', hideInfoClick);
			ctrl.showInfo.on('click', showInfoClick);
			ctrl.hideThumbs.on('click', hideThumbsClick);
			ctrl.showThumbs.on('click', showThumbsClick);
			ctrl.play.on('click', playClick);
			ctrl.pause.on('click', pauseClick);
			ctrl.next.on('click', nextClick);
							
			setupControlBehavior();
		};
		
		// Initializing the control bar for the slide page
		
		var setupSlideControls = function() {
			
			ctrl.prev = controls.children('.' + id.prev);
			ctrl.up = controls.children('.' + id.up);
			ctrl.noresize = controls.children('.' + id.noresize);
			ctrl.resize = controls.children('.' + id.resize);
			ctrl.hideInfo = controls.children('.' + id.hideInfo);
			ctrl.showInfo = controls.children('.' + id.showInfo);
			ctrl.hideThumbs = controls.children('.' + id.hideThumbs);
			ctrl.showThumbs = controls.children('.' + id.showThumbs);
			ctrl.play = controls.children('.' + id.play);
			ctrl.pause = controls.children('.' + id.pause);
			ctrl.next = controls.children('.' + id.next);
			
			if (scrollbox.find('.'+id.cont+' a').length > 1) {
				ctrl.play.togglein(!settings.slideshowAuto); 
				ctrl.pause.togglein(settings.slideshowAuto);
			} else {
				ctrl.play.add(ctrl.pause).hide();
			}
			
			if (settings.hideFitBtn) {
				ctrl.resize.add(ctrl.noresize).hide();
			}
			
			if (ctrl.up) ctrl.up.on('click', upClickSlide);
			ctrl.noresize.on('click', noresizeClick);
			ctrl.resize.on('click', resizeClick);
			ctrl.hideInfo.on('click', hideInfoClick);
			ctrl.showInfo.on('click', showInfoClick);
			ctrl.hideThumbs.on('click', hideThumbsClick);
			ctrl.showThumbs.on('click', showThumbsClick);
			ctrl.play.on('click', playClick);
			ctrl.pause.on('click', pauseClick);
			ctrl.next.on('click', nextClick);
			
			setupControlBehavior();
		};

		// Setting up thumbnails
		
		var setupThumbs = function() {
			var t, im, h;
			
			var saveCurr = function() {
				var c = images.index($(this));
				if (c) {
					$.cookie('curr:' + settings.albumName + '/' + settings.relPath, c, settings.keepPrefs);
				}
			};
		
			images.each( function() {
				
				t = $(this);
				im = t.find('img').eq(0);
				if ( !im.length ) {
					return;
				}
									
				// Right-click protection
				if ( settings.rightClickProtect ) {
					t.on('contextmenu', noAction);
				}
				
				// Mark thumbnails to be loaded later
				if ( im.attr('src').endsWith('/' + settings.loadImg) ) {
					im.addClass(id.toload);
				}
									
				// Mark as new
				if ( settings.markNewDays && (today - parseInt(im.data(id.modified) || 0, 10)) <= settings.markNewDays ) {
					t.append($('<span>', {
						'class': id.newItem,
						text: text.newItem
					}));
				}
				
				// Adding mouseover hint
				if ( !document.touchMode ) {
					t.addTooltip({
						delay: 500
					});
				}
						
				// Saving the current element when navigating away
				if ( !dynamic ) {
					images.on('click', saveCurr);
				}
			
			});
							
			// Loading the thumbnails for the first time
			setTimeout(function(){
				items.loadImages();
				// second attempt after rendering
				setTimeout(function(){
					items.loadImages();
				}, 1200);
			}, 100);
			
			var loadImgs = function() {
				items.loadImages();
				return true;
			};
	
			if ( document.touchMode ) {
				items[0].addEventListener('scroll', loadImgs);
				items[0].addEventListener(TOUCH_END, loadImgs);					
			}
			
			// Setting up the checkboxes
			setupCheckboxes();
			
			$('#' + id.selectAll).on('click', function(e) {
				e.preventDefault();
				selectAll(true);
				return false;
			});
			
			$('#' + id.selectNone).on('click', function(e) {
				e.preventDefault();
				selectAll(false)
				return false;
			});
			
			// Buy button
			$('#' + id.shopAll).on('click', shopAll);

		};
		
		// Settings up folders
		
		var setupFolders = function() {
			
			items.find('.' + id.folders).on('click', function() {
				$.cookie('curr:' + settings.albumName + '/' + settings.relPath, null);
				return true;
			});
		};
		
		// Copying thumbnails to gallery page
		
		var setupThumbScroller = function() {
			var t, el, i, im, tc, w = 0, rw, rh, tw, th, r, nl;
			
			// Creating structure: <div class=""><div class="wrap"><ul>...</ul></div></div>
			scrollbox = $('<div>', { 
				'class': id.scrollbox 
			}).appendTo(navigation);
			
			tc = $('<div>', { 
				'class': 'wrap' 
			}).appendTo(scrollbox);
			
			tc = $('<ul>', { 
				'class': id.cont + ' ' + id.load
			}).appendTo(tc);
			
			images.each( function() {
				
				t = $(this);
				im = t.find('img').eq(0);
				if ( !im.length ) {
					return;
				}
				
				// Adding thumb: <li><a><img/></a></li>
				el = $('<a>', { 
					href: NOLINK 
				}).appendTo( $('<li>').appendTo(tc) );
				
				// Reduced dimensions (calculated only once)
				if ( !rw ) {
					if (isNaN(rw = parseInt(el.css('width'),10))) {
						rw = 133;
					}
					if (isNaN(rh = parseInt(el.css('height'),10))) {
						rh = 100;
					}
				}
				
				// Normalizing to fit
				tw = im.attr('width');
				th = im.attr('height');
				if ( tw > rw || th > rh ) {
					if ( tw / rw > th / rh ) {
						th = Math.round( th * rw / tw );
						tw = rw;
					} else {
						tw = Math.round( tw * rh / th );
						th = rh;
					}
				}		
				
				// Adding image
				
				i = $('<img>', {
					src: im.attr('src'),
					'class': im.attr('class')
				}).data({
					src: im.data('src') 
				}).appendTo(el);
				
				if (tw && th) {
					i.attr({
						width: tw,
						height: th
					});
				}
				
				// New label
				
				nl = t.children('.' + id.newItem);
				if (nl.length) {
					el.append(nl.clone());
				}
				
				// Adding mouse over hint
				
				if (!document.touchMode) {
					el.addTooltip( t.data('hint') || t.siblings('.' + id.caption).html(), {
						delay: 500
					});
				}
														
				//w += a.outerWidth();

			});
			
			// Setting width with margins added
			
			el = tc.children('li').first();
			if (el.length) {
				if (isNaN(w = parseInt(el.css('width'),10))) {
					w = 135;
				} else {
					w += (parseInt(el.css('marginLeft'),10) || 0) +
						(parseInt(el.css('marginRight'),10) || 0);
				}
	
				tc.width(w * tc.children().length + 2);
			}
			
			// Adding scroller
			
			tc.scrollThumbs({
				enableMouseWheel: settings.enableMouseWheel
			});
					
			thumbs = scrollbox.find('li > a');
			thumbs.on('click', function() {
				if ( $(this).parents('[role=scroll]').data('dragOn') === true ) {
					return false;
				}
				if ( !$(this).hasClass(id.active) ) {
					stopAuto();
					showImg( thumbs.index($(this)) );
				}
				setActive();
				return false;
			});
		};
		
		// Initializing thumbs on the slide pages
		
		var setupSlideThumbs = function() {
			
			var tc = scrollbox.find('.' + id.cont), 
				w = 0;
			
			if (!document.touchMode) {
				thumbs.addTooltip({
					delay: 500		
				}).each(function() { 
					w += $(this).outerWidth();
				});
			}
			
			// Setting width with margins added
			w +=  thumbs.length * 2;
			tc.width(w);
			
			tc.scrollThumbs({
				enableMouseWheel: settings.enableMouseWheel
			});
			
			thumbs.on('click', function() {
				return !$(this).parents('[role=scroll]').data('dragOn');
			});
			
			tc.trigger('setactive');
			
			if ( !settings.thumbsOn ) {
				navigation.css('top', -scrollbox.outerHeight() - 10);
			}
		};
			
		// Initializing Turtle on the index page
		
		var initIndex = function() {
			
			// Setting up the header actions
			setupHeader( $(settings.header) );
			
			// Initializing thumbs and folders
			items = $('.' + id.items);
			if (images.length) {
				setupThumbs();
			}
			setupFolders();
			
			// Feedback button
			$('#' + id.feedback).on('click', sendFeedback);
			
			if (images.length) {
				
				// Finding all map coordinates
				if ( settings.mapOnIndex || settings.mapAll && settings.mapOnSlide ) {
					markers = images.collectMarkers({ 
						dynamic: dynamic 
					});
				}
			
				// Creating map on the index page
				if ( settings.mapOnIndex && markers.length ) {
					$('#' + id.map + ' .' + id.cont).addMap({
						click: function() {
							if ( dynamic ) {
								showImg( this.link );
							} else {
								window.location.href = this.link;
							}
						},
						markers: markers,
						range: 999,
						curr: 0
					});				
				}
			
				// Setting the active element
				if ( (curr = $.cookie('curr:' + settings.albumName + '/' + settings.relPath)) === null ||
					curr >= images.length ) {
					curr = 0;
					setActive( true );
				} else {
					setTimeout(function() {
						setActive();
					}, 300);
				}
				
				// Installing keyboard listener
				if ( ($.isFunction(settings.enableKeyboard) || settings.enableKeyboard) ) {
					$(window).on('keydown', keyhandler);
				}
			}
		};
		
		var initGallery = function() {
				
			// Click handler
			images.on('click', thumbClick);
				
			// Creating Turtle gallery structure
			
			// the main container
			gallery = $('<div>', { 
				'class': id.gallery 
			}).attr('role', 'gallery').appendTo('body');
			
			// wait layer
			wait = $('<div>', { 
				'class': id.wait 
			}).appendTo(gallery);
			
			// Navigation items
			navigation = $('<div>', { 
				'class': id.navigation 
			}).appendTo(gallery);
			
			// Creating the thumbnail scroller box
			setupThumbScroller();
			
			// Controls array
			setupControls();
			
			if ( !settings.thumbsOn ) {
				navigation.css('top', -scrollbox.outerHeight() - 10);
			}
			
			// Show / hide the control strip on mouse move
			scrollbox.on({
				mouseenter: function() { 
					fadeCtrl(); 
					smo = true; 
				},
				mouseleave: function() { 
					smo = false; 
				}
			});
				
			// Initializing history plugin
			if ( $('body').attr('id') !== 'page' && settings.hash && settings.hash !== 'no' ) {
				$.history.init(goHash);
			}
							
			// Starting slideshow
			if ( settings.slideshowAuto ) {
				if ( dynamic && settings.slideshowFullScreen ) {
					$('html').fullScreen( true );
				}
				showImg( curr );
				startAuto();
			} else if ( settings.skipIndex ) {
				showImg( curr );
			}

			// Installing keyboard listener
			if ( ($.isFunction(settings.enableKeyboard) || settings.enableKeyboard) ) {
				$(window).on('keydown', galleryKeyhandler);
			}
		};
		
		// Initializing Slide page
					
		var initSlide = function() {
			
			gallery = $('.' + id.gallery);
			navigation = $('.' + id.navigation);
			controls = $('.' + id.controls);
			cimg = $('.' + id.img);
			bottom = $('.' + id.bottom);
			images = cimg.children('.' + id.main);
			curr = 0;
			scrollbox = $('.' + id.scrollbox);
			thumbs = scrollbox.find('li > a');

			var img = images.find('img:first');
			
			// Finding all map coordinates
			if ( settings.mapAll ) {
				markers = thumbs.collectMarkers();
			}
			
			// Scroll box
			setupSlideThumbs();
			
			// Control bar
			setupSlideControls();
			
			// Initializing panels
			initScrollbox();
			initCaption();
			initZoom();
			
			// Showing the image and placing center
			if ( img.length ) {
				if ( images.hasClass(id.image) && !img[0].complete ) {
					// Not in cache
					img.on('load', function() {
						img.data('cached', true);
						imgReady();	
					}).attr({
						src: img.attr('src') // fixing a bug in IE
					});
					wait = $('<div>', {
						'class': id.wait
					}).appendTo(gallery);
					wait.fadeIn();
				} else {
					// In cache
					img.data('cached', true);
					imgReady();
				}
				
				createInfo(img);
			}
							
			// Installing keyboard listener
			if ( ($.isFunction(settings.enableKeyboard) || settings.enableKeyboard) ) {
				$(window).on('keydown', galleryKeyhandler);
			}
			
		};
		

		/////////////////////////////////
		//
		//   Starting  Turtle gallery
		//
		/////////////////////////////////
		
		// the images array passed to Turtle
		// Format
		// Index page: <ul><li><a><img></a></li>...</ul>
		// Slide page: <a></a> 
							
		if ( index ) {
			
			setTimeout( showNag, 1000 );
			
			images = $(this).find('td > a');
			
			initIndex();
			
			if ( images.length && dynamic ) {
				initGallery();
			}
			
		} else {
			
			images = $(this);
			
			initSlide();
		}
		
		// Avoid submit event in textarea elements: adding line feed instead
		/*
		$(document).on('keydown', function(e) {
			if (e.target.nodeName === 'TEXTAREA') {
				var k = e? e.keyCode : window.event.keyCode;
				if (k === 13 || k === 10) {
					if ($.getCursorPosition) {
						var el = $(e.target),
							i = el.getCursorPosition();
						el.val(el.val().substring(0,i) + '\n' + el.val().substring(i));
						el.setCursorPosition(i + 1);
					}
					e.preventDefault();
					return false;
				}
			}
			return true;
		});
		*/
		
		// Resize event
		if (images.length && dynamic || !page) {
			
			$(window).on('resize', windowResized);
			if ( document.touchMode ) {
				$(window).on('orientationchange', windowResized);
			}
		}
		
		return this;
		
	};
	
	// Default settings
	
	$.fn.turtle.defaults = {
		header: '#main header',		// Main header selector
		slides: 'slides',			// Default slides folder name
		thumbs: 'thumbs',			// Default thumbs folder name
		linkSlides: false,			// Separate slide pages mode
		loadImg: 'blank.png',		// Default load image name
		hash: 'fileName',			// Hash type: 'no' || 'number' || 'fileName'
		resPath: 'res/',			// relative path to '/res' folder
		relPath: '',				// relative path from '/res' back to current folder
		level: 0,					// gallery level (0 = top level)
		skipIndex: false,			// skip the index (thumbnail) page and goes straight to gallery
		showStart: true,			// Show "Start slideshow" button
		keepPrefs: 600,				// Time to keep preferences (s)
		speed: 600,					// picture transition speed (ms)
		controlbarOpacity: 0,		// opacity of control bar when the mouse is not over
		controlOutOpacity: 0,		// minimum opacity of control bar 
		transitions: true,			// use transitions?
		preScale: 0.95,				// size of the image before the transitions starts
		slideshowDelay: 4000,		// slideshow delay 3 s
		slideshowLoop: false,		// automatically starts over
		slideshowAuto: false,		// automatically starts with the first image
		slideshowFullScreen: false, // go Full screen during slideshows?
		markNewDays: 0,				// : days passed by considered a picture is 'new' :: 0 == no mark
		afterLast: 'ask',			// Deafult action after the last frame ( ask|backtoindex|onelevelup|startover )
		thumbsOn: false,			// Show the thumbnail scroller by default?
		
		fitImage: false,			// Fit the images to window size by default or use 1:1?
		fitShrinkonly: false,		// Fit only by shrinking (no enlarging)
		fitFreespace: true,			// Fit only the space below the thumbnail scroller
		hideFitBtn: false,			// Hide fit / 1:1 button?
		fitPadding: 15,				// Distance from the window border
		borderWidth: 10,			// Image border width
		
		clickForNext: true,			// Click through navigation
		clickBesideForIndex: false,	// Click beside for getting back to index
		rightClickProtect: false,	// No right-click menu on main images
		
		showImageNumbers: true,		// Show the actual image number on the info panel?
		buttonLabels: false,		// Show labels on the buttons?
		infoOn: true,				// Show bottom info panel?
		metaOn: false,				// Show Metadatas by default?
		
		mapOn: false,				// Map options
		mapOnIndex: false,
		mapOnSlide: false,
		mapType: 'roadmap',
		mapZoom: 18,
		mapAll: false,
		
		shopOn: true,				// Shopping options
		shopGateway: 'paypal',
		shopCurrency: 'USD',
		
		//fotomotoOn: false,			// Fotomoto panel
		shareOn: false,				// Sharing panel
		commentOn: false,			// Commenting panel
		printOn: false,				// Printing panel
		regionsOn: false,			// Show regions
		downloadNonImages: false,	// Enable download button for non-images
		
		enableKeyboard: true,		// Enable keyboard controls?
		enableMouseWheel: true,		// Enable mouse wheel?
		
		videoAuto: false,			// automatic play of videos
		videoMaximize: false,		// maximize to fit screen
		videoTitleOn: false,		// display title
		prioritizeFlash: false,		// flash first
		
		scrollDuration: 1000		// Image scroll duration when controlled from keyboard
	};
	
	// Class names and data- id's
	
	$.fn.turtle.ids = {	
		gallery: 'gallery',			// The container for gallery
		items: 'items',				// Items container = the scrollable area
		folders: 'folders',			// folders
		thumbs: 'thumbs',			// thumbnails
		navigation: 'navigation',	// Navigation at top
		scrollbox: 'scrollbox',		// Thumbnail scroller box
		active: 'active',			// active state
		parent: 'parent',			// up link
		bottom: 'bottom',			// bottom section
		img: 'img',					// one image
		main: 'main',				// the main image class
		image: 'image',				// image class
		video: 'video',				// video class
		audio: 'audio',				// audio class
		other: 'other',				// other file panel class 
		wait: 'wait',				// wait animation
		cont: 'cont',				// inside containers generated by the script
		panel: 'panel',				// general panel on the bottom
		icon: 'icon',				// icon container
		caption: 'caption',			// caption markup
		meta: 'meta',				// metadata container / also the name of data attr
		map: 'map',					// map container class
		mapcont: 'mapcont',			// map inside wrapper
		mapid: 'mapid',				// map marker unique id
		shop: 'shop',				// shop container class
		shopAll: 'shopall',			// shop multiple items
		discount: 'discount',		// discount data
		fotomoto: 'fotomoto',		// fotomoto class
		mostphotos: 'mostphotos',	// mostphotos class
		share: 'share',				// share container class
		shares: 'shares',			// shares
		print: 'print',				// print container class
		comments: 'comments',		// commenting container class 
		link: 'link',				// link to original / hi res.
		custom: 'custom',			// custom button hooked on image
		poster: 'poster',			// high res poster for audio and video
		isoriginal: 'isoriginal',	// link points to original or hi res.?
		content: 'content',			// content : iframe, html or link
		width: 'width',				// width attribute
		height: 'height',			// height attribute
		src: 'src',					// source link
		ext: 'ext',					// file extension
		thumbExt: 'thumbext',		// thumbnail extension
		regions: 'regions',			// Area tagging
		isimage: 'isimage',			// is image attr
		isvideo: 'isvideo',			// is video attr
		isaudio: 'isaudio',			// is audio attr
		isother: 'isother',			// is other attr
		modified: 'modified',		// modified x days ago attr
		startShow: 'startshow',		// Start Slideshow button
		startBtn: 'startbtn',		// Button class
		startTxt: 'starttxt',		// Start text class
		controls: 'controls',
		prev: 'prev',				// control strip classes
		next: 'next',
		up: 'up',
		noresize: 'noresize',
		resize: 'resize',
		hideInfo: 'hideinfo',
		showInfo: 'showinfo',
		hideThumbs: 'hidethumbs',
		showThumbs: 'showthumbs',
		play: 'play',
		pause: 'pause',
		newItem: 'newlabel',
		showHint: 'showhint',
		kill: 'kill',				// Image must not receive further events - an event is already processed
		load: 'load',				// Element that holds loadable items
		toload: 'toload',			// img.toload the images to load
		feedback: 'feedback',		// feedback window
		checkbox: 'checkbox',		// checkboxes
		selectAll: 'selectall',		// select all
		selectNone: 'selectnone'	// select none
	};

	// Texts to use as default
	
	$.fn.turtle.text = {
		startSlideshow: 'Start slideshow',
		close: 'Close',
		atLastPage: 'At last page', 
		atLastPageQuestion: 'Where to go next?', 
		startOver: 'Start over', 
		backToHome: 'Back to home',
		stop: 'Stop', 
		upOneLevel: 'Up one level',
		backToIndex: 'Back to index page',
		previousPicture: 'Previous picture',
		nextPicture: 'Next picture',
		previousFolder: 'Previous folder',
		nextFolder: 'Next folder',
		changeSpeed: 'Change speed',
		oneToOneSize: '1:1 size',
		fitToScreen: 'Fit to screen',
		showInfo: 'Show caption / info',
		hideInfo: 'Hide caption / info',
		showThumbs: 'Show thumbnails',
		hideThumbs: 'Hide thumbnails',
		startAutoplay: 'Start autoplay',
		stopAutoplay: 'Stop autoplay',
		newItem: 'NEW',
		clickToOpen: 'Click to open this document with the associated viewer',
		commentsBtn: 'Comments',
		commentsLabel: 'Add a comment, view other\'s comments',
		metaBtn: 'Photo data', 
		metaLabel: 'Display photograpic (Exif/Iptc) data', 
		mapBtn: 'Map',
		mapLabel: 'Show the photo location on map',
		shopBtn: 'Buy',
		shopLabel: 'Show options to buy this item',
		shareBtn: 'Share',
		shareLabel: 'Share this photo over social sites',
		download: 'Download', 
		original: 'Original', 
		hiRes: 'Hi res.',
		saveTip: 'Use Right click -> Save link as... to download',
		fotomotoBtn: 'Buy / Share',
		fotomotoLabel: 'Buy prints or digital files, send free eCard through Fotomoto',
		mostphotosBtn: 'Purchase',
		mostphotosLabel: 'Download this image from <b>mostphotos.com</b>!',
		people: 'People',
		sendFeedback: 'Send feedback',
		message: 'Message',
		subject: 'Subject',
		comment: 'Comment',
		yourEmail: 'Your email address',
		send: 'Send',
		messageSent: 'Message sent',
		errorSending: 'Error sending email!',
		tooLong: 'Text is too long or too many items!',
		emailMissing: 'Email is misssing or wrong!',
		noItemsSelected: 'No items selected!',
		selectItemsHint: 'Select the desired items first!',
		nonShoppableItems: 'The selected items have no or have proprietary shopping options, or different discount rates.',
		buyNItems: 'Buy {0} items',
		locationWarning: 'Works only when uploaded'
	};
	
})(jQuery);