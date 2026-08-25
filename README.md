# PeanutBuild Corp. 網站

PeanutSMP 內的私人建築公司申請網站。

## 檔案結構

```
peanutbuild/
├── index.html   # 主頁面
├── styles.css   # 樣式
├── script.js    # 表單與 EmailJS 邏輯
└── README.md    # 本說明
```

## 本地預覽

用任何靜態伺服器開啟即可，例如：

```bash
npx serve .
# 或
python3 -m http.server 8080
```

然後瀏覽 `http://localhost:8080`（或對應埠號）。

## EmailJS 設定（必做）

網站使用 [EmailJS](https://www.emailjs.com) 把申請資料寄到 `iilluussdd@gmail.com`。

1. 到 [EmailJS Dashboard](https://dashboard.emailjs.com) 註冊／登入。
2. **Email Services** → 新增服務（建議連 Gmail），記下 **Service ID**。
3. **Email Templates** → 建立新 Template：
   - **To Email**：`iilluussdd@gmail.com`（或用變數 `{{to_email}}`）
   - **Subject**：`有新的申請來自於PeanutBuild Corp.` 或 `{{subject}}`
   - **Content** 範例：

     ```
     {{message}}
     ```

     或拆成欄位：

     ```
     GamerTag: {{gamertag}}
     建築物: {{building}}
     NutsTeamID: {{nuts_team_id}}
     材料: {{materials}}
     地面上: {{floors_above}}
     地面下: {{floors_below}}
     Email: {{user_email}}
     ```

4. **Account → API Keys** 複製 **Public Key**。
5. 打開 `script.js`，把這三行改成你的實際值：

   ```js
   const EMAILJS_PUBLIC_KEY = "你的_Public_Key";
   const EMAILJS_SERVICE_ID = "你的_Service_ID";
   const EMAILJS_TEMPLATE_ID = "你的_Template_ID";
   ```

若尚未填入金鑰，表單會改用瀏覽器 `mailto:` 開啟郵件客戶端作為後備方案。

## 表單欄位對應

| 欄位 | name / id |
|------|-----------|
| Minecraft 名稱 | gamertag |
| 建築物內容 | building |
| NutsTeamID | nuts_team_id |
| 材料方塊 ID | materials |
| 地面上樓層 | floors_above (F1–F5) |
| 地面下樓層 | floors_below (B1–B3) |
| Email | email |

## 部署建議

可直接丟到 GitHub Pages、Cloudflare Pages、Vercel、Netlify 等靜態託管。  
記得在正式環境把 EmailJS 金鑰填好，並在 EmailJS 後台把域名加到 Allowed Origins（若有開啟限制）。
