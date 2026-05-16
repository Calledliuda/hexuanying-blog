# 个人博客设计文档

**日期**: 2026-05-16  
**状态**: 已确认

---

## 1. 概述

温润克制的个人博客，用于分享感受、见闻和书目推荐。视觉风格对标 Apple 产品页面：大量留白、低饱和色、苹方/SF Pro 字体、Spring 动画。

---

## 2. 技术选型

| 项目 | 选型 | 原因 |
|------|------|------|
| 框架 | Next.js (SSG) | 预渲染静态页面，加载极快，SEO 友好 |
| 样式 | Tailwind CSS | Utility-first，与设计 skills 兼容 |
| 动画 | Framer Motion | Spring 动画、滚动触发、拖拽手感 |
| 内容 | Markdown (frontmatter) + JSON | 不改代码即可更新 |
| 部署 | Vercel (PWA) | 免费，git push 自动部署，可添加到主屏幕 |
| 打包 | 无 | PWA 即 App，不需要 Electron |

---

## 3. 视觉设计系统

- **气质**: 温润克制（Apple 产品页风格）
- **底色**: 暖白/米白 (#FAFAF9 系)
- **文字**: 深灰 (#1C1C1E)
- **点缀色**: 灰蓝、鼠尾草绿等低饱和色
- **中文字体**: 苹方 (PingFang SC)
- **英文字体**: SF Pro (system-ui)
- **间距体系**: 8px 基准，大留白

---

## 4. 页面结构

单页滚动（混合式），共六大板块：

```
① Hero          — 名字 + tagline 居中，头像延迟浮现
② 关于我        — 个人简介，滚动淡入
③ 文章精选      — 3-4 篇最新文章卡片，stagger 出现
④ 书目推荐      — 横向滑动卡片，Spring 拖拽
⑤ 见闻相册      — 瀑布流网格，hover 放大
⑥ 页脚          — 社交链接 + 版权
```

文章详情页为独立页面（点击卡片打开），SSG 预渲染。

---

## 5. 动画编排

| 板块 | 触发 | 效果 |
|------|------|------|
| Hero 名字 | 页面加载 | blur → 0 + y 20→0 |
| Hero 头像 | 页面加载 +600ms | scale 0.8→1 + opacity 0→1 |
| 各板块 | 进入视口 30% | opacity 0→1 + y 40→0, stagger 70ms |
| 书目滑动 | 拖拽 | inertia + momentum，松手吸附 |
| 相册 hover | hover | scale 1→1.05 + shadow lift |

所有过渡使用 Spring 曲线，避免线性匀速。

---

## 6. 组件树

```
Layout
├── HeroSection
├── AboutSection
├── FeaturedPosts
│   └── PostCard × N
├── BookShelf
│   └── BookCard × N
├── Gallery
│   └── GalleryItem × N
└── Footer
```

---

## 7. 数据流

```
content/posts/*.md   → getStaticProps → PostCard / 详情页
content/books.json   → import         → BookShelf
public/gallery/      → auto-load      → Gallery
public/avatar.jpg    → direct path    → HeroSection
```

- 文章使用 Markdown frontmatter: `title`, `date`, `excerpt`, `cover`
- 书目 JSON: `title`, `author`, `cover`, `yourNote`
- 相册图片直接放 `public/gallery/`

---

## 8. 响应式

| 断点 | 布局 |
|------|------|
| < 640px | 单列堆叠，书目保持横向，卡片缩小 |
| 640-1024px | 双列文章网格，相册三列 |
| > 1024px | 三列文章网格，相册四列 |

---

## 9. 边界处理

- 书目为空 → 该板块隐藏
- 封面图缺失 → `/fallback-cover.jpg` 兜底
- 头像未放 → Hero 仅显示文字
- 文章详情页 → SSG 预渲染，无加载态
- 暗色模式 → 首版不做
- PWA 离线 → Service Worker 缓存静态资源

---

## 10. 用户维护操作

- **新增文章**: 在 `content/posts/` 新建 `.md` 文件
- **更新书目**: 编辑 `content/books.json`
- **发布上线**: `git push`
