# 🚀 京东API快速开始指南

## 5分钟快速配置京东API

### 📝 前置准备

- ✅ 已有京东账号
- ✅ BuildMaster项目已运行
- ✅ MySQL数据库已启动

---

## 步骤1: 申请京东联盟账号 (10分钟)

1. **注册京东联盟**
   ```
   访问: https://union.jd.com
   点击「免费注册」使用京东账号登录
   ```

2. **创建推广位**
   ```
   后台 -> 推广管理 -> 推广位管理 -> 新建推广位
   推广位类型: 网站推广
   推广位名称: BuildMaster
   
   📝 记录推广位ID (site-id)
   ```

3. **获取AppKey和AppSecret**
   ```
   后台 -> 账户设置 -> 应用管理
   
   📝 记录:
   AppKey: abc123456
   AppSecret: def789012
   ```

---

## 步骤2: 配置环境变量 (2分钟)

### Windows (PowerShell)
```powershell
cd E:\process\project\BuildMaster
$env:JD_APP_KEY="your_app_key"
$env:JD_APP_SECRET="your_app_secret"
$env:JD_SITE_ID="your_site_id"
```

### Linux/Mac
```bash
cd ~/BuildMaster
export JD_APP_KEY=your_app_key
export JD_APP_SECRET=your_app_secret
export JD_SITE_ID=your_site_id
```

---

## 步骤3: 启用API (1分钟)

编辑 `BuildMaster-API/src/main/resources/application.yml`:

```yaml
jd:
  api:
    enabled: true  # 改为 true
```

---

## 步骤4: 启动应用 (1分钟)

```bash
cd BuildMaster-API
mvn spring-boot:run
```

或使用Docker:
```bash
docker-compose up -d
```

---

## 步骤5: 测试API (1分钟)

### 测试1: 导入热门配件
```bash
curl -X POST http://localhost:8080/api/components/import/popular
```

### 测试2: 更新价格
```bash
curl -X POST http://localhost:8080/api/components/update-prices
```

### 测试3: 查看Swagger文档
```
访问: http://localhost:8080/swagger-ui/index.html
找到「配件管理」分类
```

---

## ✅ 验证成功

访问数据库查看配件表：
```sql
SELECT id, name, price, original_price, purchase_url, price_updated_at 
FROM components 
WHERE jd_sku_id IS NOT NULL;
```

如果看到：
- ✅ `price_updated_at` 有值
- ✅ `purchase_url` 有值
- ✅ `original_price` 有值

说明配置成功！🎉

---

## 📌 下一步

1. **添加更多配件**
   - 方式1: 使用CSV批量导入
   - 方式2: 通过API单个添加

2. **自定义定时任务**
   ```yaml
   price-update:
     cron: 0 0 */2 * * ?  # 每2小时
   ```

3. **监控日志**
   ```bash
   tail -f logs/spring.log | grep "价格更新"
   ```

---

## ❓ 遇到问题？

### 问题1: API调用失败
```bash
# 检查配置
curl http://localhost:8080/actuator/env | grep JD_
```

### 问题2: 价格未更新
```bash
# 查看日志
grep "京东API" logs/spring.log
```

### 问题3: 推广链接为空
- 检查 `site-id` 是否正确
- 确认推广位已激活

---

## 📚 更多文档

- 📖 [完整使用指南](./京东API对接完整指南.md)
- 📖 [配件数据获取方案总结](./配件数据获取方案总结.md)
- 📖 [API使用示例](./BuildMaster-API/API_USAGE_EXAMPLE.md)

---

**祝您使用愉快！** 🎊

