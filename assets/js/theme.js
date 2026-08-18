/*
	Theme toggle.

	The actual theme decision happens earlier, in a tiny inline script at the
	top of <head> on every page — it has to run before first paint (so the
	page never flashes the wrong theme), which means it has to run before
	this file has even started downloading. This file only handles what
	can wait: revealing the toggle button, wiring its click handler, and
	keeping the two bits of UI that don't update themselves from CSS alone
	in sync with the current theme.

	Everything else on the page repaints from the [data-theme] attribute via
	custom properties in custom.css. Three things don't, because they're not
	CSS-only: the Leadership & Involvement logos are separate image files per
	theme (the PNGs are pixel-recoloured for a specific background, not
	recolourable at the CSS layer), and the toggle's own aria-label/
	aria-pressed need updating so the accessible name still matches what a
	click will do.
*/

(function () {

	'use strict';

	var root = document.documentElement;
	var STORAGE_KEY = 'theme';

	function apply(theme) {

		root.setAttribute('data-theme', theme);

		Array.prototype.forEach.call(document.querySelectorAll('.involvement-logo img[data-src-dark]'), function (img) {
			var src = theme === 'light' ? img.getAttribute('data-src-light') : img.getAttribute('data-src-dark');
			if (img.getAttribute('src') !== src)
				img.setAttribute('src', src);
		});

		Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (btn) {
			btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
			btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
		});

	}

	// The inline head script already set [data-theme] before paint; this
	// just brings the logo srcs and button labels into sync with whatever
	// it decided, then takes over from here.
	var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
	apply(current);

	Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (btn) {

		// Hidden by default (see custom.css) so a JS-disabled visitor never
		// sees a button that does nothing.
		btn.hidden = false;

		btn.addEventListener('click', function () {
			current = current === 'light' ? 'dark' : 'light';
			try {
				localStorage.setItem(STORAGE_KEY, current);
			} catch (e) {
				// Private browsing / storage disabled — the toggle still
				// works for the rest of this page view, it just won't be
				// remembered next visit.
			}
			apply(current);
		});

	});

})();
