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
    xiaohongshu: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972.794.794 0 0 0-.884-.618.795.795 0 0 0-.692.794c0 .101-.002.666.001.777zm-11.509 4.808c-.203.001-1.353.004-1.685.003a2.528 2.528 0 0 1-.766-.126.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124.66.01 1.32.002 1.981 0 .01 0 .02-.006.023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01a.834.834 0 0 0-.01.08c-.027.397-.038.495-.234 3.06-.012.24-.034.389-.135.607-.026.057-.033.042.003.112.046.092.681 1.523.787 1.74.008.015.011.02.017.02.008 0 .033-.026.047-.044.147-.187.268-.391.371-.606.306-.635.44-1.325.486-1.706.014-.11.021-.22.03-.33l.204-2.616.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.427 1.427 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.443.443 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293c.076.982.153 1.964.233 2.946.05.4.186 1.085.487 1.706.103.215.223.419.37.606.015.018.037.051.048.049.02-.003.742-1.642.804-1.765.036-.07.03-.055.003-.112zm3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56c-.01 0-.02.006-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.534.534 0 0 0-.02.191.46.46 0 0 0 .23.378.981.981 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.53.53 0 0 0-.023.172.465.465 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001c.01 0 .02-.006.023-.015l.575-1.28a.025.025 0 0 0-.024-.035zm-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829 0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047.001.037.465 1.064.555 1.263.01.02.03.033.051.033.157.003.767.009.938-.014.153-.02.3-.06.438-.132.3-.156.49-.419.595-.765.052-.172.075-.353.075-.533.002-2.33 0-4.66-.007-6.991a.032.032 0 0 0-.032-.032zm11.784 6.896c0-.014-.01-.021-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084-.37 0-1.11-.002-1.304 0-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036c.006.01.013.008.058.008 1.748.003 3.495.002 5.243.002.03-.001.034-.006.035-.033v-1.539zm4.177-3.43c0 .013-.007.023-.02.024-.346.006-.692.004-1.037.004-.014-.002-.022-.01-.022-.024-.005-.434-.007-.869-.01-1.303 0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015.093.025.16.107.165.204.006.431.002 1.153.001 1.153zm2.67.244a1.953 1.953 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21c0-.132-.007-.263-.025-.394a1.823 1.823 0 0 0-.153-.53 1.533 1.533 0 0 0-.677-.71 2.167 2.167 0 0 0-1-.258c-.153-.003-.567 0-.72 0-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007c-.006.006-.008.012-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128V11.19s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003c.098 0 .191.02.28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185 0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033.184.437.374.871.57 1.303a.045.045 0 0 0 .04.026c.17.005.34.002.51.003.15-.002.517.004.666-.01a2.03 2.03 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981c0-.128-.01-.254-.034-.38 0 .078-.029-.641-.724-.998z"/></svg>',
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
    if (!box || !S.stats || !S.stats.totals) return;
    S.stats.totals.forEach(function (s, i) {
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

  /* ---------- 各平台明细 ---------- */
  function pct(v, total) {
    if (!total) return 0;
    return Math.max(2, Math.round((Number(v) || 0) / total * 1000) / 10);
  }

  function renderBreakdown() {
    var box = $("#breakdownRows");
    if (!box || !S.stats || !S.stats.breakdown || !S.stats.breakdown.items) return;
    var items = S.stats.breakdown.items;
    var totFans = items.reduce(function (a, b) { return a + (Number(b.fans) || 0); }, 0);
    var totLikes = items.reduce(function (a, b) { return a + (Number(b.likes) || 0); }, 0);

    items.forEach(function (it, i) {
      var row = el("div", "prow");
      row.setAttribute("data-reveal", "");
      row.setAttribute("data-reveal-delay", String(Math.min(i, 2)));
      row.innerHTML =
        '<div class="prow__name">' + (I[it.icon] || I.link) + "<span>" + esc(it.name) + "</span></div>" +
        '<div class="prow__metrics">' +
          '<div class="metric">' +
            '<div class="metric__top"><span class="metric__label">粉丝</span><b class="metric__val">' + fmtFull(it.fans) + "</b></div>" +
            '<div class="metric__track"><span class="metric__fill" data-w="' + pct(it.fans, totFans) + '"></span></div>' +
          "</div>" +
          '<div class="metric">' +
            '<div class="metric__top"><span class="metric__label">获赞</span><b class="metric__val">' + fmtFull(it.likes) + "</b></div>" +
            '<div class="metric__track"><span class="metric__fill" data-w="' + pct(it.likes, totLikes) + '"></span></div>' +
          "</div>" +
        "</div>";
      box.appendChild(row);
    });
  }

  function animateMetrics() {
    $all(".metric__fill").forEach(function (fill, i) {
      if (fill.getAttribute("data-done")) return;
      fill.setAttribute("data-done", "1");
      var val = parseFloat(fill.getAttribute("data-w")) || 0;
      if (reduceMotion) { fill.style.width = val + "%"; return; }
      fill.style.transitionDelay = (i * 90) + "ms";
      requestAnimationFrame(function () { fill.style.width = val + "%"; });
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

  /* ---------- 作品（多平台 + 筛选） ---------- */
  function fmtNum(n) {            /* 紧凑：用于播放量等小字 */
    n = Number(n) || 0;
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    return String(n);
  }
  function fmtFull(n) {           /* 精确：用于统计面板，千分位 */
    return (Number(n) || 0).toLocaleString("en-US");
  }

  var PLATFORM_LABEL = { bilibili: "哔哩哔哩", douyin: "抖音", xiaohongshu: "小红书" };

  function workCard(w, i) {
    var wall = w.kind === "clip";
    var a = el("a", "video");
    a.href = w.url || "#";
    a.target = "_blank"; a.rel = "noopener noreferrer";
    a.setAttribute("data-reveal", "");
    a.setAttribute("data-reveal-delay", String(Math.min(i % 4, 3)));

    var badge = (w.platform && w.platform !== "bilibili")
      ? '<span class="work__badge">' + esc(PLATFORM_LABEL[w.platform] || "") + "</span>" : "";

    var meta = "";
    if (w.kind === "video") {
      meta = "<span>" + I.eye + fmtNum(w.views) + "</span>" +
             "<span>" + I.danmaku + fmtNum(w.danmaku) + "</span>" +
             "<span>" + I.clock + esc(w.date || "") + "</span>";
    } else if (w.kind === "article") {
      meta = "<span>" + I.danmaku + "评论 " + fmtNum(w.comments) + "</span><span>图文</span>";
    }

    var dim = wall ? ' width="300" height="400"' : ' width="640" height="360"';
    a.innerHTML =
      '<div class="video__media">' +
        '<img src="' + esc(w.cover || "") + '" alt="' + esc(w.title || "作品封面") + '" loading="lazy" decoding="async"' + dim + " />" +
        badge +
        '<div class="video__play"><span>' + I.play + "</span></div>" +
        (w.duration ? '<span class="video__dur">' + esc(w.duration) + "</span>" : "") +
      "</div>" +
      (wall ? "" :
        '<div class="video__body">' +
          '<h3 class="video__title">' + esc(w.title || "") + "</h3>" +
          '<div class="video__meta">' + meta + "</div>" +
        "</div>");
    return a;
  }

  function filterItems(id) {
    var items = (S.works && S.works.items) || [];
    /* 作品区只保留视频：哔哩哔哩 = 视频网格，抖音 = 封面墙 */
    if (id === "douyin") return items.filter(function (w) { return w.platform === "douyin"; });
    return items.filter(function (w) { return w.kind === "video"; });
  }

  function renderWorks(id) {
    var box = $("#worksGrid");
    if (!box || !S.works) return;
    var f = id || "bilibili";
    var items = filterItems(f);
    box.className = "videos" + (f === "douyin" ? " videos--wall" : "");
    box.innerHTML = "";
    items.forEach(function (w, i) { box.appendChild(workCard(w, i)); });

    var note = $("#worksNote");
    if (note) {
      if (f === "douyin") {
        note.hidden = false;
        note.textContent = "抖音网页版不提供作品标题，这里以封面墙呈现 · 点击任意封面前往抖音主页";
      } else { note.hidden = true; note.textContent = ""; }
    }

    /* 切换后的错峰淡入 */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        $all("[data-reveal]", box).forEach(function (n, i) {
          setTimeout(function () { n.classList.add("is-in"); }, i * 55);
        });
      });
    });
  }

  function renderFilters() {
    var box = $("#worksFilters");
    if (!box || !S.works || !S.works.filters) return;
    var more = $("#worksMore");
    if (more && S.works.more) more.href = S.works.more.url;

    S.works.filters.forEach(function (f, i) {
      var b = el("button", "filter" + (i === 0 ? " is-active" : ""),
        esc(f.label) + '<span class="filter__count">' + filterItems(f.id).length + "</span>");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        $all(".filter", box).forEach(function (x) {
          x.classList.remove("is-active"); x.setAttribute("aria-selected", "false");
        });
        b.classList.add("is-active"); b.setAttribute("aria-selected", "true");
        renderWorks(f.id);
      });
      box.appendChild(b);
    });
  }

  /* ---------- 品牌 logo ---------- */
  function renderBrand() {
    var logo = (S.brand && S.brand.logo) || "";
    $all(".brand__avatar").forEach(function (img) {
      if (logo) { img.src = logo; return; }
      var sp = el("span", img.classList.contains("brand__avatar--sm")
        ? "brand__mark brand__mark--sm" : "brand__mark", esc((S.brand && S.brand.mark) || "P"));
      img.replaceWith(sp);
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
      var av = el("div", "platform__avatar" + (pf.icon ? " platform__avatar--" + pf.icon : ""));
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
          d.appendChild(el("span", "platform__stat-num", esc(fmtFull(s.value))));
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
      animateMetrics();
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

    /* 各平台明细：进入视口时填充 */
    var bd = $("#breakdown");
    if (bd) {
      var bdio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { bdio.disconnect(); animateMetrics(); } });
      }, { threshold: 0.25 });
      bdio.observe(bd);
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
      var bd = $("#breakdown");
      if (bd && bd.getBoundingClientRect().top < vh * 0.9) animateMetrics();
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
    if (n) n.textContent = fmtFull(val);
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

  /* ---------- 实时数据（data/stats.json，由 GitHub Action 每日生成） ---------- */
  function keyOf(name) {
    if (!name) return null;
    if (name.indexOf("哔哩") >= 0) return "bilibili";
    if (name.indexOf("抖音") >= 0) return "douyin";
    if (name.indexOf("小红书") >= 0) return "xiaohongshu";
    return null;
  }

  function loadLiveStats() {
    if (!window.fetch) return;
    fetch("data/stats.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.platforms) applyLiveStats(d); })
      .catch(function () { /* 静默回退到 content.js 数值 */ });
  }

  function applyLiveStats(d) {
    var P = d.platforms || {};

    /* 各平台明细 */
    if (S.stats && S.stats.breakdown) {
      (S.stats.breakdown.items || []).forEach(function (it) {
        var k = it.key || keyOf(it.name);
        if (!k || !P[k]) return;
        if (P[k].fans != null) it.fans = P[k].fans;
        if (P[k].likes != null) it.likes = P[k].likes;
      });
    }

    /* 平台卡片 */
    ((S.platforms && S.platforms.items) || []).forEach(function (p) {
      var k = p.key || keyOf(p.name);
      if (!k || !P[k]) return;
      (p.stats || []).forEach(function (st) {
        if (st.key === "fans" && P[k].fans != null) st.value = P[k].fans;
        if (st.key === "likes" && P[k].likes != null) st.value = P[k].likes;
      });
    });

    /* 汇总 */
    var tf = 0, tl = 0, tp = 0;
    Object.keys(P).forEach(function (k) {
      if (P[k].fans != null) { tf += Number(P[k].fans) || 0; tp++; }
      if (P[k].likes != null) { tl += Number(P[k].likes) || 0; }
    });
    if (S.stats && S.stats.totals) {
      if (tf) S.stats.totals[0].value = tf;
      if (tl) S.stats.totals[1].value = tl;
      if (tp) S.stats.totals[2].value = tp;
    }
    if (d.updated && S.stats) {
      S.stats.note = "数据每日自动同步自哔哩哔哩、抖音、小红书公开主页 · 更新于 " + String(d.updated).slice(0, 10);
    }

    rerenderStats();
  }

  function rerenderStats() {
    var box = $("#statsGrid");
    if (box) {
      box.innerHTML = "";
      renderStats();
      $all(".stat[data-count]", box).forEach(function (n) { n.classList.add("is-in"); runCounter(n); });
    }
    var bd = $("#breakdownRows");
    if (bd) {
      bd.innerHTML = "";
      renderBreakdown();
      $all(".prow", bd).forEach(function (n) { n.classList.add("is-in"); });
      animateMetrics();
    }
    var pg = $("#platformsGrid");
    if (pg) {
      pg.innerHTML = "";
      renderPlatforms();
      $all(".platform", pg).forEach(function (n) { n.classList.add("is-in"); });
    }
    var note = $(".stats__note");
    if (note && S.stats && S.stats.note) note.textContent = S.stats.note;
  }

  /* ---------- Service Worker（本地强缓存，二次访问秒开） ---------- */
  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* 不支持则静默忽略 */ });
    });
  }

  /* ---------- 启动 ---------- */
  function init() {
    bindText();
    renderNav();
    renderHero();
    renderMarquee();
    renderStats();
    renderBreakdown();
    renderFocus();
    renderAbout();
    renderTerminal();
    renderBrand();
    renderWorks();
    renderFilters();
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
    loadLiveStats();
    initServiceWorker();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
