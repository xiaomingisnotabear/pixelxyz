# PixelXYZ像素空间 · 个人主页

自媒体个人介绍站 · 纯静态站点（HTML / CSS / JS，零构建依赖）

🔗 线上地址：**https://xiaomingisnotabear.github.io/**
📺 B 站主页：**https://space.bilibili.com/3546840876190266**

> pixel infinity, advance courageously / 像素无限，一往无前

---

## ✨ 设计特点

- **Apple 科技高级风**：深空黑背景、极光渐变、玻璃拟态导航、大字号紧排标题
- **全套动效**：极光漂移、渐变流光、滚动揭示（模糊→清晰）、数字滚动、鼠标聚光、
  头像光环旋转与浮动、跑马灯、卡片悬浮高光、视差滚动
- **响应式**：桌面 / 平板 / 手机自适应
- **明暗主题**：可切换，记忆用户选择
- **零依赖**：无框架、无构建，直接部署

---

## 📝 如何更新内容

**所有内容集中在一个文件：**

```
js/content.js
```

改完保存 → 提交 → 推送，网站约 1 分钟内自动更新。

| 字段 | 说明 |
| --- | --- |
| `meta` | 标题、描述、主题色、默认主题 |
| `brand` / `nav` | 品牌名与导航 |
| `hero` | 首屏名称、标语、简介、头像、按钮、社交、跑马灯词条 |
| `stats` | 数据面板（粉丝/获赞/关注/投稿） |
| `about` | 频道介绍与资料 |
| `videos` | 视频作品（标题/封面/时长/播放/BV号） |
| `contact` | 关注区块与联系方式 |
| `footer` | 页脚 |

### 更新头像

替换 `assets/avatar.jpg`（正方形，建议 ≥ 400×400）。

### 新增视频

1. 把封面图放到 `assets/`（如 `v6.webp`）
2. 在 `js/content.js` 的 `videos.items` 里加一条：

```js
{
  title: "视频标题",
  bvid: "BVxxxxxxxxx",
  date: "8月30日",
  views: 1342,
  danmaku: 0,
  duration: "04:33",
  cover: "assets/v6.webp",
}
```

---

## 🚀 本地预览

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```

---

## 📦 部署

推送到 `main` 分支即可，GitHub Pages 自动发布：

```bash
git add .
git commit -m "update site"
git push
```

仓库名 `xiaomingisnotabear.github.io` 是 GitHub 的个人主页仓库约定，
会自动发布到 `https://xiaomingisnotabear.github.io/`。
