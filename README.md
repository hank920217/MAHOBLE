# Maho ESP32 Web Bluetooth Control

這是一個可部署到 GitHub Pages 的 React + Vite 前端專案，透過 Web Bluetooth 連接並控制 ESP32 裝置，提供使用者模式與管理者模式，並支援 PWA 安裝。

## 技術棧

- React 19
- Vite
- React Router `HashRouter`
- Web Bluetooth API
- PWA (`manifest.json` + `service-worker.js`)
- Vitest + React Testing Library

## 安裝依賴

```bash
npm install
```

## 開發模式

```bash
npm run dev
```

預設開發網址通常是 `http://localhost:5173`。

## Build

```bash
npm run build
```

若要本機預覽正式版輸出：

```bash
npm run preview
```

## 測試與檢查

```bash
npm run test
npm run lint
```

## GitHub Pages 部署

本專案已內建 GitHub Actions workflow：[`deploy.yml`](.github/workflows/deploy.yml)。

1. 將專案推送到 GitHub Repository。
2. 到 GitHub Repository 的 `Settings > Pages`。
3. `Build and deployment` 選擇 `GitHub Actions`。
4. 推送到 `main` 分支後，workflow 會自動執行 `npm ci`、`npm run build` 並部署到 Pages。

本專案使用 `HashRouter`，因此 GitHub Pages 重新整理時不會因為 SPA route rewrite 缺失而出現 404。

## Web Bluetooth 使用注意事項

- 請使用支援 Web Bluetooth 的 Chromium 系列瀏覽器。
- 實際藍牙連線需在 HTTPS 環境或 `localhost` 下執行。
- 裝置篩選條件為 `namePrefix: "maho"`。
- Service UUID：`000000ff-0000-1000-8000-00805f9b34fb`
- Characteristic UUID：`0000ff01-0000-1000-8000-00805f9b34fb`
- 目前前端假設 ESP32 會透過同一 characteristic notification 回傳 `AUTH_OK_USER`、`AUTH_OK_ADMIN`、`AUTH_FAIL`、`AUTH_REQUIRED`。

## 使用者模式

- 首頁 `#/` 預設為使用者模式。
- 新裝置連線後會立即要求輸入驗證碼。
- 驗證命令格式為 `AUTH:USER:xxxx`。
- 只有全部已連線裝置都驗證成功時，才開放批次控制。
- 支援文字訊息 `MSG:Hello` 與快捷命令 `CMD:FLASH:1~3`。

## 管理者模式

- 管理者登入頁：`#/admin-login`
- 管理者頁：`#/admin`
- 帳號：`admin`
- 密碼：`1234`
- 登入狀態會保存於 `sessionStorage`。
- 管理者模式連線後會送出 `AUTH:ADMIN:xxxx`，並在收到 `AUTH_OK_ADMIN` 後開放控制。

## PWA 說明

- `public/manifest.json` 定義 App 名稱、圖示、主題色與安裝資訊。
- `public/service-worker.js` 使用 Cache API 快取 app shell 與靜態資源。
- 在手機或桌面支援環境中，可安裝為獨立 App。

## 專案結構

```text
src/
  components/
  context/
  hooks/
  pages/
  router/
  services/
  styles/
  utils/
```

## 備註

- 使用者模式與管理者模式採一致卡片式介面，但以不同色彩清楚區分。
- 裝置列表已預留 checkbox 架構，後續可擴充全部控制、單一控制、多裝置控制。
- 管理者頁面已保留未來擴充區塊，例如廣播訊息、強制重新驗證與重新掃描。
