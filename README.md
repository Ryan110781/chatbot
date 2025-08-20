# Gemini Chat Bot

一個使用 Google Gemini API 的簡約風格聊天機器人網頁應用。

## 功能特色

- 🤖 整合 Google Gemini API
- 🔐 安全的 API Key 管理（儲存在瀏覽器 Cookies 中）
- 💬 即時聊天介面
- 📱 響應式設計，支援桌面和行動裝置
- 🎨 現代簡約的 UI 設計
- ⚡ 快速載入和流暢的使用體驗

## 部署到 GitHub Pages

### 1. Fork 或複製此專案

將此專案 fork 到您的 GitHub 帳戶，或者建立一個新的 repository 並上傳所有檔案。

### 2. 啟用 GitHub Pages

1. 進入您的 GitHub repository
2. 點擊 **Settings** 標籤
3. 在左側選單中找到 **Pages**
4. 在 **Source** 部分選擇 **GitHub Actions**

### 3. 自動部署

當您推送程式碼到 `main` 分支時，GitHub Actions 會自動：
- 安裝相依套件
- 建置專案
- 部署到 GitHub Pages

您的網站將會在 `https://yourusername.github.io/gemini-chatbot/` 上線。

## 本地開發

### 安裝相依套件

```bash
pnpm install
```

### 啟動開發伺服器

```bash
pnpm run dev
```

### 建置生產版本

```bash
pnpm run build
```

## 使用方法

1. 開啟網站
2. 點擊右上角的「設定」按鈕
3. 輸入您的 Google Gemini API Key
4. 點擊「儲存」
5. 開始與 AI 聊天！

## 取得 Gemini API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/)
2. 登入您的 Google 帳戶
3. 建立新的 API Key
4. 複製 API Key 並在應用中使用

## 技術架構

- **前端框架**: React 18
- **建置工具**: Vite
- **樣式**: Tailwind CSS + shadcn/ui
- **圖示**: Lucide React
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions

## 安全性

- API Key 僅儲存在您的瀏覽器本地 Cookies 中
- 不會傳送到任何第三方伺服器
- 所有 API 呼叫直接從瀏覽器發送到 Google

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！




<!-- Trigger GitHub Actions -->

