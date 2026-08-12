/*
 * Sintera Theme
 *
 * JavaScript entry point.
 *
 * Keep this file intentionally minimal during the
 * initial visual implementation.
 */

document.documentElement.classList.add("sintera");

function normalizeMenuText(text) {
	return (text || "").toLowerCase().trim();
}

function getMainMenuList(topMenu) {
	return topMenu.querySelector(".top-menu__links > ul") || topMenu.querySelector("ul");
}

function getMenuIconName(link) {
	var href = (link.getAttribute("href") || "").toLowerCase();
	var text = normalizeMenuText(link.textContent);

	if (href === "/" || text === "home" || text === "inicio") {
		return "home";
	}

	if (href.indexOf("/my/") !== -1 || text.indexOf("my page") !== -1 || text.indexOf("mi pagina") !== -1 || text.indexOf("mi pagina personal") !== -1) {
		return "mypage";
	}

	if (href.indexOf("/projects") !== -1 || text.indexOf("project") !== -1 || text.indexOf("proyecto") !== -1) {
		return "projects";
	}

	if (href.indexOf("/issues") !== -1 || text.indexOf("issue") !== -1 || text.indexOf("tarea") !== -1 || text.indexOf("incidencia") !== -1) {
		return "issues";
	}

	if (href.indexOf("/activity") !== -1 || text.indexOf("activity") !== -1 || text.indexOf("actividad") !== -1) {
		return "activity";
	}

	if (href.indexOf("/news") !== -1 || text.indexOf("news") !== -1 || text.indexOf("noticia") !== -1) {
		return "news";
	}

	if (href.indexOf("/calendar") !== -1 || text.indexOf("calendar") !== -1 || text.indexOf("calendario") !== -1) {
		return "calendar";
	}

	if (href.indexOf("/admin") !== -1 || text.indexOf("administration") !== -1 || text.indexOf("administracion") !== -1) {
		return "admin";
	}

	if (href.indexOf("/account") !== -1 || text.indexOf("account") !== -1 || text.indexOf("cuenta") !== -1 || text.indexOf("profile") !== -1 || text.indexOf("perfil") !== -1) {
		return "account";
	}

	if (href.indexOf("/time") !== -1 || text.indexOf("time") !== -1 || text.indexOf("tiempo") !== -1) {
		return "time";
	}

	return "generic";
}

function removeHelpMenuItem(menuList) {
	if (!menuList) {
		return;
	}

	var links = menuList.querySelectorAll("a");

	for (var i = 0; i < links.length; i += 1) {
		var link = links[i];
		var href = (link.getAttribute("href") || "").toLowerCase();
		var text = normalizeMenuText(link.textContent);

		if (href.indexOf("/help") !== -1 || text === "help" || text === "ayuda") {
			var item = link.closest("li");

			if (item) {
				item.remove();
			}
		}
	}
}

function tagMenuIcons(menuList) {
	if (!menuList) {
		return;
	}

	var links = menuList.querySelectorAll("a");

	for (var i = 0; i < links.length; i += 1) {
		var link = links[i];
		var label = (link.textContent || "").replace(/\s+/g, " ").trim();

		link.setAttribute("data-sintera-icon", getMenuIconName(link));

		if (label) {
			link.setAttribute("title", label);
			link.setAttribute("aria-label", label);
		}
	}
}

function ensureSideMenuBrand(topMenu) {
	var headerTitleLink = document.querySelector("#header h1 a");
	var headerTitle = document.querySelector("#header h1");

	if (!headerTitle) {
		return;
	}

	var brand = topMenu.querySelector(".sintera-side-brand");

	if (!brand) {
		brand = document.createElement("div");
		brand.className = "sintera-side-brand";
		topMenu.insertBefore(brand, topMenu.firstChild);
	}

	var titleText = (headerTitle.textContent || "").trim();
	var titleHref = headerTitleLink ? headerTitleLink.getAttribute("href") : "/";

	brand.innerHTML = "";

	var brandLink = document.createElement("a");
	brandLink.className = "sintera-side-brand-link";
	brandLink.href = titleHref || "/";

	var brandLogo = document.createElement("span");
	brandLogo.className = "sintera-side-brand-logo";
	brandLogo.setAttribute("aria-hidden", "true");

	var brandText = document.createElement("span");
	brandText.className = "sintera-side-brand-text";
	brandText.textContent = titleText || "Sintera";

	brandLink.appendChild(brandLogo);
	brandLink.appendChild(brandText);

	var divider = document.createElement("div");
	divider.className = "sintera-side-brand-divider";

	brand.appendChild(brandLink);
	brand.appendChild(divider);
}

function ensureSideProfile(topMenu) {
	var profileMenu = topMenu.querySelector(".profile-menu");
	var account = profileMenu ? profileMenu.querySelector("#account") : null;
	var dropdown = account ? account.querySelector(".dropdown-content") : null;

	if (!profileMenu || !dropdown) {
		return;
	}

	profileMenu.style.display = "none";

	var sideProfile = topMenu.querySelector(".sintera-side-profile");

	if (!sideProfile) {
		sideProfile = document.createElement("section");
		sideProfile.className = "sintera-side-profile";
		topMenu.appendChild(sideProfile);
	}

	sideProfile.innerHTML = "";

	var userNameNode = dropdown.querySelector(".user-name");
	var userLoginNode = dropdown.querySelector(".user-login");
	var avatarNode = account.querySelector(".dropdown-trigger .avatar");

	var head = document.createElement("div");
	head.className = "sintera-side-profile-head";

	if (avatarNode) {
		var avatar = avatarNode.cloneNode(true);
		avatar.classList.add("sintera-side-profile-avatar");
		head.appendChild(avatar);
	}

	var identity = document.createElement("div");
	identity.className = "sintera-side-profile-identity";

	var userName = document.createElement("div");
	userName.className = "sintera-side-profile-name";
	userName.textContent = userNameNode ? userNameNode.textContent.trim() : "Usuario";

	var userLogin = document.createElement("div");
	userLogin.className = "sintera-side-profile-login";
	userLogin.textContent = userLoginNode ? userLoginNode.textContent.trim() : "";

	identity.appendChild(userName);
	identity.appendChild(userLogin);
	head.appendChild(identity);

	var actions = document.createElement("ul");
	actions.className = "sintera-side-profile-actions";

	var profileLink = dropdown.querySelector("a.my-profile");
	var accountLink = dropdown.querySelector("a.my-account");
	var logoutLink = dropdown.querySelector("a.logout");

	var actionItems = [
		{ link: profileLink, label: "Perfil", icon: "my-profile" },
		{ link: accountLink, label: "Mi cuenta", icon: "my-account" },
		{ link: logoutLink, label: "Terminar sesion", icon: "logout" }
	];

	for (var i = 0; i < actionItems.length; i += 1) {
		if (!actionItems[i].link) {
			continue;
		}

		var li = document.createElement("li");
		var actionLink = actionItems[i].link.cloneNode(true);

		actionLink.textContent = actionItems[i].label;
		actionLink.setAttribute("data-sintera-icon", actionItems[i].icon);

		li.appendChild(actionLink);
		actions.appendChild(li);
	}

	sideProfile.appendChild(head);
	sideProfile.appendChild(actions);
}

function disableActivitySidebarFeature() {
	var sidebar = document.querySelector("#sidebar");
	var toggle = document.querySelector("#sintera-activity-toggle");

	document.body.classList.remove("sintera-activity-sidebar-enabled");
	document.body.classList.remove("sintera-activity-sidebar-open");

	if (toggle) {
		toggle.remove();
	}

	if (sidebar && document.body.classList.contains("controller-my") && document.body.classList.contains("action-page")) {
		sidebar.style.display = "none";
	}
}

function closeSinteraMenu() {
	document.body.classList.remove("sintera-menu-open");
}

function ensureQuickSearchPlacement(topMenu) {
	var quickSearch = document.querySelector("#quick-search");
	var header = document.querySelector("#header");

	if (!quickSearch || !header || !topMenu) {
		return;
	}

	var headerTitle = header.querySelector("h1");

	if (quickSearch.parentElement !== header) {
		if (headerTitle) {
			header.insertBefore(quickSearch, headerTitle);
		} else {
			header.appendChild(quickSearch);
		}
	}

	var sideUtilities = topMenu.querySelector(".sintera-side-utilities");

	if (sideUtilities && !sideUtilities.children.length) {
		sideUtilities.remove();
	}
}

function ensureMenuToggle(topMenu) {
	var header = document.querySelector("#header");

	if (!header) {
		return;
	}

	var toggle = document.querySelector("#sintera-menu-toggle");

	if (!toggle) {
		toggle = document.createElement("button");
		toggle.id = "sintera-menu-toggle";
		toggle.type = "button";
		toggle.className = "sintera-menu-toggle";
		toggle.setAttribute("aria-label", "Abrir menu");
		toggle.setAttribute("aria-controls", "top-menu");
		toggle.setAttribute("aria-expanded", "false");
		toggle.innerHTML = "<span></span><span></span><span></span>";

		header.insertBefore(toggle, header.firstChild);
	}

	var nativeMobileToggle = header.querySelector(".mobile-toggle-button");

	if (nativeMobileToggle) {
		nativeMobileToggle.remove();
	}

	var nativeFlyoutToggle = header.querySelector(".js-flyout-menu-toggle-button");

	if (nativeFlyoutToggle) {
		nativeFlyoutToggle.remove();
	}

	toggle.onclick = function () {
		var isOpen = document.body.classList.toggle("sintera-menu-open");
		toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
	};

	if (!document.querySelector("#sintera-menu-overlay")) {
		var overlay = document.createElement("button");
		overlay.type = "button";
		overlay.id = "sintera-menu-overlay";
		overlay.className = "sintera-menu-overlay";
		overlay.setAttribute("aria-label", "Cerrar menu");
		overlay.onclick = closeSinteraMenu;
		document.body.appendChild(overlay);
	}

	if (!topMenu.hasAttribute("data-sintera-menu-bound")) {
		topMenu.setAttribute("data-sintera-menu-bound", "true");

		topMenu.addEventListener("click", function (event) {
			if (!event.target.closest("a")) {
				return;
			}

			if (window.matchMedia("(max-width: 1024px)").matches) {
				closeSinteraMenu();
				toggle.setAttribute("aria-expanded", "false");
			}
		});
	}

	if (!document.body.hasAttribute("data-sintera-escape-bound")) {
		document.body.setAttribute("data-sintera-escape-bound", "true");

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape") {
				closeSinteraMenu();
				toggle.setAttribute("aria-expanded", "false");
			}
		});
	}
}

function shouldUseSideMenu(menuList) {
	if (!menuList) {
		return false;
	}

	var links = menuList.querySelectorAll("a");

	for (var i = 0; i < links.length; i += 1) {
		var href = (links[i].getAttribute("href") || "").toLowerCase();

		if (
			href === "/" ||
			href.indexOf("/my/") !== -1 ||
			href.indexOf("/projects") !== -1 ||
			href.indexOf("/admin") !== -1 ||
			href.indexOf("/help") !== -1
		) {
			return true;
		}
	}

	return false;
}

function enhanceSideMenu() {
	var topMenu = document.querySelector("#top-menu");
	var mainMenuList = topMenu ? getMainMenuList(topMenu) : null;

	if (!topMenu || !shouldUseSideMenu(mainMenuList)) {
		document.body.classList.remove("sintera-has-side-menu");
		return;
	}

	document.body.classList.add("sintera-has-side-menu");
	ensureSideMenuBrand(topMenu);
	removeHelpMenuItem(mainMenuList);
	tagMenuIcons(mainMenuList);
	ensureSideProfile(topMenu);
	ensureQuickSearchPlacement(topMenu);
	ensureMenuToggle(topMenu);

	if (!document.body.hasAttribute("data-sintera-resize-bound")) {
		document.body.setAttribute("data-sintera-resize-bound", "true");

		window.addEventListener("resize", function () {
			ensureQuickSearchPlacement(document.querySelector("#top-menu"));
		});
	}
}

function updateSinteraFooter() {
	var footerRoot = document.querySelector("#footer");

	if (!footerRoot) {
		return;
	}

	var footerContent = footerRoot.querySelector(".bgr, .bgl") || footerRoot;
	var currentYear = new Date().getFullYear();

	footerContent.textContent = "";

	var prefix = document.createTextNode("Powered by ");
	var link = document.createElement("a");
	var suffix = document.createTextNode(" © " + currentYear);

	link.href = "https://sintera.com.ar";
	link.textContent = "Sintera";

	footerContent.appendChild(prefix);
	footerContent.appendChild(link);
	footerContent.appendChild(suffix);
}

function runSinteraEnhancements() {
	enhanceSideMenu();
	disableActivitySidebarFeature();
	updateSinteraFooter();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", runSinteraEnhancements);
} else {
	runSinteraEnhancements();
}

document.addEventListener("turbo:load", runSinteraEnhancements);
document.addEventListener("turbolinks:load", runSinteraEnhancements);