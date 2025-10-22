# 邮箱验证码注册功能 - 快速启动指南

## ✅ 已完成的功能

1. **后端API接口**
   - ✅ 发送验证码接口 (`POST /api/user/send-code`)
   - ✅ 用户注册接口 (`POST /api/user/register`)
   - ✅ 邮件发送服务（使用QQ邮箱SMTP）
   - ✅ 验证码生成与校验（Redis存储，5分钟过期）
   - ✅ 用户数据持久化（MySQL）

2. **前端注册页面**
   - ✅ 美观的注册界面（`/register` 路由）
   - ✅ 两步注册流程
   - ✅ 验证码倒计时功能
   - ✅ 表单验证与错误提示

3. **文档**
   - ✅ QQ邮箱配置指南 (`BuildMaster-API/EMAIL_SETUP_GUIDE.md`)
   - ✅ API使用示例 (`BuildMaster-API/API_USAGE_EXAMPLE.md`)
   - ✅ 功能说明文档 (`BuildMaster-API/EMAIL_REGISTRATION_README.md`)

## 🚀 快速启动（3步）

### 第1步：获取QQ邮箱授权码

1. 登录 [QQ邮箱](https://mail.qq.com/)
2. **设置** → **账户** → 找到 **POP3/IMAP/SMTP服务**
3. 开启服务，发送短信验证，获取 **16位授权码**
4. 保存这个授权码！

### 第2步：配置环境变量

在PowerShell中运行：
```powershell
# 设置邮箱授权码（替换为你的真实授权码）
$env:MAIL_PASSWORD="你的16位QQ邮箱授权码"
```

### 第3步：启动服务

```powershell
# 启动Redis（使用Docker）
docker run -d -p 6379:6379 redis

# 启动后端（在 BuildMaster-API 目录）
cd BuildMaster-API
mvn spring-boot:run

# 启动前端（新开一个终端，在 BuildMaster-UI 目录）
cd BuildMaster-UI
npm install
npm run dev
```

## 📝 测试注册功能

### 方法1：使用前端页面

1. 打开浏览器访问：http://localhost:3000/register
2. 填写注册信息
3. 点击"发送验证码"
4. 查收邮箱获取验证码
5. 输入验证码完成注册

### 方法2：使用API测试

```bash
# 1. 发送验证码
curl -X POST http://localhost:8080/api/user/send-code \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your@email.com\"}"

# 2. 注册用户（使用收到的验证码）
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\":\"testuser\",
    \"email\":\"your@email.com\",
    \"password\":\"password123\",
    \"verificationCode\":\"123456\",
    \"displayName\":\"测试用户\"
  }"
```

### 方法3：使用Swagger UI

访问 http://localhost:8080/swagger-ui 直接测试API

## 📧 邮件效果预览

用户会收到一封精美的HTML格式验证码邮件：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
       BuildMaster
      装机配置助手
━━━━━━━━━━━━━━━━━━━━━━━━━━

欢迎注册 BuildMaster！

您的验证码是：

┌─────────────────┐
│     123456      │
└─────────────────┘

验证码有效期为 5 分钟

如果这不是您的操作，请忽略此邮件。
```

## 🔧 配置说明

当前配置使用的发送邮箱：**1518314680@qq.com**

如需修改，请编辑 `BuildMaster-API/src/main/resources/application.yml`：

```yaml
spring:
  mail:
    username: 新的邮箱@qq.com
    password: ${MAIL_PASSWORD}
```

## 📁 新增文件清单

### 后端文件
```
BuildMaster-API/
├── src/main/java/com/buildmaster/
│   ├── controller/UserController.java        # 用户API控制器
│   ├── service/EmailService.java             # 邮件发送服务
│   ├── service/UserService.java              # 用户业务逻辑
│   └── dto/
│       ├── SendCodeRequest.java              # 发送验证码DTO
│       ├── RegisterRequest.java              # 注册请求DTO
│       ├── ApiResponse.java                  # 统一响应DTO
│       └── UserDTO.java                      # 用户信息DTO
├── EMAIL_SETUP_GUIDE.md                      # QQ邮箱配置指南
├── API_USAGE_EXAMPLE.md                      # API使用示例
└── EMAIL_REGISTRATION_README.md              # 功能详细说明
```

### 前端文件
```
BuildMaster-UI/
└── src/app/register/page.tsx                 # 注册页面组件
```

### 配置变更
- ✅ `pom.xml` - 添加 Spring Boot Mail 依赖
- ✅ `application.yml` - 添加邮件服务器配置
- ✅ `application.yml` - 启用Redis配置

## ⚠️ 注意事项

1. **Redis必须运行**：验证码存储在Redis中
2. **授权码不是密码**：需要在QQ邮箱设置中专门生成
3. **验证码5分钟过期**：过期需要重新获取
4. **端口要开放**：确保587端口可访问
5. **环境变量设置**：建议使用环境变量而非硬编码

## 🐛 常见问题

### 问题1：535 Login Fail
- **原因**：授权码错误或SMTP未开启
- **解决**：检查授权码，确保开启了SMTP服务

### 问题2：收不到邮件
- **检查**：垃圾邮件文件夹
- **检查**：邮箱地址是否正确
- **检查**：后端日志是否有错误

### 问题3：验证码总是错误
- **检查**：Redis是否运行
- **检查**：是否在5分钟内使用
- **检查**：验证码输入是否正确

### 问题4：Cannot connect to Redis
- **解决**：启动Redis服务
  ```bash
  docker run -d -p 6379:6379 redis
  ```

## 📚 更多文档

- **详细配置指南**：`BuildMaster-API/EMAIL_SETUP_GUIDE.md`
- **API使用示例**：`BuildMaster-API/API_USAGE_EXAMPLE.md`
- **功能说明文档**：`BuildMaster-API/EMAIL_REGISTRATION_README.md`

## 🎯 下一步

- [ ] 添加登录功能
- [ ] 添加JWT认证
- [ ] 添加密码重置功能
- [ ] 添加发送频率限制
- [ ] 使用BCrypt加密密码

---

**祝您使用愉快！** 🎉

