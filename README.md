## 概要

楽観的更新の従来版と`useOptimistic`版の比較。

## API

### Model

#### Comment

| Field     | Type              |
| --------- | ----------------- |
| id        | string            |
| comment   | string            |
| createdAt | string (UTC Date) |

### コメント一覧の取得

GET `/comments`

#### レスポンス

```
Comment[]
```

### コメントの作成

POST `/comments`

#### リクエスト

| Field   | Type   |
| ------- | ------ |
| comment | string |

#### レスポンス

```
Comment
```

## Commands

- `npm run mock`: APIサーバーの起動
- `npm run dev`: フロントエンドの起動
