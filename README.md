# BuildMaster - 智能装机平台

BuildMaster 是一个现代化的电脑装机配置平台，提供配件选择、AI 推荐、配置管理等功能。

## 🚀 功能特性

### 前端功能 (Next.js)
- **首页**: 平台介绍和快速开始
- **装机页面**: 交互式配件选择器，支持兼容性校验
- **AI 助手**: 基于预算和需求的智能配置推荐
- **配置单管理**: 保存、查看、分享装机配置
- **响应式设计**: 支持桌面端和移动端

### 后端功能 (Spring Boot)
- **RESTful API**: 完整的配件和配置管理接口
- **AI 集成**: 支持 DeepSeek 等 AI 服务
- **数据缓存**: Redis 缓存提升性能
- **数据库支持**: MySQL 存储，支持复杂查询
- **自动文档**: Swagger API 文档

## 🏗️ 项目结构

```
BuildMaster/
├── BuildMaster-UI/                # 前端代码（Next.js）
│   ├── package.json               # 前端依赖配置
│   ├── tailwind.config.js         # Tailwind 配置
│   ├── postcss.config.js          # PostCSS 配置
│   ├── src/
│   │   ├── app/                   # 页面与组件目录
│   │   │   ├── build/             # 装机页面（配件选择与装配）
│   │   │   ├── ai-assistant/      # AI 装机助手页面
│   │   │   ├── config/[id]/       # 配置单详情页面
│   │   │   ├── page.tsx           # 首页
│   │   │   └── layout.tsx         # 布局文件
│   │   ├── hooks/                 # 自定义 Hooks
│   │   ├── lib/                   # 工具库
│   │   └── styles/                # 样式文件
├── BuildMaster-API/               # 后端代码（Spring Boot）
│   ├── pom.xml                    # 后端依赖配置
│   ├── src/
│   │   ├── main/java/com/buildmaster/
│   │   │   ├── controller/        # API 控制器
│   │   │   ├── service/           # 业务逻辑
│   │   │   ├── model/             # 数据模型（实体类）
│   │   │   ├── repository/        # 数据库访问层
│   │   │   └── config/            # 配置文件（CORS, Redis 等）
│   │   └── resources/
│   │       └── application.yml    # 应用配置
│   └── sql/
│       └── init.sql               # 数据库初始化脚本
├── docker-compose.yml             # Docker 容器编排
└── README.md                      # 项目说明文档
```

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (React 18)
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **动画**: Framer Motion
- **HTTP 客户端**: Axios
- **类型检查**: TypeScript

### 后端
- **框架**: Spring Boot 3.3
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **ORM**: Spring Data JPA + Hibernate
- **文档**: Springdoc OpenAPI (Swagger)
- **工具**: Lombok

### 部署
- **容器化**: Docker + Docker Compose
- **数据库**: MySQL 8.0
- **缓存**: Redis 7

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Java 21+
- Docker & Docker Compose
- MySQL 8.0
- Redis 7

### 使用 Docker Compose 启动（推荐）

1. **克隆项目**
```bash
git clone <repository-url>
cd BuildMaster
```

2. **配置环境变量**
```bash
# 设置 AI API 密钥（可选）
export AI_API_KEY=your-deepseek-api-key
```

3. **启动所有服务**
```bash
docker-compose up -d
```

4. **访问应用**
- 前端: http://localhost:3000
- 后端 API: http://localhost:8080
- API 文档: http://localhost:8080/swagger-ui.html

### 本地开发

#### 启动后端
```bash
cd BuildMaster-API
./mvnw spring-boot:run
```

#### 启动前端
```bash
cd BuildMaster-UI
npm install
npm run dev
```

## 📚 API 文档

### 配件管理
- `GET /api/components` - 获取所有配件
- `GET /api/components/type/{type}` - 按类型获取配件
- `GET /api/components/search?keyword={keyword}` - 搜索配件
- `GET /api/components/price-range?minPrice={min}&maxPrice={max}` - 按价格范围获取配件

### 配置单管理
- `GET /api/configs` - 获取所有公开配置
- `GET /api/configs/user/{userId}` - 获取用户配置
- `POST /api/configs` - 创建新配置
- `GET /api/configs/{id}` - 获取配置详情

### AI 推荐
- `POST /api/ai/recommend?budget={budget}&requirements={requirements}` - 获取 AI 推荐
- `POST /api/ai/recommend-advanced` - 高级推荐（支持更多参数）

## 🎯 主要功能

### 1. 配件选择器
- 按类型筛选配件（CPU、GPU、主板等）
- 价格范围筛选
- 关键词搜索
- 实时兼容性检查

### 2. AI 装机助手
- 输入预算和使用需求
- AI 智能推荐配置
- 支持多种使用场景（游戏、办公、创作等）
- 配置优化建议

### 3. 配置单管理
- 保存个人配置
- 分享配置给其他用户
- 配置单详情查看
- 价格计算和对比

### 4. 装机过程动画
- 3D 装机过程展示
- 配件安装顺序指导
- 兼容性警告提示

## 🔧 开发指南

### 代码规范
- 前端使用 Prettier + ESLint
- 后端使用 Spring Boot 标准
- 组件命名使用 PascalCase
- API 遵循 RESTful 规范

### 数据库设计
- 使用 JPA 实体映射
- 支持 JSON 字段存储规格信息
- 自动时间戳管理
- 软删除支持

### 缓存策略
- 配件数据使用 Redis 缓存
- 配置单数据按需缓存
- 支持缓存失效和更新

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过以下方式联系：
- 提交 Issue
- 发送邮件至项目维护者

---

**BuildMaster** - 让装机变得更简单！ 🖥️✨
