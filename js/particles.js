/* ============================================================================
   particles.js — 浮尘粒子层（纯原生 Canvas，无依赖）
   与 CSS 的「弥散光雾 + 网点图」共同构成背景。

   设计要点：
     · 只做会呼吸的浮尘，不做星空连线（连线是上一版效果，已彻底移除）
     · 带景深：越"近"的粒子越大、越亮、飘得越快，鼠标视差也越明显
     · 鼠标视差（不是硬排斥）：整层随光标缓慢反向偏移，产生空间纵深感
     · 发光点用离屏精灵贴图绘制，避免每帧新建径向渐变，低端设备也能稳住 60fps
   ==========================================================================*/
(function () {
  "use strict";

  var cv = document.getElementById("fx");
  if (!cv) return;

  var CFG = (window.SITE && window.SITE.effects) || {};
  var ctx = cv.getContext("2d", { alpha: true });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0, DPR = 1;
  var parts = [];
  var rafId = null, running = false;
  var sprite = null;

  /* 视差：aim 是目标偏移，par 是缓动后的当前偏移 */
  var PARALLAX = 26;
  var aimX = 0, aimY = 0, parX = 0, parY = 0;

  function isDark() {
    return document.documentElement.getAttribute("data-theme") !== "light";
  }

  /* ---------- 离屏发光精灵：只画一次，之后 drawImage 复用 ---------- */
  function buildSprite() {
    var S = 64;
    var off = document.createElement("canvas");
    off.width = off.height = S;
    var c = off.getContext("2d");
    var base = isDark() ? "255,255,255" : "17,17,17";
    var g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgba(" + base + ",1)");
    g.addColorStop(0.40, "rgba(" + base + ",0.92)");
    g.addColorStop(0.66, "rgba(" + base + ",0.22)");
    g.addColorStop(1, "rgba(" + base + ",0)");
    c.fillStyle = g;
    c.fillRect(0, 0, S, S);
    sprite = off;
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
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  /* ---------- 粒子 ---------- */
  function spawn(y) {
    /* 景深 z：开三次方偏置，让多数粒子落在"远处"，少数在"近处" */
    var z = Math.pow(Math.random(), 1.35);
    return {
      x: Math.random() * W,
      y: y == null ? Math.random() * H : y,
      z: z,
      r: 0.45 + z * 1.7,
      vx: (Math.random() - 0.5) * (0.04 + z * 0.14),
      vy: -(0.05 + z * 0.14) - Math.random() * 0.05,   /* 缓慢上浮，像光柱里的尘埃 */
      tw: Math.random() * Math.PI * 2,
      sp: 0.004 + Math.random() * 0.012,
      a: 0.16 + z * 0.42
    };
  }

  function build() {
    var n = Math.round(W * H / 24000);
    n = Math.max(24, Math.min(n, 76));
    if (CFG.particles === false) n = 0;
    if (reduce) n = Math.round(n * 0.4);
    parts = [];
    for (var i = 0; i < n; i++) parts.push(spawn());
  }

  /* ---------- 主循环 ---------- */
  function frame() {
    rafId = null;
    ctx.clearRect(0, 0, W, H);

    parX += (aimX - parX) * 0.05;
    parY += (aimY - parY) * 0.05;
    var usePar = CFG.parallax !== false;

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];

      p.x += p.vx;
      p.y += p.vy;
      p.tw += p.sp;

      /* 飘出顶部就从底部重新来过 */
      if (p.y < -30) { parts[i] = spawn(H + 30); continue; }
      if (p.x < -30) p.x = W + 30;
      else if (p.x > W + 30) p.x = -30;

      var breathe = 0.6 + Math.sin(p.tw) * 0.4;
      var depth = 0.35 + p.z * 0.65;                 /* 越近，视差位移越大 */
      var dx = p.x + (usePar ? parX * depth : 0);
      var dy = p.y + (usePar ? parY * depth : 0);
      var r = p.r * (0.85 + breathe * 0.35);

      ctx.globalAlpha = Math.min(p.a * breathe, 1);
      ctx.drawImage(sprite, dx - r * 2.6, dy - r * 2.6, r * 5.2, r * 5.2);
    }
    ctx.globalAlpha = 1;

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

  /* ---------- 交互 ---------- */
  var ticking = false;
  window.addEventListener("mousemove", function (e) {
    if (CFG.parallax === false) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      /* 反向偏移：鼠标往右，粒子层往左，形成纵深 */
      aimX = (e.clientX / W - 0.5) * -2 * PARALLAX;
      aimY = (e.clientY / H - 0.5) * -2 * PARALLAX;
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) { aimX = 0; aimY = 0; }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var rt = null;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); start(); }, 180);
  });

  /* 主题切换后重建精灵（黑白反转） */
  new MutationObserver(function () { buildSprite(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* ---------- 启动 ---------- */
  buildSprite();
  resize();

  if (CFG.particles === false) {
    ctx.clearRect(0, 0, W, H);
  } else {
    requestAnimationFrame(function () { cv.classList.add("is-ready"); });
    start();
  }
})();
