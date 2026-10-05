#!/usr/bin/env node
/* ============================================================================
 * sync-stats.mjs — 每日抓取三平台公开数据，写入 data/stats.json
 *
 * 设计原则：**尽力而为 + 不清零**
 *   任一平台抓取失败时，保留 stats.json 里的旧值，绝不写入 0。
 *   这样即使某天接口风控，网站也不会显示错误数据。
 *
 * 运行：node scripts/sync-stats.mjs
 * ==========================================================================*/

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "stats.json");

/* ---------- 账号标识 ---------- */
const BILI_MID = "3546840876190266";
const DY_SEC_UID =
  "MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3";
const XHS_ID = "6878bfff000000001e03ada7";

const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const UA_DESKTOP =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const TIMEOUT = 25000;

async function grab(url, { ua = UA_MOBILE, referer, type = "text" } = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        "User-Agent": ua,
        Accept: type === "json" ? "application/json, text/plain, */*" : "text/html,*/*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        ...(referer ? { Referer: referer } : {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return type === "json" ? await res.json() : await res.text();
  } finally {
    clearTimeout(t);
  }
}

const num = (v) => {
  const n = Number(String(v ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/* ---------- 哔哩哔哩 ---------- */
async function bilibili() {
  const j = await grab(
    `https://api.bilibili.com/x/web-interface/card?mid=${BILI_MID}&photo=true`,
    { referer: "https://space.bilibili.com/", type: "json" }
  );
  if (j.code !== 0) throw new Error(`bilibili code=${j.code} ${j.message || ""}`);
  const fans = num(j.data?.card?.fans ?? j.data?.follower);
  const likes = num(j.data?.like_num);
  return { fans, likes };
}

/* ---------- 抖音 ---------- */
async function douyin() {
  const j = await grab(
    `https://www.iesdouyin.com/web/api/v2/user/info/?sec_uid=${DY_SEC_UID}`,
    { referer: "https://www.iesdouyin.com/", type: "json" }
  );
  const u = j.user_info || j.data?.user_info || {};
  const fans = num(u.mplatform_followers_count ?? u.follower_count);
  const likes = num(u.total_favorited);
  return { fans, likes };
}

/* ---------- 小红书（尽力而为，页面结构可能变化） ---------- */
async function xiaohongshu() {
  const html = await grab(`https://www.xiaohongshu.com/user/profile/${XHS_ID}`, {
    ua: UA_DESKTOP,
    referer: "https://www.xiaohongshu.com/",
  });
  const pick = (res) => {
    for (const re of res) {
      const m = html.match(re);
      if (m) {
        const v = num(m[1]);
        if (v !== null) return v;
      }
    }
    return null;
  };
  const fans = pick([/"fans"\s*:\s*"?(\d+)/, /"fansCount"\s*:\s*"?(\d+)/]);
  const likes = pick([
    /"interaction"\s*:\s*"?(\d+)/,
    /"liked"\s*:\s*"?(\d+)/,
    /"likedCount"\s*:\s*"?(\d+)/,
    /获赞与收藏[^\d]{0,24}(\d+)/,
  ]);
  if (fans === null && likes === null) throw new Error("未能在页面中找到数据字段");
  return { fans, likes };
}

/* ---------- 主流程 ---------- */
async function main() {
  let prev = { platforms: {} };
  try {
    prev = JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    /* 首次运行没有旧文件 */
  }

  const sources = [
    ["bilibili", bilibili],
    ["douyin", douyin],
    ["xiaohongshu", xiaohongshu],
  ];

  const platforms = {};
  let changed = false;

  for (const [key, fn] of sources) {
    const old = prev.platforms?.[key] || {};
    let next = { ...old };
    try {
      const r = await fn();
      if (r.fans !== null && r.fans !== undefined) next.fans = r.fans;
      if (r.likes !== null && r.likes !== undefined) next.likes = r.likes;
      console.log(`✅ ${key.padEnd(12)} fans=${next.fans} likes=${next.likes}`);
    } catch (e) {
      console.warn(`⚠️  ${key.padEnd(12)} 抓取失败，保留旧值 (${e.message})`);
    }
    if (next.fans !== old.fans || next.likes !== old.likes) changed = true;
    platforms[key] = next;
  }

  const out = { updated: new Date().toISOString(), platforms };
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`\n📄 已写入 ${OUT}`);
  console.log(changed ? "🔄 数据有变化" : "➖ 数据无变化");
}

main().catch((e) => {
  console.error("同步脚本异常：", e);
  process.exit(0); // 即使失败也不阻塞工作流
});
