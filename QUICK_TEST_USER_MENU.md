# 用户菜单功能快速测试指南

## 🚀 快速开始（3分钟测试）

### 方法1：模拟登录测试（推荐，最快）

1. **启动前端**
   ```bash
   cd BuildMaster-UI
   npm run dev
   ```

2. **访问登录页面**
   ```
   http://localhost:3000/login
   ```

3. **模拟登录**
   - 输入任意邮箱：`test@example.com`
   - 输入任意密码：`123456`
   - 点击 "登录"
   - 系统会自动使用模拟登录

4. **查看用户菜单**
   - 右上角应该显示：`[👤 测试用户 ▼]`
   - 点击查看下拉菜单

5. **测试功能**
   - ✅ 点击 "个人信息" → 进入个人中心
   - ✅ 修改显示名称 → 保存 → 查看右上角是否更新
   - ✅ 点击 "退出登录" → 返回首页 → 右上角恢复为"登录"和"注册"

### 方法2：完整注册登录测试

1. **准备后端环境**
   ```bash
   # 启动Redis
   docker run -d -p 6379:6379 redis
   
   # 设置邮箱授权码
   $env:MAIL_PASSWORD="你的QQ邮箱授权码"
   
   # 启动后端
   cd BuildMaster-API
   mvn spring-boot:run
   ```

2. **启动前端**
   ```bash
   cd BuildMaster-UI
   npm run dev
   ```

3. **注册新用户**
   ```
   http://localhost:3000/register
   ```
   - 填写用户名、邮箱、密码
   - 点击 "发送验证码"
   - 查收邮箱获取验证码
   - 输入验证码并完成注册
   - **注册成功后会自动登录！**

4. **查看用户菜单**
   - 右上角显示你的显示名称
   - 点击查看下拉菜单

## 📸 预期效果截图说明

### 未登录状态
```
导航栏右侧：
[核心功能] [AI大师] [开始装机] [登录] [注册]
                                  ^^^^   ^^^^
```

### 已登录状态
```
导航栏右侧：
[核心功能] [AI大师] [开始装机] [👤 测试用户 ▼]
                               ^^^^^^^^^^^^^
```

### 用户菜单展开
```
                        ┌─────────────────────────────┐
                        │ 登录为                      │
                        │ 测试用户                    │
                        │ test@example.com            │
                        ├─────────────────────────────┤
                        │ 👤 个人信息                 │
                        │ 🖥️ 我的装机                 │
                        │ 💡 AI 推荐                  │
                        ├─────────────────────────────┤
                        │ 🚪 退出登录  (红色)         │
                        └─────────────────────────────┘
```

### 个人中心页面
```
┌─────────────────────────────────────────────┐
│  [头像]                                      │
│   O     个人中心                             │
│        测试用户                              │
├─────────────────────────────────────────────┤
│  [基本信息] [修改密码]                       │
├─────────────────────────────────────────────┤
│                                              │
│  用户名:  [testuser        ]                │
│  邮箱:    test@example.com (不可修改)       │
│  显示名称: [测试用户       ]                │
│                                              │
│          [保存修改]                          │
│                                              │
└─────────────────────────────────────────────┘
```

## ✅ 测试清单

### 1. 登录功能
- [ ] 未登录时显示 "登录" 和 "注册" 按钮
- [ ] 登录后显示用户菜单
- [ ] 用户菜单显示正确的显示名称

### 2. 用户菜单
- [ ] 点击用户菜单按钮，下拉菜单展开
- [ ] 显示用户信息（名称和邮箱）
- [ ] 点击外部，菜单自动关闭
- [ ] 所有菜单项可以点击

### 3. 个人信息修改
- [ ] 点击 "个人信息" 跳转到 `/profile`
- [ ] 显示当前用户信息
- [ ] 可以修改用户名
- [ ] 可以修改显示名称
- [ ] 邮箱显示为灰色（不可修改）
- [ ] 保存后右上角实时更新

### 4. 密码修改
- [ ] 切换到 "修改密码" 标签页
- [ ] 可以输入当前密码
- [ ] 可以输入新密码
- [ ] 新密码长度验证（至少6位）
- [ ] 两次密码一致性验证
- [ ] 显示成功提示

### 5. 退出登录
- [ ] 点击 "退出登录"
- [ ] 用户菜单消失
- [ ] 恢复显示 "登录" 和 "注册" 按钮
- [ ] 访问受保护页面被重定向到登录页

### 6. 注册自动登录
- [ ] 完成注册流程
- [ ] 注册成功后自动登录
- [ ] 自动跳转到装机页面
- [ ] 右上角显示用户菜单

## 🎯 关键功能验证

### A. 显示名称更新流程

1. 登录系统
2. 右上角显示：`测试用户`
3. 点击用户菜单 → 个人信息
4. 修改显示名称为：`我是新名字`
5. 点击保存
6. 查看成功提示
7. **右上角应该立即更新为：`我是新名字`**

### B. 登录状态持久化

1. 登录系统
2. 刷新页面（F5）
3. **右上角用户菜单应该依然存在**
4. 关闭浏览器标签
5. 重新打开 `http://localhost:3000`
6. **右上角用户菜单应该依然存在**（24小时内）

### C. 退出登录清除状态

1. 登录系统
2. 点击退出登录
3. 尝试访问 `/build`
4. **应该被重定向到登录页**
5. 打开浏览器开发者工具 → Application → Cookies
6. **`user_token` 和 `user_id` 应该被删除**

## 🐛 常见问题排查

### 问题1: 登录后右上角没有显示用户菜单

**检查：**
- 打开浏览器开发者工具 → Console
- 是否有JavaScript错误？
- 检查 Application → Local Storage → 是否有 `auth-storage`？

**解决：**
```javascript
// 在控制台手动设置（测试用）
localStorage.setItem('auth-storage', JSON.stringify({
  state: {
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      displayName: '测试用户'
    },
    isAuthenticated: true
  }
}));
location.reload();
```

### 问题2: 修改显示名称后右上角没有更新

**检查：**
- 是否看到成功提示？
- 刷新页面后是否更新？

**解决：**
- 检查 `useAuthStore` 是否正确调用
- 查看 Console 是否有错误

### 问题3: 退出登录后依然可以访问受保护页面

**检查：**
- Cookie 是否被清除？
- LocalStorage 是否被清除？

**解决：**
- 手动清除浏览器数据
- 检查 middleware.ts 是否正常工作

## 💡 快速调试命令

### 查看当前登录状态
在浏览器控制台运行：
```javascript
// 查看localStorage中的认证信息
JSON.parse(localStorage.getItem('auth-storage') || '{}')

// 查看cookies
document.cookie.split(';').map(c => c.trim())
```

### 手动登录（调试用）
在浏览器控制台运行：
```javascript
localStorage.setItem('auth-storage', JSON.stringify({
  state: {
    user: {
      id: 1,
      username: 'debuguser',
      email: 'debug@test.com',
      displayName: 'Debug User'
    },
    isAuthenticated: true
  },
  version: 0
}));
document.cookie = "user_token=debug_token; path=/; max-age=86400";
document.cookie = "user_id=1; path=/; max-age=86400";
location.reload();
```

### 手动退出（调试用）
在浏览器控制台运行：
```javascript
localStorage.removeItem('auth-storage');
document.cookie = "user_token=; path=/; max-age=0";
document.cookie = "user_id=; path=/; max-age=0";
location.reload();
```

## 📞 需要帮助？

如果遇到问题：

1. **查看文档**
   - `USER_MENU_GUIDE.md` - 详细功能说明
   - `LOGIN_PROTECTION_GUIDE.md` - 登录保护说明
   - `EMAIL_REGISTRATION_SETUP.md` - 注册功能说明

2. **检查日志**
   - 浏览器控制台（F12 → Console）
   - 后端日志（如果启动了后端）

3. **重置环境**
   ```javascript
   // 清除所有数据重新开始
   localStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] + "=;max-age=0;path=/";
   });
   location.reload();
   ```

---

**祝测试顺利！** 🎉

