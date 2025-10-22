# 🛒 BuildMaster - 京东联盟API对接完整指南

## 📋 目录

1. [功能概述](#功能概述)
2. [申请京东联盟API](#申请京东联盟api)
3. [配置说明](#配置说明)
4. [功能特性](#功能特性)
5. [API接口说明](#api接口说明)
6. [定时任务说明](#定时任务说明)
7. [使用示例](#使用示例)
8. [常见问题](#常见问题)

---

## 🎯 功能概述

BuildMaster 已成功集成京东联盟开放平台API，提供以下功能：

- ✅ **商品搜索** - 根据关键词搜索京东商品
- ✅ **商品详情** - 获取商品详细信息
- ✅ **价格查询** - 实时查询商品最新价格
- ✅ **批量价格更新** - 批量更新所有配件价格
- ✅ **推广链接生成** - 生成京东联盟推广链接
- ✅ **定时更新** - 自动定时更新价格和推广链接
- ✅ **手动触发** - 支持手动触发价格更新

---

## 🔑 申请京东联盟API

### 步骤1: 注册京东联盟账号

1. 访问京东联盟官网: https://union.jd.com
2. 点击「免费注册」，使用京东账号登录
3. 完成实名认证和联盟账号激活

### 步骤2: 创建推广位

1. 登录后台，进入「推广管理」-> 「推广位管理」
2. 点击「新建推广位」
3. 选择推广位类型（建议选择「网站推广」）
4. 填写推广位名称（如：BuildMaster装机平台）
5. 记录推广位ID（site-id），例如：`1234567`

### 步骤3: 申请API权限

1. 进入「开放平台」-> 「API权限申请」
2. 申请以下API权限：
   - ✅ 商品查询API (`jd.union.open.goods.query`)
   - ✅ 商品详情API (`jd.union.open.goods.promotiongoodsinfo.query`)
   - ✅ 推广链接API (`jd.union.open.promotion.common.get`)
3. 等待审核通过（一般1-3个工作日）

### 步骤4: 获取AppKey和AppSecret

1. 进入「账户设置」-> 「应用管理」
2. 创建新应用或使用默认应用
3. 记录以下信息：
   - **AppKey**: 应用Key（例如：`abc123456`）
   - **AppSecret**: 应用密钥（例如：`def789012`）

---

## ⚙️ 配置说明

### 方式1: 环境变量配置（推荐）

```bash
# Linux/Mac
export JD_APP_KEY=your_app_key
export JD_APP_SECRET=your_app_secret
export JD_SITE_ID=your_site_id

# Windows PowerShell
$env:JD_APP_KEY="your_app_key"
$env:JD_APP_SECRET="your_app_secret"
$env:JD_SITE_ID="your_site_id"
```

### 方式2: 修改application.yml

编辑 `BuildMaster-API/src/main/resources/application.yml`:

```yaml
jd:
  api:
    enabled: true  # 启用京东API
    app-key: your_app_key_here
    app-secret: your_app_secret_here
    site-id: your_site_id_here
```

### 方式3: Docker环境变量

在 `docker-compose.yml` 中添加:

```yaml
services:
  buildmaster-api:
    environment:
      - JD_APP_KEY=your_app_key
      - JD_APP_SECRET=your_app_secret
      - JD_SITE_ID=your_site_id
```

---

## 🚀 功能特性

### 1. 自动价格更新

- **频率**: 每2小时自动更新一次
- **范围**: 所有有京东SKU ID的配件
- **方式**: 批量查询，提高效率
- **配置**: 可自定义更新频率

### 2. 推广链接管理

- **频率**: 每天凌晨3点更新
- **功能**: 自动生成京东联盟推广链接
- **收益**: 通过推广链接购买可获得佣金

### 3. 数据追踪

每个配件记录以下信息：
- `price` - 当前价格
- `original_price` - 原价
- `purchase_url` - 购买链接（推广链接）
- `price_updated_at` - 价格更新时间
- `commission_rate` - 佣金比例
- `jd_sku_id` - 京东商品ID

---

## 📡 API接口说明

### 1. 更新所有配件价格

```http
POST /api/components/update-prices
```

**响应示例:**
```json
{
  "success": true,
  "successCount": 25,
  "failureCount": 0,
  "skipCount": 5,
  "totalCount": 30,
  "message": "价格更新完成"
}
```

### 2. 更新单个配件价格

```http
POST /api/components/{id}/update-price
```

**示例:**
```bash
curl -X POST http://localhost:8080/api/components/1/update-price
```

**响应:**
```json
{
  "success": true,
  "message": "价格更新成功"
}
```

### 3. 更新所有推广链接

```http
POST /api/components/update-promotion-urls
```

**响应示例:**
```json
{
  "success": true,
  "successCount": 28,
  "failureCount": 0,
  "skipCount": 2,
  "totalCount": 30,
  "message": "推广链接更新完成"
}
```

### 4. 更新单个推广链接

```http
POST /api/components/{id}/update-promotion-url
```

---

## ⏰ 定时任务说明

### 价格更新任务

**默认配置:**
```yaml
price-update:
  cron: 0 0 */2 * * ?  # 每2小时执行
```

**自定义示例:**
```yaml
# 每小时执行
cron: 0 0 * * * ?

# 每天早上8点执行
cron: 0 0 8 * * ?

# 每30分钟执行
cron: 0 */30 * * * ?
```

### 推广链接更新任务

**默认配置:**
```yaml
promotion-url-update:
  cron: 0 0 3 * * ?  # 每天凌晨3点执行
```

**Cron表达式说明:**
```
格式: 秒 分 时 日 月 周

示例:
0 0 12 * * ?    - 每天中午12点
0 15 10 * * ?   - 每天上午10:15
0 0 */4 * * ?   - 每4小时
0 0 0 * * MON   - 每周一凌晨
```

---

## 💡 使用示例

### 示例1: 首次配置并测试

```bash
# 1. 配置环境变量
export JD_APP_KEY=your_app_key
export JD_APP_SECRET=your_app_secret
export JD_SITE_ID=your_site_id

# 2. 修改配置文件启用API
# 编辑 application.yml，设置 enabled: true

# 3. 启动应用
cd BuildMaster-API
mvn spring-boot:run

# 4. 导入测试配件
curl -X POST http://localhost:8080/api/components/import/popular

# 5. 手动触发价格更新
curl -X POST http://localhost:8080/api/components/update-prices
```

### 示例2: 为配件添加京东SKU ID

```bash
# 更新配件，添加京东SKU ID
curl -X PUT http://localhost:8080/api/components/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "Intel i7-13700K",
    "type": "CPU",
    "price": 2999.00,
    "jdSkuId": "100035246116"
  }'

# 触发单个配件价格更新
curl -X POST http://localhost:8080/api/components/1/update-price

# 生成推广链接
curl -X POST http://localhost:8080/api/components/1/update-promotion-url
```

### 示例3: 批量导入带SKU ID的配件

创建 `components.csv`:
```csv
名称,类型,品牌,型号,价格,京东SKU ID
Intel i9-13900K,CPU,Intel,i9-13900K,4499.00,100035246114
RTX 4090,GPU,NVIDIA,RTX 4090,12999.00,100043754698
```

上传导入:
```bash
curl -X POST http://localhost:8080/api/components/import/csv \
  -F "file=@components.csv"
```

---

## ❓ 常见问题

### Q1: API调用失败，返回签名错误？

**解决方案:**
- 检查AppKey和AppSecret是否正确
- 确认系统时间准确（签名包含时间戳）
- 检查参数是否URL编码

### Q2: 价格查询返回空结果？

**可能原因:**
- 京东SKU ID不正确
- 商品已下架
- API权限未开通

**解决方案:**
```bash
# 验证SKU ID
# 访问: https://item.jd.com/{sku_id}.html
# 例如: https://item.jd.com/100035246116.html
```

### Q3: 定时任务不执行？

**检查步骤:**
1. 确认`@EnableScheduling`已启用
2. 检查日志输出
3. 验证cron表达式格式
4. 确认`jd.api.enabled=true`

### Q4: 推广链接生成失败？

**常见原因:**
- 推广位ID (site-id) 配置错误
- API权限未申请
- 商品不支持推广

### Q5: 如何获取京东商品的SKU ID？

**方法1: 从商品URL获取**
```
URL: https://item.jd.com/100035246116.html
SKU ID: 100035246116
```

**方法2: 使用搜索API**
```java
List<Component> results = jdApiService.searchProducts("Intel i7-13700K", 10);
// 从结果中获取 jdSkuId
```

### Q6: 价格更新频率可以更高吗？

可以，但需注意：
- 京东API有频率限制（每小时约1000次）
- 建议最短间隔30分钟
- 批量查询比单个查询更高效

### Q7: 如何监控API调用情况？

查看日志:
```bash
# 查看价格更新日志
grep "价格更新" logs/spring.log

# 查看API调用日志
grep "京东API" logs/spring.log
```

---

## 📊 性能优化建议

### 1. 批量更新策略

```java
// ✅ 推荐：批量查询
Map<String, BigDecimal> prices = jdApiService.batchGetPrices(skuIds);

// ❌ 不推荐：逐个查询
for (String skuId : skuIds) {
    BigDecimal price = jdApiService.getPrice(skuId);
}
```

### 2. 缓存配置

价格和商品信息已使用Spring Cache缓存:
- 搜索结果缓存: 1小时
- 商品详情缓存: 6小时
- 价格缓存: 30分钟

### 3. 频率限制

建议配置:
- 价格更新: 每2-4小时
- 推广链接: 每天1次
- 避免在高峰期（10:00-22:00）频繁调用

---

## 🔒 安全建议

1. **不要在代码中硬编码密钥**
   - 使用环境变量
   - 使用配置中心（如Spring Cloud Config）

2. **保护API密钥**
   - 不要提交到Git仓库
   - 添加到`.gitignore`

3. **监控异常调用**
   - 记录所有API调用日志
   - 设置告警规则

---

## 📈 收益跟踪

通过京东联盟推广链接，可以获得佣金收益：

1. **佣金比例**: 存储在 `commission_rate` 字段
2. **收益查询**: 登录京东联盟后台查看
3. **数据报表**: 可导出收益明细

---

## 🎉 总结

您已成功集成京东联盟API！现在可以：

✅ 实时更新配件价格
✅ 自动生成推广链接
✅ 定时同步商品信息
✅ 获得推广佣金收益

**下一步建议:**
1. 为现有配件添加京东SKU ID
2. 配置合适的更新频率
3. 监控API调用情况
4. 优化缓存策略

**获取帮助:**
- 京东联盟帮助中心: https://union.jd.com/helpcenter/
- API文档: https://union.jd.com/openplatform/api
- BuildMaster Issues: https://github.com/your-repo/issues

---

**Made with ❤️ by BuildMaster Team**

