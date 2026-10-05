/* ============================================================================
   main.js — 内容渲染 + 动画交互
   想改内容请编辑 js/content.js
   ==========================================================================*/
(function () {
  "use strict";

  var S = window.SITE || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 工具 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- 图标 ---------- */
  var I = {
    bilibili: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    danmaku: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.3 8.5 8.5 0 0 1-7.3 4.2 8.4 8.4 0 0 1-3.9-1L3 21l1.9-5.6a8.4 8.4 0 0 1-1-3.9A8.5 8.5 0 0 1 8 4.2 8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
  };

  /* 主题色注入 */
  if (S.meta) {
    if (S.meta.accent) document.documentElement.style.setProperty("--accent", S.meta.accent);
    if (S.meta.accent2) document.documentElement.style.setProperty("--accent-2", S.meta.accent2);
  }

  /* ---------- 绑定文本 ---------- */
  function bindText() {
    $all("[data-bind]").forEach(function (node) {
      var p = node.getAttribute("data-bind").split("."), v = S;
      for (var i = 0; i < p.length && v != null; i++) v = v[p[i]];
      if (v != null) node.textContent = v;
    });
    if (S.meta) {
      if (S.meta.title) document.title = S.meta.title;
      if (S.meta.description) { var m = $('meta[name="description"]'); if (m) m.setAttribute("content", S.meta.description); }
      if (S.meta.lang) document.documentElement.setAttribute("lang", S.meta.lang);
      if (S.meta.favicon) { var f = $('link[rel="icon"]'); if (f) f.setAttribute("href", S.meta.favicon); }
    }
    if (S.hero && S.hero.avatar) { var av = $("#heroAvatar"); if (av) av.src = S.hero.avatar; }
  }

  /* ---------- 导航 ---------- */
  function renderNav() {
    var box = $("#navLinks"); if (!box) return;
    (S.nav || []).forEach(function (it) {
      var a = el("a", "nav__link", esc(it.label));
      a.href = it.href || "#";
      box.appendChild(a);
    });
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    var cta = $("#heroCta");
    if (cta && S.hero && S.hero.cta) {
      S.hero.cta.forEach(function (b) {
        var a = el("a", "btn " + (b.primary ? "btn--primary" : "btn--ghost"),
          esc(b.label) + (I[b.icon] || ""));
        a.href = b.href || "#";
        if (/^https?:/.test(a.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        cta.appendChild(a);
      });
    }
    var soc = $("#heroSocials");
    if (soc && S.hero && S.hero.socials) {
      S.hero.socials.forEach(function (s) {
        var a = el("a", "social-chip", (I[s.icon] || I.link) + "<span>" + esc(s.name) + "</span>");
        a.href = s.url || "#"; a.target = "_blank"; a.rel = "noopener noreferrer";
        soc.appendChild(a);
      });
    }
  }

  /* ---------- 跑马灯 ---------- */
  function renderMarquee() {
    var track = $(".marquee__track");
    if (!track || !S.hero || !S.hero.highlights) return;
    var items = S.hero.highlights.slice();
    // 复制一份用于无缝循环
    var html = items.concat(items).map(function (t) {
      return '<span class="marquee__item">' + esc(t) + "</span>";
    }).join("");
    track.innerHTML = html;
  }

  /* ---------- 数据 ---------- */
  function renderStats() {
    var box = $("#statsGrid");
    if (!box || !S.stats || !S.stats.items) return;
    S.stats.items.forEach(function (s, i) {
      var card = el("div", "stat");
      card.setAttribute("data-reveal", "");
      card.setAttribute("data-reveal-delay", String(Math.min(i, 5)));
      card.setAttribute("data-count", String(s.value || 0));
      card.innerHTML =
        '<div class="stat__num"><span class="stat__value">0</span>' +
        (s.suffix ? '<span class="stat__suffix">' + esc(s.suffix) + "</span>" : "") +
        "</div>" +
        '<div class="stat__label">' + esc(s.label) + "</div>";
      box.appendChild(card);
    });
  }

  /* ---------- 关于 ---------- */
  function renderAbout() {
    var t = $("#aboutText");
    if (t && S.about && S.about.paragraphs) {
      S.about.paragraphs.forEach(function (p) { t.appendChild(el("p", null, esc(p))); });
    }
    var f = $("#aboutFacts");
    if (f && S.about && S.about.facts) {
      S.about.facts.forEach(function (x) {
        var li = el("li");
        li.appendChild(el("span", "fact__label", esc(x.label)));
        li.appendChild(el("span", "fact__value", esc(x.value)));
        f.appendChild(li);
      });
    }
  }

  /* ---------- 作品 ---------- */
  function renderVideos() {
    var box = $("#videosGrid");
    if (!box || !S.videos || !S.videos.items) return;
    var tpl = S.videos.videoUrlTemplate || "https://www.bilibili.com/video/{bvid}/";

    var more = $("#videosMore");
    if (more && S.videos.more) { more.href = S.videos.more.url; }

    S.videos.items.forEach(function (v, i) {
      var url = tpl.replace("{bvid}", v.bvid || "");
      var a = el("a", "video");
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("data-reveal", "");
      a.setAttribute("data-reveal-delay", String(Math.min(i % 3, 2)));
      a.innerHTML =
        '<div class="video__media">' +
          '<img src="' + esc(v.cover || "") + '" alt="' + esc(v.title) + '" loading="lazy" />' +
          '<div class="video__play"><span>' + I.play + "</span></div>" +
          (v.duration ? '<span class="video__dur">' + esc(v.duration) + "</span>" : "") +
        "</div>" +
        '<div class="video__body">' +
          '<h3 class="video__title">' + esc(v.title) + "</h3>" +
          '<div class="video__meta">' +
            '<span>' + I.eye + fmtNum(v.views) + "</span>" +
            '<span>' + I.danmaku + fmtNum(v.danmaku) + "</span>" +
            '<span>' + I.clock + esc(v.date || "") + "</span>" +
          "</div>" +
        "</div>";
      box.appendChild(a);
    });
  }

  function fmtNum(n) {
    n = Number(n) || 0;
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    return String(n);
  }

  /* ---------- 关注 ---------- */
  function renderContact() {
    var box = $("#contactActions");
    if (!box || !S.contact) return;
    (S.contact.socials || []).forEach(function (s, i) {
      var a = el("a", "btn " + (i === 0 ? "btn--primary" : "btn--ghost"),
        (I[s.icon] || I.link) + esc(s.name));
      a.href = s.url || "#";
      if (/^https?:/.test(a.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      box.appendChild(a);
    });
  }

  /* ---------- 主题 ---------- */
  function initTheme() {
    var btn = $("#themeToggle"); if (!btn) return;
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      try { localStorage.setItem("theme", cur); } catch (e) {}
    });
  }

  /* ---------- 菜单 ---------- */
  function initMenu() {
    var nav = $("#nav"), burger = $("#navBurger"); if (!nav || !burger) return;
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $all("#navLinks .nav__link").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------- 滚动 ---------- */
  function initScroll() {
    var nav = $("#nav"), progress = $("#scrollProgress"), toTop = $("#toTop");
    var sections = $all("main section[id]");
    var links = $all("#navLinks .nav__link");
    var ticking = false;

    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (nav) nav.classList.toggle("is-scrolled", y > 8);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (toTop) toTop.classList.toggle("is-visible", y > 700);

      var cur = "";
      sections.forEach(function (s) { if (s.offsetTop - 140 <= y) cur = s.id; });
      links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur); });

      // 视差
      if (!reduceMotion) {
        $all("[data-parallax]").forEach(function (n) {
          var sp = parseFloat(n.getAttribute("data-parallax")) || 0.1;
          n.style.transform = "translate3d(0," + (y * sp) + "px,0)";
        });
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- 揭示动画 ---------- */
  var revealObserver = null;
  function initReveal() {
    var items = $all("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }
    items.forEach(function (n) { revealObserver.observe(n); });
  }

  /* ---------- 数字滚动 ---------- */
  function initCounters() {
    var cards = $all(".stat[data-count]");
    if (!cards.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach(function (c) { setNum(c, Number(c.getAttribute("data-count"))); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var card = en.target, target = Number(card.getAttribute("data-count"));
        io.unobserve(card);
        var start = null, dur = 1500;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          setNum(card, Math.round(target * eased));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    cards.forEach(function (c) { io.observe(c); });
  }
  function setNum(card, val) {
    var n = card.querySelector(".stat__value");
    if (n) n.textContent = fmtNum(val);
  }

  /* ---------- 鼠标聚光 + 卡片高光 ---------- */
  function initPointer() {
    if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
    var spot = $("#spotlight");
    if (spot) spot.classList.add("is-on");
    window.addEventListener("mousemove", function (e) {
      if (spot) { spot.style.setProperty("--mx", e.clientX + "px"); spot.style.setProperty("--my", e.clientY + "px"); }
    }, { passive: true });

    document.addEventListener("mousemove", function (e) {
      var c = e.target.closest ? e.target.closest(".stat") : null;
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty("--sx", (e.clientX - r.left) + "px");
      c.style.setProperty("--sy", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------- 启动 ---------- */
  function init() {
    bindText();
    renderNav();
    renderHero();
    renderMarquee();
    renderStats();
    renderAbout();
    renderVideos();
    renderContact();
    initTheme();
    initMenu();
    initScroll();
    initReveal();
    initCounters();
    initPointer();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
