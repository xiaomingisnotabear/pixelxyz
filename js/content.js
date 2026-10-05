/* ============================================================================
 *  content.js  —  网站所有可编辑内容
 *  数据来源：B 站 + 抖音 + 小红书（PixelXYZ像素空间）
 *  ⚠️ 粉丝/获赞 会由 data/stats.json 自动覆盖（GitHub Action 每日同步）
 * ==========================================================================*/

window.SITE = {
  /* ---------- 站点元信息 ---------- */
  meta: {
    lang: "zh-CN",
    title: "PixelXYZ像素空间 · 数码频道",
    description:
      "PixelXYZ像素空间 — 一个兴趣使然创办的数码频道。「pixel infinity, advance courageously / 像素无限，一往无前」",
    favicon: "assets/favicon.svg",
    theme: "dark",
  },

  /* ---------- 特效开关 ---------- */
  effects: {
    particles: true,
    particleLinks: true,
    mouseRepel: true,
    customCursor: true,
    scanLines: true,
    typewriter: true,
  },

  /* ---------- 品牌 ---------- */
  brand: {
    name: "PixelXYZ",
    mark: "P",                      // logo 缺失时的字母回退
    logo: "assets/avatar.webp",      // 频道头像（导航 + 页脚）
  },

  nav: [
    { label: "首页", href: "#home" },
    { label: "数据", href: "#stats" },
    { label: "简介", href: "#about" },
    { label: "作品", href: "#works" },
    { label: "平台", href: "#platforms" },
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
    avatar: "assets/avatar.webp",
    cta: [
      { label: "关注 B 站", href: "https://space.bilibili.com/3546840876190266", primary: true, icon: "bilibili" },
      { label: "关注抖音", href: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3", primary: false, icon: "douyin" },
    ],
    socials: [
      { name: "哔哩哔哩", url: "https://space.bilibili.com/3546840876190266", icon: "bilibili" },
      { name: "抖音", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3", icon: "douyin" },
      { name: "小红书", url: "https://www.xiaohongshu.com/user/profile/6878bfff000000001e03ada7", icon: "xiaohongshu" },
    ],
    highlights: ["数码评测", "影像设备", "开箱体验", "科技资讯", "Vlog 相机", "手机影像"],
  },

  /* ---------- 全平台数据 ---------- */
  stats: {
    subtitle: "ALL PLATFORMS",
    title: "全平台数据",
    note: "数据每日自动同步自哔哩哔哩、抖音、小红书公开主页",
    totals: [
      { label: "全平台粉丝", value: 154 },
      { label: "全平台获赞", value: 5284 },
      { label: "入驻平台", value: 3 },
    ],
    breakdown: {
      title: "各平台明细",
      items: [
        { key: "bilibili", name: "哔哩哔哩", icon: "bilibili", fans: 32, likes: 287 },
        { key: "douyin", name: "抖音", icon: "douyin", fans: 100, likes: 4814 },
        { key: "xiaohongshu", name: "小红书", icon: "xiaohongshu", fans: 22, likes: 183 },
      ],
    },
  },

  /* ---------- 内容方向 ---------- */
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

  /* ---------- 终端简介 ---------- */
  terminal: {
    subtitle: "WHO AM I",
    title: "频道简介",
    windowTitle: "pixelxyz@space: ~",
    lines: [
      { type: "cmd", text: "whoami" },
      { type: "out", text: "PixelXYZ像素空间 — 一个兴趣使然创办的数码频道" },
      { type: "cmd", text: "cat motto.txt" },
      { type: "out", text: '"pixel infinity, advance courageously"' },
      { type: "out", text: '"像素无限，一往无前"' },
      { type: "cmd", text: "ls ./topics" },
      { type: "out", text: "数码评测/  影像设备/  开箱体验/  科技资讯/" },
      { type: "cmd", text: "ls ./platforms" },
      { type: "out", text: "bilibili/  douyin/  xiaohongshu/  qq-group/" },
      { type: "cmd", text: "stat --all" },
      { type: "out", text: "fans=154  likes=5284  platforms=3" },
    ],
  },

  /* ---------- 频道档案 ---------- */
  about: {
    subtitle: "PROFILE",
    title: "频道档案",
    facts: [
      { label: "频道名称", value: "PixelXYZ像素空间" },
      { label: "频道定位", value: "数码 · 影像 · 科技" },
      { label: "内容形式", value: "视频 / 图文 / 混剪" },
      { label: "B 站 UID", value: "3546840876190266" },
      { label: "抖音号", value: "49256467732" },
      { label: "小红书号", value: "95546159235" },
      { label: "创立初衷", value: "兴趣使然" },
    ],
  },

  /* ---------- 作品（多平台 + 筛选） ---------- */
  works: {
    subtitle: "LATEST WORKS",
    title: "作品",
    more: { label: "查看全部投稿", url: "https://space.bilibili.com/3546840876190266/video" },
    filters: [
      { id: "all", label: "全部" },
      { id: "video", label: "视频" },
      { id: "article", label: "图文" },
      { id: "douyin", label: "抖音" },
    ],
    items: [
      /* ---- 哔哩哔哩 · 视频 ---- */
      { platform: "bilibili", kind: "video", title: "「直抒己见」红米Note17系列拉完了？", cover: "assets/v1.webp", url: "https://www.bilibili.com/video/BV1nN496XE91/", date: "8月30日", views: 1342, danmaku: 0, duration: "04:33" },
      { platform: "bilibili", kind: "video", title: "谢幕之际，用混剪来回顾15年的库克时代……", cover: "assets/v2.webp", url: "https://www.bilibili.com/video/BV1jUKH6rEfj/", date: "7月21日", views: 109, danmaku: 1, duration: "03:11" },
      { platform: "bilibili", kind: "video", title: "只要69元就能买Pocket3？小心陷阱!", cover: "assets/v3.webp", url: "https://www.bilibili.com/video/BV1frDmB4EkL/", date: "4月12日", views: 3056, danmaku: 0, duration: "00:48" },
      { platform: "bilibili", kind: "video", title: "学生党必看!低预算也能买相机!500-4000元相机推荐", cover: "assets/v4.webp", url: "https://www.bilibili.com/video/BV1FdhXzyEAR/", date: "2025年8月29日", views: 2767, danmaku: 1, duration: "04:58" },
      { platform: "bilibili", kind: "video", title: "可能是1.5K以内最好的vlog相机？大疆Pocket2浅谈", cover: "assets/v5.webp", url: "https://www.bilibili.com/video/BV1ruVXzPEUT/", date: "2025年5月10日", views: 5481, danmaku: 34, duration: "07:41" },

      /* ---- 哔哩哔哩 · 图文 ---- */
      { platform: "bilibili", kind: "article", title: "轻舟已过万重山！", cover: "assets/opus1.webp", url: "https://www.bilibili.com/opus/1247955507289784344", comments: 1 },
      { platform: "bilibili", kind: "article", title: "华为FreeClip2｜好用但我不喜欢", cover: "assets/opus2.webp", url: "https://www.bilibili.com/opus/1244882290631245843", comments: 1 },
      { platform: "bilibili", kind: "article", title: "分享图片", cover: "assets/opus3.webp", url: "https://www.bilibili.com/opus/1232152557332201523", comments: 3 },
      { platform: "bilibili", kind: "article", title: "「60个月不卡」", cover: "assets/opus4.webp", url: "https://www.bilibili.com/opus/1225474995581354004", comments: 2 },
      { platform: "bilibili", kind: "article", title: "图片分享", cover: "assets/opus5.webp", url: "https://www.bilibili.com/opus/1119488083362840580", comments: 6 },
      { platform: "bilibili", kind: "article", title: "频道设备鸟枪换炮咯", cover: "assets/opus6.webp", url: "https://www.bilibili.com/opus/1116140714709745669", comments: 4 },
      { platform: "bilibili", kind: "article", title: "今天是世界摄影日，大家节日快乐！", cover: "assets/opus7.webp", url: "https://www.bilibili.com/opus/1102740373787115529", comments: 6 },
      { platform: "bilibili", kind: "article", title: "人生中第二卷胶片 & 也是玩上中画幅了（忽略瑕疵）", cover: "assets/opus8.webp", url: "https://www.bilibili.com/opus/1073170249769025537", comments: 6 },

      /* ---- 抖音（网页版不提供标题，以封面墙呈现） ---- */
      { platform: "douyin", kind: "clip", cover: "assets/dy1.webp", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3" },
      { platform: "douyin", kind: "clip", cover: "assets/dy2.webp", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3" },
      { platform: "douyin", kind: "clip", cover: "assets/dy3.webp", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3" },
      { platform: "douyin", kind: "clip", cover: "assets/dy4.webp", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3" },
      { platform: "douyin", kind: "clip", cover: "assets/dy5.webp", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3" },
    ],
  },

  /* ---------- 多平台矩阵 ---------- */
  platforms: {
    subtitle: "PLATFORMS",
    title: "多平台矩阵",
    note: "数据每日自动同步自各平台公开主页",
    cta: "前往关注",
    items: [
      {
        key: "bilibili", name: "哔哩哔哩", handle: "UID 3546840876190266", icon: "bilibili",
        avatar: "assets/avatar.webp", url: "https://space.bilibili.com/3546840876190266",
        stats: [{ key: "fans", label: "粉丝", value: 32 }, { key: "likes", label: "获赞", value: 287 }, { label: "投稿", value: 13 }],
      },
      {
        key: "douyin", name: "抖音", handle: "抖音号 49256467732", icon: "douyin",
        avatar: "assets/dy_avatar.webp",
        url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3",
        stats: [{ key: "fans", label: "粉丝", value: 100 }, { key: "likes", label: "获赞", value: 4814 }, { label: "作品", value: 5 }],
      },
      {
        key: "xiaohongshu", name: "小红书", handle: "小红书号 95546159235", icon: "xiaohongshu",
        avatar: "assets/xhs_avatar.webp",
        url: "https://www.xiaohongshu.com/user/profile/6878bfff000000001e03ada7",
        stats: [{ key: "fans", label: "粉丝", value: 22 }, { key: "likes", label: "获赞与收藏", value: 183 }, { label: "关注", value: 29 }],
      },
      {
        name: "QQ 交流群", handle: "群号 1023501725", icon: "qq",
        copy: "1023501725", copyLabel: "复制群号", stats: [],
      },
    ],
  },

  /* ---------- 关注 ---------- */
  contact: {
    subtitle: "FOLLOW & CONTACT",
    title: "保持关注",
    text: "如果你想第一时间看到最新内容，欢迎在哔哩哔哩、抖音或小红书关注我。",
    email: "19207560097@163.com",
    socials: [
      { name: "哔哩哔哩", url: "https://space.bilibili.com/3546840876190266", icon: "bilibili" },
      { name: "抖音", url: "https://www.douyin.com/user/MS4wLjABAAAA4LfrgNCkb6zvMb5bG7VSvdTPf-j_M-eFBGeigFmVtT9rBdOaH4Tv46X7yw5lT8d3", icon: "douyin" },
      { name: "小红书", url: "https://www.xiaohongshu.com/user/profile/6878bfff000000001e03ada7", icon: "xiaohongshu" },
    ],
  },

  /* ---------- 页脚 ---------- */
  footer: {
    text: "© 2026 PixelXYZ像素空间 · 保留所有权利",
    slogan: "pixel infinity, advance courageously",
    emailLabel: "邮箱",
  },
};
