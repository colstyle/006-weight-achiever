<div align="center">

# 体重一键记录(成就版)

**就算轻了一两，也是辉煌的一跃**

![100APP计划](https://img.shields.io/badge/100%20APP%20计划-006%20%2F%20100-ff6b6b?style=flat-square&logo=rocket)
![作者](https://img.shields.io/badge/作者-小石谈什么记-blueviolet?style=flat-square)
![版本](https://img.shields.io/badge/版本-0.1.0-blue?style=flat-square)
![平台](https://img.shields.io/badge/平台-Web%20%7C%20Windows%20%7C%20Android-brightgreen?style=flat-square)
![技术栈](https://img.shields.io/badge/技术栈-Next.js%20%2B%20Tauri%202%20%2B%20Capacitor-blueviolet?style=flat-square)

> 🚀 **100 APP 量产计划** 第 006 个作品 · 我给[目标人群]做了一个[应用描述] · 作者：[小石谈什么记](#)

</div>

---

## ✨ 功能特点

- 功能 1
- 功能 2
- 功能 3

---

## 🚀 快速开始

### 环境要求

| 工具 | 版本要求 |
|------|---------|
| Node.js | ≥ 20 |
| Rust / Cargo | ≥ 1.80（Windows 桌面端必须） |
| Android Studio | 任意（Android 端调试） |

### 安装与运行

```bash
git clone <仓库地址>
cd weight-achiever

npm install
npm run dev     # 浏览器预览 → http://localhost:3000
```

---

## 📦 三端构建

### 🌐 Web 版
```bash
npm run build
vercel --prod
```

### 🖥️ Windows 桌面版（Tauri）
```bash
npm run tauri:dev      # 开发模式
npm run tauri:build    # 打包 → dist/windows/weight-achiever.exe

### 🎨 图标生成
为了多平台发布，必须生成标准的图标资源文件：
1. 准备一张 1024x1024 的 `icon.png` 放置在项目根目录。
2. 运行：`npm run tauri:icon icon.png` 即可自动补全所有平台的图标资源。
```
> 首次编译 Rust 约需 5-10 分钟，后续增量编译秒级完成。

### 📱 Android 版（Capacitor）
```bash
npm run android:sync   # 同步 Web 代码到 Android 项目
npm run android:open   # 在 Android Studio 中打开

# 命令行构建 APK
cd android && .\gradlew assembleDebug
# APK → android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📂 项目结构

```
weight-achiever/
├── src/app/
│   ├── page.tsx            ← 主界面
│   ├── layout.tsx          ← HTML 模板
│   └── globals.css         ← 设计系统（Design Tokens）
├── src-tauri/              ← Tauri Windows 后端（Rust）
│   ├── src/main.rs
│   ├── tauri.conf.json     ← 窗口配置
│   └── capabilities/
├── android/                ← Capacitor Android 原生项目
├── dist/                   ← 发布产物
│   ├── windows/            ← .exe
│   └── android/            ← .apk
├── out/                    ← Next.js 静态导出
├── capacitor.config.ts
└── package.json
```

---

## 📝 开发日志

| 日期 | 内容 |
|------|------|
| 2026-04-04 | 项目初始化，完成 Web / Windows / Android 三端配置 |

---

## 📄 许可证

MIT License · [小石谈什么记](#)
