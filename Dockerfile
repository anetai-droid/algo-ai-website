# Algo AI 静的サイトのビルド/開発環境
# ローカルに Node を入れずに、このコンテナ上で Vite + Tailwind を動かす
FROM node:20-alpine

WORKDIR /app

# 依存だけ先にコピーしてキャッシュを効かせる
COPY package*.json ./
RUN npm install

# ソースをコピー（開発時は compose のボリュームマウントで上書きされる）
COPY . .

# 開発サーバー
EXPOSE 5173
# 本番プレビュー
EXPOSE 4173

CMD ["npm", "run", "dev"]
