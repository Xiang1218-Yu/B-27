
# NovaAdmin 专业版

一个基于 React 19、TypeScript、Atndesign 和 Tailwind CSS 构建的现代、高性能管理后台系统。

## 🌟 核心理念
NovaAdmin 旨在为企业级应用提供一个“开箱即用”的、富有未来感的管理界面。我们专注于极致的用户体验、流畅的动画效果以及完美的多端适配。

## 🚀 快速启动 (Docker)
1. 确保 Docker Desktop 已运行。
2. 在根目录执行：`docker compose up --build`
3. 访问前端：http://localhost:3000

## 🚀 技术栈
- **核心框架**: React 19 (Hooks & Context)
- **编程语言**: TypeScript (严格类型检查)
- **样式引擎**: Tailwind CSS (JIT 模式, Utility-first)
- **图标驱动**: @ant-design/icons (Ant Design 官方图标库)
- **数据可视化**: Recharts (响应式图表)
- **动效库**: 原生 CSS Keyframes (高性能)
- **UI库**: Atndesign (Ant Design)

## ✨ 功能特性
- **高度响应式**: 针对桌面端、平板、手机端进行了深度优化（如移动端卡片化表格）。
- **固定式 UI**: 固定头部与侧边栏设计，提升在复杂内容下的导航体验。
- **头像实验室**: 支持本地文件实时上传、预览并全局同步至导航栏。
- **数据大盘**: 提供流量分析、设备占比、业务增长趋势等全方位数据展示。
- **账户安全**: 模拟 2FA（双重验证）流程、登录日志监控及密码重置逻辑。
- **玻璃拟态**: 深度使用背景模糊（Backdrop Blur）与阴影，打造通透的界面质感。

## 🛠 快速上手
1. 打开 `App.tsx` 浏览主应用逻辑。
2. 模拟数据存储在 `mockData.ts`，方便快速进行 UI 测试。
3. 样式自定义主要通过 `tailwind.config` 及 `index.html` 中的样式块完成。

---
*由 Nova 设计团队精心打造。*
