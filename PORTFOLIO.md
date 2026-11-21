# 我的待辦清單 Web App

這是在 GitHub Copilot 實戰工作坊完成的待辦清單 Web App。專案從基本的待辦管理開始，逐步加入深色模式、狀態篩選與批次清理，並以離線可用的原生前端技術實作。

## 線上展示

GitHub Pages：`https://<你的帳號>.github.io/<你的repo名稱>/`

## 功能

- 新增待辦事項，並忽略空白內容。
- 勾選待辦以標記完成；完成項目會顯示刪除線並淡化文字。
- 個別刪除待辦，或在確認後一次清除所有已完成項目；沒有已完成項目時，批次清除按鈕會隱藏。
- 依「全部」、「未完成」及「已完成」篩選清單，並在篩選結果為空時顯示提示。
- 顯示未完成項目數量；數字依全部待辦計算，不受篩選影響。
- 在淺色與深色模式間切換；未手動選擇時，依作業系統偏好顯示。
- 將待辦資料與手動選擇的主題保存在 `localStorage`，重新開啟頁面後仍可使用。
- 以卡片版面呈現，並支援手機螢幕。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript，不使用框架或套件。
- 不依賴外部 CDN，可離線開啟。
- 以 CSS 變數管理介面色彩，並透過 `prefers-color-scheme` 支援系統深淺色偏好。
- 使用瀏覽器 `localStorage` 保存待辦清單及主題偏好。

## 開發方式

- 使用 GitHub Copilot Agent Mode，依需求逐步建立並擴充待辦清單功能。
- 透過 MCP 查閱 Microsoft Learn 文件及 GitHub issue 資訊，將文件與需求脈絡帶入開發流程。
- 在 `.vscode/mcp.json` 設定 Microsoft Learn MCP；以 `.github/copilot-instructions.md` 描述專案技術與協作規則。
- 以 `.github/prompts/fix-issue.prompt.md` 定義可重複使用的 issue 修復流程，包含閱讀 issue、先提出計畫並取得確認、建立分支、修改與驗證，以及提交、推送和建立 PR 的步驟。

## 我學到什麼

- 把需求拆成明確的小項目，有助於讓 AI 代理依照範圍實作，也方便逐項驗證。
- 以 CSS 變數搭配 `prefers-color-scheme`，能讓深淺色主題共用樣式結構並尊重系統偏好。
- 使用 `localStorage` 時，資料變更、畫面更新與篩選計數需要保持一致。
- 不可逆的批次操作應先取得使用者確認，並清楚說明操作範圍。
- 把常見的 issue 處理步驟寫成 prompt，可讓協作流程更明確且容易重複執行。
