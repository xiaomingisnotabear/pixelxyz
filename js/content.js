/* ============================================================================
 *  content.js  —  网站所有可编辑内容（数据来源：B 站主页 PixelXYZ像素空间）
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
    theme: "dark",       // 默认主题：dark / light
  },

  /* ---------- 品牌 ---------- */
  brand: { name: "PixelXYZ", mark: "P" },

  nav: [
    { label: "首页", href: "#home" },
    { label: "关于", href: "#about" },
    { label: "数据", href: "#stats" },
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

  /* ---------- 关于 ---------- */
  about: {
    subtitle: "ABOUT THE CHANNEL",
    title: "关于频道",
    paragraphs: [
      "PixelXYZ像素空间，是一个兴趣使然创办的数码频道。",
      "「pixel infinity, advance courageously / 像素无限，一往无前」是我们始终坚持的信念——用像素记录科技，用内容传递热爱。从数码产品评测到影像设备分享，我们乐于把真实的体验与思考带给你。",
      "无论你是数码爱好者，还是正在挑选第一台相机的学生党，这里都希望成为你值得信赖的参考。",
    ],
    facts: [
      { label: "频道定位", value: "数码 · 影像 · 科技" },
      { label: "内容形式", value: "评测 / 开箱 / 混剪" },
      { label: "B 站 UID", value: "3546840876190266" },
      { label: "等级", value: "LV3" },
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
