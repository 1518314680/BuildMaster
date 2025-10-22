# 登录保护功能说明

## ✅ 已实现的功能

为了保护需要登录才能访问的页面，我添加了以下功能：

### 1. 路由中间件保护 (`middleware.ts`)

创建了 Next.js 中间件来保护以下路由：
- `/build` - 装机配置页面
- `/ai-assistant` - AI推荐页面  
- `/config` - 配置单管理页面

**工作原理：**
- 检查用户是否有登录凭证（cookie中的 `user_token` 和 `user_id`）
- 如果未登录，自动重定向到登录页面
- 保留原始访问路径，登录后自动跳转回去

### 2. 登录页面 (`/login`)

**功能特性：**
- 邮箱和密码登录
- 记住我选项
- 忘记密码链接
- 登录成功后自动跳转
- 错误提示

**临时方案：**
- 当后端API未就绪时，使用模拟登录
- 开发环境下会显示提示信息

### 3. 后端登录API

**接口：** `POST /api/user/login`

**请求：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "user@example.com",
    "displayName": "测试用户",
    "token": "uuid-token-here"
  }
}
```

### 4. 导航栏更新

添加了：
- **登录按钮** - 跳转到登录页面
- **注册按钮** - 跳转到注册页面

## 📂 新增文件

### 前端文件
```
BuildMaster-UI/
├── src/
│   ├── middleware.ts                    # 路由保护中间件 ⭐新增
│   └── app/
│       └── login/
│           └── page.tsx                 # 登录页面 ⭐新增
```

### 后端文件
```
BuildMaster-API/
└── src/main/java/com/buildmaster/
    ├── dto/
    │   ├── LoginRequest.java            # 登录请求DTO ⭐新增
    │   └── LoginResponse.java           # 登录响应DTO ⭐新增
    ├── service/
    │   └── UserService.java             # 添加login()方法 ⭐更新
    └── controller/
        └── UserController.java          # 添加登录接口 ⭐更新
```

### 配置变更
```
BuildMaster-UI/
└── src/app/
    └── layout.tsx                       # 导航栏添加登录/注册按钮 ⭐更新
```

## 🔒 受保护的路由

访问以下页面需要先登录：

| 路由 | 说明 | 需要登录 |
|------|------|---------|
| `/` | 首页 | ❌ 不需要 |
| `/register` | 注册页面 | ❌ 不需要 |
| `/login` | 登录页面 | ❌ 不需要 |
| `/build` | 装机配置器 | ✅ **需要** |
| `/ai-assistant` | AI推荐 | ✅ **需要** |
| `/config/*` | 配置单管理 | ✅ **需要** |

## 🚀 使用流程

### 新用户流程
1. 访问 `/register` 注册账户
2. 填写信息并获取邮箱验证码
3. 完成注册后跳转到登录页
4. 登录成功即可访问所有功能

### 老用户流程
1. 访问 `/login` 登录
2. 输入邮箱和密码
3. 登录成功后可访问受保护页面

### 直接访问受保护页面
1. 用户访问 `/build`（未登录）
2. 自动跳转到 `/login?redirect=/build`
3. 登录成功后自动跳转回 `/build`

## 💻 开发测试

### 方式1：完整注册登录流程

```bash
# 1. 确保后端和Redis运行
cd BuildMaster-API
mvn spring-boot:run

# 2. 启动前端
cd BuildMaster-UI
npm run dev

# 3. 访问注册页面
浏览器访问: http://localhost:3000/register

# 4. 完成注册后登录
浏览器访问: http://localhost:3000/login
```

### 方式2：使用模拟登录（开发环境）

如果后端未启动，前端会自动使用模拟登录：
1. 访问 http://localhost:3000/login
2. 输入任意邮箱和密码
3. 点击登录（会看到黄色提示框）
4. 自动设置模拟token和user_id
5. 可以访问受保护页面

### 方式3：手动设置Cookie（快速测试）

在浏览器控制台运行：
```javascript
document.cookie = "user_token=test_token; path=/; max-age=86400";
document.cookie = "user_id=1; path=/; max-age=86400";
localStorage.setItem('user', JSON.stringify({
  id: 1,
  username: 'testuser',
  email: 'test@example.com'
}));
location.reload();
```

## 🔧 配置说明

### 修改受保护路由

编辑 `BuildMaster-UI/src/middleware.ts`：

```typescript
// 添加需要保护的路由
const protectedRoutes = [
  '/build', 
  '/ai-assistant', 
  '/config',
  '/your-new-route'  // 添加新路由
];

// 添加公开路由
const publicRoutes = [
  '/', 
  '/register', 
  '/login',
  '/your-public-route'  // 添加公开路由
];
```

### 自定义登录检查逻辑

修改 `middleware.ts` 中的认证检查：

```typescript
// 当前使用cookie检查
const token = request.cookies.get('user_token');
const userId = request.cookies.get('user_id');

// 可以改为JWT验证
// const token = request.cookies.get('jwt_token');
// const isValid = await verifyJWT(token);
```

## ⚠️ 注意事项

### 当前限制

1. **简单Token** - 使用UUID而非JWT，生产环境需要升级
2. **Cookie存储** - Token存储在cookie中，可能需要HttpOnly标志
3. **无刷新功能** - Token过期后需要重新登录
4. **前端验证** - 仅在前端验证，后端API也需要验证

### 安全建议

1. ✅ 使用HTTPS（生产环境）
2. ✅ 实现JWT token认证
3. ✅ 设置token过期时间
4. ✅ 实现token刷新机制
5. ✅ 后端API添加认证中间件
6. ✅ 使用HttpOnly Cookie防止XSS

## 🎯 下一步改进

- [ ] 实现JWT token替代简单UUID
- [ ] 添加token自动刷新
- [ ] 实现退出登录功能
- [ ] 添加用户个人中心
- [ ] 显示已登录用户信息
- [ ] 实现"记住我"功能
- [ ] 添加忘记密码功能
- [ ] 后端API添加统一认证拦截器

## 📚 相关文档

- 注册功能：`EMAIL_REGISTRATION_SETUP.md`
- 邮箱配置：`BuildMaster-API/EMAIL_SETUP_GUIDE.md`
- API使用：`BuildMaster-API/API_USAGE_EXAMPLE.md`

---

**现在访问 `/build` 或 `/ai-assistant` 会自动要求登录！** 🔐

