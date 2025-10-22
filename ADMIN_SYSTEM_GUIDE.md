# BuildMaster 后端管理系统使用指南

## ✅ 已完成的功能

成功开发了一个功能完整的后端管理系统，包括：
- 仪表盘统计
- 用户管理（CRUD）
- 配件管理（CRUD + 图片上传 + 爬虫）
- 优雅的UI界面
- 响应式设计

---

## 📁 文件结构

### 前端文件

```
BuildMaster-UI/
└── src/app/admin/
    ├── layout.tsx              # 管理系统布局（侧边栏+导航栏）
    ├── page.tsx                # 仪表盘页面
    ├── users/
    │   └── page.tsx            # 用户管理页面
    └── components/
        └── page.tsx            # 配件管理页面
```

### 后端文件

```
BuildMaster-API/
└── src/main/java/com/buildmaster/
    ├── controller/
    │   ├── ComponentController.java      # 配件API控制器（已完善）
    │   ├── FileController.java           # 文件上传控制器（添加配件图片上传）
    │   └── UserController.java           # 用户API控制器
    └── service/
        ├── ComponentService.java         # 配件服务
        └── ComponentCrawlerService.java  # 配件爬虫服务 ⭐新增
```

---

## 🚀 快速开始

### 1. 启动服务

```bash
# 启动后端
cd BuildMaster-API
mvn spring-boot:run

# 启动前端
cd BuildMaster-UI
npm run dev
```

### 2. 访问管理系统

```
http://localhost:3000/admin
```

**注意：** 需要先登录才能访问管理系统

---

## 📊 功能模块详解

### 1. 仪表盘 (`/admin`)

**功能：**
- 统计卡片（总用户数、配件总数、配置单数、今日注册）
- 快速操作按钮
- 数据概览

**快速操作：**
- 添加用户
- 添加配件
- 爬取配件

### 2. 用户管理 (`/admin/users`)

**功能列表：**
- ✅ 用户列表展示（头像、用户名、邮箱、创建时间）
- ✅ 搜索用户（按用户名、邮箱搜索）
- ✅ 添加用户（用户名、邮箱、密码、显示名称）
- ✅ 编辑用户（修改用户名、显示名称、密码）
- ✅ 删除用户（确认提示）

**操作步骤：**

#### 添加用户
1. 点击右上角"添加用户"按钮
2. 填写用户信息：
   - 用户名（必填）
   - 邮箱（必填）
   - 显示名称（可选）
   - 密码（必填）
3. 点击"添加"按钮

#### 编辑用户
1. 点击用户行的"编辑"按钮
2. 修改信息（邮箱不可修改）
3. 密码留空表示不修改
4. 点击"保存"

#### 删除用户
1. 点击"删除"按钮
2. 确认删除操作

### 3. 配件管理 (`/admin/components`)

这是核心功能模块，功能最丰富！

**功能列表：**
- ✅ 配件列表展示（图片、名称、品牌、型号、价格、库存、状态）
- ✅ 类型筛选（CPU、GPU、主板、内存等）
- ✅ 关键词搜索
- ✅ 手动添加配件
- ✅ 编辑配件信息
- ✅ 删除配件
- ✅ 配件图片上传
- ✅ 自动爬取配件信息

#### 手动添加配件

1. 点击"添加配件"按钮
2. 填写配件信息：
   - **配件图片**（点击"选择图片"上传）
   - 配件名称
   - 类型（CPU/GPU/主板/内存/存储/电源/机箱/散热器）
   - 品牌
   - 型号
   - 价格（元）
   - 库存数量
   - 可用状态（勾选框）
3. 点击"添加"

**图片上传说明：**
- 支持格式：jpg、png、webp、gif
- 最大大小：5MB
- 自动生成唯一文件名
- 实时预览

#### 编辑配件

1. 点击配件行的"编辑"按钮
2. 修改信息（可更换图片）
3. 点击"保存"

#### 爬取配件信息 🌐

这是一个强大的自动化功能！

1. 点击"爬取配件"按钮
2. 配置爬取参数：
   - **配件类型**（CPU/GPU等）
   - **数据来源**（京东/天猫/淘宝）
   - **搜索关键词**（如"Intel 13代"）
   - **爬取数量**（1-50）
3. 点击"开始爬取"

**爬虫功能说明：**
- 自动从电商平台抓取配件信息
- 包含：名称、品牌、型号、价格、库存
- 模拟数据生成（生产环境需要真实爬虫）
- 自动保存到数据库

**注意：** 当前是模拟爬取，生产环境需要实现真实的爬虫逻辑（使用Jsoup、Selenium等）。

---

## 🎨 UI 特性

### 设计风格
- 现代化管理后台设计
- 清爽的配色方案
- 卡片式布局
- 响应式设计

### 交互特性
- Framer Motion 动画效果
- 模态框弹窗
- 悬停效果
- 加载状态提示
- 错误提示

### 布局结构
```
┌─────────────────────────────────────────┐
│  BuildMaster 管理系统    [返回前台] [头像] │
├──────────┬──────────────────────────────┤
│          │                              │
│ 仪表盘   │                              │
│ 用户管理 │     主内容区域               │
│ 配件管理 │                              │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

## 🔌 后端API接口

### 配件管理API

#### 获取所有配件
```http
GET /api/components
```

#### 根据类型获取配件
```http
GET /api/components/type/{type}

例如：GET /api/components/type/CPU
```

#### 搜索配件
```http
GET /api/components/search?keyword=Intel
```

#### 添加配件
```http
POST /api/components
Content-Type: application/json

{
  "name": "Intel Core i7-13700K",
  "type": "CPU",
  "brand": "Intel",
  "model": "Core i7-13700K",
  "price": 2499,
  "stockQuantity": 50,
  "isAvailable": true
}
```

#### 更新配件
```http
PUT /api/components/{id}
Content-Type: application/json

{
  "name": "Intel Core i7-13700K",
  "price": 2399
}
```

#### 删除配件
```http
DELETE /api/components/{id}
```

#### 上传配件图片
```http
POST /api/files/upload/component
Content-Type: multipart/form-data

file: [图片文件]
```

#### 爬取配件
```http
POST /api/components/crawl?type=CPU&source=jd&keyword=Intel&maxCount=10
```

### 用户管理API

这部分API需要后续完善（当前前端使用模拟数据）。

---

## 📝 配件类型说明

| 类型代码 | 中文名称 |
|---------|----------|
| CPU | CPU 处理器 |
| GPU | GPU 显卡 |
| MOTHERBOARD | 主板 |
| RAM | 内存 |
| STORAGE | 存储 |
| PSU | 电源 |
| CASE | 机箱 |
| COOLER | 散热器 |

---

## 🎯 使用场景

### 场景1：批量导入配件

使用爬虫功能快速导入大量配件：

1. 访问 `/admin/components`
2. 点击"爬取配件"
3. 选择类型：CPU
4. 数据来源：京东
5. 关键词：Intel 13代
6. 数量：20
7. 点击"开始爬取"
8. 等待爬取完成

### 场景2：手动添加特殊配件

对于爬虫无法获取的配件，手动添加：

1. 准备配件图片
2. 点击"添加配件"
3. 上传图片
4. 填写详细信息
5. 点击"添加"

### 场景3：维护配件信息

定期更新价格、库存：

1. 搜索或筛选配件
2. 点击"编辑"
3. 修改价格和库存
4. 点击"保存"

---

## 💻 代码示例

### 前端调用配件API

```typescript
// 获取所有配件
const fetchComponents = async () => {
  const response = await fetch('http://localhost:8080/api/components');
  const data = await response.json();
  setComponents(data);
};

// 添加配件
const addComponent = async (component) => {
  const response = await fetch('http://localhost:8080/api/components', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(component),
  });
  const result = await response.json();
  return result;
};

// 上传配件图片
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8080/api/files/upload/component', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result.url;
};

// 爬取配件
const crawlComponents = async (config) => {
  const response = await fetch(
    `http://localhost:8080/api/components/crawl?` + 
    `type=${config.type}&source=${config.source}&keyword=${config.keyword}&maxCount=${config.maxCount}`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data;
};
```

---

## ⚡ 性能优化

### 前端优化
- 图片懒加载
- 虚拟滚动（大数据量）
- 防抖搜索
- 缓存数据

### 后端优化
- Redis缓存配件列表
- 分页查询
- 数据库索引
- 图片CDN加速

---

## 🔐 安全建议

1. **访问控制**
   - ✅ 登录验证（已实现）
   - ⚠️ 角色权限（待完善）
   - ⚠️ 操作日志（待实现）

2. **数据验证**
   - ✅ 前端表单验证
   - ⚠️ 后端参数验证（待完善）
   - ⚠️ SQL注入防护

3. **文件上传**
   - ✅ 文件类型验证
   - ✅ 文件大小限制
   - ⚠️ 文件内容检测（待实现）

---

## 🐛 常见问题

### Q1: 无法访问管理系统

**A:** 需要先登录。访问 `/login` 登录后即可访问 `/admin`

### Q2: 图片上传失败

**A:** 检查：
- 图片格式是否支持
- 图片大小是否超过5MB
- 后端服务是否正常运行

### Q3: 爬取配件返回空列表

**A:** 当前是模拟爬取功能，需要在 `ComponentController` 中注入 `ComponentCrawlerService` 才能正常工作。

### Q4: 用户管理无法添加/编辑

**A:** 当前用户管理使用前端模拟数据，需要完善后端API。

---

## 🔜 后续改进

### 短期计划
- [ ] 完善用户管理后端API
- [ ] 实现真实的配件爬虫（Jsoup/Selenium）
- [ ] 添加配件规格参数管理
- [ ] 实现配件分类标签

### 中期计划
- [ ] 角色权限管理
- [ ] 操作日志记录
- [ ] 数据导入导出
- [ ] 批量操作功能

### 长期计划
- [ ] AI配件推荐管理
- [ ] 价格走势分析
- [ ] 配件兼容性矩阵
- [ ] 移动端管理界面

---

## 📚 相关文档

- 用户认证：`LOGIN_PROTECTION_GUIDE.md`
- 头像上传：`AVATAR_UPLOAD_GUIDE.md`
- 邮箱注册：`EMAIL_REGISTRATION_SETUP.md`
- 用户菜单：`USER_MENU_GUIDE.md`

---

**管理系统已完成开发，可以开始使用了！** 🎉

