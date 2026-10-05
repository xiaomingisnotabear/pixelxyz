/* ============================================================================
 * sw.js — Service Worker：本地强缓存，解决 GitHub Pages 只有 10 分钟缓存的问题
 *
 * 策略：
 *   页面(HTML) → network-first（保证内容最新，离线时回退缓存）
 *   其他资源   → stale-while-revalidate（先用缓存秒开，后台静默更新）
 *
 * 升级资源后想强制刷新缓存：把下面的 VERSION 改一下即可。
 * ==========================================================================*/

const VERSION = "2026-10-05.2";
const CACHE = "pixelxyz-" + VERSION;

/* 首次安装时预热的核心资源 */
const CORE = [
  "./",
  "index.html",
  "css/style.css",
  "js/content.js",
  "js/main.js",
  "js/particles.js",
  "data/stats.json",
  "assets/favicon.svg",
  "assets/avatar.webp",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const c = await caches.open(CACHE);
      await Promise.all(
        CORE.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => {}))
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

  /* 页面导航：网络优先 */
  const isHTML =
    req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    e.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const c = await caches.open(CACHE);
          c.put("index.html", fresh.clone());
          return fresh;
        } catch {
          const c = await caches.open(CACHE);
          return (await c.match("index.html")) || (await c.match("./")) || Response.error();
        }
      })()
    );
    return;
  }

  /* 其他资源：stale-while-revalidate */
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
