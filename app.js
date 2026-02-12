const THEME_STORAGE_KEY = "act_theme";

function setTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;

  const label = document.querySelector("[data-theme-toggle] .theme-toggle-label");
  if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
}

function getPreferredTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function initThemeToggle() {
  setTheme(getPreferredTheme());

  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  links.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("a")) setOpen(false);
  });
}

function initHeaderElevate() {
  const header = document.querySelector("[data-elevate]");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 6);
  update();

  window.addEventListener("scroll", update, { passive: true });
}

function initTabs() {
  const groups = document.querySelectorAll("[data-tabs]");
  const escapeId = (id) => {
    if (typeof id !== "string") return "";
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(id);
    // Our IDs are simple; this fallback is just to avoid hard failures.
    return id;
  };

  const getOwnedTablist = (group) => {
    const lists = Array.from(group.querySelectorAll('[role="tablist"]'));
    return lists.find((list) => list.closest("[data-tabs]") === group) ?? null;
  };

  for (const group of groups) {
    const tablist = getOwnedTablist(group);
    if (!tablist) continue;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    if (tabs.length === 0) continue;
    const panels = new Map();

    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls")?.trim();

      let panel = null;
      if (panelId) {
        const byId = document.getElementById(panelId);
        if (byId && byId.closest("[data-tabs]") === group) panel = byId;

        if (!panel) {
          const byQuery = group.querySelector(`#${escapeId(panelId)}`);
          if (byQuery && byQuery.closest("[data-tabs]") === group) panel = byQuery;
        }
      }

      if (panel) panels.set(tab, panel);

      tab.setAttribute("tabindex", tab.getAttribute("aria-selected") === "true" ? "0" : "-1");
    }

    const select = (tab, { focus = true } = {}) => {
      for (const t of tabs) {
        const selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.setAttribute("tabindex", selected ? "0" : "-1");
        const panel = panels.get(t);
        if (panel) panel.hidden = !selected;
      }
      if (focus) tab.focus();
    };

    for (const tab of tabs) {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        if (!(event instanceof KeyboardEvent)) return;

        const idx = tabs.indexOf(tab);
        if (idx === -1) return;

        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const dir = event.key === "ArrowRight" ? 1 : -1;
          const next = tabs[(idx + dir + tabs.length) % tabs.length];
          select(next);
        }
      });
    }

    // Ensure a consistent initial state (and allow no-JS fallbacks by not relying on `hidden` in HTML).
    const initiallySelected = tabs.find((t) => t.getAttribute("aria-selected") === "true") ?? tabs[0];
    select(initiallySelected, { focus: false });
  }
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / restricted contexts
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "true");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}

function initCopyButtons() {
  const buttons = document.querySelectorAll("[data-copy]");
  for (const btn of buttons) {
    btn.addEventListener("click", async () => {
      const block = btn.closest("[data-copy-block]");
      const code = block?.querySelector("pre code");
      const text = code?.textContent ?? "";
      if (!text.trim()) return;

      const ok = await copyTextToClipboard(text);
      const original = btn.textContent;
      btn.textContent = ok ? "Copied" : "Copy failed";
      btn.setAttribute("aria-live", "polite");

      window.setTimeout(() => {
        btn.textContent = original;
        btn.removeAttribute("aria-live");
      }, 900);
    });
  }
}

initThemeToggle();
initMobileNav();
initHeaderElevate();
initTabs();
initCopyButtons();
