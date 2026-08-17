/**
 * Pymes Solutions — comportamiento de la interfaz.
 * Sin dependencias externas.
 */
(function () {
	"use strict";

	var header = document.getElementById("site-header");
	var toggle = document.getElementById("nav-toggle");
	var menu = document.getElementById("nav-menu");
	var links = menu ? menu.querySelectorAll("a") : [];
	var desktopQuery = window.matchMedia("(min-width: 60.0625rem)");

	/* ------------------------------------------------------------------
	   Menú móvil
	   ------------------------------------------------------------------ */

	function setMenu(open) {
		if (!toggle || !menu) return;

		menu.classList.toggle("is-open", open);
		toggle.setAttribute("aria-expanded", String(open));
		toggle.setAttribute(
			"aria-label",
			open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
		);
		document.body.classList.toggle("is-nav-open", open);
	}

	function closeMenu() {
		setMenu(false);
	}

	if (toggle && menu) {
		toggle.addEventListener("click", function () {
			setMenu(toggle.getAttribute("aria-expanded") !== "true");
		});

		Array.prototype.forEach.call(links, function (link) {
			link.addEventListener("click", closeMenu);
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && menu.classList.contains("is-open")) {
				closeMenu();
				toggle.focus();
			}
		});

		// Al pasar a escritorio, el menú vuelve a su estado normal.
		desktopQuery.addEventListener("change", function (event) {
			if (event.matches) closeMenu();
		});
	}

	/* ------------------------------------------------------------------
	   Sombra del encabezado al hacer scroll
	   ------------------------------------------------------------------ */

	if (header) {
		var updateHeader = function () {
			header.classList.toggle("is-scrolled", window.scrollY > 8);
		};

		updateHeader();
		window.addEventListener("scroll", updateHeader, { passive: true });
	}

	/* ------------------------------------------------------------------
	   Enlace activo según la sección visible
	   ------------------------------------------------------------------ */

	var sections = [];

	Array.prototype.forEach.call(links, function (link) {
		var href = link.getAttribute("href") || "";
		if (href.charAt(0) !== "#" || href === "#") return;

		var section = document.querySelector(href);
		if (section) sections.push({ link: link, section: section });
	});

	if (sections.length && "IntersectionObserver" in window) {
		var spy = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;

					sections.forEach(function (item) {
						item.link.classList.toggle(
							"is-active",
							item.section === entry.target
						);
					});
				});
			},
			{ rootMargin: "-45% 0px -50% 0px", threshold: 0 }
		);

		sections.forEach(function (item) {
			spy.observe(item.section);
		});
	}

	/* ------------------------------------------------------------------
	   Aparición progresiva de los bloques
	   ------------------------------------------------------------------ */

	var revealables = document.querySelectorAll(".reveal");
	var prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	if (!revealables.length) return;

	if (prefersReducedMotion || !("IntersectionObserver" in window)) {
		Array.prototype.forEach.call(revealables, function (element) {
			element.classList.add("is-visible");
		});
		return;
	}

	var revealObserver = new IntersectionObserver(
		function (entries, observer) {
			entries.forEach(function (entry, index) {
				if (!entry.isIntersecting) return;

				entry.target.style.transitionDelay = index * 80 + "ms";
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			});
		},
		{ rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
	);

	Array.prototype.forEach.call(revealables, function (element) {
		revealObserver.observe(element);
	});
})();
