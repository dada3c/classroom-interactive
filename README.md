# Classroom Interactive — 即時互動教學系統

講師與學員即時互動的課堂工具。講師在大螢幕控制課程流程，學員用手機掃 QR Code 加入作答，所有資料透過 Firebase Firestore 即時同步。

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## 功能

- **講師端**：建立房間、顯示 QR Code、即時查看學員名單、控制問答流程、設定正確答案、查看統計圖表
- **學員端**：手機掃 QR Code → 輸入暱稱 → 即時作答（O / X）→ 顯示作答結果
- **歷史紀錄**：查看過去所有已結束課程

## 技術架構

| 項目 | 選擇 |
|------|------|
| 框架 | Vite + React 18 + TypeScript |
| 資料庫 | Firebase Firestore（onSnapshot 即時推送） |
| 路由 | React Router v6 |
| 樣式 | Tailwind CSS v4 |
| QR Code | react-qr-code |
| 圖表 | Recharts |

## 開始使用

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 Firebase

複製 `.env.example` 為 `.env`，填入你的 Firebase Web App 設定值：

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. 設定 Firestore Security Rules

在 Firebase Console → Firestore → Rules 貼入以下規則：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. 啟動開發伺服器

```bash
# 本機開發
npm run dev

# 讓手機可以連線（同 Wi-Fi 環境下）
npm run dev -- --host
```

學員掃描 QR Code 後透過區域網路 IP（如 `http://192.168.1.x:5173`）連線。

### 5. 建置與部署

```bash
npm run build
```

推薦使用 Firebase Hosting：

```bash
firebase deploy
```

## 路由結構

```
/                         首頁（選擇角色）
/instructor               講師後台（建立房間）
/instructor/history       歷史課程紀錄
/instructor/:roomId       講師控制台
/join/:roomId             學員輸入暱稱
/student/:roomId          學員作答介面
```

## Firestore 資料結構

```
rooms/{roomId}
  createdAt: Timestamp
  status: 'waiting' | 'answering' | 'ended'
  answerType: 'OX' | 'choice'    ← 預留擴充
  correctAnswer: 'O' | 'X' | null
  question: string

rooms/{roomId}/members/{memberId}
  nickname: string
  joinedAt: Timestamp

rooms/{roomId}/answers/{memberId}
  answer: string
  submittedAt: Timestamp
  nickname: string
```

## 注意事項

- 學員端透過 HTTP（非 HTTPS）連線時，使用 `Math.random()` 生成 UUID，因為 `crypto.randomUUID()` 需要安全環境
- 歷史紀錄頁面首次使用需在 Firestore 建立複合索引（錯誤訊息內有連結可直接點擊建立）
- `.env` 已加入 `.gitignore`，請勿將 Firebase 金鑰提交至版本控制
