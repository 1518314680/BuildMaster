# 用户菜单和个人中心功能说明

## ✅ 已实现的功能

成功登录后，所有页面右上角都会显示用户菜单，包含：
- 用户显示名称（display_name）
- 个人信息修改
- 退出登录

### 1. 用户认证状态管理 (`useAuthStore`)

**功能特性：**
- 使用 Zustand 管理全局用户状态
- 自动持久化到 localStorage
- 自动管理 cookie（user_token 和 user_id）
- 提供 login、logout、updateUser 方法

**API：**
```typescript
const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();

// 登录
login({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  displayName: '测试用户',
  token: 'xxx'
});

// 退出
logout();

// 更新用户信息
updateUser({ displayName: '新名称' });
```

### 2. 用户菜单组件 (`UserMenu`)

**显示内容：**
- 用户头像（显示名称首字母）
- 显示名称
- 下拉菜单：
  - 个人信息（跳转到 /profile）
  - 我的装机（跳转到 /build）
  - AI 推荐（跳转到 /ai-assistant）
  - 退出登录

**未登录时：**
显示 "登录" 和 "注册" 按钮

### 3. 个人中心页面 (`/profile`)

**两个标签页：**

#### 基本信息
- 用户名（可修改）
- 邮箱地址（不可修改）
- 显示名称（可修改）

#### 修改密码
- 当前密码
- 新密码
- 确认新密码

## 📁 新增/修改的文件

### 新增文件
```
BuildMaster-UI/
├── src/
│   ├── hooks/
│   │   └── useAuthStore.ts              # ⭐新增 - 用户认证状态管理
│   ├── components/
│   │   └── UserMenu.tsx                 # ⭐新增 - 用户菜单组件
│   ├── app/
│   │   ├── profile/
│   │   │   └── page.tsx                 # ⭐新增 - 个人中心页面
│   │   └── metadata.ts                  # ⭐新增 - 元数据配置
```

### 修改文件
```
BuildMaster-UI/
├── src/
│   └── app/
│       ├── layout.tsx                   # ⭐更新 - 集成UserMenu组件
│       ├── login/page.tsx               # ⭐更新 - 使用useAuthStore
│       └── register/page.tsx            # ⭐更新 - 注册成功后自动登录
```

## 🎨 UI 设计

### 用户菜单样式
- 半透明深色背景
- 圆形头像，渐变色背景
- 平滑的下拉动画
- Hover 效果和过渡动画
- 退出登录为红色强调

### 个人中心样式
- 渐变背景
- 卡片式布局
- 标签页切换
- 表单验证
- 成功/错误提示

## 🚀 使用流程

### 1. 登录后自动显示用户信息

```typescript
// 用户登录
login({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  displayName: '测试用户',
  token: 'xxx'
});

// 导航栏会自动显示：
// [头像] 测试用户 [▼]
```

### 2. 点击用户菜单

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
│ 🚪 退出登录                 │
└─────────────────────────────┘
```

### 3. 修改个人信息

1. 点击 "个人信息" → 跳转到 `/profile`
2. 在 "基本信息" 标签页修改用户名或显示名称
3. 点击 "保存修改"
4. 导航栏实时更新显示名称

### 4. 修改密码

1. 在个人中心切换到 "修改密码" 标签页
2. 输入当前密码
3. 输入新密码（至少6位）
4. 确认新密码
5. 点击 "修改密码"

### 5. 退出登录

1. 点击用户菜单的 "退出登录"
2. 清除登录状态和 cookie
3. 跳转到首页

## 💻 代码示例

### 在任何组件中获取用户信息

```typescript
'use client';

import { useAuthStore } from '@/hooks/useAuthStore';

export default function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }
  
  return (
    <div>
      <h1>欢迎，{user.displayName}！</h1>
      <p>邮箱：{user.email}</p>
    </div>
  );
}
```

### 检查登录状态并重定向

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // 页面内容...
}
```

### 更新用户信息

```typescript
const { updateUser } = useAuthStore();

// 更新显示名称
updateUser({ displayName: '新的显示名称' });

// 导航栏会自动更新
```

## 🔧 后端API（待实现）

### 更新用户信息

```http
PUT /api/user/update
Content-Type: application/json

{
  "username": "newusername",
  "displayName": "新名称"
}
```

### 修改密码

```http
PUT /api/user/change-password
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

## 🎯 特性亮点

### 1. 全局状态管理
- 使用 Zustand 提供的 persist 中间件
- 自动持久化到 localStorage
- 刷新页面后状态保持

### 2. 自动登录状态同步
- Cookie 和 localStorage 双重存储
- 登录后所有页面实时更新
- 退出后立即清除所有状态

### 3. 优雅的用户体验
- 平滑的动画效果（Framer Motion）
- 点击外部自动关闭菜单
- 实时表单验证
- 成功/错误提示

### 4. 响应式设计
- 桌面端显示完整菜单
- 移动端优化显示
- 适配各种屏幕尺寸

## 🎨 视觉效果

### 未登录状态
```
[核心功能] [AI大师] [开始装机] [登录] [注册]
```

### 已登录状态
```
[核心功能] [AI大师] [开始装机] [👤 测试用户 ▼]
```

### 用户菜单展开
```
                    ┌─────────────────────┐
                    │ 登录为              │
                    │ 测试用户            │
                    │ test@example.com    │
                    ├─────────────────────┤
                    │ 👤 个人信息         │
                    │ 🖥️ 我的装机         │
                    │ 💡 AI 推荐          │
                    ├─────────────────────┤
                    │ 🚪 退出登录         │
                    └─────────────────────┘
```

## 📝 测试步骤

### 1. 测试登录后显示用户菜单

```bash
# 启动前端
cd BuildMaster-UI
npm run dev

# 访问登录页面
http://localhost:3000/login

# 登录后查看右上角用户菜单
```

### 2. 测试个人信息修改

1. 登录后点击用户菜单
2. 选择 "个人信息"
3. 修改显示名称
4. 点击 "保存修改"
5. 查看右上角是否更新

### 3. 测试退出登录

1. 点击 "退出登录"
2. 确认跳转到首页
3. 右上角恢复为 "登录" 和 "注册" 按钮
4. 尝试访问 `/build` 应该被重定向到登录页

### 4. 测试注册后自动登录

1. 访问 `/register`
2. 完成注册流程
3. 注册成功后自动显示用户菜单
4. 自动跳转到 `/build` 页面

## ⚠️ 注意事项

### 开发环境
- 后端API未实现时，更新操作会模拟成功
- 控制台会显示警告信息
- 所有更新仅在前端生效

### 生产环境准备
- 需要实现真实的后端API
- 需要添加请求认证（JWT）
- 需要添加更完善的错误处理
- 需要添加头像上传功能

## 🔜 未来改进

- [ ] 添加头像上传功能
- [ ] 支持第三方登录（Google、GitHub等）
- [ ] 添加邮箱验证修改功能
- [ ] 添加账户安全设置
- [ ] 显示最近登录记录
- [ ] 支持双因素认证（2FA）
- [ ] 添加用户偏好设置

---

**现在所有页面右上角都会显示登录用户信息了！** 👤

