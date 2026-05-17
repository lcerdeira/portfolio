# lcerdeira.github.io · Portfolio

Personal portfolio site of **Dr. Louise Cerdeira** — computational biologist and software
engineer behind [AMRnet](https://www.amrnet.org), [TyphiNET](https://www.typhi.net),
[PlasmidNET](https://www.plasmidnet.org), and [InfectoNET](https://www.infectonet.org).

Live: <https://lcerdeira.github.io/portfolio/>

![License](https://img.shields.io/badge/license-MIT-ff6b8a)
![Build](https://img.shields.io/badge/build-static-4ecdc4)
![Stack](https://img.shields.io/badge/stack-vanilla-ffb347)

## What's inside

A single-page portfolio plus a static blog, hand-built with no framework.

- `index.html` — landing page (hero, about, research, global collaborations map,
  projects, experience, GitHub feed, writing, creative, contact)
- `blog.html` — blog index
- `blog/*.html` — individual posts
- `404.html` — custom not-found page
- `assets/css/main.css` — all styles, with light (default, "happy" palette) and dark themes
- `assets/js/main.js` — theme toggle, nav, scroll reveal, particle hero canvas,
  GitHub repo loader, world map markers
- `assets/images/` — profile photo, OG image, favicon, photography samples
- `sitemap.xml`, `robots.txt`, `site.webmanifest` — SEO + PWA infrastructure

## Features

- 🌍 **Global collaborations map** — co-author countries plotted on a stylised SVG world map
  with animated pulse markers and tooltips
- 🎨 **Joyful palette** — coral, sunshine, mint, lavender — with dark mode toggle
- 🔍 **SEO-tuned** — rich meta tags, Open Graph, Twitter cards, JSON-LD `Person` and
  `WebSite` schema, sitemap
- 📡 **Live GitHub feed** — most recent public repos rendered client-side from the
  GitHub REST API
- ⚡ **Zero build step** — push to GitHub Pages and it ships
- 📱 **Responsive** — works from 360px to ultrawide
- ♿ **Accessible** — keyboard navigation, reduced-motion support, proper landmarks
- 🌐 **i18n-ready** — single source of truth in HTML, easy to clone for translations

## Local development

It's static HTML; any local server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit <http://localhost:8000/>.

## Deploy

GitHub Pages serves the repository root. Pushes to `master` go live.

## Updating content

| What | Where |
|---|---|
| Hero copy, stats, social links | `index.html` → `<section class="hero">` |
| About text + quick facts | `index.html` → `#about` |
| Publications | `index.html` → `#research` → `.pubs` list |
| Map countries | `assets/js/main.js` → `COLLAB_COUNTRIES` array |
| Project cards | `index.html` → `#projects` → `.projects` grid |
| Experience timeline | `index.html` → `#experience` |
| Blog posts | add a new file under `blog/`, link it from `blog.html` and the index teaser |
| Colours | `assets/css/main.css` → `:root` and `[data-theme="dark"]` |
| OG image | `assets/images/og-image.svg`, then re-export to `.jpg` |

## Tech

Vanilla HTML, CSS, and JavaScript. No framework, no build pipeline, no
dependencies. The CSS uses modern features (`color-mix`, container queries,
`aspect-ratio`); the JS uses `IntersectionObserver` and `fetch`. Targets evergreen
browsers.

## Licence

[MIT](LICENSE) — feel free to use the scaffolding for your own site.
