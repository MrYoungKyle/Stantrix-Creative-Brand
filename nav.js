const navigationItems = [
    {
        label: "Home",
        href: "#",
        icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.5L12 4l8 6.5"></path>
                <path d="M6.5 9.5V20h11V9.5"></path>
                <path d="M10 20v-6h4v6"></path>
            </svg>
        `
    },
    {
        label: "Projects",
        href: "#",
        icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="7.5" r="3"></circle>
                <path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"></path>
            </svg>
        `
    },
    {
        label: "Gallery",
        href: "#",
        icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l8 5v8l-8 5-8-5V8l8-5z"></path>
                <path d="M4 8l8 5 8-5"></path>
                <path d="M12 13v8"></path>
            </svg>
        `
    },
    {
        label: "About",
        href: "#",
        icon: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="1"></rect>
                <circle cx="9" cy="9" r="1.5"></circle>
                <path d="M4 17l5-5 3.5 3 2.5-2.5L20 17"></path>
            </svg>
        `
    }
];

function renderNavigation(targetId = "nav-links", items = navigationItems) {
    const navigationList = document.getElementById(targetId);

    if (!navigationList) {
        return;
    }

    navigationList.replaceChildren();

    items.forEach((item) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        const label = document.createElement("span");
        const icon = document.createElement("span");

        link.href = item.href;
        link.className = "nav-item";

        label.className = "label";
        label.textContent = item.label;

        icon.className = "icon";
        icon.innerHTML = item.icon;

        link.append(label, icon);
        listItem.append(link);
        navigationList.append(listItem);
    });
}

window.navigationItems = navigationItems;
window.renderNavigation = renderNavigation;

renderNavigation();
