/* 
 * Main.js
 */
	
	var st,
		trl = 500;
	
	function showButtons(e) {
		var eTop = document.getElementById('items').offsetTop,
			toItemsBtn = document.getElementById('toItems'),
			toTopBtn = document.getElementById('toTop');

		if ((window.scrollY + window.innerHeight) <= eTop) {
			// Header is higher than window
			toItemsBtn.style.display = 'block';
			toItemsBtn.scrollWidth;
			toItemsBtn.style.opacity = 1;
			toTopBtn.style.opacity = 0;
			setTimeout(function() {
				toTopBtn.style.display = 'none';
			}, trl);
		} else if (window.scrollY > eTop) {
			// Below itemstop
			toTopBtn.style.display = 'block';
			toTopBtn.scrollWidth;
			toTopBtn.style.opacity = 1;
			toItemsBtn.style.opacity = 0;
			setTimeout(function() {
				toItemsBtn.style.display = 'none';
			}, trl);
		} else {
			toTopBtn.style.opacity = 0;
			toItemsBtn.style.opacity = 0;
			setTimeout(function() {
				toItemsBtn.style.display = 'none';
				toTopBtn.style.display = 'none';
			}, trl);
		}
	}
	
	function scrolled(e) {
		clearTimeout(st);
		st = setTimeout(showButtons, 50);
	}
	
	function toItems(e) {
		var eTop = document.getElementById('items').offsetTop;
			
		if (window.scrollY < eTop) {
			window.scrollTo(0, eTop);
		}
		return false;
	}
	
	function toTop(e) {
		var wScroll = window.scrollY;
		
		if (wScroll > 0) {
			window.scrollTo(0, 0);
		}
		return false;
	}
	
	window.addEventListener('resize', showButtons);
	window.addEventListener('scroll', scrolled);
	document.getElementById('toItems').addEventListener('click', toItems);
	document.getElementById('toTop').addEventListener('click', toTop);
	showButtons();

