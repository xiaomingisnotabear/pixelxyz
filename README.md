# PixelXYZ像素空间 · 个人主页

科技风自媒体个人介绍站 · 纯静态（HTML / CSS / JS，零构建依赖）

🔗 线上地址：**https://xiaomingisnotabear.github.io/pixelxyz/**
📺 B 站主页：**https://space.bilibili.com/3546840876190266**

> pixel infinity, advance courageously / 像素无限，一往无前

---

## ✨ 视觉与动效清单

### 几何 & 线条
- 半透明蓝紫**渐变细分割线**（带流动光点）
- **点阵网格**背景（radial-gradient 点阵 + 径向遮罩）
- **六边形**装饰（clip-path 描边）
- 圆角卡片、**虚线边框**（头像光环 / 旋转虚线环）
- **发光描边**：`box-shadow` 外发光（`--glow` 变量）
- **扫描线**：卡片底部发光渐变线 + 全局竖向扫描光带

### 粒子 / 背景特效
- **点阵星空**：Canvas 粒子缓慢浮动
- **连线粒子**：邻近粒子自动连线（赛博风，透明度随距离衰减）
- **鼠标排斥**：靠近时粒子被推开并带光晕
- **扫光动画**：卡片 hover 时高光斜向划过

### 动画元素
- **入场时序**：粒子淡入 → 标题上浮 → 副标题延迟 → 按钮/社交依次出现
- **鼠标悬浮**：卡片上浮 + 边框发光；按钮放大 + 渐变 + 扫光
- **滚动触发**：区块逐个从下方滑入（模糊→清晰）
- **打字机**：首屏标语逐字打印 + 终端命令逐字输出

### UI 组件
- **终端风区块**：黑底 + 等宽字体 + 红黄绿窗控 + 扫描线纹理 + 打字机
- **数据面板卡片**：圆角 / 半透明 / 毛玻璃 / 悬浮高光 / 底部扫描线
- **进度条面板**：进入视口后进度条缓慢填充 + 数值滚动
- **导航栏**：半透明固定顶部，滚动时背景渐变加深 + 毛玻璃
- **自定义光标**：终端风格圆环 + 光点（桌面端，可关闭）

---

## 📝 如何更新内容

**所有内容集中在一个文件：**

```
js/content.js
```

| 字段 | 说明 |
| --- | --- |
| `meta` | 标题、描述、主题色、默认主题 |
| `effects` | 特效开关（粒子/连线/鼠标排斥/自定义光标/扫描线/打字机） |
| `brand` / `nav` | 品牌名与导航 |
| `hero` | 首屏名称、标语、简介（打字机）、头像、按钮、社交、跑马灯 |
| `stats` | 数据面板（粉丝/获赞/关注/投稿） |
| `focus` | 内容方向进度条 |
| `terminal` | 终端简介的命令行内容 |
| `about` | 频道档案 |
| `videos` | 视频作品（封面/时长/播放/BV号） |
| `contact` / `footer` | 关注区与页脚 |

### 关闭某项特效

在 `js/content.js` 的 `effects` 里把对应项设为 `false`，例如：

```js
effects: {
  customCursor: false,   // 关掉自定义光标
  particles: false,      // 关掉粒子背景
}
```

### 新增视频

1. 封面图放进 `assets/`（如 `v6.webp`）
2. 在 `videos.items` 里加一条：

```js
{
  title: "视频标题", bvid: "BVxxxxxxxxx", date: "8月30日",
  views: 1342, danmaku: 0, duration: "04:33", cover: "assets/v6.webp",
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

> 仓库 `pixelxyz` 是**项目页**，发布地址为
> `https://xiaomingisnotabear.github.io/pixelxyz/`。
> 若想恢复根地址 `https://xiaomingisnotabear.github.io/`，
> 需把仓库改回 `xiaomingisnotabear.github.io`，并同步修改
> `404.html` 中的 `/pixelxyz/` 路径。
