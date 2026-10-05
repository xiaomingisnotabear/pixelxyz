/* ============================================================================
   particles.js — 点阵星空 / 连线 / 鼠标排斥（纯原生 Canvas，无依赖）
   ==========================================================================*/
(function () {
  "use strict";

  var cv = document.getElementById("fx");
  if (!cv) return;

  var CFG = (window.SITE && window.SITE.effects) || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = cv.getContext("2d", { alpha: true });

  var W = 0, H = 0, DPR = 1;
  var parts = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var rafId = null, running = false;

  /* 读取主题色 */
  function readColors() {
    var root = getComputedStyle(document.documentElement);
    var p = (root.getPropertyValue("--particle") || "").trim() ||
            (root.getPropertyValue("--accent") || "#ffffff").trim();
    return { a: p, b: p, dark: document.documentElement.getAttribute("data-theme") !== "light" };
  }
  var C = readColors();

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  var RGB_A = hexToRgb(C.a);
  var RGB_B = hexToRgb(C.b);

  function rgba(rgb, a) {
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
  }

  /* ---------- 尺寸 ---------- */
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.floor(W * DPR);
    cv.height = Math.floor(H * DPR);
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    canvas.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function build() {
    var density = CFG.particles === false ? 0 : Math.min(W * H / 16000, 96);
    var count = Math.max(28, Math.round(reduce ? density * 0.5 : density));
    parts = [];
    for (var i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.7,
        hue: Math.random() > 0.5 ? RGB_A : RGB_B,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }

  var LINK_DIST = 132;
  var REPEL_DIST = 140;

  function frame() {
    rafId = null;
    canvas.clearRect(0, 0, W, H);

    var i, j, p, q, dx, dy, d2, d;

    /* 更新位置 */
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.tw += 0.02;

      /* 鼠标排斥 */
      if (CFG.mouseRepel !== false && mouse.active) {
        dx = p.x - mouse.x;
        dy = p.y - mouse.y;
        d2 = dx * dx + dy * dy;
        if (d2 < REPEL_DIST * REPEL_DIST && d2 > 0.01) {
          d = Math.sqrt(d2);
          var f = (1 - d / REPEL_DIST) * 2.4;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
      }

      /* 边界循环 */
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
    }

    /* 连线 */
    if (CFG.particleLinks !== false) {
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        for (j = i + 1; j < parts.length; j++) {
          q = parts[j];
          dx = p.x - q.x; dy = p.y - q.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            d = Math.sqrt(d2);
            var alpha = (1 - d / LINK_DIST) * (C.dark ? 0.22 : 0.16);
            canvas.strokeStyle = rgba(p.hue, alpha);
            canvas.lineWidth = 0.7;
            canvas.beginPath();
            canvas.moveTo(p.x, p.y);
            canvas.lineTo(q.x, q.y);
            canvas.stroke();
          }
        }
      }
    }

    /* 画点 */
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      var tw = 0.6 + Math.sin(p.tw) * 0.4;
      canvas.fillStyle = rgba(p.hue, (C.dark ? 0.75 : 0.5) * tw);
      canvas.beginPath();
      canvas.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      canvas.fill();

      /* 靠近鼠标的点加光晕 */
      if (CFG.mouseRepel !== false && mouse.active) {
        dx = p.x - mouse.x; dy = p.y - mouse.y;
        if (dx * dx + dy * dy < 90 * 90) {
          canvas.fillStyle = rgba(p.hue, 0.12);
          canvas.beginPath();
          canvas.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          canvas.fill();
        }
      }
    }

    if (running && !reduce) rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    if (rafId == null) rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  /* ---------- 事件 ---------- */
  var pointerTicking = false;
  window.addEventListener("mousemove", function (e) {
    if (pointerTicking) return;
    pointerTicking = true;
    requestAnimationFrame(function () {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      pointerTicking = false;
    });
  }, { passive: true });

  window.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) { mouse.active = false; mouse.x = -9999; mouse.y = -9999; }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var rt = null;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); start(); }, 180);
  });

  /* 主题切换后重读颜色 */
  var mo = new MutationObserver(function () {
    C = readColors();
    RGB_A = hexToRgb(C.a);
    RGB_B = hexToRgb(C.b);
    parts.forEach(function (p) { p.hue = Math.random() > 0.5 ? RGB_A : RGB_B; });
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* ---------- 启动 ---------- */
  resize();
  if (CFG.particles === false) {
    canvas.clearRect(0, 0, W, H);
  } else {
    canvas.globalAlpha = 0;
    var t0 = performance.now();
    (function fade() {
      canvas.globalAlpha = Math.min((performance.now() - t0) / 900, 1);
      if (canvas.globalAlpha < 1) requestAnimationFrame(fade);
    })();
    start();
  }
})();
