# Image Optimizer

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/Electron-28.2.0-47848F.svg" alt="Electron">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.3.3-3178C6.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</div>

<div align="center">
  <h3>专业的桌面图片批量压缩与尺寸修改工具</h3>
  <p>基于 Electron + Sharp 构建的高性能图片处理应用</p>
</div>

***

## 📖 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [安装使用](#安装使用)
- [开发指南](#开发指南)
- [项目结构](#项目结构)
- [核心功能](#核心功能)
- [性能优化](#性能优化)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

***

## ✨ 功能特性

### 🖼️ 批量图片压缩

- **多格式支持**：JPEG、PNG、WebP、AVIF、GIF、TIFF
- **智能压缩**：自动检测压缩效果，避免压缩后文件变大
- **质量可控**：1-100 质量参数调节，满足不同场景需求
- **格式转换**：支持保持原格式或转换为其他格式
- **元数据处理**：可选移除 EXIF、ICC 等元数据信息

### 📐 批量尺寸调整

- **多种缩放方式**：
  - 按宽度缩放（保持比例）
  - 按高度缩放（保持比例）
  - 按百分比缩放
  - 自定义宽高（可锁定比例）
- **预设尺寸**：4K、Full HD、HD、社交媒体、缩略图等常用尺寸
- **高级选项**：
  - 5 种缩放算法（Lanczos3、Cubic、Mitchell 等）
  - 5 种适应模式（Contain、Cover、Fill、Inside、Outside）

### 🎯 智能输出

- **自动目录**：未指定输出目录时，自动在源文件目录创建 `__image_optimizer_output` 文件夹
- **命名规则**：支持原文件名、添加后缀、添加前缀、序号命名
- **批量处理**：支持拖拽上传、文件夹批量导入

### 🎨 专业界面

- **现代设计**：专业工具风格，绿色调配色方案
- **主题切换**：自动跟随系统明暗主题
- **实时反馈**：进度显示、压缩率统计、错误提示
- **原生体验**：支持头部拖拽、macOS 红绿灯按钮预留

***

## 🛠️ 技术栈

### 核心框架

- **Electron** `28.2.0` - 跨平台桌面应用框架
- **React** `18.2.0` - 用户界面构建库
- **TypeScript** `5.3.3` - 类型安全的 JavaScript 超集

### 图像处理

- **Sharp** `0.33.2` - 高性能 Node.js 图像处理库（基于 libvips）

### UI & 样式

- **Tailwind CSS** `3.4.1` - 实用优先的 CSS 框架
- **Lucide React** `0.312.0` - 精美的开源图标库

### 状态管理

- **Zustand** `4.5.0` - 轻量级状态管理库

### 构建工具

- **Vite** `5.0.12` - 下一代前端构建工具
- **Electron Builder** `24.9.1` - Electron 应用打包工具

***

## 🚀 安装使用

### 系统要求

- **macOS**：10.15 (Catalina) 或更高版本
- **Windows**：Windows 10 或更高版本
- **Linux**：Ubuntu 18.04 或更高版本

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/artiely/image-optimizer.git
cd image-optimizer

# 安装依赖
npm install

# 启动开发模式
npm run dev

# 构建生产版本
npm run build
```

### 开发模式

```bash
npm run dev
```

应用将自动启动，支持热重载。

### 生产构建

```bash
npm run build
```

构建完成后，安装包将生成在 `release` 目录中。

***

## 📁 项目结构

```
image-optimizer/
├── electron/                    # Electron 主进程
│   ├── main.ts                  # 主进程入口
│   ├── preload.ts               # 预加载脚本
│   └── services/
│       ├── imageProcessor.ts    # Sharp 图像处理服务
│       └── fileManager.ts       # 文件系统操作
├── src/                         # React 前端
│   ├── components/              # UI 组件
│   │   ├── Layout/              # 布局组件
│   │   │   ├── Header.tsx       # 顶部导航栏
│   │   │   ├── Sidebar.tsx      # 侧边栏
│   │   │   └── MainContent.tsx  # 主内容区
│   │   ├── FileUpload/          # 文件上传
│   │   │   ├── DropZone.tsx     # 拖拽上传区域
│   │   │   └── FileList.tsx     # 文件列表
│   │   ├── ImageProcessing/     # 图像处理面板
│   │   │   ├── CompressionPanel.tsx
│   │   │   ├── ResizePanel.tsx
│   │   │   └── OutputSettings.tsx
│   │   └── Progress/            # 进度显示
│   │       └── ProgressBar.tsx
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useTheme.ts          # 主题管理
│   │   ├── useFileManager.ts    # 文件管理
│   │   └── useImageProcessor.ts # 图像处理
│   ├── stores/                  # Zustand 状态管理
│   │   ├── imageStore.ts        # 图片状态
│   │   ├── settingsStore.ts     # 设置状态
│   │   └── taskStore.ts         # 任务状态
│   ├── types/                   # TypeScript 类型
│   │   ├── image.ts
│   │   ├── settings.ts
│   │   └── electron.d.ts
│   ├── utils/                   # 工具函数
│   │   ├── formatBytes.ts
│   │   └── validators.ts
│   ├── App.tsx                  # 根组件
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式
├── package.json
├── vite.config.ts               # Vite 配置
├── electron-builder.json        # 打包配置
├── tailwind.config.js           # Tailwind 配置
└── tsconfig.json                # TypeScript 配置
```

***

## 🎯 核心功能

### 1. 图片压缩

#### JPEG 压缩

- 质量范围：1-100
- 支持 MozJPEG 优化
- 可选渐进式加载

#### PNG 压缩

- 压缩级别：6-9（自适应）
- 自适应过滤
- 支持渐进式加载

#### WebP 压缩

- 质量范围：1-100
- 支持无损压缩模式

#### AVIF 压缩

- 质量范围：1-100
- 支持无损压缩模式
- 最佳压缩率

### 2. 智能压缩策略

应用会自动检测压缩效果：

```typescript
// 如果压缩后文件 ≥ 原文件大小
if (outputStats.size >= inputStats.size) {
  // 保留原文件，避免质量损失
  await fs.copyFile(filePath, outputPath)
  return { compressionRatio: 0 }
}
```

### 3. 尺寸调整

#### 缩放算法

- **Lanczos3**：默认，高质量
- **Lanczos2**：中等质量
- **Cubic**：标准质量
- **Mitchell**：平衡质量
- **Nearest**：像素风格

#### 适应模式

- **Inside**：内部适应，保持比例（默认）
- **Outside**：外部适应，保持比例
- **Cover**：覆盖，可能裁剪
- **Contain**：包含，可能留白
- **Fill**：填充，拉伸

***

## ⚡ 性能优化

### Sharp 性能优势

- **libvips 引擎**：比 ImageMagick 快 4-5 倍
- **流式处理**：支持大文件处理
- **内存高效**：低内存占用
- **多线程**：自动利用多核 CPU

### 应用优化

1. **缩略图缓存**：减少重复加载
2. **并发控制**：避免内存溢出
3. **增量处理**：实时进度反馈
4. **智能跳过**：已压缩文件不重复处理

***

## ❓ 常见问题

### Q: 为什么有些图片压缩后反而变大？

A: 应用已实现智能检测机制：

- 如果压缩后文件 ≥ 原文件，自动保留原文件
- 这通常发生在已经高度压缩的图片上
- 建议调整质量参数或尝试不同格式

### Q: 支持哪些图片格式？

A: 支持以下格式：

- **输入**：JPEG、PNG、WebP、AVIF、GIF、TIFF
- **输出**：JPEG、PNG、WebP、AVIF（可保持原格式）

### Q: 如何选择压缩质量？

A: 推荐设置：

- **网页使用**：70-80（体积小，质量可接受）
- **一般用途**：85（默认，平衡质量和体积）
- **高质量**：90-100（文件较大）

### Q: 输出文件在哪里？

A:

- **默认**：源文件目录下的 `__image_optimizer_output` 文件夹
- **自定义**：可在输出设置中指定目录

***

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 添加必要的注释
- 编写单元测试

***

## 📝 更新日志

### v1.0.0 (2024-01-17)

#### 新增功能

- ✨ 批量图片压缩（JPEG、PNG、WebP、AVIF）
- ✨ 批量尺寸调整（多种缩放方式和预设）
- ✨ 智能压缩策略（避免文件变大）
- ✨ 自动输出目录管理
- ✨ 明暗主题自动切换
- ✨ 拖拽上传支持
- ✨ 实时进度显示

#### 技术特性

- 🚀 基于 Sharp 的高性能图像处理
- 💎 TypeScript 全栈类型安全
- 🎨 Tailwind CSS 现代化 UI
- 📦 Electron 跨平台支持

***

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

***

## 🙏 致谢

- [Sharp](https://sharp.pixelplumbing.com/) - 高性能图像处理库
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://react.dev/) - 用户界面构建库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库

***

<div align="center">
  <p>如果这个项目对您有帮助，请给一个 ⭐️ Star！</p>
  <p>Made with ❤️ by Your Name</p>
</div>
