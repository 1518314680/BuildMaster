# 🚀 BuildMaster UI - 快速启动指南

## 📋 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

## 🔧 安装步骤

### 1. 安装依赖
```bash
cd BuildMaster-UI
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 打开浏览器
访问 [http://localhost:3000](http://localhost:3000) 查看效果

## 🎨 新设计预览

### 首页特性
打开首页后，您将看到：

✨ **动态背景**
- 3个浮动的彩色光斑在屏幕上缓缓移动
- 网格背景纹理

🎯 **交互动画**
- 页面加载时的淡入动画
- 滚动时元素逐个显示
- 鼠标悬停时的发光效果

💎 **科幻元素**
- 渐变文字标题
- 玻璃态卡片
- 霓虹发光按钮
- AI 图标旋转动画

## 📱 响应式测试

### 桌面端（≥768px）
- 完整的导航菜单
- 3列功能卡片布局
- 4列数据展示

### 移动端（<768px）
- 汉堡菜单按钮
- 单列卡片布局
- 2列数据展示

## 🎭 查看不同页面

### 主页
```
http://localhost:3000/
```

### 装机页面
```
http://localhost:3000/build
```

### AI 推荐页面
```
http://localhost:3000/ai-assistant
```

## 🔍 测试交互效果

### 1. 滚动效果
- 向下滚动查看元素的淡入动画
- 注意底部滚动指示器的弹跳效果

### 2. 悬停效果
- 将鼠标悬停在功能卡片上 → 卡片上浮 + 发光边框增强
- 悬停在按钮上 → 阴影增强 + 轻微放大
- 悬停在导航链接上 → 颜色变化

### 3. 点击效果
- 点击"开始装机之旅"按钮 → 跳转到装机页面
- 点击"AI 智能推荐"按钮 → 跳转到 AI 推荐页面

## 🎨 自定义主题

如果需要调整颜色方案，编辑以下文件：

### 主色调
`src/app/page.tsx` - 查找渐变类名：
- `from-cyan-400` - 青色
- `to-blue-500` - 蓝色
- `via-purple-600` - 紫色

### 背景色
`src/app/layout.tsx`:
- `bg-slate-950` - 主背景色
- `bg-slate-900` - 导航栏背景

### 自定义动画
`src/app/globals.css`:
- `@keyframes blob` - 浮动动画
- `.animate-blob` - 应用动画

## 🛠️ 其他命令

### 类型检查
```bash
npm run type-check
```

### 代码格式化
```bash
npx prettier --write src/
```

### 代码检查
```bash
npm run lint
```

### 生产构建
```bash
npm run build
npm run start
```

## 📊 性能检查

### Chrome DevTools
1. 打开开发者工具（F12）
2. 切换到 Performance 标签
3. 录制页面加载
4. 查看 FPS 和渲染性能

### Lighthouse
1. 打开 Chrome DevTools
2. 切换到 Lighthouse 标签
3. 运行性能审计
4. 查看分数和建议

## 🐛 常见问题

### Q: 动画效果看不到？
A: 确保已安装 `framer-motion`：
```bash
npm install framer-motion
```

### Q: 背景网格不显示？
A: 检查 `public/grid.svg` 文件是否存在

### Q: 样式不生效？
A: 清除缓存并重启开发服务器：
```bash
rm -rf .next
npm run dev
```

### Q: TypeScript 报错？
A: 运行类型检查并查看详细错误：
```bash
npm run type-check
```

## 📚 相关文档

- [设计特性说明](./DESIGN_FEATURES.md)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

## 💡 开发建议

### 1. 使用热重载
开发服务器支持热重载，修改代码后浏览器会自动刷新。

### 2. 浏览器开发工具
使用 React DevTools 和 Tailwind CSS IntelliSense 插件提升开发效率。

### 3. 移动端调试
使用 Chrome 的设备模拟器测试响应式设计。

### 4. 性能监控
开发时注意控制台的性能警告，避免不必要的重渲染。

---

**祝您开发愉快！** 🎉

如有问题，请查看 [项目 README](../README.md) 或提交 Issue。

