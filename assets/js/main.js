/* ============================================================
   Louise Cerdeira — Portfolio · main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Theme toggle — default LIGHT (happy palette) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const stored = localStorage.getItem("ltc-theme");
  // Light is the joyful default; only go dark if explicitly chosen
  // or the user's system strongly prefers it.
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("ltc-theme", next);
    });
  }

  /* ---------- 2. Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3. Sticky-nav shadow ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Scroll reveal ---------- */
  const reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 5. Year stamp ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 6. GitHub repos loader ---------- */
  const reposEl = document.getElementById("repos");
  const langColors = {
    Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#2b7489",
    HTML: "#e34c26", CSS: "#563d7c", Rust: "#dea584", "C++": "#f34b7d",
    Nextflow: "#3ac486", Vue: "#41b883", Shell: "#89e051",
    Jupyter: "#DA5B0B", "Jupyter Notebook": "#DA5B0B"
  };
  const SKIP = new Set(["portfolio", "lcerdeira"]);

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function renderRepos(repos) {
    if (!reposEl) return;
    if (!repos || !repos.length) {
      reposEl.innerHTML =
        '<div class="repos-loading">Couldn\'t load repos right now. <a href="https://github.com/lcerdeira" target="_blank" rel="noopener" class="text-accent">View on GitHub →</a></div>';
      return;
    }
    const html = repos
      .filter((r) => !r.fork && !r.archived && !SKIP.has(r.name))
      .slice(0, 9)
      .map((r) => {
        const color = langColors[r.language] || "#888";
        return `
          <a class="repo" href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener">
            <span class="repo-name">${escapeHtml(r.name)}</span>
            <span class="repo-desc">${escapeHtml(r.description || "No description provided.")}</span>
            <span class="repo-meta">
              ${r.language ? `<span class="repo-lang"><span class="repo-lang-dot" style="background:${color}"></span>${escapeHtml(r.language)}</span>` : ""}
              <span class="repo-stars" title="Stars">★ ${r.stargazers_count || 0}</span>
              <span title="Updated">↻ ${new Date(r.pushed_at).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</span>
            </span>
          </a>
        `;
      })
      .join("");
    reposEl.innerHTML = html || '<div class="repos-loading">No repos to show.</div>';
  }

  if (reposEl) {
    fetch("https://api.github.com/users/lcerdeira/repos?sort=pushed&per_page=30", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(renderRepos)
      .catch(() => renderRepos(null));
  }

  /* ---------- 7. Hero canvas — soft particle field with happy palette ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles = [];
    const PARTICLE_COUNT = 50;
    const PALETTE = ["--accent", "--accent-2", "--accent-3", "--accent-4"];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function readColor(name) {
      const v = getComputedStyle(root).getPropertyValue(name).trim() || "#ff6b8a";
      const m = v.match(/^#?([a-f\d]{6})$/i);
      if (!m) return [255, 107, 138];
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function init() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const colorName = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 2.2 + 0.6,
          colorName
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const [r, g, b] = readColor(p.colorName);
        ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 110 * 110) {
            const alpha = (1 - d2 / (110 * 110)) * 0.22;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); init(); }, 120);
    });

    resize(); init(); draw();
  }

  /* ---------- 8. Global collaborations map ---------- */
  // Equirectangular projection on a 1000×500 viewBox:
  //   x = (lon + 180) * 1000 / 360
  //   y = (90  - lat) * 500  / 180
  const COLLAB_COUNTRIES = [
    // [lat, lon, name, flag, palette-var]
    [-14, -55,  "Brazil",       "🇧🇷", "--accent"],
    [54,  -2,   "United Kingdom","🇬🇧","--accent-2"],
    [-25, 134,  "Australia",    "🇦🇺", "--accent-3"],
    [38,  -97,  "United States","🇺🇸", "--accent-4"],
    [-34, -64,  "Argentina",    "🇦🇷", "--accent"],
    [-10, -76,  "Peru",         "🇵🇪", "--accent-2"],
    [-33, -71,  "Chile",        "🇨🇱", "--accent-3"],
    [23,  -102, "Mexico",       "🇲🇽", "--accent-4"],
    [-2,  23,   "DR Congo",     "🇨🇩", "--accent"],
    [8,   -1,   "Ghana",        "🇬🇭", "--accent-2"],
    [6,   12,   "Cameroon",     "🇨🇲", "--accent-3"],
    [-29, 24,   "South Africa", "🇿🇦", "--accent-4"],
    [-1,  37,   "Kenya",        "🇰🇪", "--accent"],
    [9,   40,   "Ethiopia",     "🇪🇹", "--accent-2"],
    [17,  -4,   "Mali",         "🇲🇱", "--accent-3"],
    [14,  -14,  "Senegal",      "🇸🇳", "--accent-4"],
    [-19, 47,   "Madagascar",   "🇲🇬", "--accent"],
    [22,  78,   "India",        "🇮🇳", "--accent-2"],
    [24,  90,   "Bangladesh",   "🇧🇩", "--accent-3"],
    [28,  84,   "Nepal",        "🇳🇵", "--accent-4"],
    [30,  70,   "Pakistan",     "🇵🇰", "--accent"],
    [14,  108,  "Vietnam",      "🇻🇳", "--accent-2"],
    [-2,  118,  "Indonesia",    "🇮🇩", "--accent-3"],
    [1,   104,  "Singapore",    "🇸🇬", "--accent-4"],
    [46,  2,    "France",       "🇫🇷", "--accent"],
    [51,  10,   "Germany",      "🇩🇪", "--accent-2"],
    [42,  13,   "Italy",        "🇮🇹", "--accent-3"],
    [40,  -4,   "Spain",        "🇪🇸", "--accent-4"],
    [39,  -8,   "Portugal",     "🇵🇹", "--accent"],
    [52,  5,    "Netherlands",  "🇳🇱", "--accent-2"],
    [47,  8,    "Switzerland",  "🇨🇭", "--accent-3"],
    [56,  -106, "Canada",       "🇨🇦", "--accent-4"]
  ];

  const markersEl = document.getElementById("mapMarkers");
  if (markersEl) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    COLLAB_COUNTRIES.forEach(([lat, lon, name, flag, colorVar], i) => {
      const x = (lon + 180) * 1000 / 360;
      const y = (90 - lat) * 500 / 180;
      const color = getComputedStyle(root).getPropertyValue(colorVar).trim() || "#ff6b8a";

      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "map-marker");
      g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      g.style.setProperty("--marker-color", color);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "img");
      g.setAttribute("aria-label", `Collaboration in ${name}`);

      const pin = document.createElementNS(SVG_NS, "g");
      pin.setAttribute("class", "pin");
      // pulse ring (animated via CSS)
      const ring = document.createElementNS(SVG_NS, "circle");
      ring.setAttribute("class", "ring");
      ring.setAttribute("cx", "0"); ring.setAttribute("cy", "0");
      ring.setAttribute("r", "4");
      ring.style.animationDelay = `${(i % 8) * 0.18}s`;
      pin.appendChild(ring);
      // core dot
      const core = document.createElementNS(SVG_NS, "circle");
      core.setAttribute("class", "core");
      core.setAttribute("cx", "0"); core.setAttribute("cy", "0");
      core.setAttribute("r", "3.2");
      pin.appendChild(core);
      g.appendChild(pin);

      // label
      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("class", "label");
      label.setAttribute("x", "0");
      label.setAttribute("y", "-9");
      label.textContent = `${flag}  ${name}`;
      g.appendChild(label);

      // native title fallback for tooltips
      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = `${flag} ${name}`;
      g.appendChild(title);

      markersEl.appendChild(g);
    });
  }
})();
