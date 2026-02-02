# Highscore Scratch & Win Event System

## 1. 项目简介
这是一个基于 **Next.js (App Router)** + **Tailwind CSS** + **Supabase** 开发的刮刮卡兑奖系统。
主要功能包括：
*   **防伪码验证**：用户输入编码，系统验证真伪及状态。
*   **智能分流**：
    *   **实物大奖**：跳转填写收货表单。
    *   **优惠券**：显示到店使用指引。
*   **全站 UI**：定制化蓝天/卡通风格，适配移动端与 PC 端。

---

## 2. 快速开始 (本地运行)

### 2.1 安装依赖
```bash
cd guaguale-web
npm install
```

### 2.2 启动开发服务器
```bash
npm run dev
```
打开浏览器访问 `http://localhost:3000`。

### 2.3 测试数据 (Mock 模式)
在未连接数据库时，可使用以下测试码：
*   **实物奖 (无人机)**: `HS-DRN-TEST1`
*   **优惠券 ($5)**: `HS-V05-TEST2`
*   **已使用**: `HS-USED-CODE`

---

## 3. 数据库配置 (Supabase)

### 3.1 创建项目
1.  登录 [Supabase Dashboard](https://supabase.com/dashboard)。
2.  点击 **"New Project"** 创建一个新项目。

### 3.2 创建表结构
1.  进入项目的 **SQL Editor**。
2.  打开本项目中的 `database/schema.sql` 文件。
3.  复制文件内容粘贴到 SQL Editor 中并运行 (Run)，这将自动创建 `prizes` 和 `redemptions` 表以及安全策略。

### 3.3 导入防伪码数据
1.  进入 **Table Editor** -> 选择 `prizes` 表。
2.  点击 **"Insert"** -> **"Import Data from CSV"**。
3.  上传本项目根目录下的 `prizes_for_supabase_import.csv` 文件。
    *   *注意：该文件包含了 15,000+ 个预生成的防伪码。*

---

## 4. 连接真实数据库

### 4.1 获取环境变量
1.  在 Supabase 后台，进入 **Settings** -> **API**。
2.  复制 `Project URL` 和 `anon` (public) Key。

### 4.2 配置项目
1.  在 `guaguale-web` 目录下，将 `.env.local` 文件中的占位符替换为真实值：
```env
NEXT_PUBLIC_SUPABASE_URL=你的Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Anon_Key
```

### 4.3 切换代码模式 (从 Mock 切换到 Real)
目前代码为了演示使用了 Mock Data。上线前需要修改 API 逻辑以连接数据库。

**文件 1: `app/api/verify-code/route.ts`**
*   注释掉 `MOCK_CODES` 相关逻辑。
*   启用 Supabase 查询逻辑：
```typescript
const { data, error } = await supabase
  .from('prizes')
  .select('*')
  .eq('code', code)
  .single();
```

**文件 2: `app/api/redeem-prize/route.ts`**
*   启用 Supabase 插入逻辑：
```typescript
const { error } = await supabase
  .from('redemptions')
  .insert([ ...formData ]);
```

---

## 5. 部署上线 (Vercel)

1.  将代码推送到 GitHub。
2.  登录 [Vercel](https://vercel.com) -> **"Add New..."** -> **"Project"**。
3.  导入你的 GitHub 仓库。
4.  在 Vercel 的 **Environment Variables** 设置中，添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
5.  点击 **Deploy**。

### 域名配置
1.  在 Vercel 项目设置中找到 **Domains**。
2.  添加你的二级域名 (e.g., `redeem.highscore.com`)。
3.  按照提示在你的域名服务商处添加 CNAME 记录。

---

## 6. 交付文件清单
*   📂 `guaguale-web/` (完整源代码)
*   📄 `prize_codes_for_print.xlsx` (给印刷厂的文件)
*   📄 `prizes_for_supabase_import.csv` (数据库导入文件)
*   📄 `database/schema.sql` (数据库建表脚本)
