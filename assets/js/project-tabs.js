/*
	Hover tabs for the "Other Projects" section.

	Hover is the primary interaction, but it can't be the only one — a touch
	screen has no hover and a keyboard user never fires one. So the same
	activation is wired to pointerenter, click and the WAI-ARIA tab pattern's
	arrow keys, and the hover half is gated behind a fine-pointer check so a
	tap doesn't both hover and click.

	No dependencies; the template's jQuery is not needed here.
*/

(function () {

	'use strict';

	var tabsets = document.querySelectorAll('[data-tabs]');
	if (!tabsets.length)
		return;

	// Coarse pointers (touch) report a spurious hover on tap, so hover
	// activation is desktop-only. Older Safari lacks matchMedia.
	var finePointer = window.matchMedia
		? window.matchMedia('(hover: hover) and (pointer: fine)').matches
		: true;

	Array.prototype.forEach.call(tabsets, function (tabs) {

		var tabList = tabs.querySelectorAll('[role="tab"]'),
			panels = tabs.querySelectorAll('[role="tabpanel"]');

		if (!tabList.length || tabList.length !== panels.length)
			return;

		function activate(index, moveFocus) {

			Array.prototype.forEach.call(tabList, function (tab, i) {

				var selected = (i === index),
					panel = document.getElementById(tab.getAttribute('aria-controls'));

				tab.setAttribute('aria-selected', selected ? 'true' : 'false');

				// Roving tabindex: only the selected tab is a tab stop, so
				// Tab moves past the whole list rather than through it.
				tab.setAttribute('tabindex', selected ? '0' : '-1');
				tab.classList.toggle('is-active', selected);

				if (panel) {
					panel.classList.toggle('is-active', selected);
					// hidden, not just display:none, so the inactive panels'
					// "Learn more" links stay out of the tab order.
					if (selected)
						panel.removeAttribute('hidden');
					else
						panel.setAttribute('hidden', '');
				}

			});

			if (moveFocus)
				tabList[index].focus();

		}

		Array.prototype.forEach.call(tabList, function (tab, i) {

			tab.addEventListener('click', function () {
				activate(i, false);
			});

			if (finePointer) {
				tab.addEventListener('pointerenter', function (event) {
					if (event.pointerType === 'mouse')
						activate(i, false);
				});
			}

			// Focus follows automatic activation, matching the hover
			// behaviour: arrowing through the list reveals each panel.
			tab.addEventListener('keydown', function (event) {

				var last = tabList.length - 1,
					next;

				switch (event.key) {
					case 'ArrowDown':
					case 'ArrowRight':
						next = (i === last) ? 0 : i + 1;
						break;
					case 'ArrowUp':
					case 'ArrowLeft':
						next = (i === 0) ? last : i - 1;
						break;
					case 'Home':
						next = 0;
						break;
					case 'End':
						next = last;
						break;
					default:
						return;
				}

				event.preventDefault();
				activate(next, true);

			});

		});

	});

})();
