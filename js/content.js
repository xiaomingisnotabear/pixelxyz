/* ============================================================================
 *  content.js  —  网站所有可编辑内容（数据来源：B 站 PixelXYZ像素空间）
 *  修改本文件即可更新全站，无需改动 HTML。
 *  标注 // TODO 的地方可按需替换。
 * ==========================================================================*/

window.SITE = {
  /* ---------- 站点元信息 ---------- */
  meta: {
    lang: "zh-CN",
    title: "PixelXYZ像素空间 · 数码频道",
    description:
      "PixelXYZ像素空间 — 一个兴趣使然创办的数码频道。「pixel infinity, advance courageously / 像素无限，一往无前」",
    favicon: "assets/favicon.svg",
    accent: "#0a84ff",   // Apple 蓝
    accent2: "#5e5ce6",  // Apple 靛蓝
    accent3: "#ff375f",  // 品红点缀
    theme: "dark",       // 默认主题：dark / light
  },

  /* ---------- 特效开关 ---------- */
  effects: {
    particles: true,       // 点阵星空背景
    particleLinks: true,   // 粒子之间连线（赛博风）
    mouseRepel: true,      // 鼠标靠近时粒子排斥散开
    customCursor: true,    // 自定义终端风格光标（仅桌面端）
    scanLines: true,       // 卡片底部扫描发光线条
    typewriter: true,      // 打字机动画
  },

  /* ---------- 品牌 ---------- */
  brand: { name: "PixelXYZ", mark: "P" },

  nav: [
    { label: "首页", href: "#home" },
    { label: "数据", href: "#stats" },
    { label: "简介", href: "#about" },
    { label: "作品", href: "#videos" },
    { label: "关注", href: "#contact" },
  ],

  /* ---------- 首屏 ---------- */
  hero: {
    badge: "数码频道 · Digital Channel",
    name: "PixelXYZ 像素空间",
    slogan: "像素无限，一往无前",
    sloganEn: "Pixel Infinity · Advance Courageously",
    tagline:
      "一个兴趣使然创办的数码频道，专注数码产品体验、影像设备与科技内容分享。",
    avatar: "assets/avatar.jpg",
    cta: [
      {
        label: "关注 B 站",
        href: "https://space.bilibili.com/3546840876190266",
        primary: true,
        icon: "bilibili",
      },
      {
        label: "观看视频",
        href: "https://space.bilibili.com/3546840876190266/video",
        primary: false,
        icon: "play",
      },
    ],
    socials: [
      { name: "哔哩哔哩", url: "https://space.bilibili.com/3546840876190266", icon: "bilibili" },
      { name: "邮箱", url: "mailto:hello@example.com", icon: "mail" }, // TODO
    ],
    highlights: ["数码评测", "影像设备", "开箱体验", "科技资讯", "Vlog 相机", "手机影像"],
  },

  /* ---------- 数据面板 ---------- */
  stats: {
    subtitle: "CHANNEL DATA",
    title: "频道数据",
    items: [
      { label: "粉丝", value: 32, suffix: "" },
      { label: "获赞", value: 287, suffix: "" },
      { label: "关注", value: 79, suffix: "" },
      { label: "投稿", value: 13, suffix: "" },
    ],
    note: "数据同步自哔哩哔哩 · 持续更新中",
  },

  /* ---------- 内容方向（进度条） ---------- */
  focus: {
    title: "内容方向",
    subtitle: "CONTENT FOCUS",
    note: "占比为内容侧重示意，可在 js/content.js 中调整", // TODO
    items: [
      { label: "数码产品评测", value: 85 },
      { label: "影像设备 / 相机", value: 78 },
      { label: "科技资讯与观点", value: 62 },
      { label: "剪辑 / 混剪", value: 55 },
    ],
  },

  /* ---------- 终端风简介 ---------- */
  terminal: {
    subtitle: "WHO AM I",
    title: "频道简介",
    windowTitle: "pixelxyz@bilibili: ~/space",
    lines: [
      { type: "cmd", text: "whoami" },
      { type: "out", text: "PixelXYZ像素空间 — 一个兴趣使然创办的数码频道" },
      { type: "cmd", text: "cat motto.txt" },
      { type: "out", text: '"pixel infinity, advance courageously"' },
      { type: "out", text: '"像素无限，一往无前"' },
      { type: "cmd", text: "ls ./topics" },
      { type: "out", text: "数码评测/  影像设备/  开箱体验/  科技资讯/" },
      { type: "cmd", text: "echo $CHANNEL" },
      { type: "out", text: "fans=32  likes=287  uploads=13" },
    ],
  },

  /* ---------- 关于（资料卡） ---------- */
  about: {
    subtitle: "PROFILE",
    title: "频道档案",
    facts: [
      { label: "频道名称", value: "PixelXYZ像素空间" },
      { label: "频道定位", value: "数码 · 影像 · 科技" },
      { label: "内容形式", value: "评测 / 开箱 / 混剪" },
      { label: "B 站 UID", value: "3546840876190266" },
      { label: "账号等级", value: "LV3" },
      { label: "创立初衷", value: "兴趣使然" },
    ],
  },

  /* ---------- 作品 ---------- */
  videos: {
    subtitle: "LATEST WORKS",
    title: "最新作品",
    more: { label: "查看全部投稿", url: "https://space.bilibili.com/3546840876190266/video" },
    items: [
      {
        title: "「直抒己见」红米Note17系列拉完了？",
        bvid: "BV1nN496XE91",
        date: "8月30日",
        views: 1342,
        danmaku: 0,
        duration: "04:33",
        cover: "assets/v1.webp",
      },
      {
        title: "谢幕之际，用混剪来回顾15年的库克时代……",
        bvid: "BV1jUKH6rEfj",
        date: "7月21日",
        views: 109,
        danmaku: 1,
        duration: "03:11",
        cover: "assets/v2.webp",
      },
      {
        title: "只要69元就能买Pocket3？小心陷阱!",
        bvid: "BV1frDmB4EkL",
        date: "4月12日",
        views: 3056,
        danmaku: 0,
        duration: "00:48",
        cover: "assets/v3.webp",
      },
      {
        title: "学生党必看!低预算也能买相机!500-4000元相机推荐",
        bvid: "BV1FdhXzyEAR",
        date: "2025年8月29日",
        views: 2767,
        danmaku: 1,
        duration: "04:58",
        cover: "assets/v4.webp",
      },
      {
        title: "可能是1.5K以内最好的vlog相机？大疆Pocket2浅谈",
        bvid: "BV1ruVXzPEUT",
        date: "2025年5月10日",
        views: 5481,
        danmaku: 34,
        duration: "07:41",
        cover: "assets/v5.webp",
      },
    ],
    videoUrlTemplate: "https://www.bilibili.com/video/{bvid}/",
  },

  /* ---------- 关注 / 联系 ---------- */
  contact: {
    subtitle: "FOLLOW & CONTACT",
    title: "保持关注",
    text: "如果你想第一时间看到最新内容，欢迎在哔哩哔哩关注我；合作与交流也欢迎来信。",
    email: "hello@example.com", // TODO
    socials: [
      { name: "哔哩哔哩", url: "https://space.bilibili.com/3546840876190266", icon: "bilibili" },
      { name: "邮箱", url: "mailto:hello@example.com", icon: "mail" }, // TODO
    ],
  },

  /* ---------- 页脚 ---------- */
  footer: {
    text: "© 2026 PixelXYZ像素空间 · 保留所有权利",
    slogan: "pixel infinity, advance courageously",
  },
};
