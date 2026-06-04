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

  /* ---------- 9. Visitor map + counters ----------
     Privacy notes:
     - All geo lookup happens client-side via ipwho.is (HTTPS, no signup).
     - We do NOT log or transmit the visitor's IP, location, or any PII to
       any server we control. The visitor is the only one who sees their
       own location.
     - The visit counter is a simple per-page tally via abacus.jasoncameron.dev
       (open source, no cookies, no IP storage, just an integer per key).
     - Aggregated country counters are anonymous (just a number per
       country code), no per-visitor history.
  ---------------------------------------------------- */
  const visitorLoc = document.getElementById("visitorLoc");
  const visitorOrg = document.getElementById("visitorOrg");
  const visitorGreet = document.getElementById("visitorGreet");
  const countTotal = document.getElementById("countTotal");
  const countToday = document.getElementById("countToday");
  const countCountry = document.getElementById("countCountry");
  const countContinents = document.getElementById("countContinents");

  function escapeText(s) {
    const d = document.createElement("div");
    d.textContent = String(s || "");
    return d.innerHTML;
  }

  function formatNum(n) {
    if (n == null || isNaN(n)) return "—";
    return new Intl.NumberFormat().format(n);
  }

  // Detect "institutional" ISP/org strings — universities, hospitals,
  // research institutes, government, etc. Returns a friendly label or null.
  function institutionLabel(geo) {
    const candidates = [
      geo?.connection?.org,
      geo?.connection?.isp,
      geo?.connection?.domain,
      geo?.org
    ].filter(Boolean);
    if (!candidates.length) return null;
    const text = candidates[0];
    const lower = text.toLowerCase();
    const KEYWORDS = [
      "univ", "college", "school", "academy", "institute", "instituto",
      "hospital", "clinic", "health", "saúde", "saude",
      "research", "laborat", "centro de pesquisa", "cnpq", "fapesp",
      "ministry", "government", "gov.", "minist", "fund",
      "ngo", "foundation", "fundac", "fundaç"
    ];
    if (KEYWORDS.some((k) => lower.includes(k))) {
      return text;
    }
    // domains ending in .edu, .ac, .gov are almost always institutional
    if (geo?.connection?.domain) {
      const d = geo.connection.domain.toLowerCase();
      if (/\.(edu|ac|gov|edu\.[a-z]{2}|ac\.[a-z]{2}|gov\.[a-z]{2})$/.test(d)) {
        return text;
      }
    }
    return null;
  }

  function greetingFor(geo) {
    const code = (geo?.country_code || "").toUpperCase();
    // tiny localised hello — a small joyful touch in the visitor's language
    const HELLO = {
      BR: "Olá!", PT: "Olá!",
      ES: "¡Hola!", AR: "¡Hola!", MX: "¡Hola!", CL: "¡Hola!", PE: "¡Hola!", CO: "¡Hola!",
      FR: "Bonjour !", BE: "Bonjour !",
      DE: "Hallo!", AT: "Hallo!", CH: "Hallo!",
      IT: "Ciao!",
      NL: "Hallo!",
      JP: "こんにちは!",
      CN: "你好!", TW: "你好!",
      KR: "안녕하세요!",
      IN: "नमस्ते!",
      RU: "Привет!",
      US: "Hello!", GB: "Hello!", AU: "G'day!", IE: "Hello!",
      ZA: "Hallo!"
    };
    return HELLO[code] || "Hello!";
  }

  async function fetchGeo() {
    try {
      const r = await fetch("https://ipwho.is/", { mode: "cors" });
      if (!r.ok) return null;
      const data = await r.json();
      return data && data.success ? data : null;
    } catch (e) { return null; }
  }

  async function bumpCounter(key) {
    try {
      const ns = "louisecerdeira-com";
      const r = await fetch(`https://abacus.jasoncameron.dev/hit/${ns}/${encodeURIComponent(key)}`);
      if (!r.ok) return null;
      const data = await r.json();
      return data?.value ?? null;
    } catch (e) { return null; }
  }
  async function readCounter(key) {
    try {
      const ns = "louisecerdeira-com";
      const r = await fetch(`https://abacus.jasoncameron.dev/get/${ns}/${encodeURIComponent(key)}`);
      if (!r.ok) return null;
      const data = await r.json();
      return data?.value ?? null;
    } catch (e) { return null; }
  }

  function addVisitorMarkerToMap(geo) {
    if (!markersEl || !geo || geo.latitude == null) return;
    const SVG_NS = "http://www.w3.org/2000/svg";
    const x = (geo.longitude + 180) * 1000 / 360;
    const y = (90 - geo.latitude) * 500 / 180;

    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", "map-marker visitor-marker");
    g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);

    const pin = document.createElementNS(SVG_NS, "g");
    pin.setAttribute("class", "pin");
    const ring = document.createElementNS(SVG_NS, "circle");
    ring.setAttribute("class", "ring");
    ring.setAttribute("r", "5");
    pin.appendChild(ring);
    const core = document.createElementNS(SVG_NS, "circle");
    core.setAttribute("class", "core");
    core.setAttribute("r", "4");
    pin.appendChild(core);
    g.appendChild(pin);

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("class", "label");
    label.setAttribute("y", "-12");
    label.textContent = `${geo.flag?.emoji || ""}  You · ${geo.city || geo.country}`;
    g.appendChild(label);

    const title = document.createElementNS(SVG_NS, "title");
    title.textContent = `You are here: ${geo.city || ""} ${geo.country}`.trim();
    g.appendChild(title);

    markersEl.appendChild(g);
  }

  // Visitor section flow
  async function runVisitorSection() {
    if (!visitorLoc && !countTotal) return; // section absent

    const geo = await fetchGeo();

    if (visitorLoc) {
      if (geo) {
        const flag = geo.flag?.emoji || "🌐";
        const city = geo.city ? `${geo.city}, ` : "";
        visitorLoc.innerHTML = `<span class="flag">${flag}</span> ${escapeText(city)}${escapeText(geo.country || "")}`;
        const inst = institutionLabel(geo);
        if (visitorOrg) {
          if (inst) {
            visitorOrg.innerHTML = `Coming from <span class="institution">${escapeText(inst)}</span>`;
          } else if (geo.connection?.isp) {
            visitorOrg.textContent = `via ${geo.connection.isp}`;
          } else {
            visitorOrg.textContent = "";
          }
        }
        if (visitorGreet) {
          visitorGreet.textContent = `${greetingFor(geo)} Thanks for stopping by — it's nice to see this site reaching ${geo.country || "your part of the world"}.`;
        }
        addVisitorMarkerToMap(geo);
      } else {
        visitorLoc.innerHTML = `<span class="flag">🌐</span> Welcome, wherever you are.`;
        if (visitorOrg) visitorOrg.textContent = "";
        if (visitorGreet) visitorGreet.textContent = "Couldn't detect your location (and that's fine — your browser or VPN may have blocked it).";
      }
    }

    // Counters — bump total + country in parallel, read continents from local set.
    const tasks = [bumpCounter("visits")];
    if (geo?.country_code) tasks.push(bumpCounter(`country-${geo.country_code}`));
    const [total] = await Promise.all(tasks);
    if (countTotal) countTotal.textContent = formatNum(total);
    // Today: separate daily key (best-effort, optional)
    if (countToday) {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const t = await bumpCounter(`day-${today}`);
      countToday.textContent = formatNum(t);
    }
    if (countCountry && geo?.country) {
      countCountry.textContent = geo.country;
    }
    // Continents — static value reflects the historical span
    if (countContinents) countContinents.textContent = "6";
  }

  // Defer slightly so it doesn't compete with the main thread.
  if ("requestIdleCallback" in window) {
    requestIdleCallback(runVisitorSection, { timeout: 2500 });
  } else {
    setTimeout(runVisitorSection, 600);
  }
})();
