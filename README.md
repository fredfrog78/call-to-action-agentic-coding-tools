# Agentic Coding Tools — Call‑to‑Action Website

A polished, evidence-informed, engineer-first landing page for **robotics software teams** (ROS 2, perception, autonomy, deployment) that helps explain the “phase change” from chat/autocomplete to **agentic coding workflows** (plan → patch → test → review), with worked examples and screenshots.

## Run locally
Because this is a static site, you can open it directly or serve it:

- Open: `index.html`
- Serve (recommended): `python3 -m http.server 8000`
  - Then visit: `http://localhost:8000`

## What’s inside
- `index.html` — single-page site (sections, prompts, FAQ, references)
- `styles.css` — responsive styling + light/dark themes
- `app.js` — minimal JS (theme toggle, mobile nav, tabs, copy buttons)
- `assets/screenshots/*.svg` — illustrative “screenshots” for the worked example

## Customize for your org
- Replace the illustrative SVGs in `assets/screenshots/` with real screenshots from your preferred tool (Codex, Claude, Gemini, etc.).
- The current “Worked example” is based on a real robotics repo (CSIRO OHM). Swap it to match your stack (ROS distro, build/test commands, sim, bag replay) and repo conventions.
- If you need stricter governance language (security/privacy), add a short “Org policy” section near the pilot checklist.

## Deploy anywhere
This site is static: any file host works (GitHub Pages, Netlify, S3, Nginx, etc.). No build step required.
