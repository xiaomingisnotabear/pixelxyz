/* ============================================================================
   main.js — 内容渲染 + 动画交互
   想改内容请编辑 js/content.js
   ==========================================================================*/
(function () {
  "use strict";

  var S = window.SITE || {};
  var FX = S.effects || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var noType = reduceMotion || FX.typewriter === false;

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
  function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }

  /* ---------- 图标 ---------- */
  var I = {
    bilibili: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    danmaku: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.3 8.5 8.5 0 0 1-7.3 4.2 8.4 8.4 0 0 1-3.9-1L3 21l1.9-5.6a8.4 8.4 0 0 1-1-3.9A8.5 8.5 0 0 1 8 4.2 8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    xiaohongshu: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5.06C10.3 4.4 9.34 4 8.28 4H4.6C3.72 4 3 4.72 3 5.6v11.9c0 .88.72 1.6 1.6 1.6h3.68c1.06 0 2.02.4 2.72 1.06V5.06Zm2 15.1c.7-.66 1.66-1.06 2.72-1.06h3.68c.88 0 1.6-.72 1.6-1.6V5.6c0-.88-.72-1.6-1.6-1.6h-3.68c-1.06 0-2.02.4-2.72 1.06v15.1Z"/></svg>',
    douyin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    qq: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.527 4.632 17.122 1 12 1S4.473 4.632 4.473 9.24c0 .274.013.804.014.836l-1.079 2.695a39 39 0 0 0-.803 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 3.199 4.741-.09.38-.4 1.259-.504 1.865-.011.066-.03.31-.034.4 0 .157.09.31.31.31.32 0 1.32-.42 2.36-.84.34.06.68.09 1.03.09.35 0 .69-.03 1.03-.09 1.04.42 2.04.84 2.36.84.22 0 .31-.153.31-.31-.004-.09-.023-.334-.034-.4-.104-.606-.414-1.485-.504-1.865 2.443-1.354 3.199-3.272 3.199-4.741 0 0 1.563 2.537 2.103 2.472.252-.03.583-1.39-.438-4.673z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
  };

  /* 主题色注入 */
  if (S.meta) {
    if (S.meta.accent) document.documentElement.style.setProperty("--accent", S.meta.accent);
    if (S.meta.accent2) document.documentElement.style.setProperty("--accent-2", S.meta.accent2);
    if (S.meta.accent3) document.documentElement.style.setProperty("--accent-3", S.meta.accent3);
  }

  /* ---------- 绑定文本 ---------- */
  function bindText() {
    $all("[data-bind]").forEach(function (node) {
      if (node.id === "typeTagline") return; // 交给打字机处理
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

  function renderHero() {
    var cta = $("#heroCta");
    if (cta && S.hero && S.hero.cta) {
      S.hero.cta.forEach(function (b) {
        var a = el("a", "btn " + (b.primary ? "btn--primary" : "btn--ghost"), esc(b.label) + (I[b.icon] || ""));
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

  function renderMarquee() {
    var track = $(".marquee__track");
    if (!track || !S.hero || !S.hero.highlights) return;
    var items = S.hero.highlights.slice();
    track.innerHTML = items.concat(items).map(function (t) {
      return '<span class="marquee__item">' + esc(t) + "</span>";
    }).join("");
  }

  /* ---------- 数据卡片 ---------- */
  function renderStats() {
    var box = $("#statsGrid");
    if (!box || !S.stats || !S.stats.items) return;
    S.stats.items.forEach(function (s, i) {
      var card = el("div", "stat");
      card.setAttribute("data-reveal", "");
      card.setAttribute("data-reveal-delay", String(Math.min(i, 4)));
      card.setAttribute("data-count", String(s.value || 0));
      card.innerHTML =
        '<div class="stat__num"><span class="stat__value">0</span>' +
        (s.suffix ? '<span class="stat__suffix">' + esc(s.suffix) + "</span>" : "") +
        "</div>" +
        '<div class="stat__label">' + esc(s.label) + "</div>";
      box.appendChild(card);
    });
  }

  /* ---------- 进度条面板 ---------- */
  function renderFocus() {
    var box = $("#focusBars");
    if (!box || !S.focus || !S.focus.items) return;
    S.focus.items.forEach(function (f) {
      var row = el("div", "bar");
      row.setAttribute("data-value", String(f.value || 0));
      row.setAttribute("data-reveal", "");
      row.innerHTML =
        '<div class="bar__top">' +
          '<span class="bar__label">' + esc(f.label) + "</span>" +
          '<span class="bar__val">0%</span>' +
        "</div>" +
        '<div class="bar__track"><span class="bar__fill"></span></div>';
      box.appendChild(row);
    });
  }

  function animateBars() {
    var rows = $all("#focusBars .bar");
    if (!rows.length) return;
    rows.forEach(function (row, i) {
      if (row.getAttribute("data-done")) return;
      row.setAttribute("data-done", "1");
      var val = Number(row.getAttribute("data-value")) || 0;
      var fill = row.querySelector(".bar__fill");
      var out = row.querySelector(".bar__val");
      var delay = i * 130;

      if (reduceMotion) { fill.style.width = val + "%"; out.textContent = val + "%"; return; }
      fill.style.transitionDelay = delay + "ms";

      setTimeout(function () {
        fill.style.width = val + "%";
        var t0 = null, dur = 1450;
        requestAnimationFrame(function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          out.textContent = Math.round(val * easeOutCubic(p)) + "%";
          if (p < 1) requestAnimationFrame(step);
        });
      }, delay);
    });
  }

  /* ---------- 终端打字机 ---------- */
  function renderTerminal() {
    var body = $("#terminalBody");
    if (!body || !S.terminal || !S.terminal.lines) return;
    body.innerHTML = "";
    var caret = el("span", "tcaret");
    var lines = S.terminal.lines;
    var started = false;

    function start() {
      if (started) return; started = true;

      /* 无动画模式：一次性渲染 */
      if (noType) {
        lines.forEach(function (l) {
          body.appendChild(el("span", "tline tline--" + (l.type === "cmd" ? "cmd" : "out"), esc(l.text)));
        });
        body.appendChild(caret);
        return;
      }

      var li = 0;
      function nextLine() {
        if (li >= lines.length) { body.appendChild(caret); return; }
        var l = lines[li++];
        var isCmd = l.type === "cmd";
        var node = el("span", "tline tline--" + (isCmd ? "cmd" : "out"));
        body.appendChild(node);

        if (!isCmd) {
          /* 输出行：直接出现（像真实终端） */
          node.textContent = l.text;
          setTimeout(nextLine, 190);
          return;
        }

        /* 命令：逐字打印 */
        var text = l.text, ci = 0;
        node.appendChild(caret);
        (function type() {
          if (ci <= text.length) {
            node.textContent = text.slice(0, ci) + "\u00A0";
            node.appendChild(caret);
            ci++;
            setTimeout(type, 46);
          } else {
            node.textContent = text;
            setTimeout(nextLine, 200);
          }
        })();
      }
      setTimeout(nextLine, 260);
    }

    if (!("IntersectionObserver" in window)) { start(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); start(); } });
    }, { threshold: 0 });
    io.observe($("#terminal"));

    /* 兜底：快速滚动/锚点跳转跳过触发点时，也能补上 */
    function byScroll() {
      var t = $("#terminal");
      if (!t) return;
      if (t.getBoundingClientRect().top < window.innerHeight * 0.92) {
        window.removeEventListener("scroll", byScroll);
        io.disconnect();
        start();
      }
    }
    window.addEventListener("scroll", byScroll, { passive: true });
  }

  /* ---------- 档案 ---------- */
  function renderAbout() {
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
  function fmtNum(n) {
    n = Number(n) || 0;
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    return String(n);
  }
  function renderVideos() {
    var box = $("#videosGrid");
    if (!box || !S.videos || !S.videos.items) return;
    var tpl = S.videos.videoUrlTemplate || "https://www.bilibili.com/video/{bvid}/";
    var more = $("#videosMore");
    if (more && S.videos.more) more.href = S.videos.more.url;

    S.videos.items.forEach(function (v, i) {
      var a = el("a", "video");
      a.href = tpl.replace("{bvid}", v.bvid || "");
      a.target = "_blank"; a.rel = "noopener noreferrer";
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
            "<span>" + I.eye + fmtNum(v.views) + "</span>" +
            "<span>" + I.danmaku + fmtNum(v.danmaku) + "</span>" +
            "<span>" + I.clock + esc(v.date || "") + "</span>" +
          "</div>" +
        "</div>";
      box.appendChild(a);
    });
  }

  /* ---------- 多平台矩阵 ---------- */
  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (done) done();
    } catch (e) {}
  }

  function renderPlatforms() {
    var box = $("#platformsGrid");
    if (!box || !S.platforms || !S.platforms.items) return;
    S.platforms.items.forEach(function (pf, i) {
      var card = el("div", "platform");
      card.setAttribute("data-reveal", "");
      card.setAttribute("data-reveal-delay", String(Math.min(i, 2)));
      if (pf.accent) card.style.setProperty("--pf", pf.accent);

      var head = el("div", "platform__head");
      var av = el("div", "platform__avatar");
      if (pf.avatar) {
        var img = el("img"); img.src = pf.avatar; img.alt = pf.name || ""; img.loading = "lazy";
        av.appendChild(img);
      } else {
        av.innerHTML = I[pf.icon] || I.link;
      }
      var meta = el("div", "platform__meta");
      meta.appendChild(el("div", "platform__name", esc(pf.name)));
      meta.appendChild(el("div", "platform__handle", esc(pf.handle || "")));
      head.appendChild(av); head.appendChild(meta);
      card.appendChild(head);

      if (pf.stats && pf.stats.length) {
        var st = el("div", "platform__stats");
        pf.stats.forEach(function (s) {
          var d = el("div", "platform__stat");
          d.appendChild(el("span", "platform__stat-num", esc(fmtNum(s.value))));
          d.appendChild(el("span", "platform__stat-label", esc(s.label)));
          st.appendChild(d);
        });
        card.appendChild(st);
      }

      var isCopy = !!pf.copy;
      var label = isCopy ? (pf.copyLabel || "复制") : ((S.platforms && S.platforms.cta) || "前往关注");
      var btn = el(isCopy ? "button" : "a", "platform__cta");
      btn.innerHTML = (isCopy ? I.copy : (I[pf.icon] || I.link)) + "<span>" + esc(label) + "</span>";

      if (isCopy) {
        btn.type = "button";
        var idle = I.copy + "<span>" + esc(label) + "</span>";
        btn.addEventListener("click", function () {
          fallbackCopy(pf.copy, function () {
            btn.classList.add("is-done");
            btn.innerHTML = I.check + "<span>已复制 " + esc(pf.copy) + "</span>";
            setTimeout(function () { btn.classList.remove("is-done"); btn.innerHTML = idle; }, 1900);
          });
        });
      } else {
        btn.href = pf.url || "#";
        if (/^https?:/.test(btn.href)) { btn.target = "_blank"; btn.rel = "noopener noreferrer"; }
      }
      card.appendChild(btn);
      box.appendChild(card);
    });
  }

  function renderContact() {
    var box = $("#contactActions");
    if (!box || !S.contact) return;
    var mail = $("#contactMail");
    if (mail && S.contact.email) {
      mail.href = "mailto:" + S.contact.email;
      mail.innerHTML = I.mail + "<span>" + esc(S.contact.email) + "</span>";
    }
    (S.contact.socials || []).forEach(function (s, i) {
      var a = el("a", "btn " + (i === 0 ? "btn--primary" : "btn--ghost"), (I[s.icon] || I.link) + esc(s.name));
      a.href = s.url || "#";
      if (/^https?:/.test(a.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      box.appendChild(a);
    });
  }

  /* ---------- 主题 / 菜单 ---------- */
  function initTheme() {
    var btn = $("#themeToggle"); if (!btn) return;
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      try { localStorage.setItem("theme", cur); } catch (e) {}
    });
  }
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

  /* ---------- 揭示 ---------- */
  var revealObserver = null;
  function initReveal() {
    var items = $all("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      animateBars();
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

    /* 进度条：进入视口时填充 */
    var bars = $("#focusBars");
    if (bars) {
      var bio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { bio.disconnect(); animateBars(); } });
      }, { threshold: 0.3 });
      bio.observe(bars);
    }
  }

  /* ---------- 滚动兜底（防快速跳转漏触发） ---------- */
  function initFallbacks() {
    var ticking = false;
    function check() {
      ticking = false;
      var vh = window.innerHeight;
      $all("[data-reveal]:not(.is-in)").forEach(function (n) {
        if (n.getBoundingClientRect().top < vh * 0.94) n.classList.add("is-in");
      });
      var fb = $("#focusBars");
      if (fb && fb.getBoundingClientRect().top < vh * 0.9) animateBars();
      $all(".stat[data-count]:not([data-counted])").forEach(function (c) {
        if (c.getBoundingClientRect().top < vh * 0.95) runCounter(c);
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    }, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();
  }

  /* ---------- 数字滚动 ---------- */
  function setNum(card, val) {
    var n = card.querySelector(".stat__value");
    if (n) n.textContent = fmtNum(val);
  }
  function runCounter(card) {
    if (card.getAttribute("data-counted")) return;
    card.setAttribute("data-counted", "1");
    var target = Number(card.getAttribute("data-count")) || 0;
    if (reduceMotion) { setNum(card, target); return; }
    var start = null, dur = 1500;
    requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      setNum(card, Math.round(target * easeOutCubic(p)));
      if (p < 1) requestAnimationFrame(step);
    });
  }

  function initCounters() {
    var cards = $all(".stat[data-count]");
    if (!cards.length) return;
    if (!("IntersectionObserver" in window)) { cards.forEach(runCounter); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        runCounter(en.target);
      });
    }, { threshold: 0.4 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- 首屏标语打字机 ---------- */
  function typeTagline() {
    var el = $("#typeTagline"); if (!el) return;
    var full = (S.hero && S.hero.tagline) || el.textContent || "";
    if (noType) { el.textContent = full; return; }
    el.textContent = "";                       // 立即清空，避免闪现全文
    setTimeout(function () {
      var i = 0;
      (function step() {
        el.textContent = full.slice(0, i);
        i++;
        if (i <= full.length) setTimeout(step, 30);
      })();
    }, 760);
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

  /* ---------- 自定义终端光标 ---------- */
  function initCursor() {
    if (FX.customCursor === false || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var cur = $("#cursor"); if (!cur) return;

    document.body.classList.add("has-cursor");
    cur.classList.add("is-on");

    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, raf = null;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });

    function loop() {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      cur.style.transform = "translate(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px)";
      raf = requestAnimationFrame(loop);
    }
    loop();

    var hot = "a,button,.video,.stat,.social-chip,input,textarea,.link-more";
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      cur.classList.toggle("is-link", !!(t && t.closest && t.closest(hot)));
    }, { passive: true });
    window.addEventListener("mousedown", function () { cur.classList.add("is-down"); });
    window.addEventListener("mouseup", function () { cur.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { cur.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { cur.style.opacity = "1"; });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else if (!raf) { loop(); }
    });
  }

  /* ---------- 启动 ---------- */
  function init() {
    bindText();
    renderNav();
    renderHero();
    renderMarquee();
    renderStats();
    renderFocus();
    renderAbout();
    renderTerminal();
    renderVideos();
    renderPlatforms();
    renderContact();
    initTheme();
    initMenu();
    initScroll();
    initReveal();
    initFallbacks();
    initCounters();
    initPointer();
    initCursor();
    typeTagline();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
