# Chùa Kim Cang 金剛寺

Chùa Việt Nam tại Đài Loan, thường xuyên tổ chức các khóa lễ, tụng kinh, thiền tập và các hoạt động Phật học, kính chào quý Phật tử đến lễ Phật, cùng tu học và giao lưu.

## 如何啟動(本機開發)

```bash
npm install
npm run dev
```

打開瀏覽器到 http://localhost:3000 即可看到網站。

## 如何正式建置

```bash
npm run build
npm run start
```

## 檔案結構,以及要換成別間廟時該改哪裡

```
app/
  data/content.ts        ← 【最重要】所有文字內容都在這裡,換廟只要改這個檔案
  components/
    LanguageContext.tsx   ← 語言切換邏輯,不需要動
    Nav.tsx                ← 導覽列 + 語言切換按鈕
    Hero.tsx                ← 首頁大標題區
    About.tsx                ← 寺院簡介
    Events.tsx                ← 法會/活動列表
    Gallery.tsx                ← 相簿(目前是色塊佔位,之後可以換成真實照片)
    FAQ.tsx                     ← 常見問題
    Contact.tsx                  ← 聯絡資訊 + 頁尾
  globals.css              ← 顏色/字型的主題設定(Tailwind v4 的 @theme)
```

### 換成另一間寺廟,只需要做這兩件事

1. 打開 `app/data/content.ts`,把裡面越南文/中文的內容換成新寺廟的資料
2. 有真實照片時,把照片放進 `public/images/` 資料夾,再到 `content.ts` 的 `gallery.items` 裡,把對應項目的 `src` 填上檔名,例如 `src: "/images/chanh-dien.jpg"`——`src` 留空就會維持顯示色塊佔位

版型、樣式、語言切換邏輯完全不用動,這就是用元件化架構的好處。

## 照片怎麼準備

- 放照片的資料夾是 `public/images/`,把檔案丟進去就好,不用額外設定
- 建議每張照片**寬度不超過 1600px**、用 `.jpg` 或 `.webp` 格式,檔案盡量壓在 300KB 以內,網站載入才不會慢——手機拍的原始照片通常太大,可以用線上工具(例如 squoosh.app)壓縮後再放進來
- 照片方向建議**接近正方形或稍微橫向**,因為相簿版型是正方形格子,直式照片會被裁切
- 照片來源建議:直接跟廟方要「他們自己拍的活動照片」,或是拜訪時自己現場拍——避免使用網路上搜到的圖片,會有版權問題

## 顏色主題(在 app/globals.css 裡定義)

| 名稱 | 色碼 | 用途 |
|---|---|---|
| maroon | #7A2320 | 主色,標題、按鈕 |
| maroon-deep | #4E1512 | 深色背景區塊 |
| gold | #C69214 | 點綴色 |
| jade | #2F5D50 | 次要按鈕、強調 |
| ivory | #F3ECDD | 背景色 |
| ink / ink-soft | #2B2420 / #5A4F45 | 文字顏色 |

## 部署建議

這個專案可以直接部署到 Vercel(免費方案即可):
1. 把這個資料夾推上 GitHub
2. 到 vercel.com 用 GitHub 帳號登入,選這個 repo,一鍵部署
3. 之後每次改 `content.ts` 推上 GitHub,網站會自動更新

## 注意事項

⚠️ 目前所有內容(寺名、地址、法會日期等)都是範例資料,正式使用前請務必替換成真實資訊。
