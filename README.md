<div align="center">

# 体重一键记录(成就版)

> “就算只轻了一两，也是辉煌的一跃。” —— 正在激励中 🚀

![100APP计划](https://img.shields.io/badge/100%20APP%20计划-006%20%2F%20100-10b981?style=flat-square&logo=rocket)
![作者](https://img.shields.io/badge/作者-小石谈什么记-blueviolet?style=flat-square)
![版本](https://img.shields.io/badge/版本-1.0.0-blue?style=flat-square)
![平台](https://img.shields.io/badge/平台-Web%20%7C%20Windows%20%7C%20Android-brightgreen?style=flat-square)
![技术栈](https://img.shields.io/badge/技术栈-Next.js%20%2B%20Tauri%202%20%2B%20Capacitor-blueviolet?style=flat-square)

> 🚀 **100 APP 量产计划** 第 006 个作品 · 就算轻了一两，也是辉煌的一跃 · 作者：[小石谈什么记](#)

</div>

---

## 🦾 为什么需要“成就版”？

在减脂过程中，**0.1kg 的波动**在普通表格里只是一条横线，但在“成就版”里，它是**史诗级的下跌**！

本项目专为追求视觉反馈和心理暗示的健身达人们设计。我们不只是记录数据，我们在记录你的“成神之路”。

### ✨ 核心黑科技

- **🧠 心理暗示趋势算法**：动态 Y 轴缩放技术。哪怕你只减了 100g，图表也会呈现出断崖式下跌的视觉冲击力。**主打一个欺骗自己，极致爽快。**
- **🤖 AI 自然语言录入**：支持粘贴一张截图或一段话（如：“今天 75.3kg，体脂降了点 22%，感觉贼棒”），AI 自动提取关键指标。
- **🔥 “凡人到成神”视觉系统**：采用 Emerald/Black 赛博工业风。每一次减重都会触发“辉煌一跃”勋章和极致的夸奖文案。
- **📦 三端覆盖，本地优先**：支持 Web、Windows (exe) 和 Android (apk)。所有健身数据均存储在本地 `localStorage`，不上传。
- **🛑 数据一键抹除**：想重新做人？内置“档案清除”功能，随时开启新的奋斗周期。

---

## 🎨 视觉预览 (UI Aesthetics)

- **主题色**：翡翠绿 (Emerald 500) & 赛博深黑 (Zinc 950)
- **风格**：全直角 (Zero-Radius) 工业设计，高对比度，霓虹灯光效。
- **交互**：Framer Motion 丝滑转场，每一次录入都是一场视觉盛宴。

---

## 🚀 开发者指南 (Dev Guide)

### 环境要求

| 终端 | 核心依赖 | 构建命令 |
|------|---------|---------|
| **Web** | Node.js ≥ 20 | `npm run build` |
| **Windows** | Rust 1.80+ / Tauri | `npm run tauri:build` |
| **Android** | Capacitor / Android Studio | `npm run android:sync` |

### 快速启动

```bash
# 1. 克隆进入目录
git clone https://github.com/colstyle/006-weight-achiever
cd 006-weight-achiever

# 2. 安装依赖
npm install

# 3. 启动开发模式 (Web)
npm run dev

# 4. 启动桌面端调试
npm run tauri:dev
```

---

## 📂 项目结构 (Repository Map)

```
weight-achiever/
├── src/app/              # Next.js 15+ 页面逻辑
├── lib/weight-engine.ts  # AI 语义识别解析引擎
├── src-tauri/            # Tauri 2.0 Rust 核心逻辑
├── android/              # Capacitor Android 原生壳子
└── BRIEF.md              # 项目立项与核心痛点文档
```

---

## 📝 开发进度 (Dev Log)

- [x] **2026-04-05**: 页面布局大幅重构，升级为 1200px 宽屏 3 栏设计。
- [x] **2026-04-05**: 实现“Zero-Radius”全直角 UI 系统，解决倒角遮挡问题。
- [x] **2026-04-05**: 集成 Android Capacitor 平台，解决 appId 校验及同步报错。
- [x] **2026-04-05**: 优化 AI 配置中心，统一三方模型 Preset 逻辑。
- [x] **2026-04-05**: 增加“档案清除”核心功能。

---

## 📄 开源协议

MIT License · Built with 🔥 by [colstyle](https://github.com/colstyle)

> 🚀 **100 APP 量产计划** · NO.006
