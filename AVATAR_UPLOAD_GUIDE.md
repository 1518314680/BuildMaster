# 头像上传功能使用指南

## ✅ 已实现的功能

成功添加了完整的头像上传和显示功能：
- 头像上传（支持jpg、png、gif、webp，最大5MB）
- 头像预览
- 从数据库获取并显示头像
- 头像在所有页面同步显示

## 📁 新增/修改的文件

### 后端文件

```
BuildMaster-API/
├── src/main/java/com/buildmaster/
│   ├── controller/
│   │   ├── FileController.java          # ⭐新增 - 文件上传下载控制器
│   │   └── UserController.java          # ⭐更新 - 添加更新用户信息和修改密码接口
│   ├── service/
│   │   └── UserService.java             # ⭐更新 - 添加更新用户信息和修改密码方法
│   └── dto/
│       └── LoginResponse.java           # ⭐更新 - 添加avatarUrl字段
└── src/main/resources/
    └── application.yml                  # ⭐更新 - 添加文件上传配置
```

### 前端文件

```
BuildMaster-UI/
├── src/
│   ├── app/
│   │   └── profile/
│   │       └── page.tsx                 # ⭐更新 - 添加头像上传功能
│   └── components/
│       └── UserMenu.tsx                 # ⭐更新 - 显示真实头像
```

## 🎨 功能特性

### 1. 头像上传

**位置：** 个人中心页面（`/profile`）

**功能：**
- 点击头像可上传新头像
- 支持格式：jpg、jpeg、png、gif、webp
- 最大文件大小：5MB
- 实时预览
- 上传进度提示

**流程：**
1. 用户点击头像
2. 选择图片文件
3. 前端显示预览
4. 自动上传到服务器
5. 服务器返回图片URL
6. 更新用户信息到数据库
7. 全局头像同步更新

### 2. 头像显示

**显示位置：**
- 右上角用户菜单
- 个人中心页面
- 下拉菜单中

**显示逻辑：**
- 如果有头像：显示头像图片
- 如果没有头像：显示首字母（渐变色背景）

### 3. 头像存储

**存储路径：** `uploads/avatars/`

**文件命名：** UUID + 原始扩展名（如：`a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`）

**数据库：** `users.avatar_url` 字段存储相对路径（如：`/api/files/avatars/xxx.jpg`）

## 🚀 使用步骤

### 1. 启动后端

```bash
cd BuildMaster-API
mvn spring-boot:run
```

### 2. 启动前端

```bash
cd BuildMaster-UI
npm run dev
```

### 3. 登录系统

访问 http://localhost:3000/login

### 4. 进入个人中心

点击右上角用户菜单 → 个人信息

### 5. 上传头像

1. 鼠标悬停在头像上，会显示"更换头像"提示
2. 点击头像
3. 选择图片文件
4. 等待上传完成
5. 头像自动更新

## 📝 API接口说明

### 1. 上传头像

```http
POST /api/files/upload/avatar
Content-Type: multipart/form-data

file: [图片文件]
```

**响应：**
```json
{
  "success": true,
  "message": "头像上传成功",
  "url": "/api/files/avatars/uuid-filename.jpg",
  "filename": "uuid-filename.jpg"
}
```

### 2. 获取头像

```http
GET /api/files/avatars/{filename}
```

**响应：** 图片二进制数据

### 3. 更新用户信息

```http
PUT /api/user/update?userId={userId}&username={username}&displayName={displayName}&avatarUrl={avatarUrl}
```

**响应：**
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "displayName": "测试用户",
    "avatarUrl": "/api/files/avatars/xxx.jpg",
    "createdAt": "2025-10-21T10:00:00"
  }
}
```

### 4. 修改密码

```http
PUT /api/user/change-password?userId={userId}&currentPassword={currentPassword}&newPassword={newPassword}
```

**响应：**
```json
{
  "success": true,
  "message": "密码修改成功",
  "data": null
}
```

## 💻 前端代码示例

### 头像上传处理

```typescript
const handleAvatarUpload = async (file: File) => {
  setUploadingAvatar(true);
  
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8080/api/files/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      const newAvatarUrl = `http://localhost:8080${result.url}`;
      setAvatarUrl(newAvatarUrl);
      
      // 更新到数据库
      await updateUserAvatar(result.url);
      
      setSuccess('头像上传成功！');
    }
  } catch (err) {
    setError('头像上传失败');
  } finally {
    setUploadingAvatar(false);
  }
};
```

### 显示头像

```typescript
// 在UserMenu组件中
<div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
  {user.avatarUrl ? (
    <img 
      src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:8080${user.avatarUrl}`} 
      alt="Avatar" 
      className="w-full h-full object-cover"
    />
  ) : (
    user.displayName?.charAt(0).toUpperCase() || 'U'
  )}
</div>
```

## 🔧 配置说明

### application.yml

```yaml
# 文件上传配置
file:
  upload:
    path: uploads/avatars

spring:
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 5MB
```

### 后端验证

```java
// 文件大小限制
private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 允许的文件类型
private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
```

## 🎯 测试步骤

### 1. 测试头像上传

1. 登录系统
2. 进入个人中心（`/profile`）
3. 点击头像
4. 选择一张图片（jpg/png/gif/webp，< 5MB）
5. 查看上传进度
6. 确认头像更新成功

### 2. 测试头像显示

1. 上传头像后
2. 检查个人中心页面头像是否更新
3. 检查右上角用户菜单头像是否更新
4. 刷新页面，头像应该保持

### 3. 测试头像持久化

1. 上传头像
2. 退出登录
3. 重新登录
4. 头像应该依然存在

### 4. 测试文件验证

**测试过大文件：**
- 选择 > 5MB 的图片
- 应该显示错误：`图片大小不能超过5MB`

**测试非图片文件：**
- 选择 .txt、.pdf 等文件
- 应该显示错误：`只支持 jpg、png、gif、webp 格式的图片`

## 📸 效果展示

### 未上传头像
```
┌────────┐
│        │
│   T    │  <- 显示首字母
│        │
└────────┘
```

### 已上传头像
```
┌────────┐
│        │
│  📷   │  <- 显示真实头像图片
│        │
└────────┘
```

### 鼠标悬停
```
┌────────┐
│  📷   │
│ 更换  │  <- 显示上传提示
│ 头像  │
└────────┘
```

## ⚠️ 注意事项

### 1. 文件存储

- 默认存储在项目的 `uploads/avatars/` 目录
- 生产环境建议使用OSS（如阿里云OSS、AWS S3）
- 需要配置静态资源访问路径

### 2. 安全性

- ✅ 文件类型验证
- ✅ 文件大小限制
- ✅ 文件名UUID化（防止覆盖）
- ⚠️ 建议添加：病毒扫描、内容检测

### 3. 性能优化

- 考虑添加图片压缩
- 考虑生成缩略图
- 考虑使用CDN加速

### 4. 数据库

确保 `users` 表有 `avatar_url` 字段：
```sql
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);
```

## 🔜 未来改进

- [ ] 支持头像裁剪
- [ ] 支持拖拽上传
- [ ] 自动压缩大图片
- [ ] 生成多种尺寸缩略图
- [ ] 集成云存储（OSS）
- [ ] 添加上传进度条
- [ ] 支持默认头像选择
- [ ] 支持Gravatar集成

## 🐛 常见问题

### Q1: 上传后头像不显示

**检查：**
1. 后端是否正常运行？
2. uploads/avatars 目录是否存在？
3. 浏览器控制台是否有错误？

**解决：**
- 手动创建 `uploads/avatars` 目录
- 检查文件路径配置
- 查看后端日志

### Q2: 上传提示失败

**检查：**
1. 文件是否超过5MB？
2. 文件格式是否支持？
3. 后端是否有报错？

**解决：**
- 使用符合要求的图片
- 查看后端日志定位问题

### Q3: 头像路径错误

**检查：**
- 数据库中的 `avatar_url` 是否正确
- 前端拼接路径是否正确

**解决：**
```typescript
// 正确的路径拼接
const fullUrl = user.avatarUrl.startsWith('http') 
  ? user.avatarUrl 
  : `http://localhost:8080${user.avatarUrl}`;
```

---

**现在可以上传和显示头像了！** 📸

