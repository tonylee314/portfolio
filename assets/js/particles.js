/*
	Floating particles background.

	A vanilla port of the Framer "FloatingParticlesBackground" component. That
	module is a React component (it imports react, react/jsx-runtime and the
	framer runtime as bare specifiers), but everything inside the hooks is
	plain canvas work, so the simulation is reproduced here directly rather
	than pulling a React stack onto a jQuery page.

	Faithful to the original: particle init, the mouse-proximity opacity and
	glow response with its eased in/out rates, the per-frame jitter, the
	0.999 damping, edge wrapping, and the shadowBlur glow draw.

	Added here: device-pixel-ratio scaling (the original rendered at CSS
	pixels, which is soft on retina), pausing when scrolled out of view since
	the page runs two fields, and a static frame under prefers-reduced-motion
	— which mirrors the component's own isStatic branch.

	Configure per element with data attributes; defaults match the component's.

		<div data-particles
		     data-particle-count="50"
		     data-particle-size="2"
		     data-particle-opacity="0.6"
		     data-glow-intensity="10"
		     data-movement-speed="0.5"
		     data-mouse-influence="100"
		     data-particle-color="#ffffff"></div>
*/

(function () {

	'use strict';

	var hosts = document.querySelectorAll('[data-particles]');

	if (!hosts.length || !document.createElement('canvas').getContext)
		return;

	var reduceMotion = window.matchMedia
		&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function opt(el, name, fallback) {
		var raw = el.getAttribute('data-' + name);
		if (raw === null || raw === '')
			return fallback;
		var n = parseFloat(raw);
		return isNaN(n) ? fallback : n;
	}

	function Field(host) {

		var cfg = {
			count: opt(host, 'particle-count', 50),
			size: opt(host, 'particle-size', 2),
			opacity: opt(host, 'particle-opacity', 0.6),
			glow: opt(host, 'glow-intensity', 10),
			speed: opt(host, 'movement-speed', 0.5),
			influence: opt(host, 'mouse-influence', 100)
		};

		var explicitColor = host.getAttribute('data-particle-color');

		// Re-read every frame rather than once at init: an explicit
		// data-particle-color always wins (the hero and secondary-page
		// header pin theirs there, since both stay a fixed dark gradient
		// regardless of site theme), otherwise it follows --particle-color
		// — which does change, live, when the theme toggle flips
		// [data-theme] on <html>, no reinitialising the field required.
		function color() {
			return explicitColor
				|| getComputedStyle(host).getPropertyValue('--particle-color').trim()
				|| '#ffffff';
		}

		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d'),
			particles = [],
			mouse = { x: -9999, y: -9999 },
			width = 0,
			height = 0,
			frame = null,
			visible = true;

		canvas.className = 'particles-canvas';
		host.appendChild(canvas);

		function seed() {
			particles = [];
			for (var i = 0; i < cfg.count; i++)
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * cfg.speed,
					vy: (Math.random() - 0.5) * cfg.speed,
					size: Math.random() * cfg.size + 1,
					opacity: cfg.opacity,
					baseOpacity: cfg.opacity,
					glowMultiplier: 1
				});
		}

		function resize() {

			var rect = host.getBoundingClientRect(),
				dpr = window.devicePixelRatio || 1;

			if (!rect.width || !rect.height)
				return;

			width = rect.width;
			height = rect.height;

			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!particles.length)
				seed();
			else
				// The original redistributes rather than rescales, so a
				// resize reshuffles the field instead of stretching it.
				particles.forEach(function (p) {
					p.x = Math.random() * width;
					p.y = Math.random() * height;
				});
		}

		function update() {

			particles.forEach(function (p) {

				var dx = mouse.x - p.x,
					dy = mouse.y - p.y,
					distance = Math.sqrt(dx * dx + dy * dy),
					target;

				if (distance < cfg.influence && distance > 0) {

					var force = (cfg.influence - distance) / cfg.influence;

					p.opacity = Math.min(1, p.baseOpacity + force * 0.4);

					// Eased toward the lifted glow, then eased back more
					// slowly on the way out — the component's "ease" mode.
					target = 1 + force * 2;
					p.glowMultiplier += (target - p.glowMultiplier) * 0.15;

				}
				else {

					p.opacity = Math.max(p.baseOpacity * 0.3, p.opacity - 0.02);

					target = 1;
					p.glowMultiplier = Math.max(1, p.glowMultiplier + (target - p.glowMultiplier) * 0.08);

				}

				p.x += p.vx;
				p.y += p.vy;

				// Keeps the drift from settling into straight lines.
				p.vx += (Math.random() - 0.5) * 0.001;
				p.vy += (Math.random() - 0.5) * 0.001;

				p.vx *= 0.999;
				p.vy *= 0.999;

				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;

			});

		}

		function draw() {

			ctx.clearRect(0, 0, width, height);

			// One lookup per frame, not per particle — cheap either way at
			// field sizes here, but no reason to repeat it 50 times.
			var fill = color();

			particles.forEach(function (p) {
				ctx.save();
				ctx.shadowColor = fill;
				ctx.shadowBlur = cfg.glow * p.glowMultiplier * 2;
				ctx.globalAlpha = p.opacity;
				ctx.fillStyle = fill;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			});

		}

		function tick() {
			update();
			draw();
			frame = window.requestAnimationFrame(tick);
		}

		function start() {
			if (frame === null)
				frame = window.requestAnimationFrame(tick);
		}

		function stop() {
			if (frame !== null) {
				window.cancelAnimationFrame(frame);
				frame = null;
			}
		}

		resize();

		if (reduceMotion) {
			// One frame, no loop: the field is decoration, and animating it
			// is exactly what a reduced-motion preference is asking against.
			draw();
			return;
		}

		// Mouse position is tracked relative to the canvas but listened for
		// on the window, so particles near an edge still react as the pointer
		// approaches from outside — matching the original.
		window.addEventListener('mousemove', function (event) {
			var rect = canvas.getBoundingClientRect();
			mouse.x = event.clientX - rect.left;
			mouse.y = event.clientY - rect.top;
		}, { passive: true });

		window.addEventListener('resize', resize, { passive: true });

		if (typeof ResizeObserver !== 'undefined')
			new ResizeObserver(resize).observe(host);

		// Two fields on one page, only ever one of them on screen.
		if (typeof IntersectionObserver !== 'undefined') {
			new IntersectionObserver(function (entries) {
				visible = entries[0].isIntersecting;
				if (visible) start();
				else stop();
			}).observe(host);
		}
		else
			visible = true;

		document.addEventListener('visibilitychange', function () {
			if (document.hidden) stop();
			else if (visible) start();
		});

		start();

	}

	Array.prototype.forEach.call(hosts, function (host) {
		new Field(host);
	});

})();
