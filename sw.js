/* ============================================================================
 * sw.js — Service Worker：本地缓存加速（缓解 GitHub Pages 国内访问慢）
 *
 * 策略：
 *   HTML / CSS / JS / JSON（随发布变化的“代码类”）→ network-first
 *       联网时永远拿最新版本，断网时回退缓存
 *   图片等静态资源（体积大、几乎不变）→ stale-while-revalidate
 *       先用缓存秒开，后台静默更新
 *
 * 为什么代码类不用缓存优先：
 *   早期版本用 stale-while-revalidate，导致网站更新后第一次访问看到的还是旧版，
 *   必须刷新两次才生效。而 HTML 本来就是 network-first、必须等网络，
 *   CSS/JS 与之并行请求，改成 network-first 几乎不增加感知耗时，
 *   换来的是“每次打开都是最新版”。图片才是体积大头，仍然走缓存。
 *
 * 想彻底重置缓存（含图片）：改下面的 VERSION。
 * ==========================================================================*/

const VERSION = "2026-10-05.4";
const CACHE = "pixelxyz-" + VERSION;

/* 代码 / 数据类：必须优先取最新 */
const FRESH = [
  "./",
  "index.html",
  "css/style.css",
  "js/content.js",
  "js/main.js",
  "js/particles.js",
  "data/stats.json",
];

/* 静态资源：缓存优先 */
const ASSETS = [
  "assets/favicon.svg",
  "assets/avatar.webp",
  "assets/apple-touch-icon.png",
  "manifest.webmanifest",
];

const CODE_RE = /\.(?:css|js|mjs|json|webmanifest)$/i;

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const c = await caches.open(CACHE);
      await Promise.all(
        FRESH.concat(ASSETS)
          .map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => {}))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // 只处理本站资源

  const isHTML =
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");
  const isCode = CODE_RE.test(url.pathname);

  /* ---------- 代码类：network-first ---------- */
  if (isHTML || isCode) {
    e.respondWith(
      (async () => {
        const c = await caches.open(CACHE);
        const key = isHTML ? "index.html" : req;
        try {
          /* cache:"reload" —— 绕过浏览器 HTTP 缓存
             （GitHub Pages 给 CSS/JS 设了 max-age=600，光靠 network-first 仍可能
               读到最多 10 分钟前的旧文件，用户就会以为「改了没生效」） */
          const fresh = await fetch(req, { cache: "reload" });
          if (fresh && fresh.status === 200 && fresh.type === "basic") {
            c.put(key, fresh.clone());
          }
          return fresh;
        } catch (err) {
          const hit = await c.match(key);
          return hit || Response.error();
        }
      })()
    );
    return;
  }

  /* ---------- 图片等：stale-while-revalidate ---------- */
  e.respondWith(
    (async () => {
      const c = await caches.open(CACHE);
      const cached = await c.match(req);

      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") c.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      return cached || (await network) || Response.error();
    })()
  );
});
