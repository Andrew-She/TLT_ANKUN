# 货运报价平台 (Freight Quote Platform)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Andrew-She/TLT_ANKUN/tree/claude/freight-quote-platform-P3D8C)

一个功能完整的货运报价管理平台，基于 Next.js 14 + TypeScript + Tailwind CSS 构建。

## ✨ 功能特性

### 核心功能
- 📝 **完整的询价表单** - 包含地址、联系方式、货物信息
- 🚚 **10家承运商报价** - 自动生成智能报价对比
- 📊 **询价记录管理** - 查看、搜索、过滤所有询价单
- 📍 **详细信息页面** - 完整的取货送货信息展示
- 🔍 **实时搜索** - 按客户、地点、承运商搜索

### 承运商数据库
包含10家真实货运公司：
- DDPP - Dedicated Delivery Professionals
- AVRT - Averitt Express
- RDFS - Roadrunner Freight Systems
- ABFS - ABF Freight
- ODFL - Old Dominion Freight Line
- XPO - XPO Logistics
- FedEx Freight
- Estes Express Lines
- R+L Carriers
- Saia LTL Freight

### 智能报价系统
- ✅ 基于距离、重量、运费等级计算
- ✅ 自动计算附加服务费用
- ✅ 燃油附加费（15%）
- ✅ 每个承运商价格略有差异（模拟市场竞争）

## 🚀 快速开始

### 在线预览（StackBlitz）

点击下面的按钮直接在浏览器中预览：

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Andrew-She/TLT_ANKUN/tree/claude/freight-quote-platform-P3D8C)

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/Andrew-She/TLT_ANKUN.git
cd TLT_ANKUN
```

2. **切换到开发分支**
```bash
git checkout claude/freight-quote-platform-P3D8C
```

3. **安装依赖**
```bash
npm install
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **打开浏览器**
访问 [http://localhost:3000](http://localhost:3000)

## 📱 使用流程

1. **查看报价列表** - 首页自动跳转到 `/quotes`，显示所有已保存的询价单
2. **创建新报价** - 点击 "+ New Quote" 按钮
3. **填写信息**
   - PICKUP：取货地址、联系方式、日期时间
   - DESTINATION：送货地址、联系方式
   - Items：货物尺寸、重量、数量、运费等级
   - 附加服务：Liftgate、Residential、Limited Access 等
4. **获取报价** - 点击 "Get Quote"，系统自动生成10个承运商报价
5. **查看详情** - 自动跳转到详情页面，可以查看所有承运商报价对比

## 🏗️ 项目结构

```
TLT_ANKUN/
├── app/                          # Next.js App Router
│   ├── quotes/                   # 询价相关页面
│   │   ├── page.tsx             # 询价列表
│   │   ├── new/page.tsx         # 新建询价
│   │   └── [id]/page.tsx        # 询价详情
│   ├── shipments/               # 货运管理
│   ├── claims/                  # 索赔管理
│   └── dashboard/               # 仪表板
├── components/                   # React 组件
│   ├── Sidebar.tsx              # 侧边栏导航
│   ├── MainLayout.tsx           # 主布局
│   └── FreightQuoteFormEnhanced.tsx  # 询价表单
├── lib/                         # 工具库
│   ├── types/                   # TypeScript 类型定义
│   └── data/                    # 数据服务
│       ├── carriers.ts          # 承运商数据库
│       └── storage.ts           # 数据存储服务
└── public/                      # 静态资源
```

## 💾 数据存储

项目使用浏览器 localStorage 进行数据持久化：
- 所有询价单自动保存
- 刷新页面数据不丢失
- 首次访问自动创建示例数据

## 🎨 技术栈

- **框架**: Next.js 16.1 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **字体**: Geist Sans & Geist Mono
- **数据**: localStorage (客户端持久化)

## 📋 功能列表

### 已完成 ✅
- [x] 侧边栏导航
- [x] 询价表单（完整版）
- [x] 询价列表页面
- [x] 询价详情页面
- [x] 承运商数据库（10家）
- [x] 智能报价算法
- [x] 数据持久化
- [x] 搜索和过滤
- [x] 响应式设计
- [x] 深色模式支持

### 规划中 🚧
- [ ] 地址簿管理
- [ ] 货运追踪
- [ ] 发票管理
- [ ] 用户认证
- [ ] 后端 API 集成
- [ ] 真实地理位置距离计算
- [ ] PDF 报价单生成
- [ ] 邮件通知

## 🌐 在线部署

### StackBlitz
点击徽章直接在浏览器中运行：
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Andrew-She/TLT_ANKUN/tree/claude/freight-quote-platform-P3D8C)

### Vercel
推荐使用 Vercel 部署生产环境：
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Built with ❤️ using Next.js
