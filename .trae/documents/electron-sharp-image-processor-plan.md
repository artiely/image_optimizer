# Electron + Sharp 图片批量压缩与尺寸修改应用 - 实施计划

## 项目概述

构建一个专业的桌面图片处理工具，支持批量压缩和批量修改尺寸，面向开发者和博主，提供高效、可信赖的图片优化体验。

## 技术栈

- **框架**: Electron (跨平台桌面应用)
- **图像处理**: Sharp (高性能 Node.js 图像处理库)
- **前端**: React + TypeScript
- **样式**: Tailwind CSS (支持明暗主题)
- **构建工具**: Vite + Electron Builder
- **状态管理**: Zustand (轻量级状态管理)

## 核心功能模块

### 1. 文件导入模块
- 拖拽上传区域
- 点击选择文件/文件夹
- 支持格式: JPEG, PNG, WebP, GIF, TIFF, AVIF
- 文件验证和错误提示
- 显示文件列表（缩略图、文件名、原始大小、尺寸）

### 2. 批量压缩模块
- **压缩质量设置**
  - JPEG: 质量 1-100
  - PNG: 压缩级别 0-9
  - WebP: 质量 1-100
  - AVIF: 质量 1-100
  
- **压缩选项**
  - 渐进式加载 (JPEG)
  - 无损压缩选项
  - 剥离元数据 (EXIF, ICC 等)
  - 色彩空间转换

- **实时预览**
  - 压缩前后对比
  - 文件大小变化百分比
  - 预估压缩后大小

### 3. 批量尺寸修改模块
- **尺寸调整方式**
  - 按宽度缩放（保持比例）
  - 按高度缩放（保持比例）
  - 按百分比缩放
  - 自定义宽高（可锁定比例）
  - 常用预设尺寸（1920x1080, 1280x720, 800x600 等）

- **高级选项**
  - 缩放算法选择（lanczos3, nearest, cubic 等）
  - 适应模式（contain, cover, fill, inside, outside）
  - 背景色设置（适应模式为 contain 时）

### 4. 输出设置模块
- 输出目录选择
- 文件命名规则
  - 原文件名 + 后缀
  - 自定义前缀/后缀
  - 序号命名
  
- 输出格式转换
  - 保持原格式
  - 转换为指定格式
  
- 覆盖确认机制

### 5. 处理队列与进度模块
- 任务队列管理
- 实时进度显示
- 处理速度统计
- 成功/失败统计
- 错误日志记录
- 取消/暂停功能

### 6. 预览模块
- 单图预览窗口
- 前后对比视图（滑动对比、并排对比）
- 放大/缩小功能
- 图片信息面板（尺寸、格式、大小、色彩空间）

## 项目结构

```
tiny/
├── electron/
│   ├── main.ts                 # 主进程入口
│   ├── preload.ts              # 预加载脚本
│   └── services/
│       ├── imageProcessor.ts   # Sharp 图像处理服务
│       ├── fileManager.ts      # 文件系统操作
│       └── configManager.ts    # 配置管理
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx      # 顶部导航栏
│   │   │   ├── Sidebar.tsx     # 侧边栏（设置面板）
│   │   │   └── MainContent.tsx # 主内容区
│   │   ├── FileUpload/
│   │   │   ├── DropZone.tsx    # 拖拽上传区域
│   │   │   └── FileList.tsx    # 文件列表
│   │   ├── ImageProcessing/
│   │   │   ├── CompressionPanel.tsx  # 压缩设置面板
│   │   │   ├── ResizePanel.tsx       # 尺寸设置面板
│   │   │   └── OutputSettings.tsx    # 输出设置
│   │   ├── Preview/
│   │   │   ├── ImagePreview.tsx      # 图片预览
│   │   │   └── ComparisonView.tsx    # 对比视图
│   │   └── Progress/
│   │       ├── ProgressBar.tsx       # 进度条
│   │       └── TaskQueue.tsx         # 任务队列
│   ├── hooks/
│   │   ├── useImageProcessor.ts      # 图像处理 Hook
│   │   ├── useFileManager.ts         # 文件管理 Hook
│   │   └── useTheme.ts               # 主题切换 Hook
│   ├── stores/
│   │   ├── imageStore.ts             # 图片状态管理
│   │   ├── settingsStore.ts          # 设置状态管理
│   │   └── taskStore.ts              # 任务状态管理
│   ├── types/
│   │   ├── image.ts                  # 图片相关类型
│   │   └── settings.ts               # 设置相关类型
│   ├── utils/
│   │   ├── formatBytes.ts            # 文件大小格式化
│   │   └── validators.ts             # 验证工具
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── electron-builder.json
├── tailwind.config.js
└── tsconfig.json
```

## 实施步骤

### 阶段一：项目初始化与基础架构 (Day 1)

1. **初始化项目**
   - 创建 Electron + React + TypeScript 项目
   - 配置 Vite 构建工具
   - 安装依赖：sharp, react-dnd, zustand, tailwindcss

2. **配置开发环境**
   - 配置 Electron 主进程和渲染进程
   - 设置 preload 脚本和 IPC 通信
   - 配置 Tailwind CSS（支持明暗主题）
   - 配置 Electron Builder 打包配置

3. **搭建基础 UI 框架**
   - 创建应用布局（Header + Sidebar + MainContent）
   - 实现主题切换功能（跟随系统）
   - 设计绿色调配色方案

### 阶段二：文件导入与管理 (Day 2)

1. **实现拖拽上传**
   - 创建 DropZone 组件
   - 实现文件拖拽检测
   - 文件类型验证
   - 多文件/文件夹选择

2. **文件列表展示**
   - 创建 FileList 组件
   - 生成缩略图预览
   - 显示文件信息（名称、大小、尺寸、格式）
   - 实现文件选择/全选/删除功能

3. **文件状态管理**
   - 创建 imageStore (Zustand)
   - 管理文件列表状态
   - 实现文件增删改查

### 阶段三：图像处理核心功能 (Day 3-4)

1. **Sharp 服务封装**
   - 创建 imageProcessor 服务
   - 实现压缩功能（支持多格式）
   - 实现尺寸调整功能
   - 实现格式转换功能
   - 错误处理和日志记录

2. **压缩设置面板**
   - 创建 CompressionPanel 组件
   - 质量滑块控制
   - 格式特定选项
   - 高级选项（元数据、色彩空间）
   - 实时预览压缩效果

3. **尺寸调整面板**
   - 创建 ResizePanel 组件
   - 多种缩放方式
   - 预设尺寸选择
   - 缩放算法选择
   - 适应模式选择

4. **输出设置**
   - 创建 OutputSettings 组件
   - 输出目录选择
   - 文件命名规则
   - 格式转换选项

### 阶段四：处理队列与进度管理 (Day 5)

1. **任务队列系统**
   - 创建 taskStore
   - 任务队列管理（添加、取消、暂停）
   - 并发处理控制

2. **进度显示**
   - 创建 ProgressBar 组件
   - 实时进度更新
   - 处理速度统计
   - 成功/失败计数

3. **错误处理**
   - 错误日志记录
   - 错误详情展示
   - 重试机制

### 阶段五：预览与对比功能 (Day 6)

1. **图片预览**
   - 创建 ImagePreview 组件
   - 放大/缩小功能
   - 图片信息面板

2. **前后对比**
   - 创建 ComparisonView 组件
   - 滑动对比视图
   - 并排对比视图
   - 文件大小对比

### 阶段六：优化与打包 (Day 7)

1. **性能优化**
   - 缩略图生成优化
   - 大文件处理优化
   - 内存管理

2. **用户体验优化**
   - 快捷键支持
   - 操作提示
   - 空状态设计
   - 加载状态

3. **打包发布**
   - 配置 Electron Builder
   - 生成 macOS/Windows/Linux 安装包
   - 应用签名（如需要）

## IPC 通信接口设计

### 主进程 → 渲染进程

```typescript
// 文件处理进度
'process-progress': {
  fileId: string,
  progress: number,
  status: 'processing' | 'completed' | 'error',
  error?: string
}

// 处理完成
'process-complete': {
  fileId: string,
  output: {
    path: string,
    size: number,
    dimensions: { width: number, height: number }
  }
}
```

### 渲染进程 → 主进程

```typescript
// 选择文件
'select-files': () => Promise<string[]>

// 选择文件夹
'select-folder': () => Promise<string>

// 处理图片
'process-images': {
  files: ImageFile[],
  settings: ProcessSettings
}

// 取消处理
'cancel-process': (fileId: string) => void

// 获取图片元数据
'get-image-metadata': (filePath: string) => Promise<ImageMetadata>

// 生成缩略图
'generate-thumbnail': (filePath: string) => Promise<string>
```

## 设计规范

### 色彩方案

**浅色模式**
- 主色: `#10B981` (绿色-500)
- 主色深: `#059669` (绿色-600)
- 背景: `#F9FAFB` (灰色-50)
- 卡片背景: `#FFFFFF`
- 文字: `#111827` (灰色-900)
- 次要文字: `#6B7280` (灰色-500)
- 边框: `#E5E7EB` (灰色-200)

**深色模式**
- 主色: `#34D399` (绿色-400)
- 主色深: `#10B981` (绿色-500)
- 背景: `#111827` (灰色-900)
- 卡片背景: `#1F2937` (灰色-800)
- 文字: `#F9FAFB` (灰色-50)
- 次要文字: `#9CA3AF` (灰色-400)
- 边框: `#374151` (灰色-700)

### 字体

- 标题: Inter (600 weight)
- 正文: Inter (400 weight)
- 代码/数据: JetBrains Mono

### 间距系统

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

## 测试计划

1. **功能测试**
   - 各格式图片压缩测试
   - 尺寸调整测试
   - 批量处理测试
   - 错误处理测试

2. **性能测试**
   - 大批量文件处理（100+ 文件）
   - 大文件处理（50MB+ 图片）
   - 内存占用监控

3. **兼容性测试**
   - macOS 测试
   - Windows 测试
   - Linux 测试（可选）

## 关键技术要点

1. **Sharp 性能优化**
   - 使用流式处理大文件
   - 合理设置缓存
   - 并发控制（避免内存溢出）

2. **Electron 安全**
   - 禁用 Node.js 集成（渲染进程）
   - 使用 preload 脚本暴露有限 API
   - 验证所有 IPC 消息

3. **用户体验**
   - 所有操作即时反馈
   - 支持撤销操作
   - 保存用户设置
   - 记住上次输出目录

## 后续扩展功能

1. 批量水印添加
2. 批量格式转换
3. 图片裁剪功能
4. 自定义预设保存
5. 历史记录功能
6. 多语言支持
