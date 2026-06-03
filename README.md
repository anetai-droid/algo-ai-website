# Algo AI 公式サイト

あるご合同会社が提供するAI活用支援サービス「Algo AI」の公式Webサイト。
HTML / JavaScript / Tailwind CSS による静的サイト（Vite ビルド）。

## 技術構成

- HTML5 + [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla JS
- [Vite](https://vite.dev/)（マルチページ構成）
- HTMLパーシャル: `vite-plugin-handlebars`（ヘッダー/フッター/headを共通化）
- ビルド・開発環境は **Docker** 上で動作（ローカルにNode不要）

## ディレクトリ

```
.
├── index.html ほか 9ページ      … 各ページの本文
├── partials/                    … head-meta / header / footer（共通パーツ）
├── src/css/style.css            … Tailwind エントリ + デザイントークン
├── src/js/main.js               … メニュー / FAQ / 固定CTA / GA4計測
├── public/                      … そのまま dist 直下にコピーされる静的ファイル
│   ├── robots.txt / sitemap.xml / favicon.svg / site.webmanifest
│   ├── images/ogp.svg           … OGP画像（※正式PNGに差し替え予定）
│   └── api/contact.php          … PHPフォーム（送信先は config.php に分離）
├── vite.config.js               … ページ別メタ情報・ビルド設定
├── Dockerfile / docker-compose.yml
└── .env / .env.example          … 秘密情報（.env はGit管理外）
```

## セットアップ

```bash
# 1. 環境変数を用意（実値を設定）
cp .env.example .env

# 2. 開発サーバー（http://localhost:5173）
docker compose up dev

# 3. 本番ビルド（dist/ に出力）
docker compose run --rm build

# 4. ビルド結果のプレビュー（http://localhost:4173）
docker compose up preview
```

## 環境変数（.env）

| 変数 | 内容 |
|------|------|
| `SITE_URL` | 本番URL。canonical / OGP に使用 |
| `VITE_GA4_ID` | GA4 測定ID（例 `G-XXXX`）。空ならGAタグ非出力 |
| `VITE_LINE_URL` | LINE公式アカウントの友だち追加URL |
| `VITE_CONTACT_ENDPOINT` | フォーム送信先（既定 `/api/contact.php`） |

`.env` は `.gitignore` 済み。**GitHub公開リポジトリに実値を含めないこと。**

## デプロイ

`docker compose run --rm build` で生成された `dist/` の中身を公開サーバーに配置する。

- **レンタルサーバー（PHPフォーム利用）**: `dist/` をアップロードし、`api/config.php`
  を `config.sample.php` から作成して送信先メールを設定する（`config.php` はGit管理外）。
- **AWS S3 + CloudFront**: `dist/` を配信。フォームは外部サービス or Lambda に切替
  （`VITE_CONTACT_ENDPOINT` を変更）。

## 公開前に差し替える項目（要件定義 第18章）

- 正式ドメイン → `.env` の `SITE_URL`、`public/robots.txt`、`public/sitemap.xml`
- GA4測定ID → `.env` の `VITE_GA4_ID`
- LINE公式URL → `.env` の `VITE_LINE_URL`
- 問い合わせ送信先メール → `public/api/config.php`
- OGP画像 → `public/images/ogp.svg` を 1200×630 のPNGに差し替え
- favicon（必要なら正式ロゴへ）、会社所在地・代表者名（`company.html`）
- 料金の目安（`pricing-faq.html`）
